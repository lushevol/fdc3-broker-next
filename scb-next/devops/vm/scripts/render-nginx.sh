#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
VM_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
ENV_FILE=${SCB_NEXT_VM_ENV_FILE:-$VM_ROOT/scb-next.env}
OUTPUT_FILE=${SCB_NEXT_NGINX_OUTPUT:-$VM_ROOT/rendered/scb-next.conf}

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing VM environment file: $ENV_FILE" >&2
  echo "Start from $VM_ROOT/scb-next.env.example and provide environment-owned addresses." >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090
. "$ENV_FILE"
set +a

mkdir -p "$(dirname -- "$OUTPUT_FILE")"
envsubst '${SCB_NEXT_LISTEN_PORT} ${SCB_NEXT_SERVER_NAME} ${MFE_BASE_UPSTREAM} ${SINGLE_UI_BFF_UPSTREAM} ${PORTAL_AUTH_SERVICE_UPSTREAM} ${PORTAL_TILE_MANAGEMENT_SERVICE_UPSTREAM} ${PORTAL_TELEMETRY_SERVICE_UPSTREAM} ${RATAN_CONTAINER_UPSTREAM} ${CASHFLOW_BLOTTER_UPSTREAM} ${RATAN_BFF_UPSTREAM} ${RATAN_NOTIFICATION_UPSTREAM} ${RATAN_DATA_AMBASSADOR_UPSTREAM} ${RATAN_API_GATEWAY_UPSTREAM}' \
  < "$VM_ROOT/nginx/scb-next.conf.template" > "$OUTPUT_FILE"

echo "$OUTPUT_FILE"
