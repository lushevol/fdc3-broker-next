# SCB Next VM production deployment

VM/Ansible is the supported SCB Next production deployment method. The platform edge, Base, `single-ui-bff`, Ratan container, and Cashflow blotter are independent release units. Docker Compose remains local fixture-backed acceptance only.

## Ownership

| Unit                   | Owner        | Health path        | Public route through edge                                          |
| ---------------------- | ------------ | ------------------ | ------------------------------------------------------------------ |
| Nginx edge             | Platform/SRE | `/healthz`         | all routes                                                         |
| `mfe-base`             | Platform     | `/health`          | `/`                                                                |
| `single-ui-bff`        | Platform     | `/actuator/health` | `/api/auth/*`, `/api/analytics/*`, `/api/sso/*`, platform `/api/*` |
| Ratan container        | Ratan        | `/health`          | `/static/ratan/container/*`, `/remotes/ratan/*`                    |
| Cashflow blotter       | Ratan        | `/health`          | `/static/ratan/cashflow/*`, `/remotes/cashflow/*`                  |
| Ratan backend services | Ratan        | service-specific   | `/api/ratan/*`                                                     |

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
curl -f -i https://<approved-host>/api/ratan/healthz
curl -f -I https://<approved-host>/static/ratan/container/remoteEntry.js
curl -f -I https://<approved-host>/static/ratan/cashflow/remoteEntry.js
```

Then complete the authenticated API, SockJS/STOMP, browser, security-header, and real-BFF gates in [the manual verification guide](../../docs/VERIFICATION_GUIDE.md). A rendered config and fixture-backed browser pass are pre-deployment evidence only.

## Rollback

Rollback uses the existing pipeline `rollbackAppVersion` and `rollbackBuildNumber` for only the failed unit. Restore the previous rendered edge configuration before reloading Nginx if routing caused the failure. Verify `/healthz`, both compatibility remotes, platform login, Ratan APIs, socket upgrade, and the Cashflow journey after rollback.

The external Ansible templates and VM inventory are owned by the enterprise pipeline repository and are intentionally not copied here. This directory defines their input and verification contract without production hosts or secrets.
