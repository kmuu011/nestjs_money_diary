#!/bin/sh
SHELL_PATH=$(dirname $0)

cd $SHELL_PATH

cd ..

cd nestjs

npm run build
npm run test:clearCache
npm run test:e2e