#!/bin/bash

apt install -y --no-install-recommends lilypond
apt install -y --no-install-recommends fonts-noto-core #for the Noto Naskh Arabic font
cp arabic-rhythm1.ly /usr/share/lilypond/*/ly/
cp arabic-rhythm2.ly /usr/share/lilypond/*/ly/
