#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
SCB_NEXT_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/../../.." && pwd)
PROFILE=${SCB_NEXT_MINIKUBE_PROFILE:-scb-next}
CONTEXT=${SCB_NEXT_KUBECTL_CONTEXT:-$PROFILE}
NAMESPACE=${SCB_NEXT_K8S_NAMESPACE:-scb-next-minikube}
EVIDENCE_LABEL=${SCB_NEXT_EVIDENCE_LABEL:-k8s-diagnostics}
RUN_DIR=$(SCB_NEXT_EVIDENCE_LABEL="$EVIDENCE_LABEL" sh "$SCB_NEXT_ROOT/devops/scripts/capture-environment.sh")

kubectl --context "$CONTEXT" -n "$NAMESPACE" get all,ingress,networkpolicies,pdb -o wide > "$RUN_DIR/inventory.txt" 2>&1 || true
kubectl --context "$CONTEXT" -n "$NAMESPACE" describe pods > "$RUN_DIR/pods-describe.txt" 2>&1 || true
kubectl --context "$CONTEXT" -n "$NAMESPACE" get events --sort-by='.metadata.creationTimestamp' > "$RUN_DIR/events.txt" 2>&1 || true
kubectl --context "$CONTEXT" -n "$NAMESPACE" get pods -o json > "$RUN_DIR/pods.json" 2>&1 || true
kubectl kustomize "$SCB_NEXT_ROOT/devops/kubernetes/overlays/minikube" > "$RUN_DIR/rendered-minikube.yaml" 2>&1 || true
minikube -p "$PROFILE" logs --file="$RUN_DIR/minikube.log" >/dev/null 2>&1 || true

echo "$RUN_DIR"
