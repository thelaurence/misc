wget https://github.com/googlei18n/noto-emoji/raw/master/fonts/NotoColorEmoji.ttf
sudo mkdir -p /usr/local/share/fonts/truetype/noto
sudo mv NotoColorEmoji.ttf /usr/local/share/fonts/truetype/noto/
sudo apt-get remove ttf-ancient-fonts-symbola fonts-symbola
sudo chmod 644 /usr/local/share/fonts/truetype/noto/NotoColorEmoji.ttf
sudo fc-cache -f -v
