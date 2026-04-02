#!/bin/sh

set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
SERVICE_DIR=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
DIST_DIR="$SERVICE_DIR/dist"
BUILD_DIR="$DIST_DIR/chatbot-backend-centos"
ARCHIVE_PATH="$DIST_DIR/chatbot-backend-centos.tar.gz"
JAR_PATH="$SERVICE_DIR/target/chatbot-backend.jar"

if ! command -v mvn >/dev/null 2>&1; then
  echo "Error: Maven is required to build the deploy bundle. Install Maven 3.8+ and retry." >&2
  exit 1
fi

mkdir -p "$DIST_DIR"

echo "Building chatbot-backend JAR..."
mvn -f "$SERVICE_DIR/pom.xml" -DskipTests clean package

if [ ! -f "$JAR_PATH" ]; then
  echo "Error: Expected JAR was not produced at '$JAR_PATH'." >&2
  exit 1
fi

rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"

cp "$JAR_PATH" "$BUILD_DIR/chatbot-backend.jar"
cp "$SERVICE_DIR/scripts/run-centos.sh" "$BUILD_DIR/run.sh"
cp "$SERVICE_DIR/.env.example" "$BUILD_DIR/.env.example"

cat > "$BUILD_DIR/README.txt" <<'EOF'
Chatbot Backend CentOS Deploy Bundle

1. Copy this folder to the target CentOS server.
2. Copy .env.example to .env and fill in the required values.
3. Run: chmod +x run.sh
4. Start the service with: ./run.sh

The launcher will stop with a clear error if Java 17+, the JAR, or .env is missing.
EOF

chmod +x "$BUILD_DIR/run.sh"

rm -f "$ARCHIVE_PATH"
LC_ALL=C tar -C "$DIST_DIR" -czf "$ARCHIVE_PATH" "chatbot-backend-centos"

echo "Created deploy bundle at: $ARCHIVE_PATH"
