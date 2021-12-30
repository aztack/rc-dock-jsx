mkdir -p ./example/node_modules/rc-dock-jsx/lib
cp -nf ./package.json ./example/node_modules/rc-dock-jsx/
cp -nf ./lib/index.* ./example/node_modules/rc-dock-jsx/lib/
cp -nf ./index.ts ./example/node_modules/rc-dock-jsx/
rm -rf ./node_modules/.cache