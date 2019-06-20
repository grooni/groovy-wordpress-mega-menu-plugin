<?php
define( 'GROONI_EXPORT_SEC', 'getmeexportdata' );

include 'vendor/autoload.php';

use Alchemy\Zippy\Zippy;


// ---------------------------------------------------------------------------------------------------------------------
// folders for new dev project
$project_var_folders = [
	'zip_modules',
];

foreach ( $project_var_folders as $prj_folder ) {
	if ( ! is_dir( $prj_folder ) ) {
		if ( ! mkdir( $prj_folder, 0755, true ) ) {
			die( 'ERROR on create folder for dump files ( ' . $prj_folder . ' )' );
		} else {
			echo "Folder create: ( {$prj_folder} ) \n";
		}
	}
}


// ---------------------------------------------------------------------------------------------------------------------
// Read composer.json data
$json_composer = json_decode( @file_get_contents( 'composer.json' ), true );
$modules       = array();

foreach ( $json_composer['repositories'] as $index => $data ) {
	if ('package' !== $data['type'] ) {
		continue;
	}

	preg_match( '#^.*\/(.*)#', $data['package']['name'], $parse_name );
	if ( empty( $parse_name[1] ) ) {
		continue;
	}

	echo "add module: {$parse_name[1]}\n";

	$module_ver = '1.0';
	if ( empty( $data['package']['version'] ) ) {
		$data['package']['version'] = $module_ver;
	}

	$file_name                   = $parse_name[1];
	$data['package']['filename'] = $file_name;

	$modules[$data['package']['name']] = $data['package'];
}


// ---------------------------------------------------------------------------------------------------------------------
// Create modules ZIP

echo "\n-----=[ CREATE ZIPs ]==-----\n";

$zippy = Zippy::load();

foreach ( $modules as $index => $module_data ) {
	//$file = 'zip_modules/' . $module_data['filename'] . '-' . $module_data['version'] . '.zip';
	$file = 'zip_modules/' . $module_data['filename'] . '.zip';
	$path = 'groovy-menu/includes/modules/' . $module_data['filename'];

	echo "zip module: {$path}\n";

	$zippy->create( $file, array( $path ), true );
}


// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

