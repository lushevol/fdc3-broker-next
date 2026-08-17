#!/bin/sh
set -eu

PROFILE=${SCB_NEXT_MINIKUBE_PROFILE:-scb-next}
CONTEXT=${SCB_NEXT_KUBECTL_CONTEXT:-$PROFILE}
NAMESPACE=scb-next-minikube
EDGE_PORT=${SCB_NEXT_MINIKUBE_EDGE_PORT:-9083}
EDGE_ORIGIN=http://127.0.0.1:$EDGE_PORT
PORT_FORWARD_LOG=${TMPDIR:-/tmp}/scb-next-minikube-port-forward.log
RATAN_EDGE_REPLICAS=$(kubectl --context "$CONTEXT" -n "$NAMESPACE" get deployment/ratan-edge -o jsonpath='{.spec.replicas}')
RATAN_EDGE_SCALED=false

kubectl --context "$CONTEXT" -n "$NAMESPACE" port-forward service/scb-next-edge "$EDGE_PORT:8080" >"$PORT_FORWARD_LOG" 2>&1 &
PORT_FORWARD_PID=$!
cleanup() {
  if [ "$RATAN_EDGE_SCALED" = true ]; then
    kubectl --context "$CONTEXT" -n "$NAMESPACE" scale deployment/ratan-edge --replicas="$RATAN_EDGE_REPLICAS" >/dev/null
    kubectl --context "$CONTEXT" -n "$NAMESPACE" rollout status deployment/ratan-edge --timeout=180s >/dev/null
  fi
  kill "$PORT_FORWARD_PID" 2>/dev/null || true
  wait "$PORT_FORWARD_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

attempt=0
until curl --fail --silent "$EDGE_ORIGIN/healthz" >/dev/null 2>&1; do
  attempt=$((attempt + 1))
  if [ "$attempt" -ge 30 ]; then
    cat "$PORT_FORWARD_LOG" >&2
    exit 1
  fi
  sleep 1
done

probe() {
  label=$1
  path=$2
  echo "Verifying $label: $path"
  attempt=0
  until curl --fail --silent --max-time 5 --output /dev/null "$EDGE_ORIGIN$path"; do
    attempt=$((attempt + 1))
    if [ "$attempt" -ge 30 ]; then
      curl --fail --silent --show-error --max-time 5 --output /dev/null "$EDGE_ORIGIN$path"
      return 1
    fi
    sleep 1
  done
}

reject_probe() {
  label=$1
  path=$2
  echo "Verifying $label: $path"
  if curl --fail --silent --show-error --max-time 5 --output /dev/null "$EDGE_ORIGIN$path" 2>/dev/null; then
    echo "Expected request to fail while ratan-edge is unavailable: $path" >&2
    exit 1
  fi
}

probe "platform UI" "/"
probe "platform BFF" "/api/healthz"
probe "tenant BFF" "/api/ratan/bff/healthz"
probe "tenant notification" "/api/ratan/notification/healthz"
probe "tenant data ambassador" "/api/ratan/da/healthz"
probe "tenant API fallback" "/api/ratan/healthz"
probe "Ratan canonical static" "/static/ratan/container/remoteEntry.js"
probe "Cashflow canonical static" "/static/ratan/cashflow/remoteEntry.js"
probe "Ratan compatibility static" "/remotes/ratan/remoteEntry.js"
probe "Cashflow compatibility static" "/remotes/cashflow/remoteEntry.js"

curl --fail --silent --show-error --head "$EDGE_ORIGIN/remotes/ratan/remoteEntry.js" | grep -i '^Cache-Control: no-store'
curl --fail --silent --show-error --head "$EDGE_ORIGIN/remotes/cashflow/remoteEntry.js" | grep -i '^Cache-Control: no-store'

echo "Scaling the independently owned Ratan edge to zero for failure-isolation evidence."
kubectl --context "$CONTEXT" -n "$NAMESPACE" scale deployment/ratan-edge --replicas=0
RATAN_EDGE_SCALED=true
kubectl --context "$CONTEXT" -n "$NAMESPACE" wait --for=delete pod -l app.kubernetes.io/name=ratan-edge --timeout=60s

probe "platform traffic remains available (health)" "/healthz"
probe "platform traffic remains available (UI)" "/"
probe "platform traffic remains available (BFF)" "/api/healthz"
reject_probe "tenant traffic is unavailable (API)" "/api/ratan/healthz"
reject_probe "tenant traffic is unavailable (static)" "/remotes/ratan/remoteEntry.js"

echo "Restoring the independently owned Ratan edge."
kubectl --context "$CONTEXT" -n "$NAMESPACE" scale deployment/ratan-edge --replicas="$RATAN_EDGE_REPLICAS"
kubectl --context "$CONTEXT" -n "$NAMESPACE" rollout status deployment/ratan-edge --timeout=180s
RATAN_EDGE_SCALED=false
probe "tenant traffic recovers (API)" "/api/ratan/healthz"
probe "tenant traffic recovers (static)" "/remotes/ratan/remoteEntry.js"

echo "Running fixture-backed Playwright evidence; this does not certify corporate backend integrations."
PLAYWRIGHT_BASE_URL="$EDGE_ORIGIN" PLAYWRIGHT_PRODUCTION_EDGE=1 npm run test:e2e
