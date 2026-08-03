# ratan-fdc3-react

## Purpose

`ratan-fdc3-react` composes the framework-neutral FDC3 broker, agent, app-directory, and resolver packages into two React boundaries:

- `FDC3RootProvider` owns FDC3 runtime lifecycle.
- `FDC3ChildProvider` owns one application instance's FDC3 scope and registration lifecycle.

The package is business-neutral. It calls host capabilities supplied through `FDC3PlatformAdapter`, but it never imports host stores, workspace models, routers, authentication implementations, or module runtimes.

## Ownership

The host remains responsible for:

- reporting current authentication state;
- opening and closing host applications or workspace tiles;
- validating business entitlements;
- supplying accessible FDC3 app definitions;
- supplying platform-specific module loading and isolated-window policy.

The FDC3 package remains responsible for:

- broker construction and publication;
- resolver state and UI;
- login/logout transition handling and queued-intent replay;
- app-directory updates;
- OpenFin and PostMessage option construction;
- logging lifecycle;
- child registration, unregistration, and scoped agents;
- broker cleanup on provider unmount.

## Acceptance criteria

1. Base integrates FDC3 by wrapping the application root and remote children with exported providers.
2. Base-owned `openApp` is invoked by FDC3 but is never implemented inside an FDC3 package.
3. Concurrent child providers retain distinct `AppIdentifier` values and scoped calls.
4. Changing accessible apps updates discovery without recreating the broker.
5. Login and logout callbacks are separate and run only on the matching transition.
6. Entitlement validation is required; the provider has no permissive production default.
