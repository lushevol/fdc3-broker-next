# ratan-module-composition

Platform extension for intentionally embedding a React component exposed by another tile. It is not part of the FDC3 specification: use FDC3 for navigation, intents, contexts, and channels.

The host injects the active runtime functions, so this package does not bundle SystemJS or a Module Federation runtime:

```ts
const loader = new ModuleLoader(
  [
    new SystemJsModuleAdapter((moduleId) => System.import(moduleId)),
    new ModuleFederationModuleAdapter(loadRemote),
  ],
  {
    lifecycle: {
      beforeLoad: async ({ reference }) => {
        if (!(await permissions.canLoadModule(reference.moduleId))) {
          throw new ModuleCompositionError(
            'MODULE_ACCESS_DENIED',
            reference,
            `Access denied to module ${reference.moduleId}.`,
          );
        }
      },
    },
  },
);

const { Component } = await loader.load({
  loader: 'systemjs',
  moduleId: '@fm/trades/components/trade-summary',
  exportName: 'TradeSummary',
});
```

Lifecycle hooks are invoked for every load request. `beforeLoad` runs before
cache reuse or runtime resolution, so permission changes apply even when a
module was loaded previously. Throwing from `beforeLoad` stops the load.
`afterLoad` observes successful loads and includes a `fromCache` flag.
`onLoadError` observes the original error from permission, adapter, validation,
or completion failures without replacing it.

Only dedicated component entry points are valid producers. Hosts must configure React, ReactDOM, shared design libraries, and the FDC3 client as singletons across SystemJS import maps and Module Federation shared dependencies.
