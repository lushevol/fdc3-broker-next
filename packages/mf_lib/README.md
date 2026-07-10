# mf_lib

Shared React component library built with Rslib and exposed as a Module Federation remote.

## Commands

```bash
npm --workspace packages/mf_lib run build
npm --workspace packages/mf_lib run dev
npm --workspace packages/mf_lib run mf-dev
```

- `build` creates the library distribution.
- `dev` runs the Rslib watcher.
- `mf-dev` serves the Module Federation build for local consumers.

React and React DOM are peer dependencies and must be supplied by the consuming application.
