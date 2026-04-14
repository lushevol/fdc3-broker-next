# backend (Single UI BFF) — Project Overview

← [Monorepo AGENTS.md](../../AGENTS.md)

## Type

Spring Boot 3.3.4 Backend Service (Java 17), Port 8088

## Purpose

Backend for Frontend (BFF) providing authentication (LDAP/SSO), authorization (EMS2), JWT token management, admin CRUD (tiles, categories, import maps), and analytics. Uses in-memory H2 for local dev.

## Status

Production

## Key Features

- **Dual authentication**: LDAP password login and MFA/SSO OAuth2 code exchange
- **JWT RSA512 token lifecycle**: main token (15 min), refresh token (225 min), entitlement token (12 h)
- **Maker-checker approval workflow**: tile/category/import map create/update sets `isActive=false` until checker approves
- **Entitlement-scoped data**: all tile, category, and import map data filtered by EMS2 roles
- **Elasticsearch analytics**: page-view and unique-visitor data pushed to Elasticsearch
- **Local development with mock services**: `LocalConfig` provides mock beans for LDAP, EMS2, MFA, and Elasticsearch

## Quick Start

```bash
# From monorepo root
npm run dev:services

# Or standalone
cd services/backend && npm run dev
# Equivalent to: mvn spring-boot:run -Dspring-boot.run.jvmArguments='-Dserver.port=8088 -Dspring.profiles.active=local'
```

Local profile starts H2 in-memory database with `create-drop` — no PostgreSQL or LDAP needed.

## Package

`com.scb.sso.singleuibff`

## Environment

Production requires 20+ environment variables:

| Group         | Variables                                                                               |
| ------------- | --------------------------------------------------------------------------------------- |
| Database      | `PGSL_RDB_HOST`, `PGSL_RDB_PORT`, `PGSL_RDB_NAME`, `PGSL_RDB_USER`, `PGSL_RDB_PASSWORD` |
| LDAP          | `OUD_URL`, `OUD_USER_SEARCH_BASE`, `OUD_USER_SEARCH_FILTER`                             |
| Elasticsearch | `ELASTIC_HOST`, `ELASTIC_PORT`, `ELASTIC_PROTOCOL`, `ELASTIC_INDEX`                     |
| MFA/SSO       | `MFA_CLIENT_ID`, `MFA_CLIENT_SECRET`, `MFA_TOKEN_URL`, `MFA_REDIRECT_URI`               |
| EMS2          | `EMS2_URL`, `EMS2_CLIENT_ID`, `EMS2_CLIENT_SECRET`                                      |
| JWT           | `JWT_ISSUER`, `JWT_REFRESH_ISSUER`, `JWT_SECRET` (RSA512 keys)                          |
| FMAA          | `FMAA_URL`, `FMAA_CLIENT_ID`, `FMAA_CLIENT_SECRET`                                      |

Local profile (`local`) uses in-memory H2 and `LocalConfig` mock beans — none of these are required.
