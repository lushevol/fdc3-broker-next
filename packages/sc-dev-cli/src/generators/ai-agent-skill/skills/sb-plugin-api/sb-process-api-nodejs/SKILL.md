---
name: sb-process-api-nodejs
description: Development guide for Service Bench Process API projects using NodeJS. Use this skill whenever building or modifying a NodeJS-based Process API — covers prerequisites, project creation, creating REST controllers (Express/Fastify in server.mjs), security (SC-IDP / PEP sidecar, internal vs private API classification), HCV secrets (truststore/keystore), and deployment. Trigger on any request involving: NodeJS Process API, Node REST endpoint, azure-pipelines-npm.yml, server.mjs process API, sample-v1-controller.mjs.
---

# Service Bench — Process API (NodeJS)

NodeJS Process APIs expose REST endpoints as the system integration layer. They are built on NodeJS with an Express-style controller pattern, deployed as FaaS.

---

## Support

- Teams: http://go/chat/sb-api
- Email: ServiceBench@sc.com

---

## Prerequisites

### Node.js
- Required: v20.x+
- Download from Artifactory, add `node.exe` and `npm.exe` to Windows PATH.
- Verify: `node -v` and `npm -v`

### npm Registry Setup
```bash
npm config set registry https://artifactory.global.standardchartered.com/artifactory/api/npm/npm-release
```

---

## Project Creation

Use **SC DevKit CLI**:

```bash
npx @scdevkit/cli@latest
# Select: Create → Service Bench → Process API (NodeJS) template
# Enter: project name, application id, bank id
```

Then:
```bash
cd <project-directory>
npm install
npm start
```

### Project Structure

| Path | Description |
|---|---|
| `src/` | Application code |
| `test/` | Unit test code |
| `env/` | Environment-specific properties |
| `package.json` | NodeJS project metadata and dependencies |
| `server.mjs` | NodeJS app main file (HTTP server + route registration) |
| `healthcheck.mjs` | Health check endpoint |
| `info.mjs` | Info endpoint |
| `otel.mjs` | OpenTelemetry setup |
| `azure-pipelines-npm.yml` | CI/CD pipeline configuration |

---

## Creating a Controller

`sample-v1-controller.mjs` is provided as a sample controller. In `server.mjs`, add your controller to handle API calls:

```js
// src/my-feature-v1-controller.mjs
import express from 'express';
const router = express.Router();

/**
 * GET /api/experience/v1/my-feature/:id
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // business logic — call downstream service
    const result = { id, name: 'Hello World' };
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/experience/v1/my-feature
 */
router.post('/', async (req, res) => {
  const body = req.body;
  // input validation + business logic
  res.status(201).json({ success: true, id: body.id });
});

export default router;
```

Register in `server.mjs`:
```js
// server.mjs
import myFeatureRouter from './src/my-feature-v1-controller.mjs';

app.use('/api/experience/v1/my-feature', myFeatureRouter);

const server = app.listen(port, () => {
  console.log("Node API is listening on port", port);
});

process.on("SIGTERM", () => {
  console.debug("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.debug("HTTP server closed");
    shutdownOtel().catch(console.error);
  });
});
```

---

## Security (SC-IDP / PEP Sidecar)

### Classify Your API First

Set `functionType` in `env/<environment>/properties.yml`:
```yaml
functionType: <private-api|internal-api>
```

| Type | Description | Access pattern |
|---|---|---|
| **private-api** | Only consumed within the same namespace (e.g., by the Experience API) | `http://<function-name>.<namespace>.svc.cluster.local` |
| **internal-api** | Called by other Service Bench components via SB ingress gateway | `https://<service-bench-domain>/api/<ecm>` |

### Internal API — Service Bench Onboarding
Contact SB support team to onboard to SB ingress gateway with: ECM name, namespace, function name, release date.

### Private API
No SB onboarding needed. Access via `http://<function-name>.<namespace>.svc.cluster.local` directly.

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

### JWKS URLs by Environment (internal-system realm)

| Environment | JWKS URL |
|---|---|
| SIT | `https://sit-authn.idp.global.standardchartered.com/ns03/realms/internal-system/protocol/openid-connect/certs` |
| UAT | `https://uat-authn.idp.global.standardchartered.com/ns03/realms/internal-system/protocol/openid-connect/certs` |
| PROD | `https://authn.idp.global.standardchartered.com/ns03/realms/internal-system/protocol/openid-connect/certs` |

### Token Endpoint URLs

| Environment | Token URL |
|---|---|
| SIT | `https://sit-authn.idp.global.standardchartered.com/ns03/realms/internal-system/protocol/openid-connect/token` |
| UAT | `https://uat-authn.idp.global.standardchartered.com/ns03/realms/internal-system/protocol/openid-connect/token` |
| PROD | `https://authn.idp.global.standardchartered.com/ns03/realms/internal-system/protocol/openid-connect/token` |

### PEP Egress Sidecar (SEP) for Callers

To call a private-api Process API from another service:
1. Onboard to SC-IDP as a client — obtain keystore, share `cert_pkcs1.pem` with SC-IDP team.
2. Ensure `devkitHelmVersion >= 1.0.0+20240830.11`.
3. Configure SEP in `env/<env>/properties.yml`.

### Truststore & Keystore (required for SIP and SEP)

Store certs in HCV, then configure in `env/<environment>/properties.yml`:

```yaml
vault:
  data:
    - path: <hcv-path>
      sourceName: <hcv-key>
      targetName: truststore.jks
      type: file
    - path: <hcv-path>
      sourceName: <hcv-key>
      targetName: TRUSTSTORE_PASSWORD
      type: static
    - path: <hcv-path>
      sourceName: <hcv-key>
      targetName: keystore.jks
      type: file
    - path: <hcv-path>
      sourceName: <hcv-key>
      targetName: KEYSTORE_PASSWORD
      type: static
```

---

## Deployment

- Deploy via ADO pipeline (`azure-pipelines-npm.yml`).
- Do **not** change the default HTTP port — FaaS deployment depends on it.
- Follow the ADO deployment guide: `https://confluence.global.standardchartered.com/display/SERVICEBENCH/API+Deployment`
