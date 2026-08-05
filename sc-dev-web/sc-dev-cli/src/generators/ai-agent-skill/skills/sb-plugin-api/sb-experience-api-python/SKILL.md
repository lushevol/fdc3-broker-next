---
name: sb-experience-api-python
description: Development guide for Service Bench Experience API projects using Python (Flask or FastAPI). Use this skill whenever building or modifying a Python-based Experience API — covers prerequisites, project creation, GraphQL queries/mutations, security (SC-IDP / PEP sidecar, OWASP), Hasura router onboarding, and deployment. Trigger on any request involving: Python Experience API, Flask GraphQL, FastAPI GraphQL, Python PEP sidecar, Python devkit, Python Hasura onboarding.
---

# Service Bench — Experience API (Python)

Python-based Experience APIs use **Flask** or **FastAPI** with a GraphQL layer to connect Service Bench plugin UI to Process APIs via the Hasura supergraph.

---

## Support & Contribution

- Teams: http://go/chat/sb-api
- Email: ServiceBench@sc.com

---

## Prerequisites

### Node.js
- Required: v20.x+
- Set npm registry: `npm config set registry https://artifactory.global.standardchartered.com/artifactory/api/npm/npm-release`

### Python
- Required: Python 3.9 or higher
- Install via myIT request if not available

### Python Proxy Setup (Windows)

Create `C:\Users\<PSID>\pip\pip.ini`:
```ini
[global]
index-url = https://artifactory.global.standardchartered.com/artifactory/api/pypi/pypi/simple
trusted-host = artifactory.global.standardchartered.com
```

---

## Project Creation

Use **SC DevKit CLI**:

```bash
npx @scdevkit/cli@latest
# Select: Service Bench → Experience API (Python) template
# Enter: project name, application id, bank id
```

Follow `README.md` in the generated project directory to run it.

### Framework Support
- **Flask** template: `55313-99-get-plugin-exp-api`
- **FastAPI** template: also available via CLI

### Project Structure

| Path | Description |
|---|---|
| `app/` | Python application folder |
| `test/` | Test file folder |
| `env/` | Environment-specific properties |
| `main.py` | Application entry point |
| `requirements.txt` | Python dependencies |
| `config.py` | Environment-specific configs |
| `gunicorn_config.py` | Gunicorn worker type configuration (Flask vs FastAPI) |

---

## GraphQL Query

All functions in `QueryService` are exposed as GraphQL queries.

**Naming rule:** Query functions must have the prefix `get_` to enable PEP sidecar authorization enforcement.

```python
class QueryService:
    def get_objects(self) -> List[Object]:
        LogUtil.log(LogType.APPLICATION, LogLevel.INFO, "Query get_objects called")
        try:
            output = [
                Object(id="10", name="TEST"),
            ]
            LogUtil.log(LogType.APPLICATION, LogLevel.INFO,
                        "Successfully retrieved objects", count=len(output))
            return output
        except Exception as e:
            LogUtil.log(LogType.ERROR, LogLevel.ERROR, "Error in get_objects query", e)
            raise e
```

---

## GraphQL Mutation

All functions in `MutationService` are exposed as GraphQL mutations.

**Naming rule:** Mutation functions must have the prefix `post_`, `put_`, `patch_`, or `delete_`.

```python
class MutationService:
    def put_object(self, input: ObjectInput) -> Object:
        # business logic
        return Object(id=input.id, name=input.name)
```

---

## Security (OWASP / SC-IDP)

Python Experience APIs must be protected against: Denial of Service, Broken Authorization, Batching Attacks, Insecure Configuration.

### Rate Limiting
Global ingress-level rate limiting is in place at Service Bench level. Pod-level resource controls also apply. Application-level rate limiting is in progress.

### Query Depth & Complexity Control

| ENV variable | Default | Description |
|---|---|---|
| `GRAPHQL_MAX_DEPTH` | 10 | Maximum allowed query nesting depth |
| `GRAPHQL_MAX_ALIAS_COUNT` | 10 | Maximum allowed alias count (complexity) |

### PEP Sidecar Configuration

Configure in `env/<env>/properties.yml`. All queries and mutations must be protected by SC-IDP.

```yaml
pep:
  config: |
    {
      "rules": [
        {
          "match": { "method": ["POST"], "body": "[\\s\\S]*?((post|get|put|delete|patch)_\\w*)[\\s\\S]*" },
          "handlers": [
            {
              "id": "authenticator",
              "config": {
                "jwks_uri": "<env-jwks-url>",
                "required_audience": [""]
              }
            },
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

---

## Deployment & Hasura Onboarding

Same process as the Kotlin/Java Experience API:

1. Deploy via ADO pipeline (do not change the default HTTP port).
2. Wait ~10 minutes — the remote schema auto-registers in Hasura.
3. **Naming convention:** `55313` + sub-component-id + `_` + functionName (dashes → underscores).
4. Contact SB API team at `http://go/chat/sc-app-platform` if onboarding issues arise.

**Hasura endpoints:**

| Environment | URL |
|---|---|
| UK DEV | `https://dev-graphql.servicebench.global.standardchartered.com/v1/graphql` |
| Catalyst Non-Prod SIT | `https://graphql-servicebench-sit-stg.55313.app.standardchartered.com/v1/graphql` |
| Catalyst Non-Prod UAT | `https://graphql-servicebench-uat-stg.55313.app.standardchartered.com/v1/graphql` |
| Catalyst Non-Prod QA | `https://graphql-servicebench-qa-stg.55313.app.standardchartered.com/v1/graphql` |
