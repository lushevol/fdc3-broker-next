#!/bin/bash
NAMESPACE="${NAMESPACE:-application}"

helm package . --app-version=$2 -n $NAMESPACE

helm upgrade --debug --install $1 ratan-spring-boot-1.0.0.tgz -n $NAMESPACE --set "environment=$3,$4"
