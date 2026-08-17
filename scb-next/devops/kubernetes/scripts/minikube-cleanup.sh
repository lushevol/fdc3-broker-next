#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
OVERLAY=$(CDPATH= cd -- "$SCRIPT_DIR/../overlays/minikube" && pwd)
PROFILE=${SCB_NEXT_MINIKUBE_PROFILE:-scb-next}
CONTEXT=${SCB_NEXT_KUBECTL_CONTEXT:-$PROFILE}

kubectl --context "$CONTEXT" delete -k "$OVERLAY" --ignore-not-found=true

if [ "${SCB_NEXT_DELETE_MINIKUBE_PROFILE:-false}" = "true" ]; then
  minikube delete -p "$PROFILE"
fi
