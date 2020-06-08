<?php defined( 'ABSPATH' ) || die( 'This script cannot be accessed directly.' );

global $gm_supported_module;

if ( ! function_exists( 'groovy_menu_support_elementor_post_types' ) ) {

	/**
	 * Add Elementor post types for Groovy Menu.
	 *
	 * @param $post_types array Post types list.
	 *
	 * @return array
	 */
	function groovy_menu_support_elementor_post_types( $post_types ) {

		if ( defined( 'ELEMENTOR_VERSION' ) && is_array( $post_types ) && ! in_array( 'elementor_library', $post_types, true ) ) {
			$post_types[] = 'elementor_library';
		}

		return $post_types;
	}
}

add_filter( 'groovy_menu_single_post_add_meta_box_post_types', 'groovy_menu_support_elementor_post_types', 10, 1 );


if ( ! function_exists( 'groovy_menu_prevent_output_for_elementor_post_types' ) ) {

	/**
	 * Prevent output Groovy Menu for Elementor post types.
	 *
	 * @param $prevent bool if return true - groovy menu will disapear.
	 *
	 * @return bool
	 */
	function groovy_menu_prevent_output_for_elementor_post_types( $prevent ) {

		if ( defined( 'ELEMENTOR_VERSION' ) && 'elementor_library' === get_post_type() ) {
			$prevent = true;
		}

		return $prevent;
	}
}

add_filter( 'groovy_menu_prevent_output_html', 'groovy_menu_prevent_output_for_elementor_post_types', 10, 1 );


