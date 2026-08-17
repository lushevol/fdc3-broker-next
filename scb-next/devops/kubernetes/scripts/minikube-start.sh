#!/bin/sh
set -eu

PROFILE=${SCB_NEXT_MINIKUBE_PROFILE:-scb-next}
CPUS=${SCB_NEXT_MINIKUBE_CPUS:-2}
MEMORY=${SCB_NEXT_MINIKUBE_MEMORY:-3072}

command -v minikube >/dev/null 2>&1 || {
  echo "minikube is required; install it with the approved workstation package source." >&2
  exit 1
}

if minikube status -p "$PROFILE" --format '{{.Host}}' 2>/dev/null | grep -q '^Running$'; then
  echo "Minikube profile $PROFILE is already running."
else
  minikube start -p "$PROFILE" --driver=docker --cpus="$CPUS" --memory="$MEMORY"
fi

minikube -p "$PROFILE" addons enable ingress
