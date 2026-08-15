#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
SCB_NEXT_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/../.." && pwd)
EDGE_PORT=${SCB_NEXT_EDGE_PORT:-9081}
SCB_NEXT_EDGE_ORIGIN=${SCB_NEXT_EDGE_ORIGIN:-http://127.0.0.1:$EDGE_PORT}
export SCB_NEXT_EDGE_ORIGIN
cd "$SCB_NEXT_ROOT"
npm run build:production
docker-compose -f devops/docker-compose.production.yml up --build -d
