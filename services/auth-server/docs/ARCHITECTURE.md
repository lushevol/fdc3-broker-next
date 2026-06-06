# auth-server - Architecture

<- [PROJECT.md](./PROJECT.md)

## Tech Stack

| Component         | Technology                     |
| ----------------- | ------------------------------ |
| Framework         | Spring Boot 4.0.6              |
| Language          | Java 21                        |
| API               | Spring Web MVC                 |
| Directory         | Spring LDAP                    |
| Sessions/cache    | Redis cluster                  |
| Security tokens   | Nimbus JOSE JWT, FMAA auth SDK |
| Internal platform | Ratan foundation starters      |
| Build             | Maven                          |

## Directory Structure

```text
src/main/java/com/scb/auth/
├── Application.java
└── login/
    ├── configuration/              # EMS2 and OUD configuration
    ├── controller/                 # v1, v2, and v3 auth endpoints
    ├── dataentitlement/            # Data entitlement helpers
    ├── dto/                        # Authentication DTOs
    ├── entity/                     # User, OUD, EMS2, and Ratan models
    ├── exceptions/                 # Auth exception model and handler
    ├── jwtparser/                  # JWT parser/fetcher/converter pipeline
    ├── mock/                       # Mock auth config/service
    ├── repo/                       # Directory/user repositories
    ├── service/                    # OUD, EMS2, FMAA, Kong, strategy auth
    └── util/                       # Constants and attribute mapping
```

## API Endpoints

### v1 LoginController

| Method | Path               | Purpose                                 |
| ------ | ------------------ | --------------------------------------- |
| POST   | `/v1/login`        | Login with OUD credentials              |
| POST   | `/v1/logout`       | Logout current token/session            |
| POST   | `/v1/heartBeat`    | Keep session alive                      |
| GET    | `/v1/user`         | Resolve user by JWT or xToken           |
| GET    | `/v1/userInfo`     | Read session user info                  |
| GET    | `/v1/validateUser` | Validate session and optional user info |
| POST   | `/v1/authenticate` | Check requested actions                 |
| GET    | `/v1/authenticate` | Resolve authenticated user              |

### v2 V2LoginController

| Method | Path               | Purpose                    |
| ------ | ------------------ | -------------------------- |
| POST   | `/v2/login`        | Simplified login           |
| POST   | `/v2/logout`       | Logout                     |
| POST   | `/v2/heartBeat`    | Keep session alive         |
| GET    | `/v2/user`         | Resolve user by xToken     |
| GET    | `/v2/userInfo`     | Read session user info     |
| POST   | `/v2/authenticate` | Check requested actions    |
| GET    | `/v2/authenticate` | Resolve authenticated user |

### v3 AuthenticationController

| Method | Path               | Purpose                                                                   |
| ------ | ------------------ | ------------------------------------------------------------------------- |
| POST   | `/v3/authenticate` | Multi-protocol auth using X-Token, Single-UI-Authorization, or FMAA-Token |
| GET    | `/v3/token`        | Retrieve FMAA token                                                       |
| GET    | `/v3/kong/token`   | Retrieve Kong token                                                       |

## Runtime Flow

```text
Controller
  ├─ AuthenticationStrategy selects token, basic-auth, FMAA, or Kong path
  ├─ OUD/FMAA/Kong services validate identity
  ├─ EMS2 service resolves entitlement data
  ├─ Redis stores session, user, and entitlement cache entries
  └─ Response DTO returns auth result or token data
```

## External Dependencies

- **Redis**: session token, user info, entitlement, and service-token caches.
- **OUD/LDAP**: corporate identity lookup and password bind.
- **EMS2**: role/action/data entitlement source.
- **FMAA**: OAuth2-style token introspection and token acquisition.
- **Kong Gateway**: gateway token acquisition.
- **HashiCorp/Ratan foundation**: deployment-time secrets and platform wiring.

## Observability

`application.yml` configures logging and tracing integration through Ratan foundation properties, Zipkin endpoint settings, and logstash destinations.
