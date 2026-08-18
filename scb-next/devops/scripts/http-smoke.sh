#!/bin/sh
set -eu

EDGE_ORIGIN=${SCB_NEXT_EDGE_ORIGIN:-http://127.0.0.1:8080}
CURL_CONFIG=${SCB_NEXT_CURL_CONFIG:-}
CONNECT_TIMEOUT=${SCB_NEXT_SMOKE_CONNECT_TIMEOUT:-5}
MAX_TIME=${SCB_NEXT_SMOKE_MAX_TIME:-20}
RETRIES=${SCB_NEXT_SMOKE_RETRIES:-2}
REQUIRE_SECURITY_HEADERS=${SCB_NEXT_REQUIRE_SECURITY_HEADERS:-false}
TMP_ROOT=${TMPDIR:-/tmp}
WORK_DIR=$(mktemp -d "$TMP_ROOT/scb-next-smoke.XXXXXX")

cleanup() {
  rm -rf "$WORK_DIR"
}
trap cleanup EXIT INT TERM

curl_request() {
  if [ -n "$CURL_CONFIG" ]; then
    curl --config "$CURL_CONFIG" "$@"
  else
    curl "$@"
  fi
}

require_header() {
  headers_file=$1
  pattern=$2
  description=$3
  tr -d '\r' < "$headers_file" | grep -qi "$pattern" || {
    echo "Missing required response header: $description" >&2
    return 1
  }
}

probe() {
  label=$1
  path=$2
  expected=$3
  headers=$WORK_DIR/headers

  status=$(curl_request --silent --show-error --location \
    --connect-timeout "$CONNECT_TIMEOUT" --max-time "$MAX_TIME" \
    --retry "$RETRIES" --retry-connrefused --dump-header "$headers" \
    --output /dev/null --write-out '%{http_code}' "$EDGE_ORIGIN$path")

  case "$expected:$status" in
    success:2??|reachable:2??|reachable:3??|reachable:4??) ;;
    *)
      echo "$label failed: $path returned HTTP $status (expected $expected)" >&2
      return 1
      ;;
  esac

  if [ "$REQUIRE_SECURITY_HEADERS" = "true" ]; then
    require_header "$headers" '^x-content-type-options: nosniff$' 'X-Content-Type-Options: nosniff'
    require_header "$headers" '^x-frame-options: sameorigin$' 'X-Frame-Options: SAMEORIGIN'
    require_header "$headers" '^referrer-policy: same-origin$' 'Referrer-Policy: same-origin'
    require_header "$headers" '^permissions-policy:' 'Permissions-Policy:'
  fi
  printf '%-36s HTTP %s  %s\n' "$label" "$status" "$path"
}

probe_manifest() {
  label=$1
  path=$2
  headers=$WORK_DIR/headers

  probe "$label" "$path" success
  curl_request --silent --show-error --head --connect-timeout "$CONNECT_TIMEOUT" \
    --max-time "$MAX_TIME" "$EDGE_ORIGIN$path" > "$headers"
  tr -d '\r' < "$headers" | grep -qi '^cache-control:.*no-store' || {
    echo "$label failed: $path must return Cache-Control containing no-store" >&2
    return 1
  }
}

probe "edge health" "/healthz" success
probe "platform UI" "/" success
probe "portal auth route" "/api/auth/v2/sso/validate" reachable
probe "tile management route" "/api/auth/v1/fmo/admin/importmap/active" reachable
probe "telemetry route" "/api/analytics/v1/fmo/print" reachable
probe "platform fallback route" "/api/healthz" reachable
probe "Ratan API route" "/api/ratan/healthz" reachable
probe_manifest "Ratan federation manifest" "/remotes/ratan/remoteEntry.js"
probe_manifest "Cashflow federation manifest" "/remotes/cashflow/remoteEntry.js"

echo "SCB Next edge smoke checks passed: $EDGE_ORIGIN"
