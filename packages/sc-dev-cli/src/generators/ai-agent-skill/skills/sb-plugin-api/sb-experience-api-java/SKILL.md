---
name: sb-experience-api-java
description: Development guide for Service Bench Experience API projects (GraphQL) using Kotlin or Java with Quarkus. Use this skill whenever building or modifying an Experience API — covers prerequisites, project creation, GraphQL queries/mutations, cursor-based pagination, secrets management (HCV), security (SC-IDP / PEP sidecar, OWASP), nullability, REST client integration, custom error messages, and deployment. Trigger on any request involving: new GraphQL query, new GraphQL mutation, graphql-parent, devkit-graphql-common, Hasura router onboarding, Experience API secure API, PEP sidecar, EntitlementEnable, pagination, HCV secrets, Experience API deployment.
---

# Service Bench — Experience API (Kotlin / Java)

Experience APIs are GraphQL-based Quarkus services that sit between the Service Bench plugin UI and Process APIs. They expose a GraphQL schema to the Hasura supergraph and are classified as **private-api** (consumed only within Service Bench).

---

## Library Dependencies

Keep these libraries at the latest version. Check the Confluence page regularly for CVE-driven upgrades.

| Library | Purpose |
|---|---|
| `graphql-parent` (Kotlin) / `graphql-parent-java` (Java) | Quarkus parent POM — brings in quarkus-funq and all standard quarkus dependencies |
| `devkit-graphql-common` | GraphQL-Kotlin/Java utilities: input validation, security interceptors, pagination, dataloader support, SSE |

**Latest versions (as of April 2026):**
- `graphql-parent` (Kotlin): `4.0.0-10008317`
- `graphql-parent-java` (Java): `4.0.0-10008432`
- `devkit-graphql-common`: `4.0.0-10008352`

> When upgrading to any `4.0.0-7918xxx` or later, also upgrade JDK to 21 and buildpack to the latest version simultaneously.

---

## Prerequisites

### Node.js
- Required: v20.x+
- Set npm registry: `npm config set registry https://artifactory.global.standardchartered.com/artifactory/api/npm/npm-release`

### JDK
- Required: Java 21 (as of `graphql-parent 4.0.0-7918895+`)
- Previously Java 17 was used; upgrade JDK and buildpack together when upgrading parent

### Maven
- Required: 3.8.3+
- Configure `~/.m2/settings.xml` to use SCB Artifactory mirrors (maven-release, maven-snapshot, maven-central-cache)

### IDE
- Recommended: IntelliJ IDEA (install from aXess) — best Kotlin support
- Java variant available via SC DevKit CLI

---

## Project Creation

Use **SC DevKit CLI**:

```bash
npx @scdevkit/cli@latest
# Select: Service Bench → Experience API template
# Enter: project name, application id, bank id
```

Run locally:
```bash
mvn quarkus:dev
```

### Project Structure (Kotlin)

| Path | Description |
|---|---|
| `src/main/kotlin/com/sc/faas/dto/` | POJOs exposed as GraphQL schema types |
| `src/main/kotlin/com/sc/faas/service/QueryService.kt` | Methods exposed as GraphQL queries |
| `src/main/kotlin/com/sc/faas/service/MutationService.kt` | Methods exposed as GraphQL mutations |
| `src/main/kotlin/com/sc/faas/Function.kt` | GraphQL FaaS configuration and REST endpoint |
| `src/main/resources/application.properties` | GraphQL function configuration |
| `env/<env>/properties.yml` | Environment-specific properties (secrets, PEP sidecar config) |

---

## GraphQL Query

All functions in `QueryService` are exposed as GraphQL queries.

**Naming rule:** All query functions must have the prefix `get_` to enable PEP sidecar authorization enforcement.

```kotlin
// Kotlin example
@ApplicationScoped
class QueryService {
    @GraphQLName("get_objects")
    fun objects(): List<MyObject> {
        return listOf(MyObject(id = 1, name = "TEST"))
    }
}
```

```java
// Java example
@ApplicationScoped
public class QueryService {
    @GraphQLName("get_objects")
    public List<MyObject> objects() {
        return List.of(new MyObject(10L, "TEST"));
    }
}
```

### Java DTO with Lombok

```java
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MyObject {
    @Getter(onMethod_ = {@GraphQLName("id")})
    private Long id;

    @Getter(onMethod_ = {@GraphQLName("name")})
    private String name;
}
```

> Use `@Getter(onMethod_ = {@GraphQLName("xxx")})` on Lombok getters to control the schema field name. Only use getter for Lombok; set data via builder.

---

## GraphQL Mutation

All functions in `MutationService` are exposed as GraphQL mutations.

**Naming rule:** Mutation functions must have the prefix `post_`, `put_`, `patch_`, or `delete_`.

```kotlin
@ApplicationScoped
class MutationService {
    @GraphQLName("put_object")
    fun updateObject(input: MyObjectInput): MyObject {
        // business logic
        return MyObject(id = input.id, name = input.name)
    }
}
```

---

## Cursor-Based Pagination

### Setup
Requires `devkit-graphql-common` version `1.0.0-245326` or higher.

### Implementation Steps

1. Create your own `Edge` and `GraphQLConnection` implementations extending the generic `Edge<T>` and `GraphQLConnection<T>`.
2. Keep GraphQL schema DTOs thin — field accessors should be `public`, minimal computed fields.

```java
// Custom Edge
public class ReportEdge {
    public String cursor;
    public ReportDto node;

    static ReportEdge fromEdge(Edge<ReportDto> edge) {
        return new ReportEdge(edge.getCursor().toString(), edge.getNode());
    }
}

// Custom GraphQLConnection
public class ReportGraphQLConnection {
    public List<ReportEdge> edges;
    public PageInfoDisplay pageInfo;
    public Long totalCount;

    static public ReportGraphQLConnection fromGraphQLConnection(GraphQLConnection<ReportDto> c) {
        List<ReportEdge> listEdges = c.getEdges().stream()
            .map(it -> ReportEdge.fromEdge(it)).collect(Collectors.toList());
        return new ReportGraphQLConnection(listEdges,
            PageInfoDisplayKt.toDisplay(c.getPageInfo()), c.getTotalCount());
    }
}
```

### Query Service with Pagination

```java
@GraphQLName("get_reports")
public ReportGraphQLConnection getReports(
    @Nullable String after, @Nullable String before,
    @Nullable Integer first, @Nullable Integer last,
    @Nullable String sort
) {
    var offsetPageRequest = PageRequestBuilder.build(after, before, first, last, sort);
    var page = offsetPageRequest.toPage();
    var result = reportClientService.getReportClient()
        .getReports(ownerId, page.index, page.size, sort, reportProcessApiHost);
    return ReportGraphQLConnection.fromGraphQLConnection(
        GraphQLConnection.Companion.of(offsetPageRequest.getOffset(), result.getTotalElements(), result.getContent()));
}
```

---

## Secrets Management (HCV)

### Step 1 — Onboard Entity to HCV
Onboard your application entity to HashiCorp Vault (HCV). Refer to HCV's onboarding guide.

### Step 2 — Onboard Application to Service Bench
Email `ServiceBenchSupport@sc.com`:
- Subject: `[Application Onboarding to Service Bench] - <CIID>`
- Body: Environment, Entity Instance Name, LOB, Approved By

SRE will reply with Cluster URL, Service Account (`vault-auth-sa`), and Namespace.

### Step 3 — K8S Namespace Onboarding to HCV Entity
Register the k8s cluster with your entity in HCV. Refer to HCV's K8S Namespace Onboarding guide.

### Step 4 — Onboard Application Password
Onboard AD accounts, DB accounts, or static secrets to HCV. Your team is responsible for this.

### Step 5 — Reference Secrets in Code

Create `env/<env>/properties.yml`:

```yaml
vault:
  data:
    - path: <hcv-path>
      sourceName: <hcv-key>
      targetName: MY_SECRET          # becomes env var MY_SECRET
      type: static                    # or: db | ad | file (base64-encoded cert → file)
    - path: <hcv-path>
      sourceName: <hcv-key>
      targetName: truststore.jks
      type: file                      # decoded from base64, written as file under /vault/secrets/
    - path: <hcv-path>
      sourceName: <hcv-key>
      targetName: TRUSTSTORE_PASSWORD
      type: static
```

Secrets are automatically rotated — vault agent polls HCV every 5 minutes.

---

## Security (OWASP / SC-IDP)

Experience APIs must be protected against: Injection, Denial of Service, Broken Authorization, Batching Attacks, Insecure Configuration.

### Input Validation (Hibernate Validator)

```kotlin
data class CreateCaseInput(
    @field:NotBlank val caseId: String,
    @field:Size(min = 1, max = 255) val title: String,
    @field:Pattern(regexp = "^[A-Z]{2,5}$") val countryCode: String,
    @field:Email val contactEmail: String,
    @field:Min(0) @field:Max(1000) val priority: Int
)
```

Supported annotations: `@NotNull`, `@NotEmpty`, `@NotBlank`, `@Min`, `@Max`, `@Size`, `@Email`, `@Pattern`, `@Digits`, `@Positive`, `@NegativeOrZero`, `@Future`, `@FutureOrPresent`, `@PastOrPresent`, `@Range`, `@URL`, `@CreditCardNumber`.

> When using `@Pattern`, validate the regexp against ReDoS attacks using a tool such as [ReScue](https://github.com/2bdenny/ReScue).

### Query Depth & Complexity Control

| ENV variable | Default | Description |
|---|---|---|
| `DEVKIT_GRAPHQL_MAX_QUERY_DEPTH` | 5 | Maximum allowed query nesting depth |
| `DEVKIT_GRAPHQL_MAX_QUERY_COMPLEXITY` | 20 | Maximum allowed query complexity score |

Override only after careful security analysis.

### PEP Sidecar Configuration

All queries and mutations must be protected by SC-IDP authentication and authorization. Configure in `env/<env>/properties.yml`:

```yaml
pep:
  config: |
    {
      "key_store": { ... },
      "rules": [
        {
          "match": { "method": ["POST"], "body": "[\\s\\S]*?((post|get|put|delete|patch)_\\w*)[\\s\\S]*" },
          "handlers": [
            { "id": "authenticator", "config": { "jwks_uri": "<env-jwks-url>", "required_audience": [""] } },
            { "id": "activityLogger" }
          ]
        },
        {
          "match": { "method": ["POST"], "body": "<introspection-query-regex>" },
          "handlers": []
        },
        {
          "match": { "url": "/q/health/.*", "method": ["GET"] },
          "handlers": []
        }
      ]
    }
```

> Mark IntrospectionQuery as auth-free — Hasura needs schema access to build the supergraph. The provided regex only matches legitimate Hasura introspection queries.

### JWKS URLs by Environment

| Environment | JWKS URL |
|---|---|
| UK DEV | `https://dev-authn.idp.global.standardchartered.com/realms/sc_bench/protocol/openid-connect/certs` |
| HK SIT | `https://sit-authn.idp.global.standardchartered.com/ns03/realms/staff/protocol/openid-connect/certs` |
| HK UAT | `https://uat-authn.idp.global.standardchartered.com/ns03/realms/staff/protocol/openid-connect/certs` |
| UK ARK STAGE | `https://ark-stg-authn.idp.global.standardchartered.com/ns03/realms/staff/protocol/openid-connect/certs` |
| UK ARK PROD | `https://ark-authn.idp.global.standardchartered.com/ns03/realms/staff/protocol/openid-connect/certs` |
| UK WATFORD PROD | `https://watford-authn.idp.global.standardchartered.com/ns03/realms/staff/protocol/openid-connect/certs` |
| HK JUMBO STAGE | `https://jumbo-stg-authn.idp.global.standardchartered.com/ns03/realms/staff/protocol/openid-connect/certs` |
| HK MEGA STAGE | `https://mega-stg-authn.idp.global.standardchartered.com/ns03/realms/staff/protocol/openid-connect/certs` |
| HK JUMBO PROD | `https://jumbo-authn.idp.global.standardchartered.com/ns03/realms/staff/protocol/openid-connect/certs` |
| HK MEGA PROD | `https://mega-authn.idp.global.standardchartered.com/ns03/realms/staff/protocol/openid-connect/certs` |

### Fine-Grained Authorization (`@EntitlementEnable`)

Configure the packages to scan in `application.properties`:
```properties
devkit.federated.supported.packages=com.sc.faas
```

Tag functions requiring attribute-level authorization:
```kotlin
@EntitlementEnable
@GraphQLName("get_jobs")
fun jobs(entitledNamespaces: List<String>, ...): JobDefinitionGraphqlConnection {
    ...
}
```

Annotate DTO classes for instance/field-level permission control (fields set to `null` on attribute-level check failure).

Set the SC-IDP store ID:
```yaml
# env/<env>/properties.yml
envData:
  - name: SCIDP_AUTHZ_API_STORE_ID
    value: "XXXXXXXXXXXXXXXXXXXXX"
```

---

## Nullability

Map Kotlin/Java nullability to GraphQL schema correctly.

**Kotlin:** Use null-safety syntax.
```kotlin
var a: String = "hello"    // non-nullable in GraphQL
var b: String? = "world"   // nullable in GraphQL
```

**Java:** Use `@Nullable` from `javax.annotation.Nullable`.
```java
public class MyObject {
    public Long id;         // non-nullable

    @Nullable
    public String name;     // nullable
}
```

---

## REST Client (Calling Process APIs)

Ensure `pom.xml` parent includes:
```xml
<dependency>
    <groupId>io.quarkus</groupId>
    <artifactId>quarkus-rest-client</artifactId>
</dependency>
<dependency>
    <groupId>io.quarkus</groupId>
    <artifactId>quarkus-rest-client-jackson</artifactId>
</dependency>
<!-- Kotlin only -->
<dependency>
    <groupId>com.fasterxml.jackson.module</groupId>
    <artifactId>jackson-module-kotlin</artifactId>
    <version>2.17.1</version>
</dependency>
```

Define the interface:
```kotlin
@ApplicationScoped
@RegisterRestClient(baseUri = "https://<remote-server-url>:<port>", configKey = "casaBalClient")
interface CasaBalClient {
    @Path("/rcb-api/rcb/api/v1/customer-casabalances")
    @ClientHeaderParam(name = "message-sender", value = ["IBNK"])
    @GET
    fun getCasaBalances(
        @QueryParam("filter[profile-id]") profileId: String,
        @HeaderParam("request-country") requestCountry: String
    ): CasaBalResponse
}
```

Inject and use in service:
```kotlin
@ApplicationScoped
class CasaQueryService {
    @RestClient
    @Inject
    private lateinit var casaBalClient: CasaBalClient

    @GraphQLName("get_casaBalances")
    fun casaBalances(profileId: String, requestCountry: String): List<CasaBalance> {
        return casaBalClient.getCasaBalances(profileId, requestCountry).toCasaBalances()
    }
}
```

---

## Custom Error Messages

Experience APIs mask all exceptions as "Internal server error" by default to prevent leaking sensitive information (host addresses, DB connection strings, secrets) from Process API responses.

To allow specific messages through, whitelist them in `application.properties` (requires `devkit-graphql-common` ≥ `2.0.0-5315399`):

```properties
# application.properties
devkit.graphql.error.whitelist=Your specific error message here
```

> Never whitelist messages that could expose system internals. Only whitelist user-facing business error messages.

---

## Deployment

### Pre-requisite
Project must be registered as a component under Service Bench ITAM (ITAM ID 55313). Fill in the onboarding survey at `https://axess.sc.net/survey/sb`.

### Build and Deploy
- Do **not** change `quarkus.http.port` — default 8080 is required by the FaaS deployment port.
- Follow the ADO deployment guide: `https://confluence.global.standardchartered.com/display/SERVICEBENCH/API+Deployment`
- Experience API is classified as **private-api** (consumed only by Service Bench plugin UI).

### Verification
Test before Hasura onboarding (not available in UAT/STAGE/PROD):
```bash
curl -X POST \
  -H "Host: <your-exp-api>.<namespace>.jumbo-sit-apig.servicebench.global.standardchartered.com" \
  https://<env>-apig.servicebench.global.standardchard.com/graphql \
  -d '{"query": "{ <namespace> { get_health } }"}'
```

### Hasura GraphQL Router Onboarding

After deployment, the remote schema auto-registers in Hasura within ~10 minutes.

**Naming convention:** `55313` + sub-component-id + `_` + functionName (dashes → underscores)
- Example: namespace `55313-34-case-centre-plugin`, functionName `sb-case-centre-exp-api` → `_55313_34_sb_case_centre_exp_api`

**Hasura endpoints:**

| Environment | URL |
|---|---|
| UK DEV | `https://dev-graphql.servicebench.global.standardchartered.com/v1/graphql` |
| Catalyst Non-Prod SIT | `https://graphql-servicebench-sit-stg.55313.app.standardchartered.com/v1/graphql` |
| Catalyst Non-Prod UAT | `https://graphql-servicebench-uat-stg.55313.app.standardchartered.com/v1/graphql` |
| Catalyst Non-Prod QA | `https://graphql-servicebench-qa-stg.55313.app.standardchartered.com/v1/graphql` |

> Default timeout to Experience API: 30 seconds.

Contact the SB API support team (Teams: `http://go/chat/sb-api`) to complete Hasura onboarding.

---

## Support
- Teams: http://go/chat/sb-api
- Email: ServiceBench@sc.com
