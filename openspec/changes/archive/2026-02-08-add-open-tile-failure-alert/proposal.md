## Why

When a tile fails to open in the FDC3 broker, users are not notified of the failure. This lack of feedback leaves users confused about whether an action was successful or not. A configurable callback mechanism will allow consuming applications to render their own UI feedback (e.g., snackbar, toast, banner) for tile open failures.

## What Changes

- Add `onTileOpenFailure` prop/callback to FDC3 broker constructor options
- When `open` API fails, invoke the callback with failure details (tile identifier, error message)
- If no callback provided, failure is silently logged (backwards compatible)
- Callback receives: `{ tileId: string, appId: string, reason: string }`

## Capabilities

### New Capabilities

- `tile-open-failure-alert`: Configurable callback mechanism for reporting tile open failures to consuming applications

### Modified Capabilities

- None

## Impact

- **Code**: `packages/fdc3-broker` - add `onTileOpenFailure` option to broker construction
- **API**: New optional parameter in broker initialization options
- **Breaking**: None - the option is optional with silent fallback
