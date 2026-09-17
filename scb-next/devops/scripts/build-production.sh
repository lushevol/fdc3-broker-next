#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
SCB_NEXT_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/../.." && pwd)
EDGE_ORIGIN=${SCB_NEXT_EDGE_ORIGIN:-http://127.0.0.1:9081}

cd "$SCB_NEXT_ROOT"
npm run build:packages
VITE_PUBLIC_BASE=/remotes/cashflow/ npm run build --workspace @fm/ratan_cashflow_blotter-origin
VITE_PUBLIC_BASE=/remotes/ratan/ VITE_CASHFLOW_REMOTE_URL="$EDGE_ORIGIN/remotes/cashflow/remoteEntry.js" npm run build --workspace @fm/ratan_container-origin
VITE_RATAN_REMOTE_URL="$EDGE_ORIGIN/remotes/ratan/remoteEntry.js" npm run build --workspace @fm/base-origin
