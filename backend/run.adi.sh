#!/bin/bash

while true
do
  # loop infinitely
  sleep 5
  echo "hell"
  docker cp c3549cf2dcd9:/home/pptruser/ocr/data/out_excel.adi.csv .
done
