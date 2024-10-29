<?php
/**
 * @package Articoolo
 * @version 1.1
 */
/*
Plugin Name: Articoolo
Plugin URI: http://articoolo.com/
Description: Our technology is aimed at helping writers create textual content by making the creation process quicker, cost efficient, and much more pleasant. It creates unique, proofread, high-quality content from scratch, simulating a real human writer. You choose the topic and length, and our algorithm will create your textual content.
Author: Articoolo
Version: 1.104
Author URI: http://articoolo.com/
*/

define('ARTICOOLO_WORDPRESS_VERSION', '1.1');
define('ARTICOOLO_PLUGIN_DIR', plugin_dir_path( __FILE__ ));

require_once(ARTICOOLO_PLUGIN_DIR.'class.articoolo.php');
$API_INSTANCE = new Articoolo();

require_once(ARTICOOLO_PLUGIN_DIR.'articoolo.ajax.php');

register_activation_hook(__FILE__, array($API_INSTANCE, 'articoolo_activate'));

add_action('admin_menu', array($API_INSTANCE, 'articoolo_add_left_menu_sidebar'));
add_action('init', array($API_INSTANCE, 'articoolo_run'));

?>