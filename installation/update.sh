#acts-util
cd ACTS-Util
git pull

cd core
npm run compile
npm run webpack-debug
cd ..

cd node
npm run build
cd ..

cd ..

#acfrontend
cd ACFrontEnd
git pull

npm run compile
npm run build
npm run build-themes

cd ..

#arabicmusicencyclopedia
cd ArabicMusicEncyclopedia
git pull

cd api
npm run build
cd ..

cd backend
npm run build
cd ..

cd frontend
npm run compile
npm run build-debug
cd ..

cd ..

#update apache
cd ArabicMusicEncyclopedia/apache
sudo ./deploy.sh
cd ..
cd ..

#update inform message
echo "ArabicMusicEncyclopedia needs to be restarted for the update to take effect. Execute the following command to do so:"
echo "systemctl restart arabicmusicencyclopedia.service"
