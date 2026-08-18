#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
SCB_NEXT_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/../.." && pwd)
EVIDENCE_ROOT=${SCB_NEXT_EVIDENCE_DIR:-$SCB_NEXT_ROOT/artifacts/verification}
LABEL=${SCB_NEXT_EVIDENCE_LABEL:-manual}
SAFE_LABEL=$(printf '%s' "$LABEL" | tr -c 'A-Za-z0-9._-' '_')
TIMESTAMP=$(date -u '+%Y%m%dT%H%M%SZ')
RUN_DIR=${SCB_NEXT_EVIDENCE_RUN_DIR:-$EVIDENCE_ROOT/$TIMESTAMP-$SAFE_LABEL-$$}
OUTPUT_FILE=$RUN_DIR/environment.txt

mkdir -p "$RUN_DIR"

tool_version() {
  command_name=$1
  shift
  if command -v "$command_name" >/dev/null 2>&1; then
    "$command_name" "$@" 2>&1 | head -n 1 | tr '\n' ' '
  else
    printf 'not-installed'
  fi
}

cd "$SCB_NEXT_ROOT"
{
  printf 'label=%s\n' "$LABEL"
  printf 'captured_at_utc=%s\n' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
  printf 'git_head=%s\n' "$(git rev-parse HEAD 2>/dev/null || printf unknown)"
  printf 'git_branch=%s\n' "$(git branch --show-current 2>/dev/null || printf unknown)"
  printf 'git_status_begin\n'
  git status --short 2>/dev/null || true
  printf 'git_status_end\n'
  printf 'os=%s\n' "$(uname -a)"
  printf 'node_version=%s\n' "$(tool_version node --version)"
  printf 'npm_version=%s\n' "$(tool_version npm --version)"
  printf 'docker_version=%s\n' "$(tool_version docker --version)"
  printf 'kubectl_version=%s\n' "$(tool_version kubectl version --client)"
  printf 'minikube_version=%s\n' "$(tool_version minikube version)"
  printf 'nginx_version=%s\n' "$(tool_version nginx -v)"
} > "$OUTPUT_FILE"

printf '%s\n' "$RUN_DIR"
