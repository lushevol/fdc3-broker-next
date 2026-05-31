# auth-server - Rules

<- [PROJECT.md](./PROJECT.md) - [Monorepo rules](../../../docs/rules.md)

## Security

- Never commit real Redis, OUD, EMS2, FMAA, Kong, keystore, truststore, or cipher-key values.
- Do not log passwords, bearer tokens, JWT payloads, Redis session keys, or entitlement payloads.
- Keep authentication strategy order explicit and covered by tests when adding a new auth mechanism.

## Sessions

- Redis is the session source of truth. Keep TTL changes deliberate and documented.
- Session validation must fail closed when Redis or token parsing is unavailable.

## Entitlements

- EMS2 and Ratan entitlement responses must be treated as external contracts.
- Avoid changing entitlement entity names or action strings without validating downstream clients.

## Configuration

- Keep `application.yml` environment-variable driven.
- Do not introduce local defaults for production secrets.
- Mock behavior belongs under `login/mock`.

## Tests

```bash
cd services/auth-server
mvn test
```

Add focused tests for new controllers, auth strategies, token parsing, and entitlement mapping.
