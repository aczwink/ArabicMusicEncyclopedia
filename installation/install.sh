sudo apt update

#install npm
sudo apt install npm
sudo npm install -g npm@latest

#install necessary software
sudo apt install apache2 git ruby-sass

#acts-util
git clone https://github.com/aczwink/ACTS-Util.git
cd ACTS-Util

cd core
npm install
sudo npm link
cd ..

cd node
npm link acts-util-core
npm install
sudo npm link
cd ..

cd ..

#acfrontend
git clone https://github.com/aczwink/ACFrontEnd.git
cd ACFrontEnd

npm link acts-util-core
npm install
sudo npm link

cd ..


#arabicmusicencyclopedia
git clone https://github.com/aczwink/ArabicMusicEncyclopedia.git
cd ArabicMusicEncyclopedia

cd api
npm install
sudo npm link
cd ..

cd backend
npm link acts-util-core
npm link acts-util-node
npm link ame-api
npm install
cd ..

cd frontend
npm link acts-util-core
npm link acfrontend
npm link ame-api
npm install
mkdir dist
npm run deploy
cd ..

cd ..


#install for apache
cd ArabicMusicEncyclopedia/apache
sudo ./install.sh
cd ..
cd ..


#issue update
ln -s ArabicMusicEncyclopedia/installation/update.sh update.sh
chmod +x update.sh
./update.sh

#install systemd unit
dirPath=$(dirname "$0")
absDirPath=$(realpath $dirPath)/ArabicMusicEncyclopedia/backend
sudo cp ArabicMusicEncyclopedia/installation/arabicmusicencyclopedia.service /etc/systemd/system/
sudo sed -i -e "s:\\\$TARGETDIR\\\$:$absDirPath:g" /etc/systemd/system/arabicmusicencyclopedia.service

sudo systemctl enable arabicmusicencyclopedia.service
sudo systemctl start arabicmusicencyclopedia.service
