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


echo '-----=[ make modules from premium ]==-----'
cd ../groovy-menu/
./deploy---modules.sh
cd ../groovy-menu-wp.org


echo '-----=[ copy modules from premium ]==-----'
rm -r zip_modules
ln -s ../groovy-menu/zip_modules zip_modules


### ////////////////////////////////////
echo '-----=[ remove old modules ]==-----'
rm -r groovy-menu/includes/modules
mkdir groovy-menu/includes/modules

echo '-----=[ Run Composer ]==-----'
composer clearcache
composer update


composer --working-dir=groovy-menu update


echo '-----------------------------------------------------'
echo -en "\033[1;32m                            [ All work was DONE ]  \033[0m\n"
echo '-----------------------------------------------------'
echo '                                                     '
