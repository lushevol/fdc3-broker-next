#!/bin/bash

# ./deploy.sh fmo-app-shell 0.5.0-alpha.14 sit service.type=NodePort,replicas=1

helm package . --app-version=$2 -n application

helm upgrade --debug --install $1 ratan-nginx-webapp-1.0.0.tgz -n application --set "environment=$3,$4"
