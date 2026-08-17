#!/bin/sh
set -eu

EDGE_ORIGIN=${SCB_NEXT_EDGE_ORIGIN:-http://127.0.0.1:8080}

probe() {
  label=$1
  path=$2
  echo "Verifying $label: $path"
  curl --fail --silent --show-error --location --output /dev/null "$EDGE_ORIGIN$path"
}

probe "edge health" "/healthz"
probe "platform UI" "/"
probe "Ratan canonical remote" "/static/ratan/container/remoteEntry.js"
probe "Cashflow canonical remote" "/static/ratan/cashflow/remoteEntry.js"
probe "Ratan compatibility remote" "/remotes/ratan/remoteEntry.js"
probe "Cashflow compatibility remote" "/remotes/cashflow/remoteEntry.js"

echo "Route smoke checks passed. Run the approved API and Playwright gates with environment credentials."
