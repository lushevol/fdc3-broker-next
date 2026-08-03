# ratan-fdc3 integration guide

`ratan-fdc3` is the only FDC3 package an application needs to install. It
provides the root and child React providers, the scoped desktop-agent API,
module composition, and advanced capability subpaths.

## Install

```bash
npm install ratan-fdc3
```

React, React DOM, MUI, and Emotion are peer dependencies. Applications do not
install the focused `ratan-fdc3-*` implementation packages or
`ratan-module-composition` directly.

## Root application

Wrap the shell once with `FDC3RootProvider`. The shell supplies only
host-owned capabilities and data:

```tsx
import { FDC3RootProvider, type FDC3PlatformAdapter } from 'ratan-fdc3';

const platform: FDC3PlatformAdapter = {
  isAuthenticated: Boolean(session),
  openApp: async (app) => {
    const result = await workspace.openTile({ tile: app.appId }, { workspaceId: app.instanceId });

    if (!result.opened) {
      throw new Error(result.failedReason);
    }

    return { ...app, instanceId: result.workspaceId };
  },
  validateEntitlements: (targetId, action) => entitlements.allows(targetId, action),
};

export function Root() {
  return (
    <FDC3RootProvider apps={apps} platform={platform} workflows={workflows}>
      <Application />
    </FDC3RootProvider>
  );
}
```

`openApp`, authentication, entitlements, and workspace behavior remain owned by
the host. The FDC3 package calls those capabilities but does not implement the
host's tiles, workspaces, authorization model, or business rules.

`validateEntitlements` is also called before module loading with the target
module ID and the action `load-module`. Returning `false` rejects the request
with a `MODULE_ACCESS_DENIED` error before cache reuse or runtime resolution.

## Child applications

Wrap each mounted child application with its FDC3 identity:

```tsx
import { FDC3ChildProvider } from 'ratan-fdc3';

<FDC3ChildProvider
  appIdentifier={{
    appId: tile.appId,
    instanceId: workspace.id,
  }}
>
  <RemoteApplication />
</FDC3ChildProvider>;
```

The child provider registers and unregisters the instance and scopes agent
calls to that identity. Child applications do not initialize a broker.

## Use the agent

```tsx
import { useFDC3 } from 'ratan-fdc3';

function InstrumentLink() {
  const fdc3 = useFDC3();

  return (
    <button
      onClick={() =>
        fdc3.broadcast({
          type: 'fdc3.instrument',
          id: { ticker: 'AAPL' },
        })
      }
    >
      Broadcast
    </button>
  );
}
```

## Module loading

The root provider owns module-loader creation and exposes it through
`useFDC3().modules`.

### SystemJS

No provider configuration is required when the host exposes global
`System.import`. `FDC3RootProvider` detects it and registers the SystemJS
adapter automatically:

```ts
const exposed = await fdc3.modules.load({
  loader: 'systemjs',
  moduleId: '@fm/trade-summary',
  exportName: 'default',
});
```

### Module Federation

Provide the host runtime's generic `loadRemote` function:

```tsx
import { loadRemote } from '@module-federation/enhanced/runtime';
import { FDC3RootProvider } from 'ratan-fdc3';

<FDC3RootProvider apps={apps} platform={platform} moduleLoaderOptions={{ loadRemote }}>
  <Application />
</FDC3RootProvider>;
```

The FDC3 package owns adapter construction, caching, export validation, and the
normalized module result. The host owns only its runtime-specific loading
function.

### Load lifecycle and permission control

The root provider automatically applies the host's `validateEntitlements`
policy before every module load. Additional lifecycle controls can be supplied
without implementing a loader in the host:

```tsx
import { FDC3RootProvider } from 'ratan-fdc3';
import { ModuleCompositionError } from 'ratan-fdc3/module-loader';

<FDC3RootProvider
  apps={apps}
  platform={platform}
  moduleLoaderOptions={{
    lifecycle: {
      beforeLoad: async ({ reference }) => {
        if (!(await modulePolicy.canEmbed(reference.moduleId))) {
          throw new ModuleCompositionError(
            'MODULE_ACCESS_DENIED',
            reference,
            `Access denied to module ${reference.moduleId}.`,
          );
        }
      },
      afterLoad: ({ reference, fromCache }) => {
        moduleAudit.loaded(reference.moduleId, { fromCache });
      },
      onLoadError: ({ reference, error }) => {
        moduleAudit.failed(reference.moduleId, error);
      },
    },
  }}
>
  <Application />
</FDC3RootProvider>;
```

`beforeLoad` runs before both cache reuse and runtime loading, and throwing or
rejecting stops the request. `afterLoad` observes successful completion.
`onLoadError` observes the original error without replacing it.

### Advanced module-loader override

Advanced platform packages can import the module-composition API through the
same installation:

```ts
import {
  ModuleLoader,
  ModuleFederationModuleAdapter,
  SystemJsModuleAdapter,
} from 'ratan-fdc3/module-loader';
```

Pass a custom `moduleLoader` to `FDC3RootProvider` only when automatic SystemJS
discovery or `moduleLoaderOptions` is insufficient. A custom override owns its
own lifecycle and permission enforcement.

## Optional configuration

- `directory`: remote app-directory URL, authentication token, timeout, and
  synchronization mode.
- `interop`: OpenFin and postMessage bridge options.
- `workflows`: workflow definitions exposed through the agent.
- `userChannelIds`: host-defined user channels.
- `debug` and `showConsole`: diagnostics controls.

Advanced APIs remain available as subpaths such as `ratan-fdc3/broker`,
`ratan-fdc3/app-directory`, and `ratan-fdc3/workflow-orchestrator`. Application
code should prefer the root provider and hooks unless it owns platform
infrastructure.

## Ownership boundary

| Host application owns                       | `ratan-fdc3` owns                           |
| ------------------------------------------- | ------------------------------------------- |
| Authentication state                        | Broker lifecycle                            |
| Entitlement and module-access decisions     | App-directory synchronization               |
| Opening and closing tiles or applications   | Resolver and interop lifecycle              |
| Workspace identifiers and business metadata | Root and child registration                 |
| Runtime-specific Module Federation function | Module adapters, caching, and validation    |
| Optional module lifecycle observers         | Permission enforcement before resolution    |
| Application declarations and workflows      | Scoped desktop-agent access and diagnostics |
