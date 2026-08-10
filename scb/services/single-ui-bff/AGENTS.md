# Single-UI-Bff: Project Guide

## Overview
Single-UI-Bff is a Spring Boot backend-for-frontend (BFF) for SCB Single UI. It integrates frontend clients with internal and external services, providing unified APIs and orchestrated business logic.

## Architecture
- **Layered structure**
  - `controller/`: REST endpoints for client interaction.
  - `service/`: Business logic and orchestration.
  - `repository/`: Data access and persistence.
  - `config/`: Configuration beans and properties (Auth, JWT, Elastic, EMS2).
  - `dto/`, `entity/`: Data transfer and persistence models.
  - `filter/`, `exceptions/`, `util/`: Cross-cutting concerns (error handling, utilities).
- **Configuration**
  - `src/main/resources/application.yml` and `bootstrap.yml`.
  - Additional configuration classes under `config/`.
- **Database migrations**
  - Flyway scripts in `src/main/resources/db/migration/`.
- **Testing**
  - Unit and integration tests in `src/test/java/com/scb/sso/singleuibff/`.
  - Mockito used for mocking dependencies.

## Components
- **Main application**: `SingleUIBffApplication.java`.
- **Controllers**: REST APIs by business domain.
- **Services**: Business logic, orchestration, and integration with external APIs.
- **Repositories**: Data access (typically JPA).
- **Configuration**: Auth, JWT, Elastic, EMS2, and related service properties.
- **DTOs and entities**: Request/response models and persistence entities.

## Workflows
- Build: `mvn clean install`
- Run: `mvn spring-boot:run`
- Test: `mvn test`
- Helm package: `helm package . --app-version=<version> -n application`
- Helm install: `helm install <release> <chart>.tgz -n application --wait`
- Helm upgrade: `helm upgrade --install <release> <chart>.tgz -n application --set "environment=sit"`

## Integration Points
- Kubernetes deployment assets in `ratan-spring-boot/`.
- Containerization via `Dockerfile`.
- CI/CD via `azure-pipelines-maven.yml` and `ratan-ci.yaml`.

## References
See `.github/copilot-instructions.md` for additional guidance.

## Business Implementation Details

### Core Business Domains
- **Authentication and authorization**
  - OUD (LDAP) and MFA (Multi-Factor Authentication) via `OUDAuthenticationService` and `MFAAuthenticationService`.
  - JWT-based session management with custom token handling and issuer logic.
  - EMS2-based entitlements and role checks via `AuthorizationService`.
- **Analytics**
  - User actions and events stored through `AnalyticService`.
  - Analytics endpoints validate JWT, extract user info, and log events with user/IP context.
- **Application management**
  - CRUD for categories, tiles, and import maps, with audits and role-based access.
  - Maker-checker enforcement for admin actions (e.g., activation/deactivation).
  - Bulk configuration upload via CSV with validation and mapping.
- **Session management**
  - Sessions created and validated per user; session IDs derived from JWT payloads.
  - Session validation required for sensitive operations.

### Key Business Flows
- **Admin module**
  - Entitlements token validation required.
  - Role checks, state transitions, and audit logging enforced.
  - Maker-checker ensures the same user cannot approve their own changes.
- **Data access and audit**
  - Category, tile, and import map entities have audit tables and services.
  - Creates and updates logged for traceability.
- **Integration points**
  - External authentication (OUD, MFA) and EMS2 entitlements integrated via service layer.
  - Controllers delegate to services with validation and error handling.

### Example Business Patterns
- **Analytics logging**
  - Validate JWT, extract user info, validate session, log analytics event with user/IP.
- **Category update (admin)**
  - Validate entitlements token.
  - Fetch category and confirm role and mode (maker/checker/deactivate).
  - Enforce business rules (checker-only activation; maker and checker must differ).
  - Update entity and log audit.
- **Authentication**
  - OUD: LDAP bind and attribute extraction with whitelisting logic.
  - MFA: Token exchange via HTTP, decode JWT, extract user info.

## Component Implementation Details

### Controllers
- **AnalyticsController**: Validates JWT, extracts user info, validates session, and logs analytics data via `AnalyticService`.
- **ApplicationCategoryController**: CRUD and admin actions with EMS2 role checks and maker-checker enforcement; logs via audit service.
- **ApplicationTileController**: CRUD and admin actions with entitlements, role checks, and maker-checker separation; logs via audit service.
- **ImportMapController**: CRUD/admin for import maps; provides active maps; validates entitlements and logs via audit service.
- **JwtAuthenticationController**: Orchestrates OUD/MFA authentication, JWT issuance, entitlements retrieval, and session handling.

### Services
- **AnalyticService**
  - `insertData(request, username, ip)`: Persists analytics events with user and IP context.
  - `filterData(filter)`: Retrieves filtered analytics data.
- **ApplicationCategoryService**: CRUD for categories with EMS2 role filtering and audit logging; supports bulk save and sequence management.
- **ApplicationTileService**: CRUD for tiles with EMS2 role and category filtering; supports bulk save and sequence management.
- **ImportMapService**: CRUD for import maps with EMS2 role filtering; supports bulk save and sequence management.
- **SessionService**
  - `create(sessionId)`: Creates a new session for a user.
  - `validateSession(sessionId)`: Validates session existence and state.
- **ApplicationConfigService**: Bulk configuration upload and mapping; validates FMAA access token and processes CSV uploads.
- **AuthorizationService**
  - `getEntitlements(userId, entities)`: Retrieves EMS2 entitlements for a user and requested entities.

### Authentication Services
- **OUDAuthenticationService**: LDAP bind or whitelist authentication; extracts user attributes and handles error cases.
- **MFAAuthenticationService**: Token exchange via HTTP; decodes JWT, extracts user info, and builds payload.

### Patterns and Cross-Cutting Concerns
- **Maker-checker pattern**: Enforced for category, tile, and import map admin actions.
- **Audit logging**: All admin actions logged through corresponding audit services.
- **Role-based access**: EMS2 roles required before updates or access.
- **Session validation**: Sensitive operations require JWT-derived session validation.
