# Run the BFF EMS2 / EMS3 integration checks

This build compiles the actual BFF Java source and runs its tests. It uses public
dependencies so local verification does not require the private SCB starters or
the normal build's Ansible download. It does not replace the normal deployment build.

Requirements: Java 17, Maven, and locally installed PostgreSQL binaries. No live
database, EMS2/EMS3 access, production account or service credential is required.

From this directory:

```sh
mvn clean verify -Dbff.verify.postgres.bin=/path/to/postgresql/bin
```

On the development Mac:

```sh
JAVA_HOME=/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home \
  /opt/homebrew/bin/mvn clean verify \
  -Dbff.verify.postgres.bin=/opt/homebrew/opt/postgresql@18/bin
```

The database tests initialize their own PostgreSQL cluster under `/tmp`, use a
temporary port and stop that cluster afterwards. They never connect to an
existing database. The test user must be allowed to start PostgreSQL and create
shared memory; a restricted sandbox may require a normal host test run. The
temporary directory retains the database log for diagnosis.

This verification build enables the database suites by default. In the normal
corporate build, opt into them with `-Dbff.verify.database=true` and set
`-Dbff.verify.postgres.bin` to the installed PostgreSQL binary directory.

The tests run the preserved application migration and new tile-provider migration
against existing tile/audit tables, then use the real Hibernate entities and
Spring Data ownership query. They cover shared-permission cutover, pending edits,
concurrent conflicting changes and public admin transaction rollback. HTTP fixture servers
return synthetic accounts and grants. JWT checks use generated test signing keys.
None of these fixtures provision an application in the real EMS3 service.

Reports:

- `target/surefire-reports`: test results.
- `target/site/jacoco/index.html`: coverage of the production authorization adapters, tile router, JWT controller and new tile configuration validator.

The coverage check requires at least 90% line and branch coverage for those
authorization classes and the new validator. All existing BFF tests are also run; the report does not
claim 90% coverage of every existing controller or unrelated service.

See [the integration explanation](../docs/ems3-bff-integration.md) for the data
flow, schema, configuration and remaining live checks.
