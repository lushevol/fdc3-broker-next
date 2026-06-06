# backend (Single UI BFF) - Project Overview

<- [Monorepo AGENTS.md](../../../AGENTS.md)

## Type

Spring Boot 4.0.6 backend service (Java 21), port 8088.

## Purpose

Backend for Frontend for the Single-SPA platform. It owns SSO login flows, JWT token lifecycle, EMS2 entitlement filtering, MFE admin configuration for tiles/categories/import maps, CSV config upload, and analytics forwarding.

## Status

Active service.

## Key Features

- **Dual login path**: OUD/LDAP password login or MFA/SSO authorization-code exchange.
- **JWT lifecycle**: main token, refresh token, and entitlement token signed with RSA512.
- **EMS2 authorization**: drawer, tile, category, and import-map access is filtered by entitlement data.
- **Maker-checker admin flow**: create/update operations remain inactive until approved.
- **CSV config upload**: import maps, categories, and tiles can be bulk-loaded.
- **Analytics forwarding**: UI events are written through the analytics service.
- **Local profile**: H2 in PostgreSQL mode plus mock beans for LDAP, EMS2, MFA, FMAA, and Elasticsearch.

## Quick Start

```bash
# From monorepo root
npm --workspace services/backend run dev

# Or as part of the service stack
npm run dev:services
```

The workspace `dev` script loads `.env.profile.${ACTIVE_ENV:-dev}` and starts Maven with:

```bash
mvn spring-boot:run -Dspring-boot.run.jvmArguments='-Dserver.port=8088 -Dspring.profiles.active=local'
```

## Package

`com.scb.sso.singleuibff`

## Runtime Configuration

Local `.env.profile.*` files provide H2 and mock dependency values:

| Group          | Current variables                                                                            |
| -------------- | -------------------------------------------------------------------------------------------- |
| Database       | `PGSL_RDB_URL`, `PGSL_RDB_USERNAME_HASHICORP`, `PGSL_RDB_JANUS_HASHICORP`, `PGSL_RDB_DRIVER` |
| Directory/Auth | `OUD_URL`, `RATAN_CIPHER_KEY`, `FMAA_HOST`, `MFA_CERT`, `MFA_REDIRECT_URI`                   |
| Analytics      | `ELASTIC_HOST`, `ELASTIC_API_KEY`, `ELASTIC_API_VALUE`                                       |
| Entitlements   | `EMS2_HTTPS_HOST`                                                                            |
| Gateway        | `API_GATEWAY_URL`, `API_GATEWAY_TOKEN`                                                       |

Production configuration is read from `application.yml`, HashiCorp-backed values, and deployment environment variables.

## Verification

```bash
cd services/backend
mvn test
```

Current focused tests cover local auth flow and JWT utilities.
