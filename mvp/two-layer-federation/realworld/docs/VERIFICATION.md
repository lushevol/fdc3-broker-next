# Realworld verification

The realworld track is accepted only when all of the following pass from the repository root:

1. `npm run realworld:check`
2. `npm run realworld:test:e2e`

For focused diagnosis, the aggregate gates decompose into:

- `npm run realworld:build`
- `npm run realworld:test`
- `npm run realworld:lint`
- `npm run realworld:verify:packages`
- `npm run realworld:verify:boundaries`

The boundary verifier must report two runtime layers and React/ReactDOM as the only singleton shares. Package verification must consume packed public artifacts rather than source aliases. Browser verification must cover direct remote loading, nested routes, appearance propagation, standalone execution, failure recovery, Authorization Limits grid behavior, and anonymous rollback with mutation controls absent.

The POC has a separate build/test/browser matrix under `../poc`; success in one track is never evidence for the other.

The realworld boundary scan covers both applications and all four production-identity packages. It rejects POC package names, POC paths, legacy runtime dependencies, and forbidden federation shares.
