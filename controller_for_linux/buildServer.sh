#!/bin/sh
SHELL_PATH=$(dirname $0)

cd $SHELL_PATH

cd ..

cd nestjs

find ./config -type f -name "*.js" -exec rm {} \;
find ./libs -type f -name "*.js" -exec rm {} \;
find ./src -type f -name "*.js" -exec rm {} \;
find ./test -type f -name "*.js" -exec rm {} \;

npm run build