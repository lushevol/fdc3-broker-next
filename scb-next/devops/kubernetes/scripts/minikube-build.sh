#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
SCB_NEXT_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/../../.." && pwd)
PROFILE=${SCB_NEXT_MINIKUBE_PROFILE:-scb-next}
EDGE_PORT=${SCB_NEXT_MINIKUBE_EDGE_PORT:-9083}
EDGE_ORIGIN=${SCB_NEXT_EDGE_ORIGIN:-http://127.0.0.1:$EDGE_PORT}

cd "$SCB_NEXT_ROOT"
SCB_NEXT_EDGE_ORIGIN="$EDGE_ORIGIN" npm run build:production

minikube -p "$PROFILE" image build -f devops/containers/edge/Dockerfile -t scb-next-local/edge:dev .
minikube -p "$PROFILE" image build -f devops/containers/static-ui/Dockerfile --build-arg STATIC_DIR=web/mfe-base-origin/dist -t scb-next-local/mfe-base:dev .
minikube -p "$PROFILE" image build -f devops/containers/static-ui/Dockerfile --build-arg STATIC_DIR=web/mfe-ratan-container-origin/dist -t scb-next-local/ratan-container:dev .
minikube -p "$PROFILE" image build -f devops/containers/static-ui/Dockerfile --build-arg STATIC_DIR=web/mfe-cashflow-blotter-origin/dist -t scb-next-local/cashflow-blotter:dev .
minikube -p "$PROFILE" image build -f devops/containers/mock-bff/Dockerfile -t scb-next-local/mock-bff:dev .
