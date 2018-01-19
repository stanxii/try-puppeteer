#!/bin/bash

while true
do
  # loop infinitely
  sleep 3
  echo "docker cp  5f603a3911fa:/home/pptruser/ocr/data/out_excel.microchip.csv ."
  docker cp  5f603a3911fa:/home/pptruser/ocr/data/out_excel.microchip.csv .
done
