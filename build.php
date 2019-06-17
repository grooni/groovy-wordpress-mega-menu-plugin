<?php
define( 'GROONI_EXPORT_SEC', 'getmeexportdata' );

include 'vendor/autoload.php';

use Alchemy\Zippy\Zippy;


$zippy = Zippy::load();

// ---------------------------------------------------------------------------------------------------------------------
// Create plugin ZIP

$zippy->create( 'groovy-menu.zip', array( 'groovy-menu' ), true );
echo "groovy-menu.zip done\n";


// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

