<?php defined( 'ABSPATH' ) || die( 'This script cannot be accessed directly.' );

global $gm_supported_module;

$lver = false;
if ( defined( 'GROOVY_MENU_LVER' ) && '2' === GROOVY_MENU_LVER ) {
	$lver = true;
}

require_once dirname( __FILE__ ) . '/inc/GroovyMenuRoleCapabilities.php';
if ( $lver || version_compare( $gm_supported_module['db_version'], '1.4.4', '>' ) ) {
	require_once dirname( __FILE__ ) . '/inc/GroovyMenuSettings15.php';
	require_once dirname( __FILE__ ) . '/inc/GroovyMenuStyle15.php';
	require_once dirname( __FILE__ ) . '/inc/GroovyMenuPreset15.php';
} else {
	require_once dirname( __FILE__ ) . '/inc/GroovyMenuSettings.php';
	require_once dirname( __FILE__ ) . '/inc/GroovyMenuStyle.php';
	require_once dirname( __FILE__ ) . '/inc/GroovyMenuPreset.php';
}
require_once dirname( __FILE__ ) . '/inc/GroovyMenuUtils.php';
require_once dirname( __FILE__ ) . '/inc/GroovyMenuSingleMetaPreset.php';
require_once dirname( __FILE__ ) . '/inc/GroovyMenuIcons.php';
require_once dirname( __FILE__ ) . '/inc/GroovyMenuCategoryPreset.php';
require_once dirname( __FILE__ ) . '/inc/GroovyMenuGFonts.php';
