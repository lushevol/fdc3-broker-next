#!/bin/sh
set -eu

EDGE_ORIGIN=${SCB_NEXT_EDGE_ORIGIN:-http://127.0.0.1:8080}

probe() {
  label=$1
  path=$2
  echo "Verifying $label: $path"
  curl --fail --silent --show-error --location --output /dev/null "$EDGE_ORIGIN$path"
}

probe_route() {
  label=$1
  path=$2
  echo "Verifying $label reachability: $path"
  status=$(curl --silent --show-error --location --output /dev/null --write-out '%{http_code}' "$EDGE_ORIGIN$path")
  case "$status" in
    2??|3??|4??) ;;
    *)
      echo "Route returned unavailable status $status: $path" >&2
      exit 1
      ;;
  esac
}

probe "edge health" "/healthz"
probe "platform UI" "/"
probe_route "portal auth" "/api/auth/v2/sso/validate"
probe_route "portal tile management" "/api/auth/v1/fmo/admin/importmap/active"
probe_route "portal telemetry" "/api/analytics/v1/fmo/print"
probe_route "legacy platform fallback" "/api/healthz"
probe "Ratan canonical remote" "/static/ratan/container/remoteEntry.js"
probe "Cashflow canonical remote" "/static/ratan/cashflow/remoteEntry.js"
probe "Ratan compatibility remote" "/remotes/ratan/remoteEntry.js"
probe "Cashflow compatibility remote" "/remotes/cashflow/remoteEntry.js"

echo "Route smoke checks passed. Run the approved API and Playwright gates with environment credentials."
