#!/bin/bash

set -e  # Exit on error

# Log everything
exec > >(tee /var/log/dflow-bootstrap.log | logger -t user-data -s 2>/dev/console) 2>&1

echo "[+] Installing Dokku v0.35.20"
wget -q https://dokku.com/bootstrap.sh
DOKKU_TAG="v0.35.20"
sudo DOKKU_TAG=$DOKKU_TAG bash bootstrap.sh

echo "[+] Clearing global Dokku domain"
dokku domains:clear-global

echo "[+] Setting dFlow MOTD"
chmod -x /etc/update-motd.d/* || true

cat << "EOF" > /etc/motd
 __________________
< Welcome To dFlow >
 ------------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||

A lightweight developer PaaS  
powered by Dokku

👉 https://dflow.sh
==========================================
EOF

echo "✅ Setup complete!"
