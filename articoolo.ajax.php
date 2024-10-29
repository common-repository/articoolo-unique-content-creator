<?php
    $MODE = 'dev';

    add_action( 'wp_ajax_articooloGetArticleList', 'articooloGetArticleList' );
    add_action( 'wp_ajax_articooloGetArticleById', 'articooloGetArticleById' );
    add_action( 'wp_ajax_articooloGetArticle', 'articooloGetArticle' );
    add_action( 'wp_ajax_articooloRephraseText', 'articooloRephraseText' );
    add_action( 'wp_ajax_articooloGetSuggestions', 'articooloGetSuggestions' );
    add_action( 'wp_ajax_articooloGetArticleList', 'articooloGetArticleList' );

    function articooloGetArticleList()
    {
        global $API_INSTANCE;

        $articoolo_user_id = get_option('articoolo_user_id');
        $articoolo_password = get_option('articoolo_password');

        $page = $_POST['page'];

        $params = array('user_id' => $articoolo_user_id, 'password_hash' => $articoolo_password, 'page' => $page);

        if (isset($_POST['filter_keyword']))
            $params['keyword'] = $_POST['filter_keyword'];

        if (isset($_POST['date_from']))
            $params['date_from'] = $_POST['date_from'];

        if (isset($_POST['date_to']))
            $params['date_to'] = $_POST['date_to'];

        $result = $API_INSTANCE->makeApiRequest('getArticleList', $params);

        exit(json_encode(array('success' => 1, 'response' => $result)));
    }

    function articooloGetArticleById()
    {
        global $API_INSTANCE;

        $article_id = $_POST['article_id'];

        $articoolo_user_id = get_option('articoolo_user_id');
        $articoolo_password = get_option('articoolo_password');

        $params = array('user_id' => $articoolo_user_id, 'password_hash' => $articoolo_password, 'article_id' => $article_id);

        $result = $API_INSTANCE->makeApiRequest('getArticleById', $params);

        if (isset($result->article_text))
            $result->article_text = str_replace("\n", '<br> ', $result->article_text);

        exit(json_encode(array('success' => 1, 'response' => $result)));
    }

    function articooloGetArticle()
    {
        global $API_INSTANCE;

        ini_set('max_execution_time', 300);

        $input_keywords = $_POST['input_keywords'];
        $article_length = $_POST['article_length'];
        $force_uniqueness = $_POST['force_uniqueness'];

        $articoolo_user_id = get_option('articoolo_user_id');
        $articoolo_password = get_option('articoolo_password');

        $params = array('user_id' => $articoolo_user_id, 'password_hash' => $articoolo_password, 'article_keywords' => urlencode($input_keywords), 'article_length' => $article_length, 'force_uniqueness' => $force_uniqueness);
        $result = $API_INSTANCE->makeApiRequest('createArticle', $params);

        if (isset($result->article_text))
            $result->article_text = str_replace("\n", '<br> ', $result->article_text);

        exit(json_encode(array('success' => 1, 'response' => $result)));
    }

    function articooloRephraseText()
    {
        global $API_INSTANCE;

        ini_set('max_execution_time', 300);
        
        $input_text = $_POST['input_text'];

        $articoolo_user_id = get_option('articoolo_user_id');
        $articoolo_password = get_option('articoolo_password');

        $params = array('user_id' => $articoolo_user_id, 'password_hash' => $articoolo_password, 'input_text' => urlencode($input_text));
        $result = $API_INSTANCE->makeApiRequest('rephraseText', $params);

        if (isset($result->article_text))
            $result->article_text = str_replace("\n", '<br> ', $result->article_text);

        exit(json_encode(array('success' => 1, 'response' => $result)));
    }

    function articooloGetSuggestions()
    {
        global $API_INSTANCE;

        ini_set('max_execution_time', 300);

        $input_keywords = $_POST['input_keywords'];

        $params = array('keywords' => urlencode($input_keywords));
        $result = $API_INSTANCE->makeApiRequest('topic_suggestions_api', $params, true);

        if ($result->error == "ok") {
            $result->suggestions = explode(';', $result->suggestions);

            // limit foreach like this:  if ($k < 10)
            $cnt = 0;
            $str = '';
            foreach ($result->suggestions as $k => $v) {
                if (!empty($v) && $input_keywords != $v)
                    $str .= ' <span>+</span><a href="#">' . $v . '</a><br />';

                $cnt++;
                if ($cnt == 4)
                    break;
            }

            $suggestions_log_id = 0;
            if (isset($result->suggestions_log_id))
                $suggestions_log_id = $result->suggestions_log_id;

            exit(json_encode(array('success' => 1, 'suggestions' => $str, 'keyword_match' => $result->keyword_match, 'suggestions_log_id' => $suggestions_log_id)));
        } else {
            exit(json_encode(array('success' => 0, 'error_message' => $result->error_message)));
        }
    }

?>