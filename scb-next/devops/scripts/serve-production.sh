#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
SCB_NEXT_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/../.." && pwd)
cd "$SCB_NEXT_ROOT"
npm run build:production
docker-compose -f devops/docker-compose.production.yml up --build -d
