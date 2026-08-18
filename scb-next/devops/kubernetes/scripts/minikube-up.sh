#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
RUN_VERIFY=${SCB_NEXT_MINIKUBE_RUN_VERIFY:-true}

sh "$SCRIPT_DIR/preflight.sh"
SCB_NEXT_K8S_VALIDATION_MODE=local sh "$SCRIPT_DIR/validate.sh"
sh "$SCRIPT_DIR/minikube-start.sh"
sh "$SCRIPT_DIR/minikube-build.sh"
sh "$SCRIPT_DIR/minikube-deploy.sh"

if [ "$RUN_VERIFY" = "true" ]; then
  sh "$SCRIPT_DIR/minikube-verify.sh"
else
  echo "Minikube verification skipped by SCB_NEXT_MINIKUBE_RUN_VERIFY=false"
fi
