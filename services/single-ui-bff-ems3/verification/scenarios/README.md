# Replay the full dump through the BFF rules

This finite report adds production-dump catalogue coverage to the existing local
tests. It runs the exact native query read from `ApplicationCategoryRepo`, the
mapping migration, PostgreSQL/JPA routing and `AdminModuleUtil` filtering.
Provider results are normalized synthetic fixtures assembled from supplied XML
grants. This is not a browser or live-provider test.

From the repository root, after running the [verification build](../README.md):

```sh
python3 services/single-ui-bff-ems3/verification/scenarios/prepare-input.py \
  --data-dir /Users/lushevol/code/github/fdc3-broker-next/scb-next/data \
  --output /tmp/ems3-scenario-input.json
python3 services/single-ui-bff-ems3/verification/scenarios/run-report.py \
  --input /tmp/ems3-scenario-input.json --output /tmp/ems3-scenario-results.json
```

Requires Python 3.10+, Java 17 and PostgreSQL binaries. `JAVA_HOME` selects Java;
the default PostgreSQL path matches the verification build's Mac installation.
The runner reuses the saved Maven Surefire dependency classpath. It creates and
stops an isolated database under `/tmp`, without connecting to an existing DB.

Recorded result on 2026-10-06:

```text
PASS: 113 catalogue rows; 1044 requested entities; 40 role/provider combinations; 50 individual exported roles
```

The 40 cases are eight subsets of COO/Korea/admin roles, each under four
Ratan/admin provider selections plus one entire-scope EMS3 selection. Unknown
applications have explicitly empty fixture grants; their real grants are not
assumed empty. Every case asserts that changing providers preserves visible IDs.
All-EMS2 and all-scope EMS3 assert no calls to the unselected provider.
All 50 individual exported roles are also compared to an independent parser
prediction. Query result IDs are compared as a set: equal ordering values do
not establish a deterministic tie order in the production SQL.

Support emails and creator/updater metadata are omitted. The input preserves
configuration names, source lines and XML grant ordinals. No real account-role
assignments, service credentials or production-valid tokens are included.

See [the complete user walkthrough](../../docs/ems3-user-walkthrough.md) and
[saved evidence](../../docs/evidence/ems3-scenario-results.json).
