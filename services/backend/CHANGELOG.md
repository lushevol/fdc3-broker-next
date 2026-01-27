# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-01-24

### Added

- **Local Development Configuration (`services/backend/src/main/resources/application-local.yml`)**
  - H2 in-memory database configuration with PostgreSQL compatibility mode
  - Auto-creation of `POST_TRADE_PORTAL_SERVICE` schema on startup
  - Mock JWT RSA keys for local authentication testing
  - Mock configuration for Elasticsearch, LDAP, FMAA, EMS2, and MFA services
  - Disabled Eureka client for local environment
  - Disabled Flyway migrations (using JPA ddl-auto instead)
  - Actuator health/info endpoints exposed

- **Local Configuration Beans (`services/backend/src/main/java/com/scb/sso/singleuibff/config/LocalConfig.java`)**
  - `@Configuration` class activated when `spring.profiles.active=local`
  - Mock `ObjectMapper`, `RestTemplate`, `Elasticsearch` beans
  - Mock `AuthenticationService` returning test user data for any credentials
  - Mock `AnalyticService` that logs but doesn't fail on ES unavailability
  - Mock `LdapTemplate` with empty `LdapContextSource` (prevents actual LDAP connections)

### Changed

- **`pom.xml`**
  - Added H2 database dependency (`com.h2database:h2`) for runtime
  - Added `commons-lang3` dependency (`3.14.0`) for local development
  - Added JetBrains annotations (`17.0.0`) for local development
  - Commented out internal `ratanone-service-spring-boot-starter` dependency
  - Commented out internal `ratanone-hashicorp-integrator-spring-boot-starter` dependency
  - Disabled `maven-antrun-plugin` that downloads from internal artifactory

- **`AuthConfig.java`**
  - Added `@ConditionalOnProperty` annotation to disable when local profile is active
  - Import statement for `ConditionalOnProperty` added

- **`ApplicationConfigController.java`**
  - Fixed structural issue: moved `handleImportMap`, `handleApplicationCategory`, and `handleApplicationTile` methods outside of the `upload` method
  - Added proper try-catch blocks with error handling for `IOException` and `NoSuchElementException`
  - Changed response structure to use `Map<String, Object>` for bulk auth response
  - Fixed method calls to use `csvUtility.getCategories()` and `csvUtility.getTiles()` instead of non-existent methods

### Removed

- N/A (no features removed, only mocked for local development)

### Fixed

- **ApplicationConfigController.java**
  - Resolved compilation error due to methods defined inside other methods
  - Resolved compilation error due to incorrect method names (`getApplicationCategories` → `getCategories`, `getApplicationTiles` → `getTiles`)
  - Resolved compilation error due to `ResponseOfBulkAuth` builder having different structure

### Security

- N/A (no security changes)

### Performance

- N/A (no performance changes)

### Compatibility

- **Java Version**: Requires Java 17 (verified with OpenJDK 17.0.17)
- **Spring Boot**: 3.3.4
- **Database**: H2 in-memory (dev only), PostgreSQL (production)
- **Breaking Changes**: None - changes are profile-specific and don't affect production configuration

## How to Use

### Running Locally

```bash
cd services/backend
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

The service will start on port **8088**.

### Authentication (Local Mock)

Any username/password combination will succeed and return test user data:

```json
{
  "uid": "testuser",
  "cn": "testuser",
  "mail": "testuser@test.com",
  "fullName": "Test User testuser",
  "preferredLocale": "en_US",
  "title": "Test Developer"
}
```

### Database (Local)

The H2 in-memory database is used with auto-generated schema (`create-drop` mode).
Data is lost when the application stops.

### Endpoints

- `http://localhost:8088/actuator/health` - Health check
- `http://localhost:8088/v1/fmo/admin/config/upload` - Config upload (requires FMAA token)
- Other FMO admin endpoints as defined in controllers

## Known Limitations

- Elasticsearch operations are logged but not persisted
- LDAP authentication is mocked (any credentials work)
- FMAA/EMS2/MFA service calls are mocked and point to localhost
- JWT tokens generated use test keys (not for production use)
- H2 schema auto-creation may not match production PostgreSQL schema exactly

## Next Steps

- Add database migration scripts (Liquibase/Flyway) for production
- Configure external service endpoints via environment variables
- Add integration tests with testcontainers
- Document API endpoints with OpenAPI/Swagger
