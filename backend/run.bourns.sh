#!/bin/bash

while true
do
  # loop infinitely
  sleep 3
  echo "docker cp  708e89467121:/home/pptruser/ocr/data/out_excel.bourns.csv ."
  docker cp  708e89467121:/home/pptruser/ocr/data/out_excel.bourns.csv .
done
