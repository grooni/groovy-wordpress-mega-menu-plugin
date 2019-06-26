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
echo 'remove old groovy-mega-menu.zip'
rm groovy-mega-menu.zip
echo 'run build.php'
php build.php


echo '-----------------------------------------------------'
echo -en "\033[1;32m                            [ All work was DONE ]  \033[0m\n"
echo '-----------------------------------------------------'
echo '                                                     '
