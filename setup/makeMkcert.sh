#!/bin/bash

echo "creating self-signed SSl certificates with mkcert"

echo "MKCERT VERSION: "
mkcert --version

mkcert -install

#mkcert create-ca

mkcert server localhost 0.0.0.0 ::8000