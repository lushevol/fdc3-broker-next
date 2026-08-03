---
name: sb-process-api-java
description: Development guide for Service Bench Process API projects (REST) using Kotlin or Java with Quarkus. Use this skill whenever building or modifying a Process API — covers prerequisites, project creation, exposing REST endpoints, security (SC-IDP / PEP sidecar, internal vs private API classification), HCV secrets, deployment, Kong integration, Liquibase database migrations. Trigger on any request involving: new REST endpoint, process-parent, devkit-api-common, Process API secure API, PEP sidecar internal-api, private-api, Kong onboarding, Liquibase, Process API deployment.
---

# Service Bench — Process API (Kotlin / Java)

Process APIs are REST-based Quarkus services that serve as the system integration layer. They are called by Experience APIs (private-api) or by external systems via Kong (internal-api).

---

## Library Dependencies

Keep these libraries at the latest version.

| Library | Purpose |
|---|---|
| `process-parent-java` | Quarkus parent POM for Java Process APIs |
| `process-parent-kotlin` | Quarkus parent POM for Kotlin Process APIs |
| `devkit-api-common` | Quarkus utilities for Process APIs (health, logging, common middleware) |

**Latest versions (as of April 2026):**
- `process-parent-java`: `4.0.0-10008444`
- `process-parent-kotlin`: `4.0.0-10008333`
- `devkit-api-common`: `4.0.0-10622572`

> When upgrading to `4.0.0-7918xxx` or later, upgrade JDK to 21 and buildpack simultaneously.
> Note: `devkit-api-common 4.0.0-10622572+` — `/q/health/live` now checks DB connection by default.

---

## Prerequisites

### Node.js
- Required: v20.x+
- Set npm registry: `npm config set registry https://artifactory.global.standardchartered.com/artifactory/api/npm/npm-release`

### JDK
- Required: Java 21 (as of `process-parent 4.0.0-7918xxx+`)
- Previously Java 17; upgrade JDK and buildpack together

### Maven
- Required: 3.8.3+
- Configure `~/.m2/settings.xml` to use SCB Artifactory mirrors

### Properties Manifest
The `functionType` in `env/<environment>/properties.yml` must match the API classification:
```yaml
functionType: <private-api|internal-api>
```
- `private-api` — only callable within the same namespace (e.g., by an Experience API)
- `internal-api` — callable by other Service Bench components via SB ingress gateway

---

## Project Creation

Use **SC DevKit CLI**:

```bash
npx @scdevkit/cli@latest
# Select: Service Bench → Process API template
# Enter: project name, application id, bank id
```

Run locally:
```bash
mvn quarkus:dev
```

### Project Structure

| Path | Description |
|---|---|
| `src/main/kotlin/com/sc/faas/dto/` | POJOs exposed as JSON response/request DTOs |
| `src/main/java/com/sc/faas/service/ProcessService.java` | Process API service layer (business logic) |
| `src/main/java/com/sc/faas/Function.java` | REST endpoints — one `Function.java` per project |
| `src/main/resources/application.properties` | Process function configuration |
| `env/<env>/properties.yml` | Environment-specific properties (secrets, PEP sidecar config) |

---

## Exposing REST Endpoints

Keep **one Function class per project**, focused on one domain.

```java
@Path("/api/experience/v1/")
public class Function {

    @Inject
    private ProcessService processService;

    /**
     * Exposed REST GET at /api/experience/v1/objects/{id}
     */
    @Path("/objects/{id}")
    @GET
    public Object getObjectById(@PathParam("id") Long id) {
        return processService.getObjectById(id);
    }
}
```

### Service Class

```java
@ApplicationScoped
public class ProcessService {
    public MyObject getObjectById(Long id) {
        // Business logic here
        return new MyObject(id, "Hello World");
    }
}
```

### DTO

```java
@AllArgsConstructor
@NoArgsConstructor
@Data
public class MyObject {
    private Long id;
    private String name;
}
```

---

## Security (SC-IDP / PEP Sidecar)

### Classify Your API First

Determine the API classification before applying protection:

| Type | Description | Access pattern |
|---|---|---|
| **private-api** | Only consumed within same namespace (e.g., by the Experience API) | Direct Kubernetes service call: `http://<function-name>.<namespace>.svc.cluster.local` |
| **internal-api** | Called by other Service Bench components or external consumers via Kong | Via SB ingress gateway: `https://<service-bench-domain>/api/<ecm>` |

### Internal API — Service Bench Onboarding

1. Contact SB support team to onboard to SB ingress gateway.
2. The API is assigned a context path: `https://<service-bench-domain>/api/<ecm>`
3. Get approval with: ECM name, namespace, function name, planned release date.

### SC-IDP Onboarding (Both Types)

Approach SC-IDP team to register your Process API as a service:
- Teams: `https://teams.microsoft.com/l/channel/19%3ad4d5ee8ea96f48c49f90cc11d48c2c68%40thread.tacv2/Ask%2520about%2520Onboarding?groupId=15c8b065-70cd-405d-9350-457272ce9d07`

### PEP Sidecar Configuration

Add to `env/<env>/properties.yml`:

```yaml
pep:
  config: |
    {
      "rules": [
        {
          "match": {
            "url": "[\\S\\s]*",
            "method": ["GET", "POST", "PUT", "DELETE", "PATCH"]
          },
          "handlers": [
            {
              "id": "authenticator",
              "config": {
                "jwks_uri": "https://<env-domain>/realms/internal-system/protocol/openid-connect/certs"
              }
            }
          ]
        },
        {
          "match": { "url": "/q/health/.*", "method": ["GET"] },
          "handlers": []
        }
      ]
    }
```

### SC-IDP JWKS URLs (Process API — internal-system realm)

| Environment | JWKS URL |
|---|---|
| UK SIT | `https://dev-authn.idp.global.standardchartered.com/realms/internal-system/protocol/openid-connect/certs` |
| HK SIT | `https://sit-authn.idp.global.standardchartered.com/ns03/realms/internal-system/protocol/openid-connect/certs` |
| HK UAT | `https://uat-authn.idp.global.standardchartered.com/ns03/realms/internal-system/protocol/openid-connect/certs` |
| UK ARK STAGE | `https://ark-stg-authn.idp.global.standardchartered.com/ns03/realms/internal-system/protocol/openid-connect/certs` |
| UK ARK PROD | `https://ark-authn.idp.global.standardchartered.com/ns03/realms/internal-system/protocol/openid-connect/certs` |
| UK WATFORD PROD | `https://watford-authn.idp.global.standardchartered.com/ns03/realms/internal-system/protocol/openid-connect/certs` |
| HK JUMBO STAGE | `https://jumbo-stg-authn.idp.global.standardchartered.com/ns03/realms/internal-system/protocol/openid-connect/certs` |
| HK MEGA STAGE | `https://mega-stg-authn.idp.global.standardchartered.com/ns03/realms/internal-system/protocol/openid-connect/certs` |
| HK JUMBO PROD | `https://jumbo-authn.idp.global.standardchartered.com/ns03/realms/internal-system/protocol/openid-connect/certs` |
| HK MEGA PROD | `https://mega-authn.idp.global.standardchartered.com/ns03/realms/internal-system/protocol/openid-connect/certs` |

### Token Endpoint URLs (for client credential flows)

| Environment | Token URL |
|---|---|
| UK SIT | `https://dev-authn.idp.global.standardchartered.com/realms/internal-system/protocol/openid-connect/token` |
| HK SIT | `https://sit-authn.idp.global.standardchartered.com/ns03/realms/internal-system/protocol/openid-connect/token` |
| HK UAT | `https://uat-authn.idp.global.standardchartered.com/ns03/realms/internal-system/protocol/openid-connect/token` |
| UK ARK STAGE | `https://ark-stg-authn.idp.global.standardchartered.com/ns03/realms/internal-system/protocol/openid-connect/token` |
| UK ARK PROD | `https://ark-authn.idp.global.standardchartered.com/ns03/realms/internal-system/protocol/openid-connect/token` |
| UK WATFORD PROD | `https://watford-authn.idp.global.standardchartered.com/ns03/realms/internal-system/protocol/openid-connect/token` |
| HK JUMBO STAGE | `https://jumbo-stg-authn.idp.global.standardchartered.com/ns03/realms/internal-system/protocol/openid-connect/token` |
| HK MEGA STAGE | `https://mega-stg-authn.idp.global.standardchartered.com/ns03/realms/internal-system/protocol/openid-connect/token` |
| HK JUMBO PROD | `https://jumbo-authn.idp.global.standardchartered.com/ns03/realms/internal-system/protocol/openid-connect/token` |
| HK MEGA PROD | `https://mega-authn.idp.global.standardchartered.com/ns03/realms/internal-system/protocol/openid-connect/token` |

### PEP Egress Sidecar (SEP) for Callers

For a caller to make calls to a private-api Process API:
1. Caller must onboard to SC-IDP as a client (obtain keystore, share `cert_pkcs1.pem` with SC-IDP team).
2. Ensure `devkitHelmVersion >= 1.0.0+20240830.11`.
3. Configure SEP in `env/<env>/properties.yml`.

### Truststore & Keystore (required for SIP and SEP)

Store certs in HCV, then configure in `env/<environment>/properties.yml`:

```yaml
vault:
  data:
    - path: <hcv-path-for-truststore>
      sourceName: <hcv-key>
      targetName: truststore.jks
      type: file
    - path: <hcv-path-for-truststore-password>
      sourceName: <hcv-key>
      targetName: TRUSTSTORE_PASSWORD
      type: static
    - path: <hcv-path-for-keystore>
      sourceName: <hcv-key>
      targetName: keystore.jks
      type: file
    - path: <hcv-path-for-keystore-password>
      sourceName: <hcv-key>
      targetName: KEYSTORE_PASSWORD
      type: static
```

---

## Deployment

### Pre-requisite
Project must be registered as a component under Service Bench ITAM (ITAM ID 55313). Fill in the onboarding form.

### Build and Deploy
- Do **not** change `quarkus.http.port` — default 8080 required.
- Follow the ADO deployment guide: `https://confluence.global.standardchartered.com/display/SERVICEBENCH/API+Deployment`

### Verification
Test before SB ingress gateway onboarding (not available in UAT/STAGE/PROD):
```bash
curl --location \
  'https://servicebench-sit-stg.55313.app.standardchartered.com/process/v1/55313-123-your-service-your-function-name/api/hello-world'
```

> The Host value pattern: `<function-name>.<namespace>.<cluster>-apig.servicebench.global.standardchartered.com`. Never use this routing mechanism in source code — only for local-to-K8S testing.

---

## Kong Integration

Use Kong to expose internal Process APIs to external consumers.

### Prerequisites
- Consumer account onboarded to Kong.
- Access to IDP and Kong helm repos:

| Environment | IDP Repo | Kong Helm Repo |
|---|---|---|
| Catalyst | `51242-iag-catalyst-idp-service-records` | `51242-iag-catalyst-kong-helm` |
| CN | `51242-iag-cn-idp-service-records` | `51242-iag-cn-kong-helm` |

### Steps

**Step 1: Extract as Internal API** — Follow the Internal API security section above.

**Step 2: Update IDP Repo (consumer access)**
- Create branch `feature/55313-<subITAM>` from main-branch.
- Add to `env/<sit/uat/prod>/api-access/55313.json`:
```json
{
  "services": [
    {
      "enabled": "true",
      "serviceName": "<service-name>",
      "active": true,
      "scopes": ["<scope>"]
    }
  ]
}
```
- Create PR → set auto complete → get Kong reviewer approval → merge.

**Step 3: Update Kong Helm Repo (publisher config)**
- Create branch `feature/55313-<subITAM>`.
- Add publisher config to `/files/config/<env>/55313-publisher.yaml`:

```yaml
services:
  - name: "<service-name>"
    enabled: "true"
    path: "/"
    retries: 0
    protocol: "https"
    port: 443
    host: "<upstream-name>"
    connect_timeout: 30000
    write_timeout: 30000
    read_timeout: 30000
    routes:
      - name: "<route-name>"
        paths:
          - "<internal-api-path>"
        methods:
          - "POST"
        plugins:
          - name: "scb-jwt-signer"
            config:
              access_token_upstream_header: "X-JWT-Assertion"
              access_token_scopes_required:
                - "<scope>"
              channel_token_optional: true
          - name: "rate-limiting"
            config:
              hour: 2000
              day: 50000
              minute: 60
              policy: "local"
          - name: "request-size-limiting"
            config:
              allowed_payload_size: 5
              size_unit: "megabytes"
        strip_path: false
        preserve_host: false
upstreams:
  - name: "<upstream-name>"
    targets:
      - target: "servicebench-sit-stg.55313.app.standardchartered.com:443"
        weight: 100
```
- Create PR → approval → merge → request Kong team to run pipeline.

**Step 4: Update Process API Ingress Config**
- Import Kong root CA cert into truststore.
- Update ingress for each API path onboarded to Kong:
```json
{
  "match": { "url": "<api-path>", "method": ["POST"] },
  "handlers": [
    {
      "id": "authenticator",
      "config": {
        "jwks_uri": "https://<kong-host>/public/jwks",
        "token_header_name": "X-Jwt-Assertion",
        "token_detail_header_name": "X-AUTH-TOKEN-DETAIL"
      }
    }
  ]
}
```

Token details accessible in application via `X-AUTH-TOKEN-DETAIL` header.

### Contacts
- General Kong questions: API-4-Everyone Teams channel

---

## Database Migrations (Liquibase)

Creating or altering Service Bench database tables **must** go through Liquibase.

Reference: Liquibase++ | Developer Guide - SCARF - Confluence

### Catalyst Database
ADO CD pipeline auto-retrieves DBO account from HCV. Configure liquibase pipeline in ADO.

### Non-Catalyst Database
Requires extra ADO library setup for HCV. Set the following in ADO secret library `55313-<SUB-COMPONENT-ID>-NonProd`:

| Name | Example Value |
|---|---|
| `vaultBaseUrl` | `https://vault-dev.sc.net:8200` |
| `vaultLoginPath` | `tsa/auth/approle/login` |
| `vaultRoleId` | `<provided during HCV onboarding>` |
| `vaultSecretId` | `<provided during HCV onboarding>` |
| `vaultSecretPath` | `tsa/cnlvdddbs052.cn.standardchartered.com/static-creds` |
| `vaultSecretRole` | `postgres_sb-55313-193-dbo` |

---

## Support
- Teams: http://go/chat/sb-api
- Email: ServiceBench@sc.com
