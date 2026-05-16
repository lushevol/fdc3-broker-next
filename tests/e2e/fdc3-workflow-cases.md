# FDC3 Workflow E2E Cases

## Implemented

1. Launcher tile raises `trade.pendingValidation.openChart`.
2. Broker opens the `Trade Blotter` target for `SearchTrades`.
3. Broker passes `$.trades[0].instrument` from the blotter result into the `ViewChart` context.
4. Broker opens `FDC3 Tile 2` and its `ViewChart` listener receives `id.ticker`.
5. Launcher shows a completed workflow transcript after the linear workflow resolves.

## Backlog

1. Unknown workflow ID returns an error transcript without opening target tiles.
2. Required binding failure stops before downstream intents.
3. Multiple matching targets route through resolver UI before continuing.
4. Chatbot tool invokes `raiseWorkflow` with `workflowId` and `input` only.
5. Workflow target reuse prefers an existing workspace instance when one already has the listener.
