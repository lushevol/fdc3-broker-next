#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://127.0.0.1:18080}"

echo "== Plain prompt on /api/chat/runs =="
curl -sN -X POST "${BASE_URL}/api/chat/runs" \
  -H 'Content-Type: application/json' \
  --data-binary '{
    "conversationId":"verify-plain",
    "messages":[
      {
        "id":"msg-user-1",
        "role":"user",
        "parts":[
          {"type":"text","text":"What is the weather in San Francisco?"}
        ]
      }
    ]
  }'

echo
echo "== Resumed frontend-tool flow on /api/chat/runs =="
curl -sN -X POST "${BASE_URL}/api/chat/runs" \
  -H 'Content-Type: application/json' \
  --data-binary '{
    "conversationId":"verify-resume",
    "messages":[
      {
        "id":"msg-user-1",
        "role":"user",
        "parts":[
          {"type":"text","text":"How is the weather in San Francisco?"}
        ]
      },
      {
        "id":"msg-asst-1",
        "role":"assistant",
        "parts":[
          {
            "type":"tool-call",
            "toolCallId":"tool-front-1",
            "toolName":"location.resolve",
            "executionTarget":"frontend",
            "state":"output-available",
            "input":{"query":"San Francisco"},
            "output":{"name":"San Francisco","latitude":37.7749,"longitude":-122.4194}
          }
        ]
      }
    ]
  }'
