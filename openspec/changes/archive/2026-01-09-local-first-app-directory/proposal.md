# Local First App Directory

## Summary

Enable the App Directory client to initialize with a local set of application definitions, allowing immediate access to core apps without requiring an external API call. Additionally, support lazy loading or refreshing of application data from an external source when conditions (like authentication) are met.

## Problem

Currently, the `AppDirectoryClient` relies entirely on external API calls (`/v2/apps`) to retrieve application definitions.

- Apps are not available if the network is down or the service is unreachable.
- Secure apps requiring authentication cannot be loaded until the user logs in, delaying startup/initialization of the desktop agent.
- There is no mechanism to bootstrap the environment with a "safe mode" or "local only" set of apps.

## Solution

1.  **Local Bootstrapping**: Allow `AppDirectoryClient` to be instantiated with a `localApps` list.
2.  **Hybrid Resolution**: `getAllApps`, `getApp`, etc., will query both local and remote sources.
3.  **Lazy/Conditional Loading**: Provide mechanisms to trigger remote fetches only when ready (e.g., after auth), merges results with local apps.

## Key Changes

- Update `AppDirectoryConfig` to include `localApps?: AppDefinition[]`.
- Update `AppDirectoryClientImpl` to store and serve local apps.
- Implement merging logic (local apps + remote apps).
- Ensure `getApp` and search methods (`findByIntent`) respect local apps.
