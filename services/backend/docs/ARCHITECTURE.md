# backend — Architecture

← [PROJECT.md](./PROJECT.md)

## Tech Stack

| Component     | Technology                    |
| ------------- | ----------------------------- |
| Framework     | Spring Boot 3.3.4             |
| Language      | Java 17                       |
| ORM           | Spring Data JPA               |
| LDAP          | Spring LDAP                   |
| Migrations    | Flyway (PostgreSQL only)      |
| Local DB      | H2 (create-drop)              |
| Production DB | PostgreSQL                    |
| JWT           | Auth0 java-jwt 4.3.0 (RSA512) |
| Encryption    | Jasypt                        |
| Build         | Maven                         |

## Directory Structure

```
src/main/java/com/scb/sso/singleuibff/
├── config/                      # Spring configurations
│   ├── AuthConfig.java
│   ├── ElasticProperties.java
│   ├── EMS2ConfigProperties.java
│   ├── FmaaProperties.java
│   ├── JWTConfigProperties.java
│   ├── LocalConfig.java         # Mock beans for local dev
│   ├── MFAConfigProperties.java
│   ├── OUDProperties.java
│   ├── WhitelistedProperties.java
│   ├── LogAspectConfig.java
│   └── TomcatCustomizer.java
├── controller/
│   ├── v1/                      # Admin CRUD endpoints
│   │   ├── ApplicationTileController.java
│   │   ├── ApplicationCategoryController.java
│   │   ├── ImportMapController.java
│   │   ├── ApplicationConfigController.java
│   │   └── AnalyticsController.java
│   └── v2/                      # Auth endpoints
│       └── JwtAuthenticationController.java
├── dto/
│   ├── request/                 # Inbound DTOs
│   ├── response/                # Outbound DTOs
│   ├── ems2/v2/                 # EMS2 entitlement DTOs
│   ├── elastic/                 # Elasticsearch DTOs
│   ├── mfa/                     # MFA response DTOs
│   └── config/                  # Config DTOs
├── entity/                       # JPA entities
├── exceptions/                  # Custom exceptions
├── filter/
│   ├── RequestFilter.java       # Security headers
│   └── RestExceptionHandler.java
├── repository/                  # Spring Data repos + Elasticsearch
├── service/
│   ├── v1/                      # Business logic interfaces
│   │   ├── AuthenticationService.java
│   │   ├── SessionService.java
│   │   ├── AnalyticService.java
│   │   ├── ApplicationTileService.java
│   │   ├── ApplicationCategoryService.java
│   │   ├── ImportMapService.java
│   │   └── implementation/
│   │       ├── OUDAuthenticationService.java
│   │       ├── MFAAuthenticationService.java
│   │       ├── SessionServiceImplementation.java
│   │       ├── ApplicationTileServiceImpl.java
│   │       ├── ApplicationCategoryServiceImpl.java
│   │       ├── ImportMapServiceImpl.java
│   │       ├── ApplicationConfigServiceImpl.java
│   │       ├── AnalyticServiceImplementation.java
│   │       └── Audit services
│   └── v2/
│       ├── AuthorizationService.java
│       └── implementation/
│           └── EMS2AuthorizationImplementation.java
└── util/
    ├── JwtTokenUtil.java
    ├── AdminModuleUtil.java
    ├── OudUtil.java
    ├── CsvUtility.java
    └── Constant.java
```

## API Endpoints

### v2 — Authentication

| Method | Path                  | Description                                     |
| ------ | --------------------- | ----------------------------------------------- |
| POST   | `v2/sso/login`        | Authenticate via LDAP or MFA/SSO OAuth2 code    |
| POST   | `v2/sso/validate`     | Validate JWT token and refresh entitlements     |
| POST   | `v2/sso/extend`       | Extend main token expiry (respects max-age cap) |
| POST   | `v2/sso/refreshtoken` | Exchange valid token for refresh token          |
| POST   | `v2/sso/relogin`      | Re-authenticate using refresh token             |
| POST   | `v2/sso/logout`       | Invalidate session and clear cookies            |

### v1 — Admin CRUD

| Method | Path               | Description                 |
| ------ | ------------------ | --------------------------- |
| CRUD   | `v1/tile/*`        | Application tile management |
| CRUD   | `v1/category/*`    | Category management         |
| CRUD   | `v1/importmap/*`   | Import map management       |
| POST   | `v1/config/upload` | Configuration upload        |
| POST   | `v1/analytics/*`   | Analytics data endpoints    |

## Authentication Flow

```
POST v2/sso/login
  │
  ├─ code blank? ──→ LDAP auth (OUDAuthenticationService)
  │                     │
  │                     └─ bind with username/password → retrieve OUD attributes
  │
  └─ code present? ─→ MFA/SSO auth (MFAAuthenticationService)
                        │
                        └─ exchange OAuth2 authorization code for token → retrieve user info
  │
  ▼
buildEntities()
  │
  ├─ AuthorizationService.getEntitlements() → EMS2 role/entitlement lookup
  ├─ ApplicationCategoryService.getDrawers() → category data (scoped by role)
  ├─ JwtTokenUtil.doGenerateTokenWithAuthTime() → main token (15 min)
  └─ JwtTokenUtil.generateEntitlementToken() → entitlement token (12 h)
  │
  ▼
Response: { token, entitlementsToken, oud, entities, drawers, userInfo }
```

## JWT Token Types

| Token       | Issuer               | Expiry  | Purpose                                              |
| ----------- | -------------------- | ------- | ---------------------------------------------------- |
| Main        | `JWT_ISSUER`         | 15 min  | Primary auth token in `singleUIAuthorization` header |
| Refresh     | `JWT_ISSUER_REFRESH` | 225 min | Token exchange for re-login without re-auth          |
| Entitlement | `JWT_ISSUER`         | 12 h    | Encoded role/entitlement claims                      |

All tokens are RSA512 signed.

## Database

- **Production**: PostgreSQL with Flyway migrations (`V1.0.0`–`V1.0.9`)
- **Local (`local` profile)**: H2 in-memory with `create-drop` — JPA auto-creates schema

## Security

`RequestFilter` (extends `OncePerRequestFilter`) sets the following HTTP headers on every response:

- `Cache-Control: private, no-cache, must-revalidate`
- `X-XSS-Protection: 1; mode=block`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Referrer-Policy: same-origin`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- Removes `Server` and `X-Powered-By`

Jasypt encrypts sensitive configuration values. Whitelisted users bypass normal auth flows.

## Local Profile

When `spring.profiles.active=local`, `LocalConfig` provides mock beans for:

- LDAP authentication (accepts any credentials)
- MFA/SSO authentication (returns mock user info)
- EMS2 authorization (returns full entitlements)
- Elasticsearch analytics (no-op)
- FMAA notifications (no-op)

Spring LDAP auto-configuration is excluded via `@SpringBootApplication(exclude = { ... })`.
