#!/bin/bash

readonly USAGE="Usage: run_puppeteer.sh yourfile.js"

if [ -z "$1" ]
then
  echo "File not specified."
  echo $USAGE
  exit 0
fi

echo "Running $1 in Puppeteer..."

file=`cat $1`

# set -x # debug on
 #-v /usr/local/gopath/src/github.com/ebidel/try-puppeteer/backend/out:/home/pptruser/ocr/data \
docker run --shm-size=1gb -i --rm --cap-add=SYS_ADMIN \
  --name puppeteer-chrome puppeteer-chrome-linux \
  node -e "$file"
#  node -e "--trace-warnings $file"
# set +x # debug off
