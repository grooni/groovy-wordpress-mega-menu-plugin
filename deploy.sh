#!/bin/bash

### ////////////////////////////////////
echo 'npm install'
npm i


### ////////////////////////////////////
echo 'composer install'
composer install


### ///////////////////////////////////
echo 'gulp build groovy-menu'
gulp build --production


### ////////////////////////////////////
echo 'remove old groovy-menu.zip'
rm groovy-menu.zip
echo 'run build.php'
php build.php


### ////////////////////////////////////
echo 'add new groovy-menu.zip to the Updater folder'
cp groovy-menu.zip ../wp-update-server/packages/groovy-menu.zip

echo '-----------------------------------------------------'
echo '                                                     '
echo -en "\033[1;34m     _|_     _|_     _|_     _|_     _|_     _|_     \033[0m\n"
echo -en "\033[1;34m      |       |       |       |       |       |      \033[0m\n"
echo -en "\033[1;34m _|_     _|_     _|_     _|_     _|_     _|_     _|_ \033[0m\n"
echo -en "\033[1;34m  |       |       |       |       |       |       |  \033[0m\n"
echo -en "\033[1;34m     _|_     _|_     _|_     _|_     _|_     _|_     \033[0m\n"
echo -en "\033[1;34m      |       |       |       |       |       |      \033[0m\n"
echo '                                                     '
echo -en "\033[1;5;32m                              [ All work was DONE ]  \033[0m\n"
echo '-----------------------------------------------------'
echo '                                                     '
