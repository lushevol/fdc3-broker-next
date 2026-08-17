## Context

SCB Next exposes stable same-origin platform routes through Nginx. Today `/api/auth/*`, `/api/analytics/*`, `/api/sso/*`, and unmatched `/api/*` all target one `single-ui-bff` runtime. The Spring application contains authentication, tile administration, and analytics controllers, but authentication also calls tile and analytics implementations in-process. Copying subsets into three new code trees would therefore duplicate shared persistence, session, entitlement, and integration code before those internal contracts have been separated.

This change uses the existing public path families as a deployment seam. Three new runtime modules use a compatible build of the existing Spring artifact initially, have separate endpoints and lifecycle controls, and can later replace their implementations independently without another browser or edge contract change. `single-ui-bff` remains the compatibility fallback.

## Goals / Non-Goals

**Goals:**

- Create independently deployable auth, tile-management, and telemetry runtime services alongside `single-ui-bff`.
- Give each route family one explicit owner with most-specific-path precedence.
- Preserve every existing browser URL, rewrite, payload, header, and fallback.
- Prove independent health, rollout, failure containment, and recovery in Minikube.
- Support the same additive upstream model in the VM Nginx configuration.

**Non-Goals:**

- Deleting or renaming `single-ui-bff`.
- Copying the Spring project into three new source directories.
- Refactoring the Spring dependency graph or moving databases in this stage.
- Claiming real identity, persistence, or telemetry integration from mock-backed Minikube.
- Changing tenant-edge ownership or Ratan routes.

## Decisions

### Public path families are the service interfaces

The platform edge routes in this order:

| Public path                | Runtime owner                    | Upstream path                    |
| -------------------------- | -------------------------------- | -------------------------------- |
| `/api/auth/v1/fmo/admin/*` | `portal-tile-management-service` | `/v1/fmo/admin/*`                |
| `/api/auth/*`              | `portal-auth-service`            | the path after `/api/auth/`      |
| `/api/sso/*`               | `portal-auth-service`            | the path after `/api/sso/`       |
| `/api/analytics/*`         | `portal-telemetry-service`       | the path after `/api/analytics/` |
| unmatched `/api/*`         | `single-ui-bff`                  | the path after `/api/`           |

The tile route precedes the broader auth route. These five route families form a small stable interface while controller, persistence, and integration complexity remains behind it.

Alternative considered: introduce new public prefixes such as `/api/tiles/*`. Rejected because it would require frontend changes and a coordinated compatibility migration.

### New services are additive runtime modules

Kubernetes adds three Deployments and three ClusterIP Services with unique image coordinates, health probes, resources, restricted security, ownership/domain labels, replicas, topology spreading, and PDBs. Production may initially publish the compatible `single-ui-bff` artifact under all three coordinates. The Minikube overlay maps all four platform-service images to the deterministic mock image.

Alternative considered: one Deployment with four Services selecting the same pods. Rejected because health, rollout, scaling, and failure would remain coupled.

Alternative considered: clone the Java source three times. Rejected because login currently depends directly on tile and analytics implementations; source duplication would create shallow service wrappers and divergent shared logic rather than real module depth.

### Network policy retains platform ownership while separating lifecycle

All four platform backend Deployments use `app.kubernetes.io/component: platform-api` and accept traffic only from `scb-next-edge`. The platform edge can reach platform APIs but no tenant workloads. Each new Deployment also carries `scb-next.io/domain` so ownership and policy can be narrowed later without changing routes.

### Minikube proves routing with independent failures

The mock adapter returns an `X-SCB-Next-Mock-Service` header configured per Deployment. The verifier checks the expected header for auth, tile-management, telemetry, and fallback paths, then scales each new service to zero in turn. During each outage, its route must fail while platform UI, the other platform services, the legacy fallback, and Ratan traffic remain healthy. A trap restores any changed replica count.

## Risks / Trade-offs

- **Shared implementation defects can affect all four services** -> Independent runtimes contain process and rollout failures, while later source extraction is required for full implementation isolation.
- **Authentication still uses tile and analytics code in-process** -> Keep the compatible artifact until explicit internal interfaces replace those calls; do not claim code-level decomposition yet.
- **Route precedence can send admin traffic to auth** -> Rendered-config tests require the tile prefix before the auth prefix, and live service-identity headers verify the selected upstream.
- **Three extra runtimes increase resources** -> Define bounded requests/limits and measure production capacity before rollout.
- **Minikube bridge CNI does not enforce NetworkPolicy** -> Verify manifest structure locally and repeat denial tests on the production-selected CNI.
- **Failure tests intentionally remove endpoints** -> Restrict them to the proof namespace and restore replicas through a cleanup trap.

## Migration Plan

1. Deploy the three new services with the same approved artifact version as `single-ui-bff` and verify their direct health endpoints.
2. Apply Nginx upstream configuration without changing routes yet where the deployment mechanism allows staged configuration.
3. Enable tile, auth, SSO, and telemetry route ownership in most-specific order; retain `/api/*` fallback.
4. Verify response parity, service identity, browser behavior, independent rollouts, and each service outage/recovery.
5. Roll back by restoring the previous Nginx configuration; keep the unused services deployed until traffic is confirmed on `single-ui-bff`.
6. Extract code implementations only through separately specified changes once internal auth/tile/telemetry interfaces are defined.

## Open Questions

- Production image repository ownership and whether the initial compatible artifact is promoted once or under three coordinates must be decided by release governance.
- Database and session ownership for eventual code extraction remain architecture decisions outside this deployment stage.
