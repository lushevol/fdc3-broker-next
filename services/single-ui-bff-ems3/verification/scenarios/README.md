# Replay the full dump through the BFF rules

This finite report adds production-dump catalogue coverage to the existing local
tests. It runs the exact native query read from `ApplicationCategoryRepo`, the
tile-provider migration, PostgreSQL/JPA routing and `AdminModuleUtil` filtering.
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

The earlier 6 October report exercised the old application-table router.
The updated replay tests the tile-provider design. A successful run reports:

```text
PASS: 113 catalogue rows; 1044 requested entities; 40 role/provider combinations; 50 individual exported roles
```

The 40 cases are eight subsets of COO/Korea/admin roles, each under four
RATAN/admin selected-feature provider combinations plus a Strategic Cashflow
only migration. Blank-subject entity access and other applications stay EMS2.
Unknown applications have explicitly empty fixture grants; their real grants are
not assumed empty. Every case asserts that switching the configured features
preserves visible IDs. All-EMS2 asserts no CES calls; each provider is called at
most once per authorization check, regardless of tile count.
All 50 individual exported roles are also compared to an independent parser
prediction. Query result IDs are compared as a set: equal ordering values do
not establish a deterministic tie order in the production SQL.

Support emails and creator/updater metadata are omitted. The input preserves
configuration names, source lines and XML grant ordinals. No real account-role
assignments, service credentials or production-valid tokens are included.

See [the complete user walkthrough](../../docs/ems3-user-walkthrough.md) and
[saved evidence](../../docs/evidence/ems3-tile-scenario-results.json).
