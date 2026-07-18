# Change: Add a versioned platform identity capability

## Why

The Cashflow mutation composition needs a trustworthy principal, but neither the host/application contract nor the SDK currently exposes identity. Applications must not infer users from UI state, browser storage, tokens, or legacy globals. A versioned, read-only identity snapshot lets the host own authentication integration while applications consume only the minimum authorization context they need.

## What changes

- Add an independently versioned anonymous/authenticated identity snapshot contract.
- Add an optional identity capability to platform application props and SDK clients.
- Negotiate the identity contract only for applications that request the capability.
- Have the current host expose a truthful anonymous snapshot.
- Declare Cashflow identity compatibility without activating its mutation service.

## Impact

- Affected code: production platform contracts/SDK, portal host, Cashflow manifest, registry, tests, and acceptance documentation.
- Package minor versions advance while the application and appearance contract versions remain stable.
- No authentication provider, token, credential, entitlement service, HTTP transport, or mutation activation is introduced.
