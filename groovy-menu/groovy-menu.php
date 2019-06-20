<?php defined( 'ABSPATH' ) || die( 'This script cannot be accessed directly.' );
/*
Plugin Name: Groovy Menu (free)
Version: 0.9.11
Description: Groovy menu is a modern adjustable and flexible menu designed for creating mobile-friendly menus with a lot of options.
Plugin URI: https://groovymenu.grooni.com/
Author: Grooni
Author URI: https://grooni.com
Text Domain: groovy-menu
Domain Path: /languages/
License: GPL3

Groovy Menu (free) is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
any later version.

Groovy Menu (free) is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Groovy Menu (free). If not, see http://www.gnu.org/licenses/gpl-3.0.html.

*/

define( 'GROOVY_MENU_VERSION', '0.9.11' );
define( 'GROOVY_MENU_DB_VER_OPTION', 'groovy_menu_db_version' );
define( 'GROOVY_MENU_DIR', plugin_dir_path( __FILE__ ) );
define( 'GROOVY_MENU_URL', plugin_dir_url( __FILE__ ) );
define( 'GROOVY_MENU_BASENAME', plugin_basename( trailingslashit( dirname( dirname( __FILE__ ) ) ) . 'groovy-menu.php' ) );

if ( ! defined( 'AUTH_COOKIE' ) && function_exists( 'is_multisite' ) && is_multisite() ) {
	if ( function_exists( 'wp_cookie_constants' ) ) {
		wp_cookie_constants();
	}
}

$db_version = get_option( GROOVY_MENU_DB_VER_OPTION );
if ( ! $db_version ) {
	update_option( GROOVY_MENU_DB_VER_OPTION, GROOVY_MENU_VERSION );
	$db_version = GROOVY_MENU_VERSION;
}
if ( ! defined( 'GROOVY_MENU_LVER' ) ) {
	define( 'GROOVY_MENU_LVER', '2' );
}

global $gm_supported_module;
$gm_supported_module = array(
	'theme'      => wp_get_theme()->get_template(),
	'post_types' => array(),
	'activate'   => array(),
	'deactivate' => array(),
	'db_version' => $db_version,
);


// Autoload modules and classes by composer.
require_once GROOVY_MENU_DIR . 'vendor/autoload.php';

register_activation_hook( __FILE__, 'groovy_menu_activation' );
register_deactivation_hook( __FILE__, 'groovy_menu_deactivation' );

add_action( 'init', array( 'GroovyMenuUtils', 'add_groovy_menu_preset_post_type' ), 3 );
add_filter( 'plugin_row_meta', array( 'GroovyMenuUtils', 'gm_plugin_meta_links' ), 10, 2 );
add_filter( 'plugin_action_links', array( 'GroovyMenuUtils', 'gm_plugin_page_links' ), 10, 2 );


// Initialize Groovy Menu.
if ( class_exists( 'GroovyMenuPreset' ) ) {
	new GroovyMenuPreset( null, true );
}

if ( class_exists( 'GroovyMenuSettings' ) ) {
	new GroovyMenuSettings();
}

if ( class_exists( 'GroovyMenuCategoryPreset' ) ) {
	new GroovyMenuCategoryPreset( array( 'category', 'crane_portfolio_cats', 'post_tag', 'product_cat' ) );
}

if ( class_exists( 'GroovyMenuSingleMetaPreset' ) ) {
	new GroovyMenuSingleMetaPreset();
}

if ( class_exists( '\GroovyMenu\AdminWalker' ) ) {
	\GroovyMenu\AdminWalker::registerWalker();
}

if ( method_exists( 'GroovyMenuUtils', 'cache_pre_wp_nav_menu' ) ) {
	add_filter( 'pre_wp_nav_menu', array( 'GroovyMenuUtils', 'cache_pre_wp_nav_menu' ), 10, 2 );
}

if ( method_exists( 'GroovyMenuUtils', 'install_default_icon_packs' ) ) {
	add_action( 'wp_ajax_gm_install_default_icon_packs', array( 'GroovyMenuUtils', 'install_default_icon_packs' ) );
}

function groovy_menu_activation() {
	global $gm_supported_module;

	foreach ( $gm_supported_module['activate'] as $launch_function ) {
		$launch_function();
	}

	if ( class_exists( 'GroovyMenuRoleCapabilities' ) ) {
		GroovyMenuRoleCapabilities::add_capabilities();
	}

	$default_icon_packs = get_option( 'gm_default_icon_packs_installed' );
	if ( empty( $default_icon_packs ) && method_exists( 'GroovyMenuUtils', 'install_default_icon_packs' ) ) {
		GroovyMenuUtils::install_default_icon_packs( true );
		update_option( 'gm_default_icon_packs_installed', true, false );
	}
}

function groovy_menu_deactivation() {
	global $gm_supported_module;

	foreach ( $gm_supported_module['deactivate'] as $launch_function ) {
		$launch_function();
	}
}


function groovy_menu_scripts() {

	wp_enqueue_style( 'groovy-menu-style', GROOVY_MENU_URL . 'assets/style/frontend.css', [], GROOVY_MENU_VERSION );
	wp_style_add_data( 'groovy-menu-style', 'rtl', 'replace' );
	wp_enqueue_script( 'groovy-menu-js', GROOVY_MENU_URL . 'assets/js/frontend.js', [], GROOVY_MENU_VERSION, true );
	wp_localize_script( 'groovy-menu-js', 'groovyMenuHelper', array( 'ajaxurl' => admin_url( 'admin-ajax.php' ) ) );

	foreach ( \GroovyMenu\FieldIcons::getFonts() as $name => $icon ) {
		wp_enqueue_style( 'groovy-menu-style-fonts-' . $name, esc_url( GroovyMenuUtils::getUploadUri() . 'fonts/' . $name . '.css' ), [], GROOVY_MENU_VERSION );
	}

	/**
	 * Fires when enqueue_script for Groovy Menu
	 *
	 * @since 1.0
	 */
	do_action( 'gm_enqueue_script_actions' );

}

function groovy_menu_toolbar() {
	if ( function_exists( 'is_user_logged_in' ) && is_user_logged_in() && current_user_can( 'edit_theme_options' ) ) {
		wp_enqueue_style( 'groovy-menu-style-toolbar', GROOVY_MENU_URL . 'assets/style/toolbar.css', [], GROOVY_MENU_VERSION );
		wp_style_add_data( 'groovy-menu-style-toolbar', 'rtl', 'replace' );
	}
}

function groovy_menu_load_textdomain() {
	load_plugin_textdomain( 'groovy-menu', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
}

add_action( 'init', 'groovy_menu_load_textdomain' );

add_action( 'wp_enqueue_scripts', 'groovy_menu_toolbar' );
add_action( 'admin_enqueue_scripts', 'groovy_menu_toolbar' );
add_action( 'wp_enqueue_scripts', 'groovy_menu_scripts' );
add_action( 'in_admin_footer', function () {
	global $pagenow;
	if ( 'nav-menus.php' === $pagenow ) {
		echo GroovyMenuRenderIconsModal();
	}
} );

add_filter( 'body_class', 'groovy_menu_add_version_class_2_html' );
/**
 * @param $classes
 *
 * @return array
 */
function groovy_menu_add_version_class_2_html( $classes ) {
	$classes[] = 'groovy_menu_' . str_replace( '.', '-', GROOVY_MENU_VERSION );

	return $classes;
}

function gm_is_wplogin() {
	$path = str_replace( array( '\\', '/' ), DIRECTORY_SEPARATOR, ABSPATH );

	return ( ( in_array( $path . 'wp-login.php', get_included_files(), true ) || in_array( $path . 'wp-register.php', get_included_files(), true ) ) || ( isset( $_GLOBALS['pagenow'] ) && 'wp-login.php' === $GLOBALS['pagenow'] ) || '/wp-login.php' === $_SERVER['PHP_SELF'] );
}

// Start pre storage (compile groovy menu preset and nav_menu) before template.
if ( ! is_admin() && ! gm_is_wplogin() ) {
	add_action( 'wp_enqueue_scripts', 'groovy_menu_start_pre_storage', 50 );
}

function groovy_menu_start_pre_storage() {
	if ( isset( $_GET['gm_action_preview'] ) && $_GET['gm_action_preview'] ) {
		return;
	}

	if ( class_exists( '\GroovyMenu\PreStorage' ) ) {
		\GroovyMenu\PreStorage::get_instance()->start_pre_storage();
	}
}


if ( ! is_admin() && ! gm_is_wplogin() && GroovyMenuUtils::getAutoIntegration() ) {
	add_action( 'init', 'groovy_menu_start_buffer', 0, 0 );
	add_action( 'shutdown', 'groovy_menu_pre_shutdown', 0 );
	add_filter( 'groovy_menu_final_output', 'groovy_menu_add_after_body' );
	add_filter( 'groovy_menu_after_body_insert', 'groovy_menu_add_markup' );
}

/**
 * Start buffering on the front-end.
 *
 * @since 1.0
 */
function groovy_menu_start_buffer() {
	if ( is_admin() || gm_is_wplogin() ) {
		return;
	}
	ob_start();
}

/**
 * Before final action.
 *
 * @since 1.0
 */
function groovy_menu_pre_shutdown() {
	if ( is_admin() || gm_is_wplogin() ) {
		return;
	}

	$final  = '';
	$levels = ob_get_level();
	for ( $i = 0; $i < $levels; $i ++ ) {
		$final .= ob_get_clean();
	}

	echo apply_filters( 'groovy_menu_final_output', $final );
}

/**
 * Parse body tag and add additional output after.
 *
 * @param string $output additional output text for adding.
 *
 * @since 1.0
 *
 * @return null|string
 */
function groovy_menu_add_after_body( $output ) {
	if ( is_admin() || gm_is_wplogin() ) {
		return $output;
	}

	if ( isset( $_GET['gm_action_preview'] ) ) { // @codingStandardsIgnoreLine
		return $output;
	}

	$after_body = apply_filters( 'groovy_menu_after_body_insert', '' );
	$output     = preg_replace( '#(\<body.*\>)#', '$1' . $after_body, $output );

	return $output;
}

/**
 * Add markup
 *
 * @param string $after_body consist html code for insert after body.
 *
 * @since 1.0
 *
 * @return string
 */
function groovy_menu_add_markup( $after_body ) {

	$saved_auto_integration = GroovyMenuUtils::getAutoIntegration();

	if ( $saved_auto_integration ) {

		$gm_ids = \GroovyMenu\PreStorage::get_instance()->search_ids_by_location( array( 'theme_location' => 'gm_primary' ) );

		if ( ! empty( $gm_ids ) ) {

			foreach ( $gm_ids as $gm_id ) {
				$gm_data = \GroovyMenu\PreStorage::get_instance()->get_gm( $gm_id );

				$after_body .= $gm_data['gm_html'];
			}

		} else {
			$after_body .= groovy_menu( [
				'gm_echo'        => false,
				'theme_location' => 'gm_primary',
			] );
		}
	}

	return $after_body;
}

// This theme uses wp_nav_menu() in one location.
register_nav_menus( array(
	'gm_primary' => esc_html__( 'Groovy menu Primary', 'groovy-menu' ),
) );

/**
 * Return public post types.
 *
 * @return array
 */
function groovy_menu_get_post_types() {
	$post_types = array();

	// get the registered data about each post type with get_post_type_object.
	foreach ( get_post_types() as $type ) {
		$type_obj = get_post_type_object( $type );

		if ( isset( $type_obj->public ) && $type_obj->public ) {
			if ( 'attachment' !== $type_obj->name ) {
				$post_types[ $type_obj->name ] = $type_obj->label;
			}
		}
	}

	return $post_types;
}


/**
 * Return script with preset customs js
 *
 * @param string $uniqid        unique string id.
 * @param bool   $return_string if true: return string wrap in html tag: script. If false return empty string and add script to wp_add_inline_script() function.
 *
 * @return string
 */
function groovy_menu_js_request( $uniqid, $return_string = false ) {
	global $groovyMenuPreview, $groovyMenuSettings;

	if ( $groovyMenuPreview ) {
		$groovyMenuPreview = $uniqid;
	}

	$groovyMenuSettings_json = $groovyMenuSettings;
	if ( isset( $groovyMenuSettings_json['nav_menu_data'] ) ) {
		unset( $groovyMenuSettings_json['nav_menu_data'] );
	}

	// TODO check 'var groovyMenuSettings = ...' for poly GM blocks
	$additional_js = 'var groovyMenuSettings = ' . wp_json_encode( $groovyMenuSettings ) . '; document.addEventListener("DOMContentLoaded", function () {  var gm = new GroovyMenu(\'#' . $uniqid . '\' ,groovyMenuSettings); gm.init();});';

	if ( $return_string ) {
		$tag_name = 'script';
		return "\n" . '<' . esc_attr( $tag_name ) . '>' . $additional_js . '</' . esc_attr( $tag_name ) . '>';
	} else {
		if ( function_exists( 'wp_add_inline_script' ) ) {
			wp_add_inline_script( 'groovy-menu-js', $additional_js );
		}
	}

	return '';
}


/**
 * Return style with preset customs css
 *
 * @param string|integer $preset_id
 * @param string         $compiled_css
 * @param bool           $return_string
 *
 * @return string
 */
function groovy_menu_add_preset_style( $preset_id, $compiled_css, $return_string = false ) {

	if ( empty( $compiled_css ) ) {
		$styles       = new GroovyMenuStyle( $preset_id );
		$compiled_css = $styles->get( 'general', 'compiled_css' );
	}

	if ( $return_string ) {
		$handled_compiled_css = trim( stripcslashes( $compiled_css ) );
		$tag_name             = 'style';

		return "\n" . '<' . $tag_name . ' id="gm-style-preset--' . $preset_id . '" class="gm-compiled-css">' . $handled_compiled_css . '</' . $tag_name . '>';
	} else {
		if ( function_exists( 'wp_add_inline_style' ) ) {
			wp_add_inline_style( 'groovy-menu-style', $compiled_css );
		}
	}

	return '';
}

add_action( 'admin_enqueue_scripts', 'groovy_menu_scripts_admin', 10, 1 );
if ( ! function_exists( 'groovy_menu_scripts_admin' ) ) {
	/**
	 * Enqueue scripts and styles for admin pages.
	 *
	 * @param string $hook_suffix suffix of the current page.
	 */
	function groovy_menu_scripts_admin( $hook_suffix ) {

		// Only integration.
		if ( in_array( $hook_suffix, array(
				'groovy-menu_page_groovy_menu_integration',
				'toplevel_page_groovy_menu_integration'
			), true ) && ! isset( $_GET['action'] ) ) {
			wp_enqueue_script( 'groovy-menu-js-integration', GROOVY_MENU_URL . 'assets/js/integration.js', [], GROOVY_MENU_VERSION, true );
			echo '<link href="https://fonts.googleapis.com/css?family=Roboto:400,500,700&display=swap" rel="stylesheet">';
		}

		// Only dashboard.
		if ( 'toplevel_page_groovy_menu_settings' === $hook_suffix && ! isset( $_GET['action'] ) ) {
			wp_enqueue_script( 'groovy-menu-js-dashboard', GROOVY_MENU_URL . 'assets/js/dashboard.js', [], GROOVY_MENU_VERSION, true );
			echo '<link href="https://fonts.googleapis.com/css?family=Roboto:400,500,700&display=swap" rel="stylesheet">';
		}

		// Only preset editor page.
		if ( 'toplevel_page_groovy_menu_settings' === $hook_suffix && isset( $_GET['id'] ) && isset( $_GET['action'] ) && 'edit' === $_GET['action'] ) {
			wp_enqueue_script( 'groovy-menu-js-preset', GROOVY_MENU_URL . 'assets/js/preset.js', [], GROOVY_MENU_VERSION, true );
		}

		// Only Appearance > Menus page.
		if ( 'nav-menus.php' === $hook_suffix ) {
			wp_enqueue_media();
			wp_enqueue_script( 'groovy-menu-js-appearance', GROOVY_MENU_URL . 'assets/js/appearance.js', [], GROOVY_MENU_VERSION, true );
		}

		// Only Debug page.
		if ( 'tools_page_groovy_menu_debug_page' === $hook_suffix ) {
			wp_enqueue_script( 'groovy-menu-js-appearance', GROOVY_MENU_URL . 'assets/js/debug.js', [], GROOVY_MENU_VERSION, true );
		}

	}
}


add_action( 'admin_enqueue_scripts', 'gm_include_code_editor', 10, 1 );
if ( ! function_exists( 'gm_include_code_editor' ) ) {
	/**
	 * Enqueue scripts and styles of codemirror for textarea.
	 *
	 * @param string $hook_suffix suffix of the current page.
	 */
	function gm_include_code_editor( $hook_suffix ) {

		if ( 'toplevel_page_groovy_menu_settings' !== $hook_suffix ) {
			return;
		}

		$output = '';

		foreach ( array( 'css', 'javascript' ) as $type ) {

			$codemirror_params = array( 'autoRefresh' => true );

			if ( 'javascript' === $type ) {
				$codemirror_params['closeBrackets'] = true;
			}

			$settings = false;
			// function wp_enqueue_code_editor() since WP 4.9 .
			if ( function_exists( 'wp_enqueue_code_editor' ) ) {
				$settings = wp_enqueue_code_editor( array(
					'type'       => 'text/' . $type,
					'codemirror' => $codemirror_params,
				) );
			}

			if ( false !== $settings ) {

				$output .= sprintf( '
					var groovyMenuCodeMirror%3$sAreas = $(".gmCodemirrorInit[data-lang_type=\'%2$s\']");
					if (groovyMenuCodeMirror%3$sAreas.length > 0) {
						$.each(groovyMenuCodeMirror%3$sAreas, function(key, element) {
							var codeEditorObj = wp.codeEditor.initialize( element, %1$s );
							codeEditorObj.codemirror.on("change", function( cm ) {
								cm.save();
							});
						});
					}',
					wp_json_encode( $settings ),
					$type,
					strtoupper( $type )
				);
			}
		}


		// Add inline js.
		if ( $output ) {
			wp_add_inline_script(
				'code-editor',
				'(function ($) { $(function () {
				' . $output . '
				});})(jQuery)'
			);
		}

	}
}


add_filter( 'woocommerce_add_to_cart_fragments', 'groovy_menu_woocommerce_add_to_cart_fragments', 50 );

/**
 * Mini cart fix
 *
 * @param array $fragments elements of cart.
 *
 * @return mixed
 */
function groovy_menu_woocommerce_add_to_cart_fragments( $fragments ) {
	global $woocommerce;
	$count = $woocommerce->cart->cart_contents_count;

	$fragments['.gm-cart-counter'] = groovy_menu_woocommerce_mini_cart_counter( $count );

	return $fragments;
}


/**
 * Mini cart counter
 *
 * @param string $count count of elements.
 *
 * @return string
 */
function groovy_menu_woocommerce_mini_cart_counter( $count = '' ) {
	if ( empty( $count ) ) {
		$count = '';
	}

	$count_text = ' <span class="gm-cart-counter">' . esc_html( $count ) . '</span> ';

	return $count_text;
}


/**
 * @param $preset_id
 * @param $font_option
 * @param $common_font_family
 *
 * @return string
 */
function groovy_menu_add_gfonts_fontface( $preset_id, $font_option, $common_font_family, $add_inline = false ) {
	$output = '';
	if ( class_exists( 'GroovyMenuGFonts' ) ) {
		$google_fonts = new GroovyMenuGFonts();

		$output = $google_fonts->add_gfont_face( $preset_id, $font_option, $common_font_family, $add_inline );
	}

	return $output;
}


add_action( 'wp_head', 'groovy_menu_add_gfonts_from_pre_storage' );

/**
 * Add link tag with google fonts.
 */
function groovy_menu_add_gfonts_from_pre_storage() {
	$font_data = \GroovyMenu\PreStorage::get_instance()->get_preset_data_by_key( 'font_family' );

	if ( ! empty( $font_data ) ) {
		$font_family_exist = array();
		foreach ( $font_data as $_preset_id => $font_family_array ) {
			foreach ( $font_family_array as $index => $font_family ) {

				// Prevent duplicate.
				if ( in_array( $font_family, $font_family_exist, true ) ) {
					continue;
				}

				// Store for duplicate check.
				$font_family_exist[] = $font_family;

				echo '
<link rel="stylesheet" id="gm-google-fonts-' . esc_attr( $index ) . '" href="https://fonts.googleapis.com/css?family=' . esc_attr( $font_family ) . '" type="text/css" media="all">
';
			}
		}
	}
}


/**
 * Enable or Disable google fonts loading from local directory
 */
function groovy_menu_check_gfonts_params() {

	$google_fonts_local = false;
	$styles_class       = new GroovyMenuStyle( null );

	if ( $styles_class->getGlobal( 'tools', 'google_fonts_local' ) ) {
		$google_fonts_local = true;
	}


	if ( class_exists( 'GroovyMenuGFonts' ) ) {
		$google_fonts = new GroovyMenuGFonts();

		if ( $google_fonts_local ) {

			$need_fonts = $google_fonts->get_specific_fonts();

			foreach ( $need_fonts as $_font ) {
				if ( ! empty( $_font['zip_url'] ) ) {
					$google_fonts->download_font( $_font['zip_url'] );
				}
			}
		} else {
			delete_transient( $google_fonts->get_opt_name() );
			delete_transient( $google_fonts->get_opt_name() . '__current' );
			delete_option( $google_fonts->get_opt_name() . '__downloaded' );
		}
	}

}
