# Ratan Container migration MVP

Status: inventory-only application. Last reviewed 3 August 2026. See the
[current-state record](../../docs/CURRENT_STATE.md).

This workspace is a migration inventory for `apps/mfe-ratan-container`. It is a
directly hosted diagnostic application, not a replacement shared runtime.
Reusable components belong in `@scdevkit/webkit` or
`@fm/ratan-data-grid`; shell concerns arrive through `@fm/platform-sdk`.

```bash
npm --workspace @fm/mfe-ratan-container-mvp run dev
npm --workspace @fm/mfe-ratan-container-mvp test
npm --workspace @fm/mfe-ratan-container-mvp run build
```

Standalone URL: `http://127.0.0.1:9205`
