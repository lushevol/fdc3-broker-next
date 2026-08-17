#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
OVERLAY=$(CDPATH= cd -- "$SCRIPT_DIR/../overlays/minikube" && pwd)
PROFILE=${SCB_NEXT_MINIKUBE_PROFILE:-scb-next}
CONTEXT=${SCB_NEXT_KUBECTL_CONTEXT:-$PROFILE}
NAMESPACE=scb-next-minikube

kubectl --context "$CONTEXT" apply -k "$OVERLAY"

for deployment in scb-next-edge mfe-base single-ui-bff ratan-container cashflow-blotter ratan-backend-mock; do
  kubectl --context "$CONTEXT" -n "$NAMESPACE" rollout restart "deployment/$deployment"
done

for deployment in scb-next-edge mfe-base single-ui-bff ratan-container cashflow-blotter ratan-backend-mock; do
  kubectl --context "$CONTEXT" -n "$NAMESPACE" rollout status "deployment/$deployment" --timeout=180s
done

kubectl --context "$CONTEXT" -n "$NAMESPACE" get deployments,services,ingress,networkpolicies
