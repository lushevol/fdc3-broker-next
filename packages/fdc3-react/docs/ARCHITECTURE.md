# Architecture

```text
Base business/platform state
        │
        │ FDC3PlatformAdapter + AppDefinition[]
        ▼
FDC3RootProvider
  ├─ AppDirectoryClientImpl
  ├─ Broker
  ├─ global agent publication
  ├─ resolver/log UI
  └─ auth transition → broker queue replay
        │
        ▼
FDC3ChildProvider(appIdentifier)
  ├─ AgentProvider(scoped agent)
  ├─ registerTile
  └─ unregisterTile
```

Dependencies point inward toward focused packages. No focused FDC3 package depends on this composition package.
