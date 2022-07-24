deployPath="/var/www/html/arabicmusicencyclopedia_frontend"
frontendPath="../frontend"
distPath=$frontendPath/dist

rm -rf $deployPath
mkdir $deployPath

cp $frontendPath/index.htm $deployPath/
cp $frontendPath/emmentaler-26.woff $deployPath/
cp $distPath/acts-util-core.js $deployPath/
cp $distPath/acfrontend.js $deployPath/
cp $distPath/bundle.js $deployPath/
cp $distPath/clean.css $deployPath/
cp $distPath/site.css $deployPath/
cp -r $frontendPath/images $deployPath/

chown -R www-data:www-data $deployPath
