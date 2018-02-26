echo "Instalando dependências..."

echo "Instalando fswebcam..."
apt install fswebcam -y

echo "Instalando NodeJS..."
mkdir ~/.opt
mv ./node/node-v9.6.0-linux-x64.tar ~/.opt
tar -xvf ~/.opt/node-v9.6.0-linux-x64.tar
export PATH=$PATH:~/.opt/node-v9.4.0-linux-x64/bin

echo "Instalando dependências..."
npm install

echo "Finalizado."