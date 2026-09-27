# Architecture
This repo is the FlowZero gateway and iAuthentication edge. It runs on port `8868`, uses a reactive Spring Cloud Gateway stack, and owns API edge concerns such as route registration, token validation, LDAP integration, Kong integration, and auth-related persistence. The main package root is `com.scb.ratan.flowzero.auth` with dedicated areas for `route`, `filter`, `security`, `jwtparser`, `api`, `service`, and `repository`.

# Tech Stack
- Java 17
- Spring Boot 3.3.5
- Spring Cloud Gateway + WebFlux
- Spring Data JPA + Flyway
- Micrometer tracing
- LDAP, Jasypt, Nimbus JWT, FMAA client

# Key Commands
- build: `mvn clean package -f be-app/51358-ratan-flowzero-auth-service/pom.xml`
- test: `mvn clean test -f be-app/51358-ratan-flowzero-auth-service/pom.xml`
- run: `mvn spring-boot:run -f be-app/51358-ratan-flowzero-auth-service/pom.xml`
- format: `mvn formatter:format -f be-app/51358-ratan-flowzero-auth-service/pom.xml`

# Conventions
- Preserve reactive behavior. This service intentionally forces `spring.main.web-application-type=reactive` because servlet dependencies are also on the classpath.
- Keep gateway routes, gateway filters, and auth-edge concerns out of the designer and orchestration services.
- Follow the existing package split for `route`, `filter`, `security`, `service`, and `repository` instead of introducing a parallel structure.
- Add defensive error handling around external integrations such as LDAP, EMS, FMAA, Kong, and database calls.
- Follow surrounding log patterns and keep committed code, comments, logs, and exception messages in English.

# Gotchas
- Removing or bypassing the reactive application type will break Spring Cloud Gateway startup.
- This service depends on external auth and entitlement integrations configured through variable names in `service-properties/config-repo`.
- Runtime sizing and port defaults are defined in `app.conf`, not only in Spring config.

# Supporting Docs
-> `../CLAUDE.md` - backend family routing and shared conventions
-> `../../claude.md` - workspace-level routing and global conventions
