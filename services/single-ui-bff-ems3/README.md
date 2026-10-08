# Single UI BFF EMS3 Fork

This service is the EMS2/EMS3 migration fork of
[`scb/services/single-ui-bff`](../../scb/services/single-ui-bff). The original
service remains at its pre-migration version. Development of this fork lives on
`codex/ems3-single-ui-bff` in a separate worktree.

The fork includes database-selected EMS2/EMS3 routing, strict provider failure
handling, the new route/audit migration and entitlement checks on token renewal.
See [the data flow and verified behavior](docs/ems3-bff-integration.md).

See [the plan for approval](docs/ems3-approval-plan.md) for actions, estimates,
dates and the application checklist. See [the technical report](docs/ems3-three-application-report.md)
for matrices, database examples, data flow and maintenance responsibilities.

## Local Verification

With Java 17, Maven and PostgreSQL binaries installed, run from this service:

```sh
mvn -f verification/pom.xml clean verify -Dbff.verify.postgres.bin=/path/to/postgresql/bin
```

This uses temporary PostgreSQL databases and synthetic HTTP providers, without
live credentials. See [verification details](verification/README.md).

## Service Configuration

The npm workspace, Maven artifact, Spring application and CI application are
named `single-ui-bff-ems3`. The default local port is 8089. Gateway service
targets and API registration names use the fork's identity. Public endpoint
paths, response fields and JWT claims retain the compatibility contract.

Running the actual service requires explicit `EMS3_BFF_DB_URL`,
`EMS3_BFF_DB_USERNAME` and `EMS3_BFF_DB_PASSWORD`. Use a separate PostgreSQL
database for the fork, with `post_trade_portal_service` as its current schema;
the inherited SQL migrations and JPA mappings use that schema name. The fork's
Flyway migrations must not be pointed at the original database during local
development. Authentication and EMS3 settings still come from the deployment's
normal environment/secret configuration.

Deploy the fork under its own Helm release name `single-ui-bff-ems3` and route
requests to that release explicitly. It is not automatically added to the local
UI launcher or switched into an existing production gateway by this fork.

## Corporate Build

Prerequisites: JDK 17+ (per `pom.xml`) and access to the internal Artifactory used by the build. The first `mvn test` run downloads an Ansible zip during the build.

Run unit tests:

`mvn test`
