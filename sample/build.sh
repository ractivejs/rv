#!/bin/bash

# First, remove any existing dist folder
rm -rf dist
mkdir dist

# Then, copy the index.html, require.js and styles.css files
cp src/index.html dist/index.html
cp src/require.js dist/require.js
cp src/styles.css dist/styles.css

# Then we run r.js - the main.js file contains all the
# configuration we need
r.js -o mainConfigFile=src/js/main.js
