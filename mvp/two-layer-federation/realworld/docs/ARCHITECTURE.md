# Realworld two-layer architecture

## Runtime

The runtime graph is exactly:

```text
portal-host -> independently deployed applications
```

`portal-host` owns registry validation, application loading, global appearance preference, navigation, notifications, telemetry, workspace lifecycle, identity delivery, and application failure containment. Applications own domain routing, workflows, state, data acquisition, authorization-aware composition, and local design providers.

React and ReactDOM are the only Module Federation singleton shares. MUI, Emotion, the design system, the data-grid adapter, platform contracts, and domain utilities are versioned build-time packages bundled into deployables.

## Package boundary

All production-identity packages for this migration live under `realworld/packages`. They are isolated from general repository packages so the migration can be built, reviewed, released, or removed as one explicit program boundary. Package names remain stable and use normal semantic versioning; physical relocation does not change their public identities.

## Prohibited dependencies

Realworld code must not import or load:

- any `*-poc` workspace;
- legacy `root-config`, `base`, or `mfe-ratan-container` runtime code;
- Single-SPA, SystemJS, or import maps;
- a design-system or Ratan component remote.

The POC and realworld tracks may run simultaneously only through separate ports and manifests. They share no source aliases or runtime registry entries.
