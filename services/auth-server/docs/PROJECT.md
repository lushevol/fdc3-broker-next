# auth-server - Project Overview

<- [Monorepo AGENTS.md](../../../AGENTS.md)

## Type

Spring Boot 4.0.6 authentication service (Java 21), port 8082.

## Purpose

Central authentication and authorization service for Ratan/FMO flows. It validates users through OUD/LDAP or external tokens, manages Redis-backed sessions, checks EMS2 entitlements, and exposes token helper endpoints for FMAA and Kong integrations.

## Status

Active service. It is not part of the npm workspace command set and is run directly with Maven.

## Key Features

- OUD/LDAP username-password login.
- Redis-backed session token and user-info cache.
- EMS2 entitlement retrieval and action authorization.
- JWT parsing/conversion for legacy and current token shapes.
- FMAA OAuth2 and Kong Gateway token support.
- HashiCorp/Ratan foundation integration through internal starters.
- Zipkin/logstash-oriented observability wiring.

## Quick Start

```bash
cd services/auth-server
mvn test
mvn spring-boot:run -Dspring-boot.run.jvmArguments='-Dserver.port=8082'
```

Most realistic flows require corporate network access and configured external dependencies.

## Package

`com.scb.auth`

## Runtime Configuration

Primary configuration lives in `src/main/resources/application.yml` and `bootstrap.yml`.

| Group        | Example variables                                                                                   |
| ------------ | --------------------------------------------------------------------------------------------------- |
| Redis        | `REDIS_CLUSTER_NODES`, `REDIS_JANUS`                                                                |
| OUD/LDAP     | `OUD_URL`, `EDMI_OUD`, `EDMI_OUD_PWD`                                                               |
| EMS2         | `EMS2_HOST`, `EMS2_HTTPS_HOST`                                                                      |
| FMAA         | `FMAA_HOST`, `FMAA_ACCOUNT`, `FMAA_JANUS`, `FMAA_CERT_PATH`                                         |
| Kong         | `KONG_APPLICATION_NAME`, `KONG_IAM_URL`, `KONG_TOKEN_ENDPOINT`, `KONG_CLIENT_ID`, `KONG_CLIENT_SEC` |
| Certificates | `JKS_KEYSTORE_FILE`, `JKS_KEYSTORE_PWD`, `JKS_TRUSTSTORE_FILE`, `JKS_TRUSTSTORE_PWD`                |
| Logging      | `LOG_DIR`, `LOGSTASH_URL`, `ZIPKIN_SERVER_ENDPOINT`                                                 |

Secrets must come from deployment configuration, not source.
