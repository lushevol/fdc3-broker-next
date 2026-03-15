# Auth-Server Architecture Document

**Version:** 3.0.8-SNAPSHOT
**Framework:** Spring Boot 3.3.7
**Java Version:** 17
**Port:** 8082
**Last Updated:** 2026-03-14

---

## 1. System Overview

The Auth-Server is a Spring Boot-based authentication and authorization service that provides:

- **User Authentication** via LDAP/OUD (Oracle Unified Directory)
- **Session Management** using Redis-backed token storage
- **Entitlement Management** through EMS2 integration
- **Multi-protocol Support** for JWT, FMAA OAuth2, and Kong Gateway authentication
- **RESTful APIs** for login, logout, session validation, and entitlement checks

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              AUTH-SERVER (Port 8082)                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │  LoginController│  │V2LoginController │  │AuthController  │             │
│  │    (/v1/*)      │  │    (/v2/*)      │  │    (/v3/*)     │             │
│  └────────┬────────┘  └────────┬────────┘  └────────┬───────┘             │
│           │                    │                    │                       │
│           └────────────────────┼────────────────────┘                       │
│                                ▼                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        SERVICE LAYER                                 │   │
│  │  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐             │   │
│  │  │  LoginService │ │ OUDAuthBO     │ │FMAAAuthService│             │   │
│  │  └───────────────┘ └───────────────┘ └───────────────┘             │   │
│  │  ┌───────────────┐ ┌───────────────┐ ┌───────────────────────┐     │   │
│  │  │Ems2Entitlement│ │KongGatewayAuth│ │AuthenticationStrategy │     │   │
│  │  │    Service    │ │   Service     │ │       (Chain)         │     │   │
│  │  └───────────────┘ └───────────────┘ └───────────────────────┘     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                │                                            │
│                                ▼                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      REPOSITORY LAYER                                │   │
│  │  ┌─────────────────────────────────────────────────────────────┐    │   │
│  │  │                    Redis Repository                          │    │   │
│  │  │  • Session Tokens  • User Info  • Entitlements  • Cache      │    │   │
│  │  └─────────────────────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Architecture Diagram

```
                                    ┌─────────────────┐
                                    │   CLIENT APPS   │
                                    │  (MFE, Web UI)  │
                                    └────────┬────────┘
                                             │
                                             │ HTTPS (REST API)
                                             ▼
┌────────────────────────────────────────────────────────────────────────────────────┐
│                                   AUTH-SERVER                                       │
│                                                                                            │
│   ┌──────────────────────────────────────────────────────────────────────────────┐   │
│   │                           API LAYER (Controllers)                            │   │
│   │                                                                              │   │
│   │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐  │   │
│   │  │   /v1/login     │  │   /v2/login     │  │      /v3/authenticate       │  │   │
│   │  │   /v1/logout    │  │   /v2/logout    │  │      /v3/token              │  │   │
│   │  │   /v1/heartBeat  │  │   /v2/heartBeat │  │      /v3/kong/token        │  │   │
│   │  │   /v1/user      │  │   /v2/user      │  │                             │  │   │
│   │  │   /v1/validateUser  │  /v2/authenticate │                             │  │   │
│   │  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘  │   │
│   └──────────────────────────────────────────────────────────────────────────────┘   │
│                                            │                                            │
│                                            ▼                                            │
│   ┌──────────────────────────────────────────────────────────────────────────────┐   │
│   │                         AUTHENTICATION STRATEGIES                             │   │
│   │                                                                              │   │
│   │  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌─────────────┐  │   │
│   │  │  OUD/LDAP     │  │  JWT Token    │  │  FMAA OAuth2  │  │ Kong Gateway│  │   │
│   │  │  (Username/   │  │  (Single-UI-   │  │  (FMAA-Token  │  │ (X-Token)  │  │   │
│   │  │   Password)  │  │  Authorization)│  │   Header)     │  │             │  │   │
│   │  └───────────────┘  └───────────────┘  └───────────────┘  └─────────────┘  │   │
│   └──────────────────────────────────────────────────────────────────────────────┘   │
│                                            │                                            │
└────────────────────────────────────────────┼────────────────────────────────────────────┘
                                             │
              ┌───────────────────────────────┼───────────────────────────────┐
              │                               │                               │
              ▼                               ▼                               ▼
┌─────────────────────┐          ┌─────────────────────┐          ┌─────────────────────┐
│                     │          │                     │          │                     │
│  EXTERNAL SERVICES  │          │   DATA STORAGE      │          │   OBSERVABILITY     │
│                     │          │                     │          │                     │
├─────────────────────┤          ├─────────────────────┤          ├─────────────────────┤
│                     │          │                     │          │                     │
│  ┌───────────────┐  │          │  ┌───────────────┐  │          │  ┌───────────────┐  │
│  │  LDAP/OUD     │  │          │  │    Redis      │  │          │  │    Zipkin     │  │
│  │  (User Auth)  │  │          │  │   Cluster     │  │          │  │   (Tracing)   │  │
│  └───────────────┘  │          │  └───────────────┘  │          │  └───────────────┘  │
│                     │          │                     │          │                     │
│  ┌───────────────┐  │          │  Redis Keys:        │          │  ┌───────────────┐  │
│  │     EMS2      │  │          │  • ratanone:        │          │  │   Logstash    │  │
│  │ (Entitlements)│  │          │  authentication:*   │          │  │    (Logs)     │  │
│  └───────────────┘  │          │  • ratan:fmaaToken  │          │  └───────────────┘  │
│                     │          │  • ratanone:da:*    │          │                     │
│  ┌───────────────┐  │          │                     │          │  ┌───────────────┐  │
│  │  Kong Gateway │  │          │  TTL: 15 minutes    │          │  │    Kafka      │  │
│  │   (API GW)    │  │          │  (session timeout)  │          │  │   (Events)    │  │
│  └───────────────┘  │          │                     │          │  └───────────────┘  │
│                     │          │                     │          │                     │
│  ┌───────────────┐  │          └─────────────────────┘          └─────────────────────┘
│  │     FMAA      │  │
│  │ (OAuth2/OIDC) │  │
│  └───────────────┘  │
│                     │
│  ┌───────────────┐  │
│  │ HashiCorp     │  │
│  │    Vault      │  │
│  │  (Secrets)    │  │
│  └───────────────┘  │
│                     │
└─────────────────────┘
```

---

## 3. API Endpoints

### 3.1 V1 API - LoginController

| Endpoint | Method | Description | Request | Response |
|----------|--------|-------------|---------|----------|
| `/v1/login` | POST | Authenticate user with OUD credentials | `{"data": {"username": "...", "password": "..."}}` | User info + token + entitlements |
| `/v1/logout` | POST | End user session | - | `{"responseCode": "SUCCESS"}` |
| `/v1/heartBeat` | POST | Refresh session token | - | New token |
| `/v1/user` | GET | Get user by JWT or xToken | Header: `Single-UI-Authorization` or param `xToken` | User info JSON |
| `/v1/userInfo` | GET | Get user info from session | Header: `X-Token` | User info JSON |
| `/v1/validateUser` | GET | Validate session & optionally get user info | Header: `X-Token`, param `includeUserInfo` | Validation result |
| `/v1/authenticate` | POST | Check user entitlements for actions | `{"action": [...]}` | `{"result": true/false}` |
| `/v1/authenticate` | GET | Get user if session valid | Header: `X-Token` | User info JSON |

### 3.2 V2 API - V2LoginController

| Endpoint | Method | Description | Request | Response |
|----------|--------|-------------|---------|----------|
| `/v2/login` | POST | Simplified login | `{"username": "...", "password": "..."}` | AuthEntity |
| `/v2/logout` | POST | Logout | - | AuthEntity |
| `/v2/heartBeat` | POST | Session keepalive | - | AuthEntity with new token |
| `/v2/user` | GET | Get user by xToken | param `xToken` | User info JSON |
| `/v2/userInfo` | GET | Get user info | Header: `X-Token` | User info JSON |
| `/v2/authenticate` | POST | Check entitlements | `{"action": [...]}` | AuthEntity |

### 3.3 V3 API - AuthenticationController

| Endpoint | Method | Description | Headers | Response |
|----------|--------|-------------|---------|----------|
| `/v3/authenticate` | POST | Multi-protocol auth | `X-Token` OR `Single-UI-Authorization` OR `FMAA-Token` | AuthenticationResponseDto |
| `/v3/token` | GET | Get FMAA access token | - | FMAA token |
| `/v3/kong/token` | GET | Get Kong gateway token | - | Kong access token |

---

## 4. External Dependencies

### 4.1 Redis Cluster

**Purpose:** Primary data store for sessions, cache, and rate limiting

**Connection Configuration:**
```yaml
spring.data.redis:
  cluster.nodes: ${REDIS_CLUSTER_NODES}
  password: ${REDIS_JANUS}
  timeout: 30s
```

**Redis Key Patterns:**

| Key Pattern | Purpose | TTL |
|-------------|---------|-----|
| `ratanone:authentication:token:s:{token}` | Session token → User ID mapping | 15 min |
| `ratanone:authentication:user_info:s:{userId}` | Cached user information | 15 min |
| `ratanone:authentication:ems2_authorization:s:{userId}` | Cached EMS2 entitlements | 15 min |
| `ratanone:authentication:user_actions:s:{userId}` | User action permissions | 15 min |
| `ratanone:authentication:last_login_time:s:{userId}` | Last login timestamp | 15 min |
| `ratanone:da:pct2:kong:client:*` | Kong client credentials | Configurable |
| `ratan:fmaaToken:str` | FMAA token cache | Configurable |

**Failure Mode:** Service becomes unavailable; all sessions lost on Redis failure

---

### 4.2 LDAP/OUD (Oracle Unified Directory)

**Purpose:** Corporate user authentication and directory lookup

**Connection Configuration:**
```yaml
spring.ldap.urls: ${OUD_URL}
```

**DN Patterns:**
- **User DN:** `cn={userId},ou=users,o=standardchartered`
- **System Account DN:** `cn={userId},ou=fmedmi,ou=apps,o=standardchartered`

**Authentication Flow:**
1. Bind to LDAP with user credentials
2. Search for user entry
3. Retrieve user attributes
4. Map to internal `UserInfo` entity

**Failure Mode:** Authentication fails; users cannot log in

---

### 4.3 EMS2 (Entitlement Management System)

**Purpose:** User entitlements, roles, and authorization data

**Configuration:**
```yaml
scb.ems2:
  host: ${EMS2_HOST}
  userRoles: ${scb.ems2.host}/ems2/rest/account/%s
  userAuthorizationOnEntity: ${scb.ems2.host}/ems2/rest/entitlements/entity/name/%s/user/%s
```

**API Endpoints:**
- `GET /ems2/rest/account/{userId}` - Get user roles
- `GET /ems2/rest/entitlements/entity/name/{entity}/user/{userId}` - Get user entitlements for entity

**Monitored Entities (for entitlement checks):**
| Entity | Purpose |
|--------|---------|
| `RATAN_TRADE_BLOTTER` | Trade blotter access |
| `RATAN_CASHFLOW_BLOTTER` | Cashflow blotter access |
| `RATAN_MO_EXCEPTION` | MO exception handling |
| `RATAN_VALIDATION_EXCEPTION` | Validation exception handling |
| `RATAN_SETTLEMENT_EXCEPTION` | Settlement exception handling |
| `RATAN_WORKFLOW` | Workflow management |
| `RATAN_SUPPRESSION_RULE` | Suppression rule management |
| `RATAN_SETTLEMENT_STP_RULE` | STP rule management |

**Failure Mode:** Entitlements unavailable; users may have restricted access

---

### 4.4 FMAA (Financial Markets Authentication & Authorization)

**Purpose:** OAuth2 token validation and client credentials flow

**Configuration:**
```yaml
fmaa.api:
  introspectPoint: ${FMAA_HOST}/introspect
  account: ${FMAA_ACCOUNT}
  janus: ${FMAA_JANUS}
  host: ${FMAA_HOST}
  certPath: ${FMAA_CERT_PATH}
```

**API Used:**
- `GET /introspect?access_token={token}&user_id={userId}&app_id={appId}` - Token validation

**Authentication Flow:**
1. Receive FMAA token from `FMAA-Token` header
2. Call introspect endpoint
3. Validate token validity and expiration
4. Fetch user entitlements from EMS2
5. Return combined authentication response

**Failure Mode:** FMAA authentication unavailable; JWT/OUD auth still works

---

### 4.5 Kong API Gateway

**Purpose:** API gateway authentication via client credentials flow

**Configuration:**
```yaml
ratanone.authentication.kong:
  account: ${EDMI_OUD}
  sec: ${EDMI_OUD_PWD}
  iam: ${KONG_IAM_URL}
  tokenEndpoint: ${KONG_TOKEN_ENDPOINT}
  clientEndpoint: ${KONG_CLIENT_ENDPOINT}
  gateway: ${KONG_GATEWAY}
```

**Token Acquisition Flow:**
1. Fetch client credentials from `clientEndpoint` using Basic auth
2. Exchange credentials for access token at `tokenEndpoint`
3. Cache token in Redis

**Failure Mode:** Kong authentication unavailable; other auth methods still work

---

### 4.6 HashiCorp Vault

**Purpose:** Secrets management

**Integration:** Via `ratanone-hashicorp-integrator-spring-boot-starter`

**Managed Secrets:**
- Database credentials
- API keys
- Certificate passwords
- Redis passwords
- LDAP bind credentials

**Failure Mode:** Application may fail to start if secrets cannot be retrieved

---

### 4.7 Observability Stack

#### Zipkin (Distributed Tracing)
```yaml
management.zipkin.tracing.endpoint: ${ZIPKIN_SERVER_ENDPOINT}
management.tracing.sampling.probability: ${TRACING_SAMPLING_PROBABILITY:0.3}
```

#### Logstash (Centralized Logging)
```yaml
ratanone.logging.logstash.destinations: ${LOGSTASH_URL}
```

#### Kafka (Event Streaming)
```yaml
spring.kafka.bootstrap-servers: ${KAFKA_CLUSTER_BROKERS}
```

---

## 5. Data Flow

### 5.1 Login Flow (Username/Password)

```
┌─────────┐      ┌─────────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐
│  Client │      │Auth-Server  │      │   OUD   │      │  EMS2   │      │  Redis  │
└────┬────┘      └──────┬──────┘      └────┬────┘      └────┬────┘      └────┬────┘
     │                  │                  │                │                │
     │ POST /v1/login   │                  │                │                │
     │ {user, pass}     │                  │                │                │
     │─────────────────>│                  │                │                │
     │                  │                  │                │                │
     │                  │ LDAP Bind        │                │                │
     │                  │─────────────────>│                │                │
     │                  │                  │                │                │
     │                  │ Bind Result      │                │                │
     │                  │<─────────────────│                │                │
     │                  │                  │                │                │
     │                  │ LDAP Search      │                │                │
     │                  │─────────────────>│                │                │
     │                  │                  │                │                │
     │                  │ User Attributes  │                │                │
     │                  │<─────────────────│                │                │
     │                  │                  │                │                │
     │                  │                  │  GET /account  │                │
     │                  │                  │  & entitlements│                │
     │                  │──────────────────────────────────>│                │
     │                  │                  │                │                │
     │                  │                  │  Roles & Perms│                │
     │                  │<──────────────────────────────────│                │
     │                  │                  │                │                │
     │                  │                  │                │  Store Session │
     │                  │                  │                │  SET token → userId
     │                  │──────────────────────────────────────────────────>│
     │                  │                  │                │                │
     │  {userInfo,      │                  │                │                │
     │   token,          │                  │                │                │
     │   entitlements}   │                  │                │                │
     │<─────────────────│                  │                │                │
     │                  │                  │                │                │
```

### 5.2 JWT Authentication Flow

```
┌─────────┐      ┌─────────────┐      ┌─────────┐      ┌─────────┐
│  Client │      │Auth-Server  │      │  EMS2   │      │  Redis  │
└────┬────┘      └──────┬──────┘      └────┬────┘      └────┬────┘
     │                  │                  │                │
     │ POST /v3/authenticate                │                │
     │ Header: Single-UI-Authorization: Bearer <JWT>
     │─────────────────>│                  │                │
     │                  │                  │                │
     │                  │ Parse & Validate │                │
     │                  │ JWT locally      │                │
     │                  │ (no external call)                │
     │                  │                  │                │
     │                  │ Extract userId   │                │
     │                  │ from JWT claims  │                │
     │                  │                  │                │
     │                  │ Check cache      │                │
     │                  │──────────────────────────────────>│
     │                  │                  │                │
     │                  │<──────────────────────────────────│
     │                  │ (cached or fetch from EMS2)       │
     │                  │                  │                │
     │  {userInfo,      │                  │                │
     │   entitlements}  │                  │                │
     │<─────────────────│                  │                │
     │                  │                  │                │
```

### 5.3 Session Heartbeat Flow

```
┌─────────┐      ┌─────────────┐      ┌─────────┐
│  Client │      │Auth-Server  │      │  Redis  │
└────┬────┘      └──────┬──────┘      └────┬────┘
     │                  │                  │
     │ POST /v1/heartBeat                  │
     │ Header: X-Token: <current_token>    │
     │─────────────────>│                  │
     │                  │                  │
     │                  │ GET userId by token
     │                  │─────────────────>│
     │                  │                  │
     │                  │ userId           │
     │                  │<─────────────────│
     │                  │                  │
     │                  │ DEL old token    │
     │                  │─────────────────>│
     │                  │                  │
     │                  │ Generate new UUID token
     │                  │ SET new_token → userId
     │                  │ (TTL: 15 min)    │
     │                  │─────────────────>│
     │                  │                  │
     │  {newToken}      │                  │
     │<─────────────────│                  │
     │                  │                  │
```

---

## 6. Security Architecture

### 6.1 Authentication Methods

| Method | Use Case | Header | Validation |
|--------|----------|--------|------------|
| **OUD/LDAP** | Traditional login | Username/Password in body | LDAP bind |
| **JWT** | SSO/Microservice | `Single-UI-Authorization: Bearer <jwt>` | Local signature validation |
| **FMAA** | FMO Portal | `FMAA-Token: <token>` | Introspect endpoint |
| **Session Token** | Web session | `X-Token: <uuid>` | Redis lookup |
| **Kong** | API Gateway | Token from `/v3/kong/token` | Kong OAuth2 flow |

### 6.2 Token Lifecycle

```
┌─────────────────────────────────────────────────────────────────────┐
│                        TOKEN LIFECYCLE                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────┐     ┌───────────┐     ┌───────────┐                 │
│  │   Login   │────>│ Generate  │────>│  Store in │                 │
│  │  Success  │     │UUID Token │     │   Redis   │                 │
│  └───────────┘     └───────────┘     └─────┬─────┘                 │
│                                             │                       │
│                                             │ TTL: 15 min           │
│                                             ▼                       │
│  ┌───────────┐     ┌───────────┐     ┌───────────┐                 │
│  │   Token   │<────│ Heartbeat │<────│   Auto    │                 │
│  │  Expired  │     │  Refresh  │     │  Expire   │                 │
│  └─────┬─────┘     └───────────┘     └───────────┘                 │
│        │                                                            │
│        │                                                            │
│        ▼                                                            │
│  ┌───────────┐                                                     │
│  │  Logout   │                                                     │
│  │  (Manual  │                                                     │
│  │  Delete)  │                                                     │
│  └───────────┘                                                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.3 Entitlement Checks

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ENTITLEMENT CHECK FLOW                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  POST /v1/authenticate                                             │
│  Body: {"action": ["RATAN_TRADE_BLOTTER", "RATAN_WORKFLOW"]}        │
│                                                                     │
│                          │                                          │
│                          ▼                                          │
│               ┌───────────────────┐                                │
│               │ Get user from     │                                │
│               │ session token     │                                │
│               └─────────┬─────────┘                                │
│                         │                                          │
│                         ▼                                          │
│               ┌───────────────────┐                                │
│               │ Check Redis cache │                                │
│               │ for entitlements  │                                │
│               └─────────┬─────────┘                                │
│                         │                                          │
│              ┌──────────┴──────────┐                               │
│              │                     │                               │
│              ▼                     ▼                               │
│     ┌────────────────┐    ┌────────────────┐                       │
│     │ Cache HIT      │    │ Cache MISS    │                       │
│     │ Return cached  │    │ Fetch from    │                       │
│     │ result         │    │ EMS2          │                       │
│     └────────────────┘    └────────┬───────┘                       │
│                                     │                              │
│                                     ▼                              │
│                          ┌────────────────┐                       │
│                          │ Cache result   │                       │
│                          │ in Redis       │                       │
│                          └────────┬───────┘                       │
│                                   │                                │
│                                   ▼                                │
│                          ┌────────────────┐                       │
│                          │ Return result  │                       │
│                          │ {"result":true}│                       │
│                          └────────────────┘                       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 7. Configuration

### 7.1 Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `KAFKA_CLUSTER_BROKERS` | Kafka broker addresses | `kafka1:9092,kafka2:9092` |
| `OUD_URL` | LDAP/OUD server URL | `ldap://oud-server:389` |
| `REDIS_CLUSTER_NODES` | Redis cluster nodes | `redis1:6379,redis2:6379` |
| `REDIS_JANUS` | Redis password | `********` |
| `LOGSTASH_URL` | Logstash destination | `logstash:5000` |
| `JKS_KEYSTORE_FILE` | Keystore file path | `/opt/keystore.jks` |
| `JKS_KEYSTORE_PWD` | Keystore password | `********` |
| `JKS_TRUSTSTORE_FILE` | Truststore file path | `/opt/truststore.jks` |
| `JKS_TRUSTSTORE_PWD` | Truststore password | `********` |
| `EDMI_OUD` | Kong OUD account | `svc_account` |
| `EDMI_OUD_PWD` | Kong OUD password | `********` |
| `KONG_APPLICATION_NAME` | Kong application name | `ratanone-auth` |
| `KONG_IAM_URL` | Kong IAM URL | `https://iam.example.com` |
| `KONG_TOKEN_ENDPOINT` | Kong token endpoint | `https://kong.example.com/oauth2/token` |
| `KONG_CLIENT_ID` | Kong client ID | `client-123` |
| `KONG_CLIENT_SEC` | Kong client secret | `********` |
| `KONG_CLIENT_ENDPOINT` | Kong client endpoint | `https://kong.example.com/clients` |
| `KONG_GATEWAY` | Kong gateway URL | `https://api.example.com` |
| `PCT2_ENDPOINT` | PCT2 endpoint | `https://pct2.example.com` |
| `RATAN_CIPHER_KEY` | Cipher key for encryption | `********` |
| `EMS2_HTTPS_HOST` | EMS2 HTTPS host | `https://ems2.example.com` |
| `EMS2_HOST` | EMS2 host | `https://ems2.example.com` |
| `FMAA_HOST` | FMAA host URL | `https://fmaa.example.com` |
| `FMAA_ACCOUNT` | FMAA account | `fmaa_svc` |
| `FMAA_JANUS` | FMAA password | `********` |
| `FMAA_CERT_PATH` | FMAA certificate path | `/opt/fmaa-cert.pem` |
| `ZIPKIN_SERVER_ENDPOINT` | Zipkin server URL | `https://zipkin.example.com:9411` |

### 7.2 Application Configuration

```yaml
# bootstrap.yml
spring:
  application:
    name: ratanone-auth-server

  data:
    redis:
      cluster:
        nodes: ${REDIS_CLUSTER_NODES}
      password: ${REDIS_JANUS}
      timeout: 30s

  ldap:
    urls: ${OUD_URL}

  kafka:
    bootstrap-servers: ${KAFKA_CLUSTER_BROKERS}

server:
  port: 8082

management:
  zipkin:
    tracing:
      endpoint: ${ZIPKIN_SERVER_ENDPOINT}
  tracing:
    sampling:
      probability: ${TRACING_SAMPLING_PROBABILITY:0.3}

ratanone:
  logging:
    logstash:
      destinations: ${LOGSTASH_URL}
```

---

## 8. Project Structure

```
services/auth-server/
├── app.conf                           # Application startup config
├── pom.xml                            # Maven dependencies
└── src/main/
    ├── assembly/
    │   └── assembly.xml               # Maven assembly configuration
    └── java/com/scb/auth/
        ├── Application.java           # Spring Boot entry point
        └── login/
            ├── configuration/
            │   ├── Ems2Configuration.java      # EMS2 client config
            │   └── OudConfiguration.java        # LDAP/OUD config
            ├── controller/
            │   ├── BaseController.java          # Common controller logic
            │   ├── LoginController.java         # /v1/* endpoints
            │   ├── AuthenticationController.java # /v3/* endpoints
            │   └── v2/
            │       └── V2LoginController.java  # /v2/* endpoints
            ├── dto/
            │   ├── AuthenticationResponseDto.java
            │   └── LoginResponseDto.java
            ├── entity/
            │   ├── AuthEntity.java             # Core auth response entity
            │   ├── OUDAuthResult.java          # LDAP auth result
            │   ├── UserInfo.java               # User information
            │   ├── ems2/                        # EMS2 entities
            │   └── ratan/                       # Domain entities
            ├── exceptions/                      # Custom exceptions
            ├── jwtparser/                       # JWT parsing utilities
            ├── mock/                            # Mock services (testing)
            ├── repo/                            # Repository layer
            ├── service/
            │   ├── LoginService.java            # Main login orchestration
            │   ├── OUDAuthBO.java               # LDAP authentication
            │   ├── FMAAAuthService.java         # FMAA OAuth2 validation
            │   ├── FmaaAuth.java                # FMAA client wrapper
            │   ├── KongGatewayAuthService.java  # Kong token acquisition
            │   ├── Ems2EntitlementService.java   # EMS2 entitlement fetch
            │   └── authentication/              # Authentication strategy
            └── util/                            # Utilities & constants
```

---

## 9. Key Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| `spring-boot-starter-web` | 3.3.7 | REST API framework |
| `spring-boot-starter-data-ldap` | 3.3.7 | LDAP/OUD integration |
| `spring-boot-starter-data-redis` | 3.3.7 | Redis integration |
| `ratanone-redis-spring-boot-starter` | 6.7.2 | Custom Redis utilities |
| `ratanone-hashicorp-integrator-spring-boot-starter` | 6.7.2 | HashiCorp Vault integration |
| `ratanone-service-tracing-spring-boot-starter` | 6.7.2 | Distributed tracing |
| `fmoportal-auth-sdk` | 1.1.1 | FMO Portal authentication |
| `fmaa-client` | 1.0 | FMAA OAuth2 client |
| `nimbus-jose-jwt` | 9.37.3 | JWT parsing & validation |
| `jasypt-spring-boot-starter` | - | Password encryption |
| `fastjson` | 2.0.38 | JSON processing |

---

## 10. Failure Modes & Resilience

| Dependency | Failure Mode | Impact | Mitigation |
|------------|--------------|--------|------------|
| **Redis** | Connection failure | Complete service outage | Circuit breaker, retry, cluster mode |
| **OUD/LDAP** | Connection failure | Login failures | Multiple LDAP URLs, timeout config |
| **EMS2** | Connection failure | No entitlements | Graceful degradation, cached data |
| **FMAA** | Connection failure | FMAA auth unavailable | Other auth methods still work |
| **Kong** | Connection failure | Kong auth unavailable | Other auth methods still work |
| **Vault** | Connection failure | Startup failure | Secrets caching, retry |
| **Kafka** | Connection failure | No event streaming | Non-blocking, auth continues |

---

## 11. Monitoring & Observability

### Health Endpoints
- `GET /actuator/health` - Application health status
- `GET /actuator/info` - Application information

### Metrics
- Request latency
- Authentication success/failure rates
- Redis connection pool status
- LDAP connection status
- External service call durations

### Tracing
- Distributed tracing via Zipkin
- 30% sampling rate by default
- Trace propagation across services

### Logging
- Structured JSON logging
- Logstash integration
- Request/response logging for audit

---

## 12. Scalability Considerations

- **Stateless Design:** Session data stored in Redis, allowing horizontal scaling
- **Redis Cluster:** Supports Redis cluster mode for high availability
- **External Secrets:** Vault integration allows secrets management across instances
- **Circuit Breakers:** Recommended for external service calls (EMS2, FMAA, Kong)
- **Rate Limiting:** Redis-backed rate limiting for OUD timeout protection

---

*Document generated: 2026-03-14*