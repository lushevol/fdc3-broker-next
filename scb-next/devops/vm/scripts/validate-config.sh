#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
VM_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
OUTPUT_FILE=${SCB_NEXT_NGINX_OUTPUT:-$VM_ROOT/rendered/scb-next.conf}
MODE=${SCB_NEXT_VM_MODE:-local}

sh "$SCRIPT_DIR/preflight.sh"
sh "$SCRIPT_DIR/render-nginx.sh" >/dev/null

if grep -n '\${[^}][^}]*}' "$OUTPUT_FILE"; then
  echo "Rendered Nginx configuration contains unresolved variables" >&2
  exit 1
fi

for route in '/healthz' '/api/auth/' '/api/analytics/' '/api/ratan/' '/remotes/ratan/' '/remotes/cashflow/'; do
  grep -F "$route" "$OUTPUT_FILE" >/dev/null || {
    echo "Rendered Nginx configuration is missing required route: $route" >&2
    exit 1
  }
done

if [ -n "${SCB_NEXT_NGINX_TEST_COMMAND:-}" ]; then
  SCB_NEXT_RENDERED_NGINX_CONFIG=$OUTPUT_FILE sh -c "$SCB_NEXT_NGINX_TEST_COMMAND"
elif [ "$MODE" = "production" ]; then
  echo "Production validation requires SCB_NEXT_NGINX_TEST_COMMAND for the estate-approved nginx -t invocation" >&2
  exit 1
else
  echo "Structural validation passed; set SCB_NEXT_NGINX_TEST_COMMAND to include nginx -t."
fi

echo "VM edge configuration validation passed: $OUTPUT_FILE"
