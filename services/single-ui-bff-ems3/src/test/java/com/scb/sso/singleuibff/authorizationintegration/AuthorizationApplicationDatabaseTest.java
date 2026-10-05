package com.scb.sso.singleuibff.authorizationintegration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.scb.sso.singleuibff.entity.AuthorizationApplication;
import com.scb.sso.singleuibff.repository.AuthorizationApplicationRepo;
import jakarta.persistence.EntityManager;
import jakarta.persistence.OptimisticLockException;
import java.io.IOException;
import java.net.ServerSocket;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;
import org.flywaydb.core.Flyway;
import org.hibernate.SessionFactory;
import org.hibernate.boot.MetadataSources;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfSystemProperty;
import org.springframework.data.jpa.repository.support.JpaRepositoryFactory;

@EnabledIfSystemProperty(named = "bff.verify.database", matches = "true")
class AuthorizationApplicationDatabaseTest {
    private static final String SCHEMA = "post_trade_portal_service";
    private static final Path POSTGRES_BIN = Path.of(System.getProperty("bff.verify.postgres.bin",
        "/opt/homebrew/opt/postgresql@18/bin"));
    private static Path cluster;
    private static String jdbcUrl;
    private static String databaseUser;
    private static SessionFactory sessionFactory;

    @BeforeAll
    static void startIsolatedDatabaseAndMigrate() throws Exception {
        cluster = Files.createTempDirectory(Path.of("/tmp"), "bff-route-");
        databaseUser = "bff_route_test";
        int port;
        try (var reservation = new ServerSocket(0)) {
            port = reservation.getLocalPort();
        }
        run("initdb", "-D", cluster.resolve("data").toString(), "-U", databaseUser,
            "--auth-local=trust", "--auth-host=trust", "--no-locale", "--encoding=UTF8");
        run("pg_ctl", "-D", cluster.resolve("data").toString(), "-l", cluster.resolve("server.log").toString(),
            "-o", "-h 127.0.0.1 -p " + port + " -k " + cluster, "-w", "start");
        jdbcUrl = "jdbc:postgresql://127.0.0.1:" + port + "/postgres";
        try (Connection connection = connect(); var statement = connection.createStatement()) {
            statement.execute("CREATE SCHEMA " + SCHEMA);
            statement.execute("CREATE TABLE " + SCHEMA
                + ".application_tile (ems2_entities text, is_active boolean NOT NULL)");
            statement.execute("INSERT INTO " + SCHEMA + ".application_tile VALUES "
                + "(' X_RATANONE , FMO PORTAL ADMIN, X_RATANONE ', true),"
                + "(' X_INACTIVE , , ', false), ('', true), (NULL, true)");
        }
        Path migrationDirectory = Files.createDirectory(cluster.resolve("migrations"));
        String migration = "V1_0_10__authorization_application.sql";
        try (var input = AuthorizationApplicationDatabaseTest.class.getClassLoader()
            .getResourceAsStream("db/migration/" + migration)) {
            if (input == null) throw new IOException("Migration resource unavailable: " + migration);
            Files.copy(input, migrationDirectory.resolve(migration));
        }
        Flyway.configure().dataSource(jdbcUrl, databaseUser, "")
            .locations("filesystem:" + migrationDirectory).schemas(SCHEMA)
            .baselineOnMigrate(true).baselineVersion("1.0.9").load().migrate();
        var registry = new StandardServiceRegistryBuilder()
            .applySetting("hibernate.connection.url", jdbcUrl)
            .applySetting("hibernate.connection.username", databaseUser)
            .applySetting("hibernate.connection.password", "")
            .applySetting("hibernate.hbm2ddl.auto", "validate")
            .build();
        sessionFactory = new MetadataSources(registry).addAnnotatedClass(AuthorizationApplication.class)
            .buildMetadata().buildSessionFactory();
    }

    @AfterAll
    static void stopIsolatedDatabase() throws Exception {
        if (sessionFactory != null) {
            sessionFactory.close();
        }
        if (cluster != null && Files.exists(cluster.resolve("data/postmaster.pid"))) {
            run("pg_ctl", "-D", cluster.resolve("data").toString(), "-m", "immediate", "-w", "stop");
        }
    }

    @Test
    void backfillsAllDistinctTileEntitiesWithEms2WithoutGrantingMissingEntities() throws Exception {
        try (Connection connection = connect(); var statement = connection.createStatement();
             var rows = statement.executeQuery("SELECT bff_entity_name, provider, mapping_version, active,"
                 + " subject_long_names::text FROM " + SCHEMA + ".authorization_application"
                 + " WHERE bff_entity_name IN ('FMO PORTAL ADMIN', 'X_INACTIVE', 'X_RATANONE')"
                 + " ORDER BY bff_entity_name")) {
            var routes = new ArrayList<List<Object>>();
            while (rows.next()) {
                routes.add(List.of(rows.getString(1), rows.getString(2), rows.getLong(3),
                    rows.getBoolean(4), rows.getString(5)));
            }
            assertEquals(List.of(
                List.of("FMO PORTAL ADMIN", "EMS2", 0L, true, "{}"),
                List.of("X_INACTIVE", "EMS2", 0L, true, "{}"),
                List.of("X_RATANONE", "EMS2", 0L, true, "{}")), routes);
        }
    }

    @Test
    void repositoryReturnsOnlyRequestedPersistedRoutesAndRoundTripsStaticSubjectNames() {
        Long id = transact(repository -> {
            var route = ems3Route("X_DB_REPOSITORY", "DB_REPOSITORY_APP", 501L);
            route.setSubjectLongNames(Map.of("TRADE_BLOTTER", "/RATAN/TRADE_BLOTTER"));
            return repository.saveAndFlush(route).getId();
        });

        var routes = transact(repository -> repository.findByBffEntityNameIn(List.of("X_DB_REPOSITORY", "UNKNOWN")));

        assertEquals(1, routes.size());
        var route = routes.get(0);
        assertEquals(id, route.getId());
        assertEquals("EMS3", route.getProvider());
        assertEquals(101L, route.getBffEntityId());
        assertEquals("51358", route.getEms3AppId());
        assertEquals("51358", route.getEms3ItamId());
        assertEquals(501L, route.getEms3AppUid());
        assertEquals(Map.of("TRADE_BLOTTER", "/RATAN/TRADE_BLOTTER"), route.getSubjectLongNames());
        assertEquals(0L, route.getMappingVersion());
        assertTrue(route.isActive());
        assertNotNull(route.getCreatedAt());
        assertNotNull(route.getUpdatedAt());
    }

    @Test
    void databaseRejectsBlankEntitiesUnknownProvidersAndIncompleteEms3Identity() throws Exception {
        rejects("INSERT INTO " + SCHEMA + ".authorization_application (bff_entity_name) VALUES ('  ')", "23514");
        rejects("INSERT INTO " + SCHEMA + ".authorization_application (bff_entity_name) VALUES (' X_PADDED ')", "23514");
        rejects("INSERT INTO " + SCHEMA + ".authorization_application (bff_entity_name, provider)"
            + " VALUES ('X_BAD_PROVIDER', 'EMS4')", "23514");
        rejects("INSERT INTO " + SCHEMA + ".authorization_application (bff_entity_name, provider)"
            + " VALUES ('X_INCOMPLETE', 'EMS3')", "23514");
        rejects("INSERT INTO " + SCHEMA + ".authorization_application (bff_entity_name, bff_entity_id)"
            + " VALUES ('X_ZERO_ID', 0)", "23514");
        rejects("INSERT INTO " + SCHEMA + ".authorization_application (bff_entity_name, ems3_app_uid)"
            + " VALUES ('X_ZERO_UID', 0)", "23514");
        rejects("INSERT INTO " + SCHEMA + ".authorization_application (bff_entity_name, mapping_version)"
            + " VALUES ('X_NEGATIVE_VERSION', -1)", "23514");
        rejects("INSERT INTO " + SCHEMA + ".authorization_application (bff_entity_name) VALUES ('X_RATANONE')", "23505");
    }

    @Test
    void databaseAcceptsOnlyNonblankStringToStringSubjectAliases() throws Exception {
        for (String invalid : List.of("[]", "null", "{\"FEATURE\":1}", "{\"FEATURE\":null}",
            "{\"FEATURE\":\" \"}", "{\" \" : \"/FEATURE\"}", "{\"FEATURE\":{\"nested\":\"grant\"}}")) {
            try (Connection connection = connect(); var statement = connection.prepareStatement("INSERT INTO " + SCHEMA
                + ".authorization_application (bff_entity_name, subject_long_names) VALUES (?, ?::jsonb)")) {
                statement.setString(1, "X_BAD_JSON");
                statement.setString(2, invalid);
                SQLException error = assertThrows(SQLException.class, statement::executeUpdate);
                assertEquals("23514", error.getSQLState());
            }
        }
    }

    @Test
    void databasePreventsTwoActiveEntitiesFromClaimingOneEms3Application() {
        transact(repository -> repository.saveAndFlush(ems3Route("X_DB_UNIQUE", "DB_UNIQUE_APP", 502L)));

        assertThrows(RuntimeException.class, () -> transact(repository ->
            repository.saveAndFlush(ems3Route("X_DB_DUPLICATE_NAME", "DB_UNIQUE_APP", 503L))));
        assertThrows(RuntimeException.class, () -> transact(repository ->
            repository.saveAndFlush(ems3Route("X_DB_DUPLICATE_UID", "DB_OTHER_APP", 502L))));

        Long inactiveId = transact(repository -> {
            var route = ems3Route("X_DB_INACTIVE_MAPPING", "DB_UNIQUE_APP", 502L);
            route.setActive(false);
            return repository.saveAndFlush(route).getId();
        });
        assertNotNull(inactiveId);
    }

    @Test
    void versionAdvancesOnceForJpaAndDirectSqlChangesAndAuditRetainsEverySnapshot() throws Exception {
        Long id = transact(repository -> {
            var route = new AuthorizationApplication();
            route.setBffEntityName("X_DB_AUDIT");
            route.setCreatedBy("test-maker");
            route.setUpdatedBy("test-maker");
            return repository.saveAndFlush(route).getId();
        });
        assertEquals(0L, transact(repository -> repository.findById(id).orElseThrow()).getMappingVersion());

        transact(repository -> {
            var route = repository.findById(id).orElseThrow();
            route.setProvider("EMS3");
            route.setBffEntityId(102L);
            route.setEms3AppName("DB_AUDIT_APP");
            route.setEms3AppId("51358");
            route.setEms3AppUid(504L);
            route.setEms3ItamId("51358");
            route.setUpdatedBy("test-reviewer");
            return repository.saveAndFlush(route);
        });
        assertEquals(1L, transact(repository -> repository.findById(id).orElseThrow()).getMappingVersion());

        try (Connection connection = connect(); var statement = connection.prepareStatement("UPDATE " + SCHEMA
            + ".authorization_application SET active = false, updated_by = 'test-operator' WHERE id = ?")) {
            statement.setLong(1, id);
            assertEquals(1, statement.executeUpdate());
        }
        var inactive = transact(repository -> repository.findById(id).orElseThrow());
        assertEquals(2L, inactive.getMappingVersion());
        assertEquals("test-operator", inactive.getUpdatedBy());
        assertTrue(inactive.getUpdatedAt().isAfter(inactive.getCreatedAt()));

        transact(repository -> {
            repository.deleteById(id);
            repository.flush();
            return null;
        });
        try (Connection connection = connect(); var statement = connection.prepareStatement("SELECT transaction_mode,"
            + " mapping_version, changed_by, configuration->>'provider', configuration->>'active' FROM "
            + SCHEMA + ".authorization_application_audit WHERE authorization_application_id = ? ORDER BY id")) {
            statement.setLong(1, id);
            try (var rows = statement.executeQuery()) {
                var history = new ArrayList<List<Object>>();
                while (rows.next()) {
                    history.add(List.of(rows.getString(1), rows.getLong(2), rows.getString(3),
                        rows.getString(4), rows.getString(5)));
                }
                assertEquals(List.of(
                    List.of("INSERT", 0L, "test-maker", "EMS2", "true"),
                    List.of("UPDATE", 1L, "test-reviewer", "EMS3", "true"),
                    List.of("UPDATE", 2L, "test-operator", "EMS3", "false"),
                    List.of("DELETE", 2L, databaseUser, "EMS3", "false")), history);
            }
        }
    }

    @Test
    void staleJpaWritesCannotOverwriteAChangedRoute() {
        Long id = transact(repository -> {
            var route = new AuthorizationApplication();
            route.setBffEntityName("X_DB_STALE");
            return repository.saveAndFlush(route).getId();
        });
        try (EntityManager staleManager = sessionFactory.createEntityManager()) {
            staleManager.getTransaction().begin();
            var staleRepository = new JpaRepositoryFactory(staleManager).getRepository(AuthorizationApplicationRepo.class);
            var stale = staleRepository.findById(id).orElseThrow();
            transact(repository -> {
                var fresh = repository.findById(id).orElseThrow();
                fresh.setActive(false);
                return repository.saveAndFlush(fresh);
            });
            stale.setUpdatedBy("stale-writer");
            assertThrows(OptimisticLockException.class, () -> staleRepository.saveAndFlush(stale));
            staleManager.getTransaction().rollback();
        }
        assertEquals(1L, transact(repository -> repository.findById(id).orElseThrow()).getMappingVersion());
    }

    @Test
    void directSqlCannotSkipOrResetTheMappingVersion() throws Exception {
        Long id = transact(repository -> {
            var route = new AuthorizationApplication();
            route.setBffEntityName("X_DB_SQL_VERSION");
            return repository.saveAndFlush(route).getId();
        });
        rejects("UPDATE " + SCHEMA + ".authorization_application SET mapping_version = 5 WHERE id = " + id, "23514");
        assertEquals(0L, transact(repository -> repository.findById(id).orElseThrow()).getMappingVersion());
    }

    private static AuthorizationApplication ems3Route(String entity, String application, long uid) {
        var route = new AuthorizationApplication();
        route.setBffEntityName(entity);
        route.setProvider("EMS3");
        route.setBffEntityId(101L);
        route.setEms3AppName(application);
        route.setEms3AppId("51358");
        route.setEms3AppUid(uid);
        route.setEms3ItamId("51358");
        return route;
    }

    private static <T> T transact(Function<AuthorizationApplicationRepo, T> operation) {
        try (EntityManager manager = sessionFactory.createEntityManager()) {
            manager.getTransaction().begin();
            try {
                var repository = new JpaRepositoryFactory(manager).getRepository(AuthorizationApplicationRepo.class);
                T result = operation.apply(repository);
                manager.getTransaction().commit();
                return result;
            } finally {
                if (manager.getTransaction().isActive()) {
                    manager.getTransaction().rollback();
                }
            }
        }
    }

    private static void rejects(String sql, String sqlState) throws Exception {
        try (Connection connection = connect(); var statement = connection.createStatement()) {
            SQLException error = assertThrows(SQLException.class, () -> statement.execute(sql));
            assertEquals(sqlState, error.getSQLState());
        }
    }

    private static Connection connect() throws Exception {
        return DriverManager.getConnection(jdbcUrl, databaseUser, "");
    }

    private static void run(String executable, String... arguments) throws Exception {
        Path binary = POSTGRES_BIN.resolve(executable);
        if (!Files.isExecutable(binary)) {
            throw new IOException("PostgreSQL binary unavailable: " + binary);
        }
        var command = new ArrayList<String>();
        command.add(binary.toString());
        command.addAll(List.of(arguments));
        Path output = cluster.resolve(executable + "-" + System.nanoTime() + ".log");
        Process process = new ProcessBuilder(command).redirectErrorStream(true)
            .redirectOutput(output.toFile()).start();
        if (!process.waitFor(30, TimeUnit.SECONDS)) {
            process.destroyForcibly();
            throw new IOException("PostgreSQL command timed out: " + executable);
        }
        if (process.exitValue() != 0) {
            throw new IOException("PostgreSQL command failed: " + executable + "\n" + Files.readString(output));
        }
    }
}
