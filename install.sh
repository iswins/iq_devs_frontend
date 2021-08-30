#!/bin/bash


cd docker && docker-compose up -d && cd ../
docker exec -it iq_devs_frontend npm install
docker exec -it iq_devs_frontend npm run build
