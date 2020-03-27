#!/bin/bash

### update modules with composer
#echo '-----=[ update modules with composer ]==-----'
#composer --working-dir=groovy-menu/includes/modules/core update
#composer --working-dir=groovy-menu/includes/modules/walkers update
#composer --working-dir=groovy-menu/includes/modules/storage update
#composer --working-dir=groovy-menu/includes/modules/debugpage update
#composer --working-dir=groovy-menu/includes/modules/fields update
#composer --working-dir=groovy-menu/includes/modules/virtualpages update


#echo '-----=[ make modules from premium ]==-----'
cd ../groovy-menu/
./deploy---modules.sh
cd ../groovy-menu-wp.org


#echo '-----=[ copy modules from premium ]==-----'
rm -r zip_modules
mkdir zip_modules
#ln -s ../groovy-menu/zip_modules zip_modules
cp ../groovy-menu/zip_modules/core.zip zip_modules/core.zip
cp ../groovy-menu/zip_modules/walkers.zip zip_modules/walkers.zip
cp ../groovy-menu/zip_modules/storage.zip zip_modules/storage.zip
cp ../groovy-menu/zip_modules/debugpage.zip zip_modules/debugpage.zip
cp ../groovy-menu/zip_modules/fields.zip zip_modules/fields.zip
cp ../groovy-menu/zip_modules/virtualpages.zip zip_modules/virtualpages.zip


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
