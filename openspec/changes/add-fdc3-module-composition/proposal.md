## Why

FDC3 provides a governed interoperability model for navigation, intents, contexts, and channels, but it intentionally does not define how one running tile renders a component exposed by another. The platform already hosts both SystemJS and Module Federation applications, so teams otherwise create one-off dynamic imports with inconsistent contracts and no central policy.

## What Changes

- Introduce a platform-owned module-composition contract for loading explicitly exposed React components from a tile.
- Provide SystemJS and Module Federation loader adapters behind one runtime-neutral API.
- Extend the platform's `RatanDesktopAgent` with a clearly non-FDC3 `modules` capability.
- Permit the broker/host to inject the loader, preserving a single control point for future catalog, entitlement, origin, and observability policies.
- Document that component composition is distinct from FDC3 application launch and that producers must expose embeddable component entry points.

## Capabilities

### New Capabilities

- `module-composition`: A versioned, runtime-neutral contract for loading intentional cross-tile component exports through SystemJS or Module Federation.
- `fdc3-module-composition-client`: The optional platform extension available from the existing FDC3 client without altering FDC3 conformance.

### Modified Capabilities

- None.

## Impact

- Affected code: a new shared package, `ratan-fdc3-broker`, `ratan-fdc3-agent`, package exports, tests, and package documentation.
- No FDC3 standard API, intent, context, App Directory schema, tile navigation behavior, or existing application loading behavior changes.
- Module Federation is supported through an injected runtime adapter, avoiding a hard dependency from the FDC3 packages to a specific federation runtime.
