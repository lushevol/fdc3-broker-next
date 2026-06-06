# backend - Architecture

<- [PROJECT.md](./PROJECT.md)

## Tech Stack

| Component  | Technology                                    |
| ---------- | --------------------------------------------- |
| Framework  | Spring Boot 4.0.6                             |
| Language   | Java 21                                       |
| API        | Spring Web MVC                                |
| ORM        | Spring Data JPA                               |
| Database   | PostgreSQL in deployed profiles, H2 for local |
| Migrations | Flyway for PostgreSQL                         |
| LDAP       | Spring LDAP                                   |
| JWT        | Auth0 java-jwt, RSA512                        |
| Build      | Maven                                         |

## Directory Structure

```text
src/main/java/com/scb/sso/singleuibff/
├── config/                 # Spring config and typed property classes
├── controller/
│   ├── v1/                 # Admin, analytics, and config endpoints
│   └── v2/                 # SSO/JWT endpoints
├── dto/                    # Request/response/external DTOs
├── entity/                 # JPA entities and audit entities
├── exceptions/             # API exception handling
├── filter/                 # Response security headers
├── repository/             # JPA repositories and Elasticsearch adapter
├── service/
│   ├── v1/                 # Auth, session, analytics, admin services
│   └── v2/                 # EMS2 authorization services
└── util/                   # JWT, CSV, OUD, and admin helpers
```

## API Endpoints

### Authentication

| Method | Path                   | Purpose                                                                                     |
| ------ | ---------------------- | ------------------------------------------------------------------------------------------- |
| POST   | `/v2/sso/login`        | Authenticate through OUD or MFA/SSO and return tokens, user info, entitlements, and drawers |
| POST   | `/v2/sso/validate`     | Validate an existing token and refresh entitlement/drawer data                              |
| POST   | `/v2/sso/extend`       | Extend a token while respecting absolute expiry                                             |
| POST   | `/v2/sso/refreshtoken` | Create a refresh token from a valid main token                                              |
| POST   | `/v2/sso/relogin`      | Exchange a refresh token for a new login response                                           |
| POST   | `/v2/sso/logout`       | Invalidate session state and clear cookies                                                  |

### Admin and Analytics

| Method | Path                             | Purpose                                              |
| ------ | -------------------------------- | ---------------------------------------------------- |
| POST   | `/v1/fmo/print`                  | Insert an analytics event                            |
| POST   | `/v1/fmo/analytics`              | Query analytics data                                 |
| POST   | `/v1/fmo/admin/config/upload`    | Bulk upload import map, category, and tile CSV files |
| POST   | `/v1/fmo/admin/category/create`  | Create category candidate                            |
| POST   | `/v1/fmo/admin/category/update`  | Update category candidate                            |
| POST   | `/v1/fmo/admin/category/audit`   | Read category audit data                             |
| POST   | `/v1/fmo/admin/category/data`    | Read entitlement-scoped category data                |
| POST   | `/v1/fmo/admin/tile/create`      | Create tile candidate                                |
| POST   | `/v1/fmo/admin/tile/update`      | Update tile candidate                                |
| POST   | `/v1/fmo/admin/tile/audit`       | Read tile audit data                                 |
| POST   | `/v1/fmo/admin/tile/data`        | Read entitlement-scoped tile data                    |
| GET    | `/v1/fmo/admin/importmap/active` | Read active import maps                              |
| POST   | `/v1/fmo/admin/importmap/create` | Create import-map candidate                          |
| POST   | `/v1/fmo/admin/importmap/update` | Update import-map candidate                          |
| POST   | `/v1/fmo/admin/importmap/audit`  | Read import-map audit data                           |
| POST   | `/v1/fmo/admin/importmap/data`   | Read entitlement-scoped import-map data              |

## Login Flow

```text
JwtAuthenticationController.login
  ├─ code blank -> OUDAuthenticationService
  ├─ code present -> MFAAuthenticationService
  ├─ AuthorizationService.getEntitlements -> EMS2 role/entity data
  ├─ ApplicationCategoryService.getDrawers -> configured drawers and tiles
  ├─ AdminModuleUtil.getDrawer -> entitlement-filtered drawer tree
  ├─ JwtTokenUtil -> main token and entitlement token
  └─ AnalyticService.insertData -> login analytics event
```

## Local Profile

`spring.profiles.active=local` uses `application-local.yml`:

- H2 in PostgreSQL mode with schema `POST_TRADE_PORTAL_SERVICE`.
- Flyway disabled and JPA `create-drop` enabled.
- Eureka disabled.
- `LocalConfig` provides mock services for auth, analytics, EMS2, MFA, and FMAA behavior.

## Data

- Production uses PostgreSQL and Flyway migrations under `src/main/resources/migration/`.
- Local H2 data is transient and rebuilt on every start.
- Admin entities have audit tables to support maker-checker review.

## Security

`RequestFilter` adds cache, XSS, content type, frame, HSTS, and referrer headers to every response. Sensitive config values are encrypted with Jasypt in deployed profiles.
