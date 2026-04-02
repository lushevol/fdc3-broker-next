#!/bin/sh

set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
if [ -f "$SCRIPT_DIR/chatbot-backend.jar" ]; then
  DEPLOY_DIR=$SCRIPT_DIR
else
  DEPLOY_DIR=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
fi

JAR_PATH="$DEPLOY_DIR/chatbot-backend.jar"
ENV_PATH="$DEPLOY_DIR/.env"

if [ ! -f "$JAR_PATH" ] && [ -f "$DEPLOY_DIR/target/chatbot-backend.jar" ]; then
  JAR_PATH="$DEPLOY_DIR/target/chatbot-backend.jar"
fi

if ! command -v java >/dev/null 2>&1; then
  echo "Error: Java 17+ is required. Install a JDK and verify 'java -version' works before running this service." >&2
  exit 1
fi

if [ ! -f "$JAR_PATH" ]; then
  echo "Error: Missing application JAR at '$JAR_PATH'." >&2
  exit 1
fi

if [ ! -f "$ENV_PATH" ]; then
  echo "Error: Missing '$ENV_PATH'. Copy '.env.example' to '.env' and fill in the required values before starting the service." >&2
  exit 1
fi

set -a
. "$ENV_PATH"
set +a

exec java -jar "$JAR_PATH"
