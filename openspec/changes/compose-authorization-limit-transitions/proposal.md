# Change: Compose Authorization Limit delete and transitions

## Why

Create/edit is behavior-tested behind an omitted-by-default mutation capability. The remaining legacy record actions—delete plus add/edit/delete pending confirm/reject—can use the same application policy and service ports without selecting production transport, completing mutation composition while preserving read-only runtime rollback.

## What changes

- Add policy-driven details actions for confirmed delete and status-specific pending approve/reject.
- Use explicit confirmation dialogs for each operation with loading repeat prevention.
- Refresh from the injected service after successful transitions to reconcile deletion/rejection semantics.
- Keep all actions absent when the mutation capability is omitted or policy denies them.
- Preserve the current production bootstrap, host, grid boundary, and runtime architecture.

## Impact

- Affected code: Cashflow Authorization Limits details composition and tests/docs.
- No backend adapter, authentication contract, design package, host, or federation change.
