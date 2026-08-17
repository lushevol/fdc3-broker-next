#!/bin/sh
set -eu

PROFILE=${SCB_NEXT_MINIKUBE_PROFILE:-scb-next}
CONTEXT=${SCB_NEXT_KUBECTL_CONTEXT:-$PROFILE}
NAMESPACE=scb-next-minikube
EDGE_PORT=${SCB_NEXT_MINIKUBE_EDGE_PORT:-9083}
EDGE_ORIGIN=http://127.0.0.1:$EDGE_PORT
PORT_FORWARD_LOG=${TMPDIR:-/tmp}/scb-next-minikube-port-forward.log

kubectl --context "$CONTEXT" -n "$NAMESPACE" port-forward service/scb-next-edge "$EDGE_PORT:8080" >"$PORT_FORWARD_LOG" 2>&1 &
PORT_FORWARD_PID=$!
cleanup() {
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
  curl --fail --silent --show-error --output /dev/null "$EDGE_ORIGIN$path"
}

probe "platform UI" "/"
probe "platform BFF" "/api/healthz"
probe "tenant API" "/api/ratan/healthz"
probe "Ratan canonical static" "/static/ratan/container/remoteEntry.js"
probe "Cashflow canonical static" "/static/ratan/cashflow/remoteEntry.js"
probe "Ratan compatibility static" "/remotes/ratan/remoteEntry.js"
probe "Cashflow compatibility static" "/remotes/cashflow/remoteEntry.js"

curl --fail --silent --show-error --head "$EDGE_ORIGIN/remotes/ratan/remoteEntry.js" | grep -i '^Cache-Control: no-store'
curl --fail --silent --show-error --head "$EDGE_ORIGIN/remotes/cashflow/remoteEntry.js" | grep -i '^Cache-Control: no-store'

echo "Running fixture-backed Playwright evidence; this does not certify corporate backend integrations."
PLAYWRIGHT_BASE_URL="$EDGE_ORIGIN" PLAYWRIGHT_PRODUCTION_EDGE=1 npm run test:e2e
