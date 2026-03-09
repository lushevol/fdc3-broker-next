Single UI BFF (Backend for Frontend) - Detailed Analysis Document

Executive Summary

Application Name: Single UI BFF (Backend for Frontend)
Purpose: A Spring Boot backend service that serves as a Backend for Frontend (BFF) layer for a Single-SPA micro-frontend application. It handles authentication, authorization, and application
configuration management.

Primary Functions:

1. User authentication via LDAP (OUD) or MFA (SSO)
2. User authorization and entitlement management via EMS2
3. JWT token management
4. Application tile/category/import map configuration administration
5. Analytics logging to Elasticsearch

---

1. REST API Controllers and Endpoints

1.1 JwtAuthenticationController (v2) - SSO Authentication

┌─────────────┬──────────────────────┬──────────────────────────────────┐
│ HTTP Method │ Endpoint Path │ Purpose │
├─────────────┼──────────────────────┼──────────────────────────────────┤
│ POST │ /v2/sso/login │ User authentication (OUD or MFA) │
├─────────────┼──────────────────────┼──────────────────────────────────┤
│ POST │ /v2/sso/validate │ Validate JWT token │
├─────────────┼──────────────────────┼──────────────────────────────────┤
│ POST │ /v2/sso/extend │ Extend JWT token validity │
├─────────────┼──────────────────────┼──────────────────────────────────┤
│ POST │ /v2/sso/refreshtoken │ Generate refresh token │
├─────────────┼──────────────────────┼──────────────────────────────────┤
│ POST │ /v2/sso/relogin │ Re-login using refresh token │
├─────────────┼──────────────────────┼──────────────────────────────────┤
│ POST │ /v2/sso/logout │ Invalidate user session │
└─────────────┴──────────────────────┴──────────────────────────────────┘

1.2 AnalyticsController (v1) - Analytics Management

┌─────────────┬───────────────────┬─────────────────────────────────────────┐
│ HTTP Method │ Endpoint Path │ Purpose │
├─────────────┼───────────────────┼─────────────────────────────────────────┤
│ POST │ /v1/fmo/print │ Insert analytics event │
├─────────────┼───────────────────┼─────────────────────────────────────────┤
│ POST │ /v1/fmo/analytics │ Query analytics data from Elasticsearch │
└─────────────┴───────────────────┴─────────────────────────────────────────┘

1.3 ApplicationCategoryController (v1) - Category Administration

┌─────────────┬───────────────────────────────┬─────────────────────────────┐
│ HTTP Method │ Endpoint Path │ Purpose │
├─────────────┼───────────────────────────────┼─────────────────────────────┤
│ POST │ /v1/fmo/admin/category/create │ Create application category │
├─────────────┼───────────────────────────────┼─────────────────────────────┤
│ POST │ /v1/fmo/admin/category/update │ Update application category │
├─────────────┼───────────────────────────────┼─────────────────────────────┤
│ POST │ /v1/fmo/admin/category/data │ Get categories by EMS2 role │
├─────────────┼───────────────────────────────┼─────────────────────────────┤
│ POST │ /v1/fmo/admin/category/audit │ Get category audit history │
└─────────────┴───────────────────────────────┴─────────────────────────────┘

1.4 ApplicationTileController (v1) - Tile Administration

┌─────────────┬───────────────────────────┬─────────────────────────┐
│ HTTP Method │ Endpoint Path │ Purpose │
├─────────────┼───────────────────────────┼─────────────────────────┤
│ POST │ /v1/fmo/admin/tile/create │ Create application tile │
├─────────────┼───────────────────────────┼─────────────────────────┤
│ POST │ /v1/fmo/admin/tile/update │ Update application tile │
├─────────────┼───────────────────────────┼─────────────────────────┤
│ POST │ /v1/fmo/admin/tile/data │ Get tiles by EMS2 role │
├─────────────┼───────────────────────────┼─────────────────────────┤
│ POST │ /v1/fmo/admin/tile/audit │ Get tile audit history │
└─────────────┴───────────────────────────┴─────────────────────────┘

1.5 ImportMapController (v1) - Import Map Administration

┌─────────────┬────────────────────────────────┬─────────────────────────────────┐
│ HTTP Method │ Endpoint Path │ Purpose │
├─────────────┼────────────────────────────────┼─────────────────────────────────┤
│ GET │ /v1/fmo/admin/importmap/active │ Get active import maps (public) │
├─────────────┼────────────────────────────────┼─────────────────────────────────┤
│ POST │ /v1/fmo/admin/importmap/create │ Create import map entry │
├─────────────┼────────────────────────────────┼─────────────────────────────────┤
│ POST │ /v1/fmo/admin/importmap/update │ Update import map entry │
├─────────────┼────────────────────────────────┼─────────────────────────────────┤
│ POST │ /v1/fmo/admin/importmap/data │ Get import maps by EMS2 role │
├─────────────┼────────────────────────────────┼─────────────────────────────────┤
│ POST │ /v1/fmo/admin/importmap/audit │ Get import map audit history │
└─────────────┴────────────────────────────────┴─────────────────────────────────┘

1.6 ApplicationConfigController (v1) - Bulk Configuration Upload

┌─────────────┬─────────────────────────────┬──────────────────────────────────────────┐
│ HTTP Method │ Endpoint Path │ Purpose │
├─────────────┼─────────────────────────────┼──────────────────────────────────────────┤
│ POST │ /v1/fmo/admin/config/upload │ Bulk upload configurations via CSV files │
└─────────────┴─────────────────────────────┴──────────────────────────────────────────┘

---

2. Execution Flow Analysis

2.1 POST /v2/sso/login - Authentication Flow

Sequence Diagram (Text):

1. Controller receives RequestOfAuthenticate (username, password, code, iss, clientId)
2. Set hostname from request
3. Decision: Is 'code' present?
   ├─ NO (Normal Login) → OUDAuthenticationService.authenticate()
   │ ├─ Check if user is whitelisted for specific environments
   │ │ ├─ YES → getUserInfo() using service account
   │ │ └─ NO → LDAP bind with user credentials
   │ │ ├─ Build DN: cn={username},ou=users,o=standardchartered
   │ │ ├─ Call LDAP getContext() for authentication
   │ │ └─ Retrieve user attributes from OUD
   │ └─ Return user info map
   │
   └─ YES (SSO Login) → MFAAuthenticationService.authenticate()
   ├─ Build OAuth2 token request
   │ ├─ client_id, grant_type=authorization_code, code, redirect_uri
   │ └─ X-Cert header from config
   ├─ POST to {iss}/access_token
   ├─ Parse response, decode JWT id_token
   └─ Extract user claims (name, email, locale, country)

4. Serialize OUD data to JSON string
5. Call buildEntities() → Authorization & tile retrieval
   ├─ ApplicationCategoryService.getDrawers() → DB query for categories
   ├─ Extract EMS2 entity names from categories
   ├─ AuthorizationService.getEntitlements(userId, entities)
   │ ├─ GET {EMS2_HOST}/ems2/rest/account/{userId}
   │ ├─ Parse entitlement roles
   │ ├─ POST {EMS2_HOST}/ems2/rest/entitlements/entitlementList
   │ │ └─ Body: {userId: [entityList]}
   │ └─ Return Ems2Result with entities, subjects, actions
   ├─ Filter drawers based on user entitlements
   ├─ Generate entitlementsToken (JWT with entitlements payload)
   └─ Generate main JWT token with user info + session ID

6. Insert analytics event (login type: normal/sso)
7. Clear JSESSIONID cookie
8. Return ResponseOfAuthenticate with:
   - token (JWT)
   - entitlementsToken
   - oud (user info JSON)
   - entities (authorization data)
   - drawers (filtered application tiles)

Key Decision Points:

- code presence determines OUD vs MFA authentication path
- Whitelisted users on whitelisted hosts bypass password validation
- Tile visibility filtered by EMS2 entity/subject permissions

---

2.2 POST /v2/sso/validate - Token Validation Flow

1. Extract JWT from Authorization header
2. JwtTokenUtil.validateToken()
   ├─ Verify RSA512 signature
   ├─ Check expiration
   └─ Check absolute idle timeout
3. Verify issuer matches JWT_ISSUER
4. Extract session ID from token payload
5. SessionService.validateSession(sessionId)
   └─ Check session exists and is valid
6. Rebuild entities and drawers (same as login)
7. Return refreshed entitlementsToken and updated authorization data

---

2.3 POST /v2/sso/extend - Token Extension Flow

1. Validate existing token
2. Verify issuer
3. Validate session
4. Check if new expiration exceeds absolute idle timeout
   ├─ If exceeds → Generate new token with auth_time reset
   └─ Otherwise → Generate standard extended token
5. Return new JWT token in response header

---

2.4 POST /v1/fmo/admin/config/upload - Bulk Configuration Upload

1. Validate FMAA access token
   └─ GET {FMAA_HOST}/introspect?app_id=FMO_PORTAL&access_token={jwt}
2. Verify FMAA user is active
3. Parse CSV files:
   - moduleMap.csv → ImportMapConfig list
   - category.csv → ApplicationCategoryConfig list
   - tile.csv → ApplicationTileConfig list
4. For each ImportMap:
   ├─ Check if exists by ID
   ├─ Verify EMS2 role matches
   ├─ Create or update record
   └─ Create audit record
5. For each Category:
   ├─ Similar create/update logic
   └─ Create audit record
6. For each Tile:
   ├─ Link to ImportMap and Category
   ├─ Validate references exist
   ├─ Create or update record
   └─ Create audit record
7. Save all to database
8. Return summary of created/updated records

---

3. Key Data Entities and Fields

3.1 Core Entities

┌──────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬────────────────────────────────────┐
│ Entity │ Key Fields │ Description │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────────────────────┤
│ ApplicationTile │ applicationTileId, title, module, tile, ems2Role, ems2Entities, ems2Subject, applicationCategory, importMap, isActive │ Represents a micro-frontend tile │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────────────────────┤
│ ApplicationCategory │ applicationCategoryId, label, orderNo, ems2Role, isActive │ Groups tiles into drawers │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────────────────────┤
│ ImportMap │ importMapId, keyName, path, ems2Role, isActive │ Maps module names to URLs │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────────────────────┤
│ ApplicationSession │ sessionId, userData │ Stores user session data │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────────────────────┤
│ ApplicationTileAudit │ Mirrors ApplicationTile + transactionMode │ Audit trail for tile changes │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────────────────────┤
│ ApplicationCategoryAudit │ Mirrors ApplicationCategory + transactionMode │ Audit trail for category changes │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────────────────────┤
│ ImportMapAudit │ Mirrors ImportMap + transactionMode │ Audit trail for import map changes │
└──────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴────────────────────────────────────┘

3.2 Request DTOs

┌──────────────────────────────┬────────────────────────────────────────────────────────────────┐
│ DTO │ Key Fields │
├──────────────────────────────┼────────────────────────────────────────────────────────────────┤
│ RequestOfAuthenticate │ username, password, code, iss, clientId, hostName │
├──────────────────────────────┼────────────────────────────────────────────────────────────────┤
│ RequestOfJWT │ singleUIAuthorization (JWT token) │
├──────────────────────────────┼────────────────────────────────────────────────────────────────┤
│ RequestOfRelogin │ Uses refresh token from header │
├──────────────────────────────┼────────────────────────────────────────────────────────────────┤
│ RequestOfApplicationTile │ Tile data + entitlementsToken, mode (checker/maker/deactivate) │
├──────────────────────────────┼────────────────────────────────────────────────────────────────┤
│ RequestOfApplicationCategory │ Category data + entitlementsToken, mode │
├──────────────────────────────┼────────────────────────────────────────────────────────────────┤
│ RequestOfImportMap │ Import map data + entitlementsToken, mode │
└──────────────────────────────┴────────────────────────────────────────────────────────────────┘

3.3 Response DTOs

┌────────────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────┐
│ DTO │ Key Fields │
├────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────┤
│ ResponseOfAuthenticate │ result, token, entitlementsToken, oud, entities, drawers, userInfo, expiration, errorMessage │
├────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────┤
│ ResponseOfAdminModule │ result, data, errorMessage │
├────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────┤
│ ResponseOfAnalytics │ result, data, total, errorMessage │
└────────────────────────┴──────────────────────────────────────────────────────────────────────────────────────────────┘

---

4. External System Interactions

4.1 OUD (Oracle Unified Directory) - LDAP Authentication

┌──────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────┐
│ Aspect │ Details │
├──────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────┤
│ Purpose │ User authentication and profile retrieval │
├──────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────┤
│ Protocol │ LDAP (via Spring LdapTemplate) │
├──────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────┤
│ Configuration │ spring.ldap.urls: ${OUD_URL} │
├──────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────┤
│ DN Pattern │ cn={username},ou=users,o=standardchartered │
├──────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────┤
│ Service Account │ auth.oud.un, auth.oud.pw, auth.oud.id (encrypted) │
├──────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────┤
│ Attributes Retrieved │ uid, cn, givenName, fullName, sn, mail, preferredLocale, co, title, description, psEmplStatus │
├──────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────┤
│ Error Handling │ Returns OUD_RELATED_CODE error on failure │
└──────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────┘

Decision Logic:

- Whitelisted users (idList) on whitelisted environments (envList) bypass password check
- Service account used to retrieve attributes for whitelisted users
- Regular users authenticate directly with their credentials

---

4.2 EMS2 (Enterprise Management System 2) - Authorization

┌──────────┬──────────────────────────────────────────────────────┐
│ Aspect │ Details │
├──────────┼──────────────────────────────────────────────────────┤
│ Purpose │ Role-based access control and entitlement management │
├──────────┼──────────────────────────────────────────────────────┤
│ Protocol │ REST (JSON over HTTP) │
├──────────┼──────────────────────────────────────────────────────┤
│ Host │ ${EMS2_HTTPS_HOST} │
├──────────┼──────────────────────────────────────────────────────┤
│ Timeouts │ connectTimeout: 5s, readTimeout: 5s │
└──────────┴──────────────────────────────────────────────────────┘

API Endpoints:

1. Get User Roles (GET)
   - URL: {EMS2_HOST}/ems2/rest/account/{userId}
   - Returns: Ems2RoleResult with entitlementTypes, accountName, fullName, accountStatus

2. Get Entitlements (POST)
   - URL: {EMS2_HOST}/ems2/rest/entitlements/entitlementList
   - Request Body: {"{userId}": ["Entity1", "Entity2", ...]}
   - Returns: List of Entitlement objects with Role, Subject, Action

Data Structures:
Entity: id, name, applicationName, roleId, roleName, subjects[]
Subject: id, name, longName, actions[]
Action: id, name, entitlementId

Error Handling:

- Returns empty result on failure (graceful degradation)
- Logs errors but doesn't throw exceptions

---

4.3 FMAA (Federation Management and Authentication Application) - Token Verification

┌──────────┬─────────────────────────────────────────────────────────┐
│ Aspect │ Details │
├──────────┼─────────────────────────────────────────────────────────┤
│ Purpose │ Verify FMAA access tokens for bulk upload authorization │
├──────────┼─────────────────────────────────────────────────────────┤
│ Protocol │ REST (HTTP GET) │
├──────────┼─────────────────────────────────────────────────────────┤
│ Host │ ${FMAA_HOST} │
├──────────┼─────────────────────────────────────────────────────────┤
│ Timeouts │ connectTimeout: 5s, readTimeout: 5s │
└──────────┴─────────────────────────────────────────────────────────┘

API Endpoint:

- URL: {FMAA_HOST}/introspect?app_id=FMO_PORTAL&access_token={jwt}
- Returns: FmaaResult with userId, active (true/false)

Error Handling:

- On failure, returns FmaaResult with active="false"

---

4.4 MFA (Multi-Factor Authentication) - SSO Login

┌────────────┬──────────────────────────────────────────────┐
│ Aspect │ Details │
├────────────┼──────────────────────────────────────────────┤
│ Purpose │ OAuth2 token exchange for SSO authentication │
├────────────┼──────────────────────────────────────────────┤
│ Protocol │ REST (form-urlencoded POST) │
├────────────┼──────────────────────────────────────────────┤
│ Headers │ X-Cert: ${MFA_CERT} │
├────────────┼──────────────────────────────────────────────┤
│ Grant Type │ authorization_code │
└────────────┴──────────────────────────────────────────────┘

API Endpoint:

- URL: {iss}/access_token (issuer from request)
- Request Body: client_id, grant_type, code, redirect_uri
- Returns: ResponseMFA with id_token (JWT)

JWT Claims Extracted:

- name → userId
- given_name → firstName
- family_name → lastName
- full_name → fullName
- email → emailId
- locale → locale
- country → country

---

4.5 Elasticsearch - Analytics Storage

┌──────────┬────────────────────────────────────────────────────┐
│ Aspect │ Details │
├──────────┼────────────────────────────────────────────────────┤
│ Purpose │ Store and query user interaction analytics │
├──────────┼────────────────────────────────────────────────────┤
│ Protocol │ REST (HTTP) │
├──────────┼────────────────────────────────────────────────────┤
│ Host │ ${ELASTIC_HOST} │
├──────────┼────────────────────────────────────────────────────┤
│ Auth │ API Key: ${ELASTIC_API_KEY} / ${ELASTIC_API_VALUE} │
├──────────┼────────────────────────────────────────────────────┤
│ Timeouts │ connectTimeout: 1s, readTimeout: 1s │
└──────────┴────────────────────────────────────────────────────┘

Operations:

1. Insert Analytics - Index document with key, event, container, tile, name, username, ip
2. Query Analytics - Elasticsearch DSL query with filters, pagination

---

5. Decision Points and Conditional Logic

5.1 Authentication Path Selection

if (StringUtils.isBlank(request.getCode())) {
// Normal LDAP authentication
oud = oudAuthenticationService.authenticate(request);
} else {
// MFA/SSO authentication
oud = mfaAuthenticationService.authenticate(request);
}

5.2 Whitelist Bypass Logic

if (envs.contains(hostname) && ids.contains(username)) {
// Bypass password check, use service account
userInfo = getUserInfo(username);
} else {
// Standard LDAP bind with user credentials
dirContext = ldapTemplate.getContextSource().getContext(userDn, password);
}

5.3 Admin Module Maker-Checker Pattern

if (!applicationTile.isActive() && mode.equalsIgnoreCase("checker")) {
if (applicationTile.getUpdatedBy().equalsIgnoreCase(userName)) {
throw "Maker and Checker should be different user";
}
applicationTile.setActive(true); // Approve the record
} else if (mode.equalsIgnoreCase("deactivate")) {
applicationTile.setActive(false);
} else {
// Maker mode - update record and set inactive for approval
applicationTile.setActive(false);
}

5.4 Token Extension vs Re-authentication

if (maxAge != null && newExpirationDate.after(maxAge)) {
// Absolute timeout reached, need fresh token
newJwtToken = jwtTokenUtil.doGenerateTokenWithAuthTime(userName, payload);
}

5.5 Tile Filtering by Entitlements

if (isTemplate) {
// Template tiles always visible
newTiles.add(tile);
} else {
// Check entity and subject permissions
if (Arrays.asList(entitiesDrawer).contains(entity1.getName())) {
if (StringUtils.isBlank(subject) || subjects.size() > 0) {
newTiles.add(tile);
}
}
}

---

6. Summary

6.1 Application Purpose

Single UI BFF is a Backend for Frontend service that:

1. Provides unified authentication (LDAP/SSO) for micro-frontend applications
2. Manages user authorization through EMS2 entitlements
3. Administers application configuration (tiles, categories, import maps)
4. Logs user analytics to Elasticsearch

6.2 External System Dependencies

┌───────────────┬───────────────────────────────────┬──────────────┬──────────┐
│ System │ Purpose │ Protocol │ Critical │
├───────────────┼───────────────────────────────────┼──────────────┼──────────┤
│ OUD │ User authentication, profile data │ LDAP │ Yes │
├───────────────┼───────────────────────────────────┼──────────────┼──────────┤
│ EMS2 │ Authorization, entitlements │ REST │ Yes │
├───────────────┼───────────────────────────────────┼──────────────┼──────────┤
│ FMAA │ Token verification for bulk ops │ REST │ Partial │
├───────────────┼───────────────────────────────────┼──────────────┼──────────┤
│ MFA │ SSO authentication │ REST/ OAuth2 │ Partial │
├───────────────┼───────────────────────────────────┼──────────────┼──────────┤
│ Elasticsearch │ Analytics storage │ REST │ No │
├───────────────┼───────────────────────────────────┼──────────────┼──────────┤
│ PostgreSQL │ Application data persistence │ JDBC │ Yes │
└───────────────┴───────────────────────────────────┴──────────────┴──────────┘

6.3 Endpoint-External System Mapping

┌──────────────────────────────────┬─────┬──────┬──────┬─────┬───────────────┐
│ Endpoint │ OUD │ EMS2 │ FMAA │ MFA │ Elasticsearch │
├──────────────────────────────────┼─────┼──────┼──────┼─────┼───────────────┤
│ POST /v2/sso/login │ ✓ │ ✓ │ - │ ✓* │ ✓ │
├──────────────────────────────────┼─────┼──────┼──────┼─────┼───────────────┤
│ POST /v2/sso/validate │ - │ ✓ │ - │ - │ - │
├──────────────────────────────────┼─────┼──────┼──────┼─────┼───────────────┤
│ POST /v2/sso/extend │ - │ - │ - │ - │ - │
├──────────────────────────────────┼─────┼──────┼──────┼─────┼───────────────┤
│ POST /v2/sso/relogin │ - │ ✓ │ - │ - │ - │
├──────────────────────────────────┼─────┼──────┼──────┼─────┼───────────────┤
│ POST /v2/sso/logout │ - │ - │ - │ - │ - │
├──────────────────────────────────┼─────┼──────┼──────┼─────┼───────────────┤
│ POST /v1/fmo/admin/category/* │ - │ - │ - │ - │ - │
├──────────────────────────────────┼─────┼──────┼──────┼─────┼───────────────┤
│ POST /v1/fmo/admin/tile/_ │ - │ - │ - │ - │ - │
├──────────────────────────────────┼─────┼──────┼──────┼─────┼───────────────┤
│ POST /v1/fmo/admin/importmap/_ │ - │ - │ - │ - │ - │
├──────────────────────────────────┼─────┼──────┼──────┼─────┼───────────────┤
│ POST /v1/fmo/admin/config/upload │ - │ - │ ✓ │ - │ - │
├──────────────────────────────────┼─────┼──────┼──────┼─────┼───────────────┤
│ POST /v1/fmo/print │ - │ - │ - │ - │ ✓ │
├──────────────────────────────────┼─────┼──────┼──────┼─────┼───────────────┤
│ POST /v1/fmo/analytics │ - │ - │ - │ - │ ✓ │
└──────────────────────────────────┴─────┴──────┴──────┴─────┴───────────────┘

\*Only when code parameter is provided (SSO flow)

---

This document provides the complete logic and flow analysis needed to create detailed flowcharts for the Single UI BFF application. Each section breaks down the execution path, decision points, and
external system interactions in a step-by-step manner suitable for visualization.
