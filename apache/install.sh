cp arabicmusicencyclopedia_frontend.conf /etc/apache2/sites-available/
a2ensite arabicmusicencyclopedia_frontend.conf
a2enmod ssl
sed -i s/^Listen\ 80$/Listen\ 80\\nListen\ 8082/ /etc/apache2/ports.conf
systemctl reload apache2
