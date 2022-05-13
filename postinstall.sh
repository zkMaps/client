#!/bin/bash

# Remove old minified bundles
rm packages/react-app/public/snarkjs.min.js packages/react-app/public/circomlibjs.min.js packages/react-app/public/mexa.js

# Generate new SnarkJS minified bundle
cd node_modules/snarkjs
yarn && yarn buildiifemin
cd ..

# Generate new circomlibjs minified bundle
# @notice uses custom fork @ github.com/jp4g/circomlibjs#browser-compatibility until fix pushed
# cd circomlibjs
# yarn && yarn build:min
cd ..

# Generate new biconomy bundle
# cd @biconomy/mexa
# yarn && yarn build
# cd ../../..

# Copy new bundles to public/
cp node_modules/snarkjs/build/snarkjs.min.js packages/react-app/public/
# cp node_modules/circomlibjs/build/circomlibjs.min.js packages/react-app/public/
# cp node_modules/@biconomy/mexa/dist/mexa.js packages/react-app/public/


