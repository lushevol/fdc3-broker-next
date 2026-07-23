# Design: Versioned host-owned identity snapshots

## Decisions

### Model state as a discriminated union

`IdentitySnapshot` is either anonymous or authenticated. Anonymous has no user id or permissions. Authenticated requires a non-empty user id and a unique list of non-empty permission identifiers. Both carry the independent identity contract version.

This makes an absent principal impossible to mistake for a partially populated user and prevents applications from treating a token or display label as an identity.

### Keep authentication mechanics behind the host boundary

The capability exposes only `getSnapshot` and `subscribe`. It contains no access token, cookie, credential, refresh operation, login method, or provider-specific claim. The host will later adapt its approved authentication source into this snapshot.

### Add identity without breaking existing applications

`PlatformCapabilities.identity` is optional. Registry and manifest identity versions are optional unless the registry requests `identity`. Compatibility then requires the host-supported version on both sides. Existing applications that do not request identity continue to satisfy the existing application contract.

### Publish anonymous state in the current host

Until the real authentication adapter exists, the host publishes an immutable anonymous snapshot. Cashflow may observe it but cannot construct a mutation principal or activate mutation controls. Authenticated identity is necessary but not sufficient: an approved configured transport is also required.

### Version packages and contracts independently

`@fm/platform-contracts` and `@fm/platform-sdk` advance to `1.1.0`. The application and appearance contracts remain `1.0.0`; the new identity contract starts at `1.0.0`. Consumers accept compatible package minors while runtime negotiation remains exact per contract dimension.

## Non-goals

- Login/logout flows or authentication-provider selection.
- Tokens, cookies, CSRF, refresh, session expiry, or backend transport configuration.
- Server-side authorization or permission taxonomy design.
- Activating Authorization Limits mutations.

## Activation gate

Mutation capability may be constructed only when an approved bootstrap provides both an authenticated identity snapshot and a configured, authenticated Authorization Limits transport. Server authorization remains authoritative; UI permissions only control affordances.
