#!/bin/bash

cd ./setup

mkcert -install

mkcert -CAROOT

mkcert -key-file key.pem -cert-file cert.pem server localhost 0.0.0.0 ::8002
