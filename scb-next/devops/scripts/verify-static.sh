#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
SCB_NEXT_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/../.." && pwd)
RUN_BUILD=${SCB_NEXT_STATIC_RUN_BUILD:-true}
RUN_TYPECHECK=${SCB_NEXT_STATIC_RUN_TYPECHECK:-false}
RUN_DIR=$(SCB_NEXT_EVIDENCE_LABEL=static-verification sh "$SCRIPT_DIR/capture-environment.sh")

run_stage() {
  name=$1
  shift
  log_file=$RUN_DIR/$name.log
  echo "Running $name"
  if "$@" > "$log_file" 2>&1; then
    cat "$log_file"
  else
    cat "$log_file" >&2
    echo "Static verification failed at stage: $name" >&2
    echo "Evidence: $RUN_DIR" >&2
    exit 1
  fi
}

cd "$SCB_NEXT_ROOT"
run_stage shell-syntax sh -c "find devops/vm/scripts devops/kubernetes/scripts devops/scripts -type f -name '*.sh' -exec sh -n {} +"
run_stage dependency-isolation npm run verify:dependency-isolation
run_stage root-tests npm test
run_stage kubernetes-base-policy npm run k8s:validate
run_stage vm-template env \
  SCB_NEXT_VM_MODE=local \
  SCB_NEXT_VM_ENV_FILE="$SCB_NEXT_ROOT/devops/vm/scb-next.env.example" \
  SCB_NEXT_NGINX_OUTPUT="$RUN_DIR/scb-next.conf" \
  npm run vm:validate

if [ "$RUN_BUILD" = "true" ]; then
  run_stage production-build npm run build:production
fi

if [ "$RUN_TYPECHECK" = "true" ]; then
  run_stage typecheck npm run typecheck
else
  echo "Typecheck debt gate skipped; set SCB_NEXT_STATIC_RUN_TYPECHECK=true when required."
fi

echo "Static verification passed. Evidence: $RUN_DIR"
