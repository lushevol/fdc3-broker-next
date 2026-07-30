# Rules

- Never import from `apps/` or depend on a host's store, workspace, authentication, routing, or business models.
- Call host behavior exclusively through `FDC3PlatformAdapter`.
- Require entitlement validation; do not provide an allow-all default.
- Keep app identities explicit. Do not infer a current child from a process-wide or window-wide singleton.
- Root provider owns broker setup and cleanup.
- Child provider owns tile registration and unregistration.
- Maintain greater than 90% line and branch coverage.
