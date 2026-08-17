# SCB Next VM production deployment

VM/Ansible is the supported SCB Next production deployment method. The platform edge, Base, three portal domain services, retained `single-ui-bff` fallback, Ratan container, and Cashflow blotter are independent release units. Docker Compose remains local fixture-backed acceptance only.

## Ownership

| Unit                             | Owner        | Health path        | Public route through edge                         |
| -------------------------------- | ------------ | ------------------ | ------------------------------------------------- |
| Nginx edge                       | Platform/SRE | `/healthz`         | all routes                                        |
| `mfe-base`                       | Platform     | `/health`          | `/`                                               |
| `portal-auth-service`            | Platform     | `/actuator/health` | `/api/auth/*` except admin, plus `/api/sso/*`     |
| `portal-tile-management-service` | Platform     | `/actuator/health` | `/api/auth/v1/fmo/admin/*`                        |
| `portal-telemetry-service`       | Platform     | `/actuator/health` | `/api/analytics/*`                                |
| `single-ui-bff`                  | Platform     | `/actuator/health` | unmatched platform `/api/*` fallback              |
| Ratan container                  | Ratan        | `/health`          | `/static/ratan/container/*`, `/remotes/ratan/*`   |
| Cashflow blotter                 | Ratan        | `/health`          | `/static/ratan/cashflow/*`, `/remotes/cashflow/*` |
| Ratan backend services           | Ratan        | service-specific   | `/api/ratan/*`                                    |

The three portal services are new runtime release units. During this additive stage they may use the same approved Spring artifact as `single-ui-bff`, published under independent image coordinates. This proves independent deployment and failure containment; it is not Spring source or database decomposition.

## Release procedure

1. Record the immutable version, source revision, build ID, and digest for every unit in the release record.
2. Deploy each selected unit with the existing Azure DevOps `deployEnv: vm` and approved Ansible template. Do not rebuild unchanged units.
3. Create an environment-owned `scb-next.env` from `scb-next.env.example`; do not commit addresses containing credentials or secret values.
4. Render the edge configuration with `npm run vm:render-nginx`, validate it with the estate Nginx binary, and deploy it with the platform Ansible role.
5. Run `SCB_NEXT_EDGE_ORIGIN=https://<approved-host> npm run vm:verify` plus authenticated API, WebSocket, security-header, and Playwright checks.
6. Complete the real-BFF certification in `docs/VERIFICATION_GUIDE.md`; fixture-backed evidence is insufficient for production approval.

## Manual pre-deployment verification

Create an environment-owned file from `scb-next.env.example`. The example contains documentation-only hostnames and no credentials.

```bash
cd /Users/lushevol/code/github/fdc3-broker-next/scb-next
test -f devops/vm/scb-next.env || \
  cp devops/vm/scb-next.env.example devops/vm/scb-next.env
# Replace every example hostname with the approved environment address.
npm run vm:render-nginx
! rg -n '\$\{' devops/vm/rendered/scb-next.conf
```

The `rg` command must return no unresolved template variable. After Ansible stages the rendered file and proxy include in their production locations, run the estate's approved `nginx -t` command before reload. When validating with the supplied non-root container instead, mount the rendered directory at `/etc/nginx/conf.d` and `devops/vm/nginx` at `/etc/nginx/scb-next`. The upstream names must resolve inside the container.

After the edge and upstreams are deployed:

```bash
SCB_NEXT_EDGE_ORIGIN=https://<approved-host> npm run vm:verify
curl -f -i https://<approved-host>/api/healthz
curl -f -i https://<approved-host>/api/auth/v2/sso/validate
curl -f -i https://<approved-host>/api/auth/v1/fmo/admin/importmap/active
curl -f -i https://<approved-host>/api/analytics/v1/fmo/print
curl -f -i https://<approved-host>/api/ratan/healthz
curl -f -I https://<approved-host>/static/ratan/container/remoteEntry.js
curl -f -I https://<approved-host>/static/ratan/cashflow/remoteEntry.js
```

Supply the environment's approved authorization headers or credentials for protected portal probes and verify their response contracts, not only their status codes. Then complete the authenticated API, SockJS/STOMP, browser, security-header, and real-BFF gates in [the manual verification guide](../../docs/VERIFICATION_GUIDE.md). A rendered config and fixture-backed browser pass are pre-deployment evidence only.

## Rollback

Rollback uses the existing pipeline `rollbackAppVersion` and `rollbackBuildNumber` for only the failed unit. For route-level rollback, restore the previous Nginx configuration so the affected path family returns to `single-ui-bff`; keep the three new services deployed until fallback traffic is confirmed. Verify `/healthz`, all four platform route families, both compatibility remotes, platform login, Ratan APIs, socket upgrade, and the Cashflow journey after rollback.

The external Ansible templates and VM inventory are owned by the enterprise pipeline repository and are intentionally not copied here. This directory defines their input and verification contract without production hosts or secrets.
