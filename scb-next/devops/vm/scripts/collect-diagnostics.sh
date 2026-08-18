#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
SCB_NEXT_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/../../.." && pwd)
EDGE_ORIGIN=${SCB_NEXT_EDGE_ORIGIN:-http://127.0.0.1:8080}
EVIDENCE_LABEL=${SCB_NEXT_EVIDENCE_LABEL:-vm-diagnostics}
RUN_DIR=$(SCB_NEXT_EVIDENCE_LABEL="$EVIDENCE_LABEL" sh "$SCB_NEXT_ROOT/devops/scripts/capture-environment.sh")
ROUTE_FILE=$RUN_DIR/routes.txt

probe_metrics() {
  path=$1
  curl --silent --show-error --location --output /dev/null \
    --connect-timeout 5 --max-time 20 \
    --write-out "$path status=%{http_code} remote=%{remote_ip} connect=%{time_connect} total=%{time_total}\n" \
    "$EDGE_ORIGIN$path" || true
}

{
  for path in /healthz / /api/healthz /api/auth/v2/sso/validate /api/analytics/v1/fmo/print /api/ratan/healthz /remotes/ratan/remoteEntry.js /remotes/cashflow/remoteEntry.js; do
    probe_metrics "$path"
  done
} > "$ROUTE_FILE"

if [ -f "$SCB_NEXT_ROOT/devops/vm/rendered/scb-next.conf" ]; then
  if command -v shasum >/dev/null 2>&1; then
    shasum -a 256 "$SCB_NEXT_ROOT/devops/vm/rendered/scb-next.conf" > "$RUN_DIR/rendered-nginx.sha256"
  elif command -v sha256sum >/dev/null 2>&1; then
    sha256sum "$SCB_NEXT_ROOT/devops/vm/rendered/scb-next.conf" > "$RUN_DIR/rendered-nginx.sha256"
  fi
fi

echo "$RUN_DIR"
