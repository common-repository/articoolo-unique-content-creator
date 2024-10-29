<?php
    require_once( ABSPATH.'wp-includes/pluggable.php' );

    class Articoolo {

        public $admin_email;
        public $admin_password;
        public $articoolo_email;
        public $articoolo_password;
        public $articoolo_user_id;

        private $api_host = 'articoolo.com';

        function __construct()
        {
            $current_user = wp_get_current_user();

            $this->admin_email = $current_user->user_email;
            $this->admin_password = $current_user->user_pass;
            $this->articoolo_email = '';
            $this->articoolo_password = '';
            $this->articoolo_user_id = 0;

            $articoolo_user_id = get_option('articoolo_user_id');
            $articoolo_login = get_option('articoolo_login');
            $articoolo_password = get_option('articoolo_password');

            if ($articoolo_user_id && $articoolo_login && $articoolo_password) {
                $this->articoolo_email = $articoolo_login;
                $this->articoolo_password = $articoolo_password;
                $this->articoolo_user_id = $articoolo_user_id;
            }
        }

        public function articoolo_activate() {
            if (!$this->articoolo_user_id) {
                $response = $this->getUserDataByEmail();

                if ($response->success == '1' && $response->user_data) {
                    $user_data = $response->user_data;

                    add_option('articoolo_login', $user_data->login);
                    add_option('articoolo_password', $user_data->password);
                    add_option('articoolo_user_id', $user_data->user_id);

                    $this->articoolo_email = $user_data->login;
                    $this->articoolo_password = $user_data->password;
                    $this->articoolo_user_id = $user_data->user_id;

                    return true;
                }
                else if ($response->success == '0' && $response->message) {
                    die(_e($response->message, 'articoolo-unique-content-creator'));

                    return false;
                }

                die(_e('Activation error, please try again.', 'articoolo-unique-content-creator'));

                return false;
            }
        }

        public function articoolo_run() {
            add_action('admin_head', array($this, 'articoolo_scripts_to_wp_head'));
        }

        public function articoolo_scripts_to_wp_head() {
            echo '<link rel="stylesheet" href="'.plugins_url('articoolo-unique-content-creator').'/css/styles.css">';
            echo '<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css">';
            echo '<link rel="stylesheet" href="'.plugins_url('articoolo-unique-content-creator').'/css/tinyscrollbar.css">';

            echo '<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>';
            echo '<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>';
            echo '<script src="'.plugins_url('articoolo-unique-content-creator').'/js/jquery.tinyscrollbar.min.js"></script>';
            echo '<script src="'.plugins_url('articoolo-unique-content-creator').'/js/articoolo.js"></script>';
            echo '<script type="text/javascript"> var articoolo_plugin_url = "'.plugins_url("articoolo-unique-content-creator").'"</script>';
        }

        public function articoolo_add_left_menu_sidebar() {
            add_menu_page('Articoolo', 'Articoolo', 1, 'articoolo-unique-content-creator', array($this, 'articoolo_options_page'));
        }

        public function articoolo_options_page() {
            if (!$this->articoolo_user_id || !$this->articoolo_email || !$this->articoolo_password)
                die(_e('Undefined user. Please reactivate articoolo plugin.', 'articoolo-unique-content-creator'));

            $user_credits_data = $this->getCreditsData();

            $params = array('user_id' => $this->articoolo_user_id, 'password_hash' => $this->articoolo_password);
            $response = $this->makeApiRequest('getPriceLink', $params);

            $content_creation_tpl = file_get_contents(__DIR__.'/templates/content_creation.tpl');
            $content_creation_tpl = str_replace('{user_balance}', $user_credits_data->balance, $content_creation_tpl);
            $content_creation_tpl = str_replace('{payment_link}', $response->link, $content_creation_tpl);
            $content_creation_tpl = str_replace('{plugin_path}', plugins_url('articoolo-unique-content-creator'), $content_creation_tpl);
            echo $content_creation_tpl;
            echo '<br/>';
        }

        private function getCreditsData()
        {
            $params = array('user_id' => $this->articoolo_user_id, 'password_hash' => $this->articoolo_password);

            $response = $this->makeApiRequest('getCreditsData', $params);

            if ($response->success == '1' && $response->credits_data)
                return $response->credits_data;

            return false;
        }

        private function getUserDataByEmail()
        {
            $params = array('email' => $this->admin_email, 'password_hash' => $this->admin_password, 'ip' => urlencode($_SERVER['REMOTE_ADDR']));

            $response = $this->makeApiRequest('getUserDataByMail', $params);

            return $response;
        }

        public function makeApiRequest($action, $params_arr, $direct_api_request = false)
        {
            $const_params_arr = array('app_name' => 'wordpress', 'app_version' => ARTICOOLO_WORDPRESS_VERSION);

            $params_arr = array_merge($params_arr, $const_params_arr);

            foreach($params_arr as $key=>$val) {
                $str_arr[] = $key.'='.$val;
            }


            if ($direct_api_request)
                $action .= '.php';

            $str = implode('&', $str_arr);

            $ch = curl_init('http://' . $this->api_host . '/api/' . $action);

            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $str);

            $response = curl_exec($ch);
            curl_close($ch);

            $result = json_decode($response);

            return $result;
        }
    }
?>