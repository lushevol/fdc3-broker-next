#!/bin/sh
set -eu

PROFILE=${SCB_NEXT_MINIKUBE_PROFILE:-scb-next}
CONTEXT=${SCB_NEXT_KUBECTL_CONTEXT:-$PROFILE}
NAMESPACE=scb-next-minikube
EDGE_PORT=${SCB_NEXT_MINIKUBE_EDGE_PORT:-9083}
EDGE_ORIGIN=http://127.0.0.1:$EDGE_PORT
PORT_FORWARD_LOG=${TMPDIR:-/tmp}/scb-next-minikube-port-forward.log
SCALED_DEPLOYMENT=
SCALED_REPLICAS=

kubectl --context "$CONTEXT" -n "$NAMESPACE" port-forward service/scb-next-edge "$EDGE_PORT:8080" >"$PORT_FORWARD_LOG" 2>&1 &
PORT_FORWARD_PID=$!
cleanup() {
  if [ -n "$SCALED_DEPLOYMENT" ]; then
    kubectl --context "$CONTEXT" -n "$NAMESPACE" scale "deployment/$SCALED_DEPLOYMENT" --replicas="$SCALED_REPLICAS" >/dev/null
    kubectl --context "$CONTEXT" -n "$NAMESPACE" rollout status "deployment/$SCALED_DEPLOYMENT" --timeout=180s >/dev/null
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
    echo "Expected request to fail while its owning service is unavailable: $path" >&2
    exit 1
  fi
}

probe_identity() {
  label=$1
  path=$2
  expected_service=$3
  echo "Verifying $label: $path -> $expected_service"
  attempt=0
  until curl --fail --silent --max-time 5 --dump-header - --output /dev/null "$EDGE_ORIGIN$path" |
    tr -d '\r' | grep -i "^x-scb-next-mock-service: $expected_service$" >/dev/null; do
    attempt=$((attempt + 1))
    if [ "$attempt" -ge 30 ]; then
      echo "Expected x-scb-next-mock-service: $expected_service for $path" >&2
      return 1
    fi
    sleep 1
  done
}

scale_down() {
  deployment=$1
  SCALED_DEPLOYMENT=$deployment
  SCALED_REPLICAS=$(kubectl --context "$CONTEXT" -n "$NAMESPACE" get "deployment/$deployment" -o jsonpath='{.spec.replicas}')
  kubectl --context "$CONTEXT" -n "$NAMESPACE" scale "deployment/$deployment" --replicas=0
  kubectl --context "$CONTEXT" -n "$NAMESPACE" wait --for=delete pod -l "app.kubernetes.io/name=$deployment" --timeout=60s
}

restore_scaled_deployment() {
  kubectl --context "$CONTEXT" -n "$NAMESPACE" scale "deployment/$SCALED_DEPLOYMENT" --replicas="$SCALED_REPLICAS"
  kubectl --context "$CONTEXT" -n "$NAMESPACE" rollout status "deployment/$SCALED_DEPLOYMENT" --timeout=180s
  SCALED_DEPLOYMENT=
  SCALED_REPLICAS=
}

verify_portal_outage() {
  deployment=$1
  owned_path=$2

  echo "Scaling $deployment to zero for portal failure-isolation evidence."
  scale_down "$deployment"
  reject_probe "portal service is unavailable ($deployment)" "$owned_path"

  for route in \
    "portal-auth-service|/api/auth/v2/sso/validate" \
    "portal-tile-management-service|/api/auth/v1/fmo/admin/importmap/active" \
    "portal-telemetry-service|/api/analytics/v1/fmo/print"; do
    service=${route%%|*}
    path=${route#*|}
    if [ "$service" != "$deployment" ]; then
      probe_identity "unaffected routes remain available" "$path" "$service"
    fi
  done
  probe_identity "legacy fallback remains available" "/api/healthz" "single-ui-bff"
  probe "tenant route remains available" "/api/ratan/healthz"

  restore_scaled_deployment
  probe_identity "portal service recovers" "$owned_path" "$deployment"
}

probe "platform UI" "/"
probe_identity "portal auth" "/api/auth/v2/sso/validate" "portal-auth-service"
probe_identity "portal tile management" "/api/auth/v1/fmo/admin/importmap/active" "portal-tile-management-service"
probe_identity "portal telemetry" "/api/analytics/v1/fmo/print" "portal-telemetry-service"
probe_identity "legacy platform fallback" "/api/healthz" "single-ui-bff"
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
scale_down "ratan-edge"

probe "platform traffic remains available (health)" "/healthz"
probe "platform traffic remains available (UI)" "/"
probe "platform traffic remains available (BFF)" "/api/healthz"
reject_probe "tenant traffic is unavailable (API)" "/api/ratan/healthz"
reject_probe "tenant traffic is unavailable (static)" "/remotes/ratan/remoteEntry.js"

echo "Restoring the independently owned Ratan edge."
restore_scaled_deployment
probe "tenant traffic recovers (API)" "/api/ratan/healthz"
probe "tenant traffic recovers (static)" "/remotes/ratan/remoteEntry.js"

verify_portal_outage "portal-auth-service" "/api/auth/v2/sso/validate"
verify_portal_outage "portal-tile-management-service" "/api/auth/v1/fmo/admin/importmap/active"
verify_portal_outage "portal-telemetry-service" "/api/analytics/v1/fmo/print"

echo "Running fixture-backed Playwright evidence; this does not certify corporate backend integrations."
PLAYWRIGHT_BASE_URL="$EDGE_ORIGIN" PLAYWRIGHT_PRODUCTION_EDGE=1 npm run test:e2e
