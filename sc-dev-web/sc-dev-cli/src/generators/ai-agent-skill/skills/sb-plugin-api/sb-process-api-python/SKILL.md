---
name: sb-process-api-python
description: Development guide for Service Bench Process API projects using Python (Flask or FastAPI). Use this skill whenever building or modifying a Python-based Process API — covers prerequisites, project creation, exposing REST endpoints, security (SC-IDP / PEP sidecar, internal vs private API classification), and deployment. Trigger on any request involving: Python Process API, Flask REST, FastAPI REST, Python PEP sidecar, Python private-api, Python internal-api.
---

# Service Bench — Process API (Python)

Python Process APIs use **Flask** or **FastAPI** to expose REST endpoints as the system integration layer. They follow the same private-api / internal-api classification and security model as the Kotlin/Java variant.

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
# Select: Service Bench → Process API (Python) template
# Enter: project name, application id, bank id
```

Follow `README.md` in the generated project directory.

### Framework Support
- **Flask** template
- **FastAPI** template

Sample projects:
- Flask: `55313-99-get-plugin-exp-api`
- FastAPI: `55313-99-get-plugin-exp-api`

### Project Structure

| Path | Description |
|---|---|
| `app/` | Python application folder |
| `test/` | Test file folder |
| `env/` | Environment-specific properties |
| `main.py` | Application entry point |
| `requirements.txt` | Python dependencies |
| `config.py` | Environment-specific configs |
| `gunicorn_config.py` | Gunicorn worker type configuration |

---

## Exposing REST Endpoints

```python
# Flask example
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/experience/v1/objects/<int:id>', methods=['GET'])
def get_object_by_id(id):
    return jsonify({"id": id, "name": "Hello World"})
```

```python
# FastAPI example
from fastapi import FastAPI

app = FastAPI()

@app.get('/api/experience/v1/objects/{id}')
def get_object_by_id(id: int):
    return {"id": id, "name": "Hello World"}
```

---

## Security (SC-IDP / PEP Sidecar)

### API Classification
Set `functionType` in `env/<environment>/properties.yml`:
```yaml
functionType: <private-api|internal-api>
```

### Internal API — SB Onboarding
Contact SB support team to onboard to SB ingress gateway with: ECM name, namespace, function name, release date.

### Private API
No SB onboarding needed. Callers invoke directly: `http://<function-name>.<namespace>.svc.cluster.local`.

### SC-IDP Onboarding (Both Types)
Approach SC-IDP team to register your Process API as a service.

### PEP Sidecar JWKS URLs (internal-system realm)

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

### PEP Sidecar config in `env/<env>/properties.yml`

```yaml
pep:
  config: |
    {
      "rules": [
        {
          "match": {
            "url": "[\\S\\s]*",
            "method": ["CONNECT","GET","POST","DELETE","PUT"]
          },
          "handlers": [
            {
              "id": "authenticator",
              "config": {
                "jwks_uri": "<env-jwks-url>"
              }
            }
          ]
        }
      ]
    }
```

### Truststore & Keystore
Same model as the Kotlin/Java Process API — store in HCV and reference via `env/<environment>/properties.yml`. See `sb-process-api-java` skill for the full YAML template.

---

## Deployment

- Deploy via ADO pipeline (do not change the default HTTP port).
- Follow the ADO deployment guide: `https://confluence.global.standardchartered.com/display/SERVICEBENCH/API+Deployment`
