# Ratan Container migration MVP

This workspace is a migration inventory for `apps/mfe-ratan-container`. It is a
directly hosted diagnostic application, not a replacement shared runtime.
Reusable components belong in `@fm/ratan-design` or
`@fm/ratan-data-grid`; shell concerns arrive through `@fm/platform-sdk`.

```bash
npm --workspace @fm/mfe-ratan-container-mvp run dev
npm --workspace @fm/mfe-ratan-container-mvp test
npm --workspace @fm/mfe-ratan-container-mvp run build
```

Standalone URL: `http://127.0.0.1:9205`
