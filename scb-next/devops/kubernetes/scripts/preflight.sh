#!/bin/sh
set -eu

MODE=${SCB_NEXT_K8S_PREFLIGHT_MODE:-local}
PROFILE=${SCB_NEXT_MINIKUBE_PROFILE:-scb-next}
CONTEXT=${SCB_NEXT_KUBECTL_CONTEXT:-$PROFILE}

require_command() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Missing required command: $1" >&2
    exit 1
  }
}

require_command node
require_command npm
require_command kubectl
require_command curl

if [ "$MODE" = "local" ]; then
  require_command docker
  require_command minikube
  docker info >/dev/null 2>&1 || {
    echo "Docker is installed but its daemon is unavailable" >&2
    exit 1
  }
  echo "Kubernetes local preflight passed: profile=$PROFILE context=$CONTEXT"
else
  kubectl config get-contexts "$CONTEXT" >/dev/null 2>&1 || {
    echo "kubectl context is unavailable: $CONTEXT" >&2
    exit 1
  }
  echo "Kubernetes production preflight passed: context=$CONTEXT"
fi
