#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
VM_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
ENV_FILE=${SCB_NEXT_VM_ENV_FILE:-$VM_ROOT/scb-next.env}
MODE=${SCB_NEXT_VM_MODE:-local}

require_command() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Missing required command: $1" >&2
    exit 1
  }
}

require_command curl
require_command envsubst

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing VM environment file: $ENV_FILE" >&2
  echo "Copy $VM_ROOT/scb-next.env.example, then replace documentation values." >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090
. "$ENV_FILE"
set +a

required_variables='SCB_NEXT_LISTEN_PORT SCB_NEXT_SERVER_NAME MFE_BASE_UPSTREAM SINGLE_UI_BFF_UPSTREAM PORTAL_AUTH_SERVICE_UPSTREAM PORTAL_TILE_MANAGEMENT_SERVICE_UPSTREAM PORTAL_TELEMETRY_SERVICE_UPSTREAM RATAN_CONTAINER_UPSTREAM CASHFLOW_BLOTTER_UPSTREAM RATAN_BFF_UPSTREAM RATAN_NOTIFICATION_UPSTREAM RATAN_DATA_AMBASSADOR_UPSTREAM RATAN_API_GATEWAY_UPSTREAM'

for variable in $required_variables; do
  eval "value=\${$variable:-}"
  if [ -z "$value" ]; then
    echo "Missing required VM setting: $variable" >&2
    exit 1
  fi
done

case "$SCB_NEXT_LISTEN_PORT" in
  *[!0-9]*|'') echo "SCB_NEXT_LISTEN_PORT must be numeric" >&2; exit 1 ;;
esac

for variable in $required_variables; do
  case "$variable" in
    *_UPSTREAM)
      eval "value=\${$variable}"
      case "$value" in
        *://*|*/*|*@*|*' '*)
          echo "$variable must be an Nginx upstream host:port without scheme, path, credentials, or spaces" >&2
          exit 1
          ;;
      esac
      ;;
  esac
done

if [ "$MODE" = "production" ]; then
  case "$(tr '[:upper:]' '[:lower:]' < "$ENV_FILE")" in
    *example.invalid*|*example.internal*|*replace-me*)
      echo "Production VM settings still contain documentation placeholders" >&2
      exit 1
      ;;
  esac
fi

echo "VM preflight passed ($MODE): $ENV_FILE"
