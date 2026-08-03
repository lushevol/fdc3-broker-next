#!/bin/bash

subcommand=$1
# check sub command is run or build
if [ "$subcommand" == "run" ]; then
    echo "Building the project and perform the deployment..."
    ssh scb@localhost -p 2222 < .sc-devkit/build-n-deploy.sh
else
    echo "Invalid subcommand"
fi
