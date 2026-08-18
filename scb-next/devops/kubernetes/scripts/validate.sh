#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
SCB_NEXT_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/../../.." && pwd)
MODE=${SCB_NEXT_K8S_VALIDATION_MODE:-base}

case "$MODE" in
  base) DEFAULT_OVERLAY=$SCB_NEXT_ROOT/devops/kubernetes/base ;;
  local) DEFAULT_OVERLAY=$SCB_NEXT_ROOT/devops/kubernetes/overlays/minikube ;;
  production) DEFAULT_OVERLAY=$SCB_NEXT_ROOT/devops/kubernetes/base ;;
  *) echo "Unsupported SCB_NEXT_K8S_VALIDATION_MODE: $MODE" >&2; exit 1 ;;
esac

OVERLAY=${SCB_NEXT_K8S_OVERLAY:-$DEFAULT_OVERLAY}

command -v kubectl >/dev/null 2>&1 || { echo "kubectl is required" >&2; exit 1; }
command -v node >/dev/null 2>&1 || { echo "node is required" >&2; exit 1; }

node "$SCB_NEXT_ROOT/devops/scripts/verify-kubernetes-manifests.mjs" \
  --mode "$MODE" --kustomize "$OVERLAY"

if command -v kubeconform >/dev/null 2>&1; then
  kubectl kustomize "$OVERLAY" | kubeconform -strict -summary
else
  echo "kubeconform not installed; structural policy passed, schema validation skipped."
fi

echo "Kubernetes validation passed: mode=$MODE overlay=$OVERLAY"
