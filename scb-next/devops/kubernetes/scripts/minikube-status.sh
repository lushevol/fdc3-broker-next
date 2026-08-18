#!/bin/sh
set -eu

PROFILE=${SCB_NEXT_MINIKUBE_PROFILE:-scb-next}
CONTEXT=${SCB_NEXT_KUBECTL_CONTEXT:-$PROFILE}
NAMESPACE=${SCB_NEXT_K8S_NAMESPACE:-scb-next-minikube}

minikube status -p "$PROFILE"
kubectl --context "$CONTEXT" -n "$NAMESPACE" get \
  deployments,pods,services,ingress,networkpolicies,pdb -o wide
kubectl --context "$CONTEXT" -n "$NAMESPACE" get events \
  --sort-by='.metadata.creationTimestamp' | tail -n 30
