# Single UI BFF (Backend for Frontend) - Detailed Analysis Document

## Executive Summary

**Application Name:** Single UI BFF (Backend for Frontend)
**Package:** `com.scb.sso.singleuibff`
**Purpose:** A Spring Boot backend service that serves as a Backend for Frontend (BFF) layer for a Single-SPA micro-frontend application. It handles authentication, authorization, and application configuration management.

**Primary Functions:**

1. User authentication via LDAP (OUD) or MFA (SSO)
2. User authorization and entitlement management via EMS2
3. JWT token management
4. Application tile/category/import map configuration administration
5. Analytics logging to Elasticsearch

---

## 1. REST API Controllers and Endpoints

### 1.1 JwtAuthenticationController (v2) - SSO Authentication

**File:** `controller/v2/JwtAuthenticationController.java`

| HTTP Method | Endpoint Path          | Purpose                          |
| ----------- | ---------------------- | -------------------------------- |
| POST        | `/v2/sso/login`        | User authentication (OUD or MFA) |
| POST        | `/v2/sso/validate`     | Validate JWT token               |
| POST        | `/v2/sso/extend`       | Extend JWT token validity        |
| POST        | `/v2/sso/refreshtoken` | Generate refresh token           |
| POST        | `/v2/sso/relogin`      | Re-login using refresh token     |
| POST        | `/v2/sso/logout`       | Invalidate user session          |

### 1.2 AnalyticsController (v1) - Analytics Management

**File:** `controller/v1/AnalyticsController.java`

| HTTP Method | Endpoint Path       | Purpose                                 |
| ----------- | ------------------- | --------------------------------------- |
| POST        | `/v1/fmo/print`     | Insert analytics event                  |
| POST        | `/v1/fmo/analytics` | Query analytics data from Elasticsearch |

### 1.3 ApplicationCategoryController (v1) - Category Administration

**File:** `controller/v1/ApplicationCategoryController.java`

| HTTP Method | Endpoint Path                   | Purpose                     |
| ----------- | ------------------------------- | --------------------------- |
| POST        | `/v1/fmo/admin/category/create` | Create application category |
| POST        | `/v1/fmo/admin/category/update` | Update application category |
| POST        | `/v1/fmo/admin/category/data`   | Get categories by EMS2 role |
| POST        | `/v1/fmo/admin/category/audit`  | Get category audit history  |

### 1.4 ApplicationTileController (v1) - Tile Administration

**File:** `controller/v1/ApplicationTileController.java`

| HTTP Method | Endpoint Path               | Purpose                 |
| ----------- | --------------------------- | ----------------------- |
| POST        | `/v1/fmo/admin/tile/create` | Create application tile |
| POST        | `/v1/fmo/admin/tile/update` | Update application tile |
| POST        | `/v1/fmo/admin/tile/data`   | Get tiles by EMS2 role  |
| POST        | `/v1/fmo/admin/tile/audit`  | Get tile audit history  |

### 1.5 ImportMapController (v1) - Import Map Administration

**File:** `controller/v1/ImportMapController.java`

| HTTP Method | Endpoint Path                    | Purpose                         |
| ----------- | -------------------------------- | ------------------------------- |
| GET         | `/v1/fmo/admin/importmap/active` | Get active import maps (public) |
| POST        | `/v1/fmo/admin/importmap/create` | Create import map entry         |
| POST        | `/v1/fmo/admin/importmap/update` | Update import map entry         |
| POST        | `/v1/fmo/admin/importmap/data`   | Get import maps by EMS2 role    |
| POST        | `/v1/fmo/admin/importmap/audit`  | Get import map audit history    |

### 1.6 ApplicationConfigController (v1) - Bulk Configuration Upload

**File:** `controller/v1/ApplicationConfigController.java`

| HTTP Method | Endpoint Path                 | Purpose                                  |
| ----------- | ----------------------------- | ---------------------------------------- |
| POST        | `/v1/fmo/admin/config/upload` | Bulk upload configurations via CSV files |

---

## 2. Execution Flow Analysis

### 2.1 POST `/v2/sso/login` - Authentication Flow

**Sequence Diagram:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           LOGIN FLOW                                         │
└─────────────────────────────────────────────────────────────────────────────┘

1. Controller receives RequestOfAuthenticate
   ├── username (String)
   ├── password (String)
   ├── code (String, optional - for SSO)
   ├── iss (String, optional - MFA issuer URL)
   ├── clientId (String, optional)
   └── hostName (from HttpServletRequest)

2. Decision: Is 'code' present?
   │
   ├─ NO (Normal Login) ──────────────────────────────────────────────────────┐
   │   │                                                                       │
   │   └─→ OUDAuthenticationService.authenticate()                             │
   │       │                                                                   │
   │       ├─ Check Whitelist Condition:                                       │
   │       │   IF (hostname in envList AND username in idList)                 │
   │       │   THEN:                                                           │
   │       │       getUserInfo(username) using service account                 │
   │       │       └─ No password validation required                          │
   │       │   ELSE:                                                           │
   │       │       Standard LDAP Authentication                                │
   │       │       ├─ Build DN: cn={username},ou=users,o=standardchartered     │
   │       │       ├─ ldapTemplate.getContextSource().getContext(userDn, pwd)   │
   │       │       ├─ Retrieve attributes via dirContext.getAttributes()       │
   │       │       └─ Map attributes to userInfo Map                           │
   │       │                                                                   │
   │       └─ Return Map<String, String> userInfo                              │
   │                                                                           │
   ├─ YES (SSO Login) ────────────────────────────────────────────────────────┐
   │   │                                                                       │
   │   └─→ MFAAuthenticationService.authenticate()                             │
   │       │                                                                   │
   │       ├─ Build OAuth2 Token Request:                                      │
   │       │   ├── Headers: Content-Type: application/x-www-form-urlencoded   │
   │       │   │           X-Cert: {MFA_CERT}                                 │
   │       │   └── Body: client_id, grant_type=authorization_code,            │
   │       │                code, redirect_uri                                 │
   │       │                                                                   │
   │       ├─ POST to {iss}/access_token                                       │
   │       │                                                                   │
   │       ├─ Parse ResponseMFA:                                               │
   │       │   └── Extract id_token (JWT)                                     │
   │       │                                                                   │
   │       ├─ Decode JWT and Extract Claims:                                   │
   │       │   ├── name → userId                                               │
   │       │   ├── given_name → firstName                                      │
   │       │   ├── family_name → lastName                                      │
   │       │   ├── full_name → fullName                                        │
   │       │   ├── email → emailId                                             │
   │       │   ├── locale → locale                                             │
   │       │   └── country → country                                           │
   │       │                                                                   │
   │       └─ Return Map<String, String> userInfo                              │
   │                                                                           │
   └───────────────────────────────────────────────────────────────────────────┘

3. Serialize OUD data to JSON string
   └── objectMapper.writeValueAsString(oud)

4. Call buildEntities(response, username, oudString, sessionId)
   │
   ├─→ ApplicationCategoryService.getDrawers()
   │       └── Query database for application categories with tiles
   │
   ├─→ Extract EMS2 entity names from categories
   │       └── Parse ems2_entities field (comma-separated)
   │
   ├─→ AuthorizationService.getEntitlements(userId, entities)
   │       │
   │       ├─ GET {EMS2_HOST}/ems2/rest/account/{userId}
   │       │       └── Returns Ems2RoleResult with entitlementTypes
   │       │
   │       ├─ Parse uniqueName format: "id|entityName|roleId|roleName|..."
   │       │
   │       ├─ POST {EMS2_HOST}/ems2/rest/entitlements/entitlementList
   │       │       └── Body: {"{userId}": ["Entity1", "Entity2", ...]}
   │       │       └── Returns EntitlementList with subjects and actions
   │       │
   │       └─ Return Ems2Result
   │
   ├─→ AdminModuleUtil.getDrawer(categories, entities)
   │       ├─ Build drawer structure from categories
   │       ├─ Filter tiles based on user entitlements
   │       │   ├─ Template tiles: always visible
   │       │   └─ Regular tiles: check entity + subject permissions
   │       └─ Return filtered drawers
   │
   ├─→ Generate JWT Tokens:
   │       ├─ entitlementsToken (12-hour expiry, issuer: ENTITLEMENT)
   │       │       └── Contains serialized entitlements map
   │       │
   │       └─ mainToken (configurable expiry, issuer: SINGLE-UI-BFF)
   │               └── Contains: sub, oud (JSON), sessionId
   │
   └─ Return Map with entities, token, entitlementsToken, drawers

5. Insert Analytics Event
   └── AnalyticService.insertData()
       ├── key: "button"
       ├── event: "click"
       ├── container: "Base"
       ├── tile: "Login"
       ├── name: "normal login" | "sso login"
       ├── username
       └── IP address

6. Clear JSESSIONID Cookie
   └── Set cookie with maxAge=0, HttpOnly, Secure, SameSite=Strict

7. Return ResponseOfAuthenticate:
   ├── result: true
   ├── token: JWT token
   ├── entitlementsToken: JWT with entitlements
   ├── oud: JSON string of user info
   ├── entities: List<Entity>
   ├── drawers: List<Map> (filtered application tiles)
   └── userInfo: JSON string from token payload
```

---

### 2.2 POST `/v2/sso/validate` - Token Validation Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        TOKEN VALIDATION FLOW                                 │
└─────────────────────────────────────────────────────────────────────────────┘

1. Extract JWT from Authorization header
   └── Format: "Bearer {token}"

2. JwtTokenUtil.validateToken()
   ├─ Verify RSA512 signature using public key
   ├─ Check expiration (exp claim)
   └─ Check absolute idle timeout (absolute_idle claim)
       └── IF current time > absolute_idle → throw exception

3. Verify issuer matches JWT_ISSUER ("SINGLE-UI-BFF")
   └── handleIssuer(token, JWT_ISSUER)

4. Extract session ID from token payload
   └── Parse JSON payload, get "sessionId" field

5. SessionService.validateSession(sessionId)
   └─ Check session exists in ApplicationSession table

6. Rebuild entities and drawers
   └─ Same process as login (steps 4-5 in login flow)

7. Generate new entitlementsToken

8. Clear JSESSIONID cookie

9. Return ResponseOfAuthenticate:
   ├── result: true
   ├── entitlementsToken: (new token)
   ├── oud: (from original token)
   ├── entities: (refreshed)
   ├── drawers: (refreshed)
   ├── userInfo: (from token)
   └── expiration: Date
```

---

### 2.3 POST `/v2/sso/extend` - Token Extension Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        TOKEN EXTENSION FLOW                                  │
└─────────────────────────────────────────────────────────────────────────────┘

1. Validate existing token (same as validate flow)

2. Verify issuer is JWT_ISSUER

3. Validate session

4. Extract payload from token

5. Remove exp and iat claims from payload

6. Generate new token with updated expiration
   │
   ├─ Calculate new expiration: now + tokenExpiration (minutes)
   │
   ├─ Calculate max age: from absolute_idle claim
   │
   └─ Decision: Does new expiration exceed absolute timeout?
       │
       ├─ YES → Generate token with fresh auth_time
       │        └── doGenerateTokenWithAuthTime()
       │            └── Resets idle timeout window
       │
       └─ NO → Generate standard extended token
                └── generateToken()

7. Set new token in response header
   └── Header: "x-token: Bearer {newToken}"

8. Return ResponseOfAuthenticate:
   ├── result: true
   └── expiration: Date
```

---

### 2.4 POST `/v2/sso/refreshtoken` - Refresh Token Generation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      REFRESH TOKEN GENERATION FLOW                           │
└─────────────────────────────────────────────────────────────────────────────┘

1. Validate existing token

2. Verify issuer is JWT_ISSUER

3. Validate session

4. Extract user info from token payload
   ├── sub (username)
   ├── oud (user data JSON)
   └── sessionId

5. Generate refresh token
   ├─ Expiration: now + reTokenExpiration (minutes, typically 1440 = 24h)
   └─ Issuer: JWT_ISSUER_REFRESH ("SINGLE-UI-BFF-REFRESH")

6. Set refresh token in response header
   └── Header: "x-refresh-token: Bearer {refreshToken}"

7. Return ResponseOfAuthenticate:
   ├── result: true
   └── expiration: Date
```

---

### 2.5 POST `/v2/sso/relogin` - Re-login with Refresh Token

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      RE-LOGIN FLOW (Refresh Token)                           │
└─────────────────────────────────────────────────────────────────────────────┘

1. Extract refresh token from request header
   └── Header: "x-refresh-token"

2. Validate refresh token
   └── Check signature, expiration

3. Verify issuer is JWT_ISSUER_REFRESH

4. Validate session from token payload

5. Extract user info from token
   ├── username
   ├── oud (JSON string)
   └── sessionId

6. Rebuild entities and drawers
   └─ Same as login flow

7. Generate new main token and entitlementsToken

8. Return ResponseOfAuthenticate:
   ├── result: true
   ├── entitlementsToken: (new)
   ├── oud: (from refresh token)
   ├── entities: (refreshed)
   ├── drawers: (refreshed)
   └── userInfo: (from new token)
```

---

### 2.6 POST `/v2/sso/logout` - Logout Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           LOGOUT FLOW                                        │
└─────────────────────────────────────────────────────────────────────────────┘

1. Extract JWT from request body

2. Extract session ID from token payload

3. SessionService.create(sessionId)
   └─ Create/invalidate session record

4. Invalidate HTTP session
   └── httpSession.invalidate()

5. Clear JSESSIONID cookie

6. Clear token in response header
   └── Set "x-token" to empty string

7. Return ResponseOfAuthenticate:
   └── result: true
```

---

### 2.7 POST `/v1/fmo/admin/config/upload` - Bulk Configuration Upload

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    BULK CONFIGURATION UPLOAD FLOW                            │
└─────────────────────────────────────────────────────────────────────────────┘

1. Receive multipart form data:
   ├── fmaa_access_token (String)
   ├── moduleMap (MultipartFile - CSV)
   ├── category (MultipartFile - CSV)
   └── tile (MultipartFile - CSV)

2. Validate FMAA access token
   └── ApplicationConfigService.getAppId(jwt)
       │
       ├─ GET {FMAA_HOST}/introspect?app_id=FMO_PORTAL&access_token={jwt}
       │
       └─ Return FmaaResult
           ├── userId
           └── active: "true" | "false"

3. Verify FMAA user is active
   └── IF active != "true" → throw exception

4. Validate CSV file formats
   └── CsvUtility.hasCsvFormat() for each file

5. Parse CSV Files:

   a. moduleMap.csv → List<ImportMapConfig>
      └── Fields: importMapId, keyName, path, active, ems2Role

   b. category.csv → List<ApplicationCategoryConfig>
      └── Fields: applicationCategoryId, label, orderNo, active, ems2Role

   c. tile.csv → List<ApplicationTileConfig>
      └── Fields: applicationTileId, title, subtitle, module, tile,
                   imageDarkTheme, imageLightTheme, ems2Entities,
                   ems2Subject, emailSupport, isTemplate, active,
                   orderNo, importMapId, applicationCategoryId, ems2Role

6. Process Import Maps (handleImportMap):
   │
   FOR EACH ImportMapConfig:
   │
   ├─ Check if ImportMap exists by ID
   │   └── importMapService.getById(importMapId)
   │
   ├─ Decision: Record exists?
   │   │
   │   ├─ NO → Create new ImportMap
   │   │        └── Set result: "RECORD_CREATED"
   │   │
   │   └─ YES → Verify EMS2 role matches
   │            └── IF mismatch → throw access denied exception
   │
   ├─ Update record fields:
   │   ├── path
   │   ├── keyName
   │   ├── active
   │   ├── updatedAt: now()
   │   └── updatedBy: "FMO_PORTAL_SERVICE"
   │
   └─ Create audit record (ImportMapAudit)
       └── transactionMode: "FMO_PORTAL_SERVICE"

7. Process Categories (handleApplicationCategory):
   │
   FOR EACH ApplicationCategoryConfig:
   │
   ├─ Same create/update logic as ImportMaps
   │
   └─ Create audit record (ApplicationCategoryAudit)

8. Process Tiles (handleApplicationTile):
   │
   FOR EACH ApplicationTileConfig:
   │
   ├─ Find referenced ImportMap by ID
   │   └── IF not found → throw exception
   │
   ├─ Find referenced ApplicationCategory by ID
   │   └── IF not found → throw exception
   │
   ├─ Create or update tile record
   │
   └─ Create audit record (ApplicationTileAudit)

9. Save all records to database
   ├── importMapService.saveAll()
   ├── importMapAuditService.saveAll()
   ├── applicationCategoryService.saveAll()
   ├── applicationCategoryAuditService.saveAll()
   ├── applicationTileService.saveAll()
   └── applicationTileAuditService.saveAll()

10. Return ResponseOfBulkAuth:
    ├── result: true
    └── data: {
          importMaps: [...],
          applicationCategories: [...],
          applicationTiles: [...]
        }
```

---

### 2.8 Admin Module CRUD Operations (Tile/Category/ImportMap)

**Maker-Checker Pattern Flow:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MAKER-CHECKER WORKFLOW                                    │
└─────────────────────────────────────────────────────────────────────────────┘

1. Validate Request
   └── AdminModuleUtil.validate(request, entitlementsToken)
       │
       ├─ Extract JWT from x-token header
       ├─ Validate JWT signature and expiration
       ├─ Verify issuer is JWT_ISSUER
       │
       ├─ Validate entitlementsToken
       │   └─ Verify issuer is JWT_ISSUER_ENTITLEMENT
       │
       ├─ Extract EMS2 Role from entitlements
       │   └─ Find role starting with "FMO PORTAL ADMIN"
       │
       ├─ Validate session
       │
       └─ Return payload with ems2Role

2. Retrieve existing record (for update)
   └─ Verify record exists

3. Verify EMS2 Role Access
   └─ IF record.ems2Role != user.ems2Role → throw access denied

4. Process based on mode:

   a. mode = "checker" (Approval)
      │
      ├─ Check record is inactive (pending approval)
      │
      ├─ Verify maker != checker
      │   └─ IF updatedBy == currentUser → throw exception
      │
      └─ Set record.active = true

   b. mode = "deactivate"
      └─ Set record.active = false

   c. mode = "maker" (Create/Update)
      ├─ Update record fields
      └─ Set record.active = false (pending approval)

5. Update audit fields:
   ├── updatedAt: new Date()
   └── updatedBy: username

6. Save record to database

7. Create audit record
   └── Include transactionMode

8. Return ResponseOfAdminModule:
   ├── result: true
   └── data: updated record
```

---

## 3. Key Data Entities and Fields

### 3.1 Core Entities

#### ApplicationTile

| Field               | Type                | Description                               |
| ------------------- | ------------------- | ----------------------------------------- |
| applicationTileId   | Long                | Primary key (auto-generated)              |
| title               | String              | Display title                             |
| subtitle            | String              | Secondary text                            |
| module              | String              | Module path (e.g., "/apps/tile/src/main") |
| tile                | String              | Tile path (e.g., "/src/main")             |
| imageDarkTheme      | String              | Dark theme icon URL                       |
| imageLightTheme     | String              | Light theme icon URL                      |
| ems2Entities        | String              | Comma-separated EMS2 entity names         |
| ems2Subject         | String              | EMS2 subject name for filtering           |
| emailSupport        | String              | Support email                             |
| isTemplate          | boolean             | Whether tile is a template                |
| orderNo             | int                 | Display order                             |
| ems2Role            | String              | Role assignment for RBAC                  |
| applicationCategory | ApplicationCategory | Parent category (FK)                      |
| importMap           | ImportMap           | Associated import map (FK)                |
| isActive            | boolean             | Record status                             |
| createdBy           | String              | Creator username                          |
| updatedBy           | String              | Last modifier username                    |
| createdAt           | Date                | Creation timestamp                        |
| updatedAt           | Date                | Last modification timestamp               |

#### ApplicationCategory

| Field                 | Type    | Description           |
| --------------------- | ------- | --------------------- |
| applicationCategoryId | Long    | Primary key           |
| label                 | String  | Category display name |
| orderNo               | int     | Display order         |
| ems2Role              | String  | Role assignment       |
| isActive              | boolean | Record status         |
| createdBy/updatedBy   | String  | Audit fields          |
| createdAt/updatedAt   | Date    | Timestamps            |

#### ImportMap

| Field               | Type    | Description                              |
| ------------------- | ------- | ---------------------------------------- |
| importMapId         | Long    | Primary key                              |
| keyName             | String  | Module key (e.g., "react", "single-spa") |
| path                | String  | Module URL                               |
| ems2Role            | String  | Role assignment                          |
| isActive            | boolean | Record status                            |
| createdBy/updatedBy | String  | Audit fields                             |
| createdAt/updatedAt | Date    | Timestamps                               |

#### ApplicationSession

| Field     | Type   | Description          |
| --------- | ------ | -------------------- |
| sessionId | String | Primary key          |
| userData  | String | Serialized user data |

#### Audit Entities (ApplicationTileAudit, ApplicationCategoryAudit, ImportMapAudit)

Mirror the main entity fields plus:
| Field | Type | Description |
|-------|------|-------------|
| transactionMode | String | Operation type: "create", "update", "checker", "deactivate" |

---

### 3.2 Request DTOs

#### RequestOfAuthenticate

| Field    | Type   | Required    | Description                                      |
| -------- | ------ | ----------- | ------------------------------------------------ |
| username | String | Yes         | User identifier                                  |
| password | String | Conditional | LDAP password (required for OUD auth)            |
| code     | String | Conditional | OAuth authorization code (required for MFA auth) |
| iss      | String | Conditional | MFA issuer URL                                   |
| clientId | String | Conditional | OAuth client ID                                  |
| hostName | String | No          | Set from request server name                     |

#### RequestOfJWT

| Field                 | Type   | Description                     |
| --------------------- | ------ | ------------------------------- |
| singleUIAuthorization | String | JWT token with "Bearer " prefix |

#### RequestOfApplicationTile / RequestOfApplicationCategory / RequestOfImportMap

| Field             | Type   | Description                              |
| ----------------- | ------ | ---------------------------------------- |
| entitlementsToken | String | JWT with user entitlements               |
| mode              | String | "checker", "deactivate", or maker update |
| (entity fields)   | ...    | Same as entity fields                    |

---

### 3.3 Response DTOs

#### ResponseOfAuthenticate

| Field             | Type         | Description                                    |
| ----------------- | ------------ | ---------------------------------------------- |
| result            | boolean      | Success indicator                              |
| token             | String       | JWT access token                               |
| entitlementsToken | String       | JWT with serialized entitlements               |
| oud               | String       | JSON string of user profile                    |
| entities          | List<Entity> | EMS2 authorization entities                    |
| drawers           | List<Map>    | Filtered application tiles grouped by category |
| userInfo          | String       | JSON string from token payload                 |
| expiration        | Date         | Token expiration                               |
| errorMessage      | String       | Error description (if failed)                  |

#### ResponseOfAdminModule

| Field        | Type    | Description               |
| ------------ | ------- | ------------------------- |
| result       | boolean | Success indicator         |
| data         | Object  | Record or list of records |
| errorMessage | String  | Error description         |

#### ResponseOfAnalytics

| Field        | Type         | Description       |
| ------------ | ------------ | ----------------- |
| result       | boolean      | Success indicator |
| data         | List<Object> | Query results     |
| total        | Map          | Total count info  |
| errorMessage | String       | Error description |

---

## 4. External System Interactions

### 4.1 OUD (Oracle Unified Directory) - LDAP Authentication

| Aspect              | Details                                                        |
| ------------------- | -------------------------------------------------------------- |
| **Purpose**         | User authentication and profile retrieval                      |
| **Protocol**        | LDAP (via Spring LdapTemplate)                                 |
| **Configuration**   | `spring.ldap.urls: ${OUD_URL}`                                 |
| **DN Pattern**      | `cn={username},ou=users,o=standardchartered`                   |
| **Service Account** | `auth.oud.un`, `auth.oud.pw`, `auth.oud.id` (Jasypt encrypted) |
| **Timeouts**        | Default LDAP connection timeouts                               |

**Attributes Retrieved:**

```
uid, cn, givenName, fullName, sn, mail, preferredLocale,
co, title, description, psEmplStatus
```

**Implementation Class:** `OUDAuthenticationService.java`

**Error Handling:**

- Authentication failure → `AuthenticationException` with code `OUD_RELATED_CODE`
- Message: "Invalid username and password combination."

**Decision Logic:**

```java
IF (hostname in whitelistedEnvironments AND username in whitelistedIds) THEN
    // Bypass password check
    Use service account to retrieve user attributes
ELSE
    // Standard LDAP bind
    Authenticate with user's DN and password
END IF
```

---

### 4.2 EMS2 (Enterprise Management System 2) - Authorization

| Aspect           | Details                                              |
| ---------------- | ---------------------------------------------------- |
| **Purpose**      | Role-based access control and entitlement management |
| **Protocol**     | REST (JSON over HTTP)                                |
| **Host**         | `${EMS2_HTTPS_HOST}`                                 |
| **Timeouts**     | connectTimeout: 5s, readTimeout: 5s                  |
| **Admin Entity** | `FMO PORTAL ADMIN`                                   |

**Implementation Class:** `EMS2AuthorizationImplementation.java`

#### API Endpoints:

**1. Get User Roles (GET)**

```
URL: {EMS2_HOST}/ems2/rest/account/{userId}
Method: GET
Response: Ems2RoleResult
```

**Response Structure:**

```json
{
  "accountName": "...",
  "fullName": "...",
  "accountOwner": "...",
  "accountType": "...",
  "accountStatus": "...",
  "entitlementTypes": [
    {
      "uniqueName": "123|EntityName|456|RoleName|...",
      "applicationName": "..."
    }
  ]
}
```

**2. Get Entitlements (POST)**

```
URL: {EMS2_HOST}/ems2/rest/entitlements/entitlementList
Method: POST
Content-Type: application/json
Body: {"userId": ["Entity1", "Entity2", ...]}
Response: EntitlementList
```

**Response Structure:**

```json
{
  "userId": {
    "count": 5,
    "entitlements": [
      {
        "id": 789,
        "role": { "id": 456, "name": "RoleName" },
        "subject": { "id": 111, "name": "SUBJECT", "longName": "Subject Display Name" },
        "action": { "id": 222, "name": "ACTION_NAME" }
      }
    ]
  }
}
```

**Error Handling:**

- Returns empty result (`new Ems2RoleResult()`) on failure
- Logs error but continues with degraded functionality
- Empty entitlements = no tiles visible to user

---

### 4.3 FMAA (Federation Management and Authentication Application) - Token Verification

| Aspect       | Details                                                 |
| ------------ | ------------------------------------------------------- |
| **Purpose**  | Verify FMAA access tokens for bulk upload authorization |
| **Protocol** | REST (HTTP GET)                                         |
| **Host**     | `${FMAA_HOST}`                                          |
| **Timeouts** | connectTimeout: 5s, readTimeout: 5s                     |
| **App ID**   | `FMO_PORTAL`                                            |

**Implementation Class:** `ApplicationConfigServiceImpl.java`

**API Endpoint:**

```
URL: {FMAA_HOST}/introspect?app_id=FMO_PORTAL&access_token={jwt}
Method: GET
Response: FmaaResult
```

**Response Structure:**

```json
{
  "userId": "user123",
  "active": "true"
}
```

**Error Handling:**

- On exception, returns `FmaaResult` with `active="false"`
- Request rejected if `active != "true"`

---

### 4.4 MFA (Multi-Factor Authentication) - SSO Login

| Aspect           | Details                                      |
| ---------------- | -------------------------------------------- |
| **Purpose**      | OAuth2 token exchange for SSO authentication |
| **Protocol**     | REST (form-urlencoded POST)                  |
| **Headers**      | `X-Cert: ${MFA_CERT}`                        |
| **Grant Type**   | `authorization_code`                         |
| **Redirect URI** | `${MFA_REDIRECT_URI}`                        |

**Implementation Class:** `MFAAuthenticationService.java`

**API Endpoint:**

```
URL: {iss}/access_token
Method: POST
Content-Type: application/x-www-form-urlencoded
Body: client_id={clientId}&grant_type=authorization_code&code={code}&redirect_uri={redirectUri}
Headers: X-Cert: {MFA_CERT}
Response: ResponseMFA
```

**Response Structure:**

```json
{
  "id_token": "eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9...",
  "access_token": "...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

**JWT Claims Extracted:**
| Claim | Maps To |
|-------|---------|
| name | userId |
| given_name | firstName |
| family_name | lastName |
| full_name | fullName |
| email | emailId |
| locale | locale |
| country | country |

**Error Handling:**

- Returns `AuthenticationException` with code `MFA_RELATED_CODE`
- Message: "MFA authenticate failed."

---

### 4.5 Elasticsearch - Analytics Storage

| Aspect       | Details                                                |
| ------------ | ------------------------------------------------------ |
| **Purpose**  | Store and query user interaction analytics             |
| **Protocol** | REST (HTTP)                                            |
| **Host**     | `${ELASTIC_HOST}`                                      |
| **Auth**     | API Key: `${ELASTIC_API_KEY}` / `${ELASTIC_API_VALUE}` |
| **Timeouts** | connectTimeout: 1s, readTimeout: 1s                    |

**Implementation Class:** `Elasticsearch.java`

**Operations:**

**1. Insert Analytics**

```json
POST {ELASTIC_HOST}/{index}/_doc
Headers:
  Authorization: ApiKey {key}:{value}
Body:
{
  "key": "button",
  "event": "click",
  "container": "Base",
  "tile": "Login",
  "name": "normal login",
  "username": "user123",
  "ip": "192.168.1.1",
  "@timestamp": "2026-03-08T10:00:00Z"
}
```

**2. Query Analytics**

```json
POST {ELASTIC_HOST}/{index}/_search
Body:
{
  "from": 0,
  "size": 10,
  "query": {
    "bool": {
      "must": [...]
    }
  }
}
```

---

## 5. Decision Points and Conditional Logic

### 5.1 Authentication Path Selection

```java
// JwtAuthenticationController.authenticate()

if (StringUtils.isBlank(request.getCode())) {
    // Path A: Normal LDAP authentication
    oud = oudAuthenticationService.authenticate(request);
} else {
    // Path B: MFA/SSO authentication
    oud = mfaAuthenticationService.authenticate(request);
}
```

**Flowchart:**

```
           ┌─────────────┐
           │   Request   │
           └──────┬──────┘
                  │
                  ▼
         ┌────────────────┐
         │ code present?  │
         └───────┬────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
   ┌─────────┐       ┌─────────┐
   │   NO    │       │   YES   │
   │  OUD    │       │   MFA   │
   │  Auth   │       │  Auth   │
   └─────────┘       └─────────┘
```

---

### 5.2 Whitelist Bypass Logic

```java
// OUDAuthenticationService.authenticate()

if (Objects.nonNull(envs) && !envs.isEmpty() &&
    Objects.nonNull(ids) && !ids.isEmpty() &&
    Objects.nonNull(request.getHostName()) &&
    envs.contains(request.getHostName()) &&
    ids.contains(request.getUsername())) {

    // Whitelisted user on whitelisted host
    // → Use service account, no password check
    userInfo = getUserInfo(request.getUsername());

} else {
    // Standard authentication
    // → LDAP bind with user credentials
    String userDn = "cn=" + username + ",ou=users,o=standardchartered";
    dirContext = ldapTemplate.getContextSource().getContext(userDn, password);
    userInfo = oudUtil.getOudData(dirContext.getAttributes(userDn));
}
```

**Configuration:**

```yaml
auth:
  whitelisted:
    idList:
      - 1490627
      - 1632320
      # ... more IDs
    envList:
      - localhost
      - 10.198.199.160 # dev
      - uklvadapp1341.uk.dev.net # uat
```

---

### 5.3 Maker-Checker Pattern

```java
// ApplicationTileController.update()

if (!applicationTile.isActive() && mode.equalsIgnoreCase("checker")) {
    // Approval path
    if (applicationTile.getUpdatedBy().equalsIgnoreCase(userName)) {
        throw RecordNotUpdatedException.builder()
            .message("Maker and Checker should be different user.")
            .build();
    }
    applicationTile.setActive(true);  // Approve

} else if (mode.equalsIgnoreCase("deactivate")) {
    // Deactivation path
    applicationTile.setActive(false);

} else {
    // Maker update path
    applicationTile.setActive(false);  // Set pending approval
    // ... update fields
}
```

**Workflow Diagram:**

```
┌──────────┐     create/update      ┌───────────┐
│  MAKER   │ ──────────────────────→│  INACTIVE │
└──────────┘                         └─────┬─────┘
                                           │
                                           │ checker approves
                                           │ (different user)
                                           ▼
                                     ┌───────────┐
                                     │  ACTIVE   │
                                     └─────┬─────┘
                                           │
                                           │ deactivate
                                           ▼
                                     ┌───────────┐
                                     │ INACTIVE  │
                                     └───────────┘
```

---

### 5.4 Token Extension vs Re-authentication

```java
// JwtAuthenticationController.extend()

Date newExpirationDate = jwtTokenUtil.getExpirationDate(newJwtToken);
Date maxAge = jwtTokenUtil.getMaxAge(newJwtToken);

if (Objects.nonNull(maxAge) && newExpirationDate.after(maxAge)) {
    // Absolute timeout reached - need fresh token with new auth_time
    newJwtToken = jwtTokenUtil.doGenerateTokenWithAuthTime(userName, payload);
}
```

**Token Lifecycle:**

```
┌─────────────────────────────────────────────────────────────────┐
│                        TOKEN TIMELINE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Login Time        Token Expiry       Absolute Idle Timeout     │
│      │                 │                      │                  │
│      ▼                 ▼                      ▼                  │
│      ├─────────────────┼──────────────────────┤                  │
│      │                 │                      │                  │
│      │  15 min         │   60 min total       │                  │
│      │  (configurable) │   (configurable)     │                  │
│      │                 │                      │                  │
│      ▼                 ▼                      ▼                  │
│  ────┬─────────────────┬──────────────────────┬───────→ time    │
│      │                 │                      │                  │
│      │   can extend    │   can extend         │   cannot extend  │
│      │   normally      │   (fresh token)      │   (must relogin) │
│      │                 │                      │                  │
└─────────────────────────────────────────────────────────────────┘
```

---

### 5.5 Tile Filtering by Entitlements

```java
// AdminModuleUtil.filterDrawers()

for (Map<String, Object> tile : tiles) {
    boolean isTemplate = (boolean) tile.get("isTemplate");

    if (isTemplate) {
        // Templates always visible
        newTiles.add(tile);
    } else {
        String[] entitiesDrawer = (String[]) tile.get("entity");
        String subject = (String) tile.get("subject");

        for (Entity entity1 : entities) {
            if (Arrays.asList(entitiesDrawer).contains(entity1.getName())) {
                // User has entity permission
                if (StringUtils.isBlank(subject)) {
                    // No subject filter - show tile
                    newTiles.add(tile);
                } else {
                    // Check subject permission
                    List<Subject> subjects = entity1.getSubjects().stream()
                        .filter(s -> s.getLongName().equalsIgnoreCase(subject)
                                  || s.getName().equalsIgnoreCase(subject))
                        .collect(Collectors.toList());

                    if (subjects.size() > 0) {
                        newTiles.add(tile);
                    }
                }
            }
        }
    }
}
```

---

## 6. JWT Token Structure

### 6.1 Main Access Token

**Header:**

```json
{
  "alg": "RS512",
  "typ": "JWT"
}
```

**Payload:**

```json
{
  "iss": "SINGLE-UI-BFF",
  "sub": "username",
  "iat": 1678262400,
  "exp": 1678263300,
  "jti": "jwt-id",
  "oud": "{\"userId\":\"...\",\"firstName\":\"...\",\"emailId\":\"...\"}",
  "sessionId": "session-uuid",
  "user_login_time": 1678262400,
  "absolute_idle": 1678266000
}
```

### 6.2 Refresh Token

**Payload:**

```json
{
  "iss": "SINGLE-UI-BFF-REFRESH",
  "sub": "username",
  "iat": 1678262400,
  "exp": 1678348800,
  "jti": "jwt-id",
  "oud": "{...user info...}",
  "sessionId": "session-uuid"
}
```

### 6.3 Entitlements Token

**Payload:**

```json
{
  "iss": "SINGLE-UI-BFF-ENTITLEMENT",
  "sub": "username",
  "iat": 1678262400,
  "exp": 1678305600,
  "jti": "jwt-id",
  "entitlements": "{\"Entity1:RoleName\":{\"Subject1\":[\"Action1\",\"Action2\"]},...}"
}
```

---

## 7. Summary

### 7.1 Application Purpose

Single UI BFF is a Backend for Frontend service that:

1. **Authentication Gateway**
   - Supports LDAP (OUD) for standard username/password authentication
   - Supports MFA/SSO via OAuth2 authorization code flow
   - Manages JWT tokens with configurable expiration and idle timeout

2. **Authorization Layer**
   - Integrates with EMS2 for role-based access control
   - Filters application tiles based on user entitlements
   - Implements entity/subject/action permission model

3. **Configuration Management**
   - CRUD operations for application tiles, categories, and import maps
   - Maker-checker workflow for approval process
   - Bulk upload via CSV files

4. **Analytics**
   - Logs user interactions to Elasticsearch
   - Query interface for analytics data

---

### 7.2 External System Dependencies

| System            | Purpose                           | Protocol    | Criticality | Fallback                      |
| ----------------- | --------------------------------- | ----------- | ----------- | ----------------------------- |
| **OUD**           | User authentication, profile data | LDAP        | Critical    | None                          |
| **EMS2**          | Authorization, entitlements       | REST        | Critical    | Empty entitlements (no tiles) |
| **FMAA**          | Token verification for bulk ops   | REST        | Medium      | Reject upload                 |
| **MFA**           | SSO authentication                | REST/OAuth2 | Medium      | OUD fallback                  |
| **Elasticsearch** | Analytics storage                 | REST        | Low         | Skip analytics                |
| **PostgreSQL**    | Application data persistence      | JDBC        | Critical    | None                          |

---

### 7.3 Endpoint-External System Mapping

| Endpoint                           | OUD | EMS2 | FMAA | MFA | Elasticsearch | PostgreSQL |
| ---------------------------------- | :-: | :--: | :--: | :-: | :-----------: | :--------: |
| POST /v2/sso/login                 |  ✓  |  ✓   |  -   | ✓\* |       ✓       |     ✓      |
| POST /v2/sso/validate              |  -  |  ✓   |  -   |  -  |       -       |     ✓      |
| POST /v2/sso/extend                |  -  |  -   |  -   |  -  |       -       |     ✓      |
| POST /v2/sso/refreshtoken          |  -  |  -   |  -   |  -  |       -       |     ✓      |
| POST /v2/sso/relogin               |  -  |  ✓   |  -   |  -  |       -       |     ✓      |
| POST /v2/sso/logout                |  -  |  -   |  -   |  -  |       -       |     ✓      |
| POST /v1/fmo/admin/category/\*     |  -  |  -   |  -   |  -  |       -       |     ✓      |
| POST /v1/fmo/admin/tile/\*         |  -  |  -   |  -   |  -  |       -       |     ✓      |
| POST /v1/fmo/admin/importmap/\*    |  -  |  -   |  -   |  -  |       -       |     ✓      |
| GET /v1/fmo/admin/importmap/active |  -  |  -   |  -   |  -  |       -       |     ✓      |
| POST /v1/fmo/admin/config/upload   |  -  |  -   |  ✓   |  -  |       -       |     ✓      |
| POST /v1/fmo/print                 |  -  |  -   |  -   |  -  |       ✓       |     -      |
| POST /v1/fmo/analytics             |  -  |  -   |  -   |  -  |       ✓       |     -      |

\*Only when `code` parameter is provided (SSO flow)

---

### 7.4 Configuration Properties

| Property                      | Description                     | Default            |
| ----------------------------- | ------------------------------- | ------------------ |
| `jwt.token-expiration`        | Access token expiry (minutes)   | 15                 |
| `jwt.re-token-expiration`     | Refresh token expiry (minutes)  | 225                |
| `jwt.absolute-expiration`     | Absolute idle timeout (minutes) | 60                 |
| `scb.ems2.connectTimeout`     | EMS2 connection timeout         | 5s                 |
| `scb.ems2.readTimeout`        | EMS2 read timeout               | 5s                 |
| `scb.fmaa.connectTimeout`     | FMAA connection timeout         | 5s                 |
| `scb.fmaa.readTimeout`        | FMAA read timeout               | 5s                 |
| `auth.elastic.connectTimeout` | Elasticsearch connect timeout   | 1s                 |
| `auth.elastic.readTimeout`    | Elasticsearch read timeout      | 1s                 |
| `scb.ems2.adminModuleEntity`  | Admin module entity name        | "FMO PORTAL ADMIN" |

---

## 8. Error Handling

### 8.1 Exception Types

| Exception                   | HTTP Status | Scenario                      |
| --------------------------- | ----------- | ----------------------------- |
| `AuthenticationException`   | 400         | Invalid credentials (OUD/MFA) |
| `JwtException`              | 401         | Invalid/expired token         |
| `RecordNotFoundException`   | 400         | Record not found in database  |
| `RecordNotCreatedException` | 400         | Failed to create record       |
| `RecordNotUpdatedException` | 400         | Failed to update record       |
| `NoSuchElementException`    | 400         | Required data not found       |

### 8.2 Error Response Format

```json
{
  "result": false,
  "errorMessage": "TOKEN_INVALID_EXPIRED - token validation failed."
}
```

---

This document provides the complete logic and flow analysis needed to create detailed flowcharts for the Single UI BFF application.
