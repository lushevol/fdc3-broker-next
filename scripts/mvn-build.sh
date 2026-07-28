#!/bin/bash
# Wrapper for Maven builds that handles missing private SCB dependencies gracefully.
# Some services (auth-server, flowzero-designer-service, flowzero-orchestration-service)
# require com.scb.ratan:ratanone-dependencies which is not available on Maven Central.
#
# In environments without access to the SCB Maven repository, this script exits
# successfully when the build fails due to unresolvable internal POMs, allowing
# the rest of the monorepo to build without error.
#
# Set FORCE_MAVEN_BUILD=1 to always fail on build errors.

# Intentionally NOT using set -e here so we can handle mvn failures gracefully

OUTPUT=$(mvn -DskipTests clean package 2>&1)
EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
  echo "$OUTPUT"
  exit 0
fi

if [ "${FORCE_MAVEN_BUILD:-}" = "1" ]; then
  echo "$OUTPUT"
  exit $EXIT_CODE
fi

# Check if the failure is due to unresolvable SCB internal POM
if echo "$OUTPUT" | grep -q "Non-resolvable import POM"; then
  echo "[mvn-build] WARNING: SCB internal Maven dependencies not available, skipping build."
  echo "[mvn-build] Set FORCE_MAVEN_BUILD=1 to enforce a real build failure."
  exit 0
fi

# Otherwise, it's a real build error
echo "$OUTPUT"
exit $EXIT_CODE
