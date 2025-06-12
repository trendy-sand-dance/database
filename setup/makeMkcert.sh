#!/bin/bash

echo "creating self-signed SSl certificates with mkcert"

#curl https://mkcert.org/generate/dst+digicert

#sudo apt-get install wget libnss3-tools -y

#wget https://github.com/FiloSottile/mkcert/releases/download/v1.4.3/mkcert-v1.4.3-linux-amd64

#sudo mv mkcert-v1.4.3-linux-amd64 /setup

#sudo chmod +x /setup

mkcert -install

mkcert -CAROOT

mkcert test localhost 0.0.0.0 ::8000