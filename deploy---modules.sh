#!/bin/bash

### update modules with composer
#echo '-----=[ update modules with composer ]==-----'
#composer --working-dir=groovy-menu/includes/modules/core update
#composer --working-dir=groovy-menu/includes/modules/walkers update
#composer --working-dir=groovy-menu/includes/modules/storage update
#composer --working-dir=groovy-menu/includes/modules/templates update
#composer --working-dir=groovy-menu/includes/modules/debugpage update
#composer --working-dir=groovy-menu/includes/modules/fields update
#composer --working-dir=groovy-menu/includes/modules/menublocks update
#composer --working-dir=groovy-menu/includes/modules/virtualpages update
#composer --working-dir=groovy-menu/includes/modules/widgetinmenu update


### ////////////////////////////////////
echo '-----=[ remove old zip_modules files and same folder ]==-----'
rm -r zip_modules

### ////////////////////////////////////
echo '-----=[ run build-modules.php ]==-----'
php build-modules.php


### ////////////////////////////////////
echo '-----=[ add new modules to the Updater folder ]==-----'
cp zip_modules/*.zip ../wp-update-server/modules/
chown -R www-data ../wp-update-server/modules/


echo '-----------------------------------------------------'
echo -en "\033[1;32m                            [ All work was DONE ]  \033[0m\n"
echo '-----------------------------------------------------'
echo '                                                     '
