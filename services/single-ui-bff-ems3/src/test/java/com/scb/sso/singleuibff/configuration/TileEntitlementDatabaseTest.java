package com.scb.sso.singleuibff.configuration;

import com.scb.sso.singleuibff.controller.v1.ApplicationTileController;
import com.scb.sso.singleuibff.dto.request.RequestOfApplicationCategory;
import com.scb.sso.singleuibff.dto.request.RequestOfApplicationTile;
import com.scb.sso.singleuibff.dto.request.RequestOfImportMap;
import com.scb.sso.singleuibff.entity.ApplicationCategory;
import com.scb.sso.singleuibff.entity.ApplicationTile;
import com.scb.sso.singleuibff.entity.ApplicationTileAudit;
import com.scb.sso.singleuibff.entity.ImportMap;
import com.scb.sso.singleuibff.exceptions.RecordNotCreatedException;
import com.scb.sso.singleuibff.service.v1.ApplicationCategoryService;
import com.scb.sso.singleuibff.service.v1.ApplicationTileAuditService;
import com.scb.sso.singleuibff.service.v1.ApplicationTileService;
import com.scb.sso.singleuibff.service.v1.ImportMapService;
import com.scb.sso.singleuibff.util.AdminModuleUtil;
import org.postgresql.ds.PGSimpleDataSource;
import org.springframework.aop.framework.ProxyFactory;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.jdbc.datasource.DataSourceUtils;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.transaction.annotation.AnnotationTransactionAttributeSource;
import org.springframework.transaction.interceptor.TransactionInterceptor;
import java.util.Map;
import java.util.Optional;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import java.io.IOException;
import java.net.ServerSocket;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfSystemProperty;
import static org.junit.jupiter.api.Assertions.*;

@EnabledIfSystemProperty(named = "bff.verify.database", matches = "true")
class TileEntitlementDatabaseTest {
    private static final String SCHEMA = "post_trade_portal_service";
    private static final Path POSTGRES_BIN = Path.of(System.getProperty("bff.verify.postgres.bin",
        "/opt/homebrew/opt/postgresql@18/bin"));
    private static Path cluster;
    private static String jdbcUrl;
    private static final String USER = "bff_tile_test";
    private static final List<Long> STRATEGIC = List.of(37L, 39L, 144L, 152L, 161L, 165L);

    @BeforeAll
    static void migrateAnExistingEms2TileDatabase() throws Exception {
        cluster = Files.createTempDirectory(Path.of("/tmp"), "bff-tile-config-");
        int port;
        try (var reservation = new ServerSocket(0)) { port = reservation.getLocalPort(); }
        run("initdb", "-D", cluster.resolve("data").toString(), "-U", USER,
            "--auth-local=trust", "--auth-host=trust", "--no-locale", "--encoding=UTF8");
        run("pg_ctl", "-D", cluster.resolve("data").toString(), "-l", cluster.resolve("server.log").toString(),
            "-o", "-h 127.0.0.1 -p " + port + " -k " + cluster, "-w", "start");
        jdbcUrl = "jdbc:postgresql://127.0.0.1:" + port + "/postgres";
        try (var connection = connect(); var sql = connection.createStatement()) {
            sql.execute("CREATE SCHEMA " + SCHEMA);
            sql.execute("CREATE TABLE " + SCHEMA + ".application_tile (application_tile_id bigint PRIMARY KEY,"
                + " is_active boolean NOT NULL DEFAULT true, is_template boolean NOT NULL DEFAULT false,"
                + " ems2_entities text NOT NULL, ems2_subject text NOT NULL)");
            sql.execute("CREATE TABLE " + SCHEMA + ".application_tile_audit (application_tile_audit_id bigint"
                + " GENERATED ALWAYS AS IDENTITY PRIMARY KEY, application_tile_id bigint NOT NULL,"
                + " is_active boolean NOT NULL, transaction_mode text NOT NULL)");
            sql.execute("INSERT INTO " + SCHEMA + ".application_tile VALUES (108, true, false, 'FLOW_ZERO', 'FLOW_ZERO_RAISE REQUEST')");
            sql.execute("INSERT INTO " + SCHEMA + ".application_tile_audit (application_tile_id,is_active,transaction_mode)"
                + " VALUES (108,true,'checker')");
        }
        var migrations = Files.createDirectory(cluster.resolve("migrations"));
        String name = "V1_0_11__tile_entitlement_provider.sql";
        try (var input = TileEntitlementDatabaseTest.class.getClassLoader().getResourceAsStream("db/migration/" + name)) {
            if (input == null) throw new IOException("Migration is missing: " + name);
            Files.copy(input, migrations.resolve(name));
        }
        Flyway.configure().dataSource(jdbcUrl, USER, "").schemas(SCHEMA)
            .locations("filesystem:" + migrations).baselineOnMigrate(true).baselineVersion("1.0.10")
            .load().migrate();
        try (var connection = connect(); var sql = connection.createStatement();
             var row = sql.executeQuery("SELECT t.provider,a.provider FROM " + SCHEMA + ".application_tile t JOIN "
                 + SCHEMA + ".application_tile_audit a USING(application_tile_id) WHERE application_tile_id=108")) {
            assertTrue(row.next());
            assertEquals("EMS2", row.getString(1));
            assertEquals("EMS2", row.getString(2));
        }
    }

    @BeforeEach
    void resetStrategicSiblings() throws SQLException {
        try (var connection = connect(); var sql = connection.createStatement()) {
            sql.execute("TRUNCATE " + SCHEMA + ".application_tile, " + SCHEMA + ".application_tile_audit RESTART IDENTITY");
            for (long id : STRATEGIC) {
                sql.execute("INSERT INTO " + SCHEMA + ".application_tile(application_tile_id,ems2_entities,ems2_subject) VALUES("
                    + id + ",'X_RATANONE','RATAN_STRATEGIC_CASHFLOW_BLOTTER')");
            }
        }
    }

    @AfterAll
    static void stopTheIsolatedDatabase() throws Exception {
        if (cluster != null && Files.exists(cluster.resolve("data/postmaster.pid"))) {
            run("pg_ctl", "-D", cluster.resolve("data").toString(), "-m", "immediate", "-w", "stop");
        }
    }

    @Test
    void aSingleSiblingCannotCommitAnEms3Cutover() throws Exception {
        try (var connection = connect()) {
            connection.setAutoCommit(false);
            switchTile(connection, 37);
            var error = assertThrows(SQLException.class, connection::commit);
            assertEquals("23514", error.getSQLState());
            connection.rollback();
        }
        assertEquals(6, count("application_tile", "provider='EMS2'"));
    }

    @Test
    void sixSiblingsSwitchTogetherAndTheirAuditContainsTheSameMapping() throws Exception {
        try (var connection = connect()) {
            connection.setAutoCommit(false);
            for (long id : STRATEGIC) {
                switchTile(connection, id);
                auditTile(connection, id);
            }
            connection.commit();
        }
        String binding = "provider='EMS3' AND ems3_app_id='51358' AND ems3_app_name='RATAN_ENTITLEMENT_RULE'"
            + " AND ems3_subject='RATAN_STRATEGIC_CASHFLOW_BLOTTER'";
        assertEquals(6, count("application_tile", binding));
        assertEquals(6, count("application_tile_audit", binding));
    }

    @Test
    void anAuditFailureRollsBackTheEntireTileGroup() throws Exception {
        try (var connection = connect()) {
            connection.setAutoCommit(false);
            for (long id : STRATEGIC) {
                switchTile(connection, id);
                auditTile(connection, id);
            }
            try (var sql = connection.createStatement()) {
                var error = assertThrows(SQLException.class, () -> sql.execute("INSERT INTO " + SCHEMA
                    + ".application_tile_audit(application_tile_id,is_active,transaction_mode) VALUES(37,NULL,'checker')"));
                assertEquals("23502", error.getSQLState());
            }
            connection.rollback();
        }
        assertEquals(6, count("application_tile", "provider='EMS2'"));
        assertEquals(0, count("application_tile_audit", "true"));
    }

    @Test
    void caughtAuditFailureAtThePublicAdminApiRollsBackPublishedAuditAndTileChanges() throws Exception {
        var dataSource = new PGSimpleDataSource();
        dataSource.setUrl(jdbcUrl);
        dataSource.setUser(USER);
        try (var connection = connect(); var sql = connection.createStatement()) {
            sql.execute("INSERT INTO " + SCHEMA + ".application_tile(application_tile_id,ems2_entities,ems2_subject,provider,"
                + "ems3_app_id,ems3_app_name,ems3_subject) VALUES(108,'FLOW_ZERO','FLOW_ZERO_RAISE REQUEST','EMS3','51358','FLOWZERO','RAISE_REQUEST')");
        }
        var category = ApplicationCategory.builder().applicationCategoryId(7).ems2Role("RATAN_ADMIN").build();
        var module = ImportMap.builder().importMapId(27).ems2Role("RATAN_ADMIN").build();
        var tile = ApplicationTile.builder().applicationTileId(108).applicationCategory(category).importMap(module)
            .ems2Role("RATAN_ADMIN").title("FlowZero").module("flowzero").tile("launch")
            .ems2Entities("FLOW_ZERO").ems2Subject("FLOW_ZERO_RAISE REQUEST")
            .provider("EMS3").ems3AppId("51358").ems3AppName("FLOWZERO").ems3Subject("RAISE_REQUEST")
            .isActive(true).createdBy("owner").updatedBy("owner").build();
        var tiles = mock(ApplicationTileService.class);
        when(tiles.getById(108L)).thenReturn(Optional.of(tile));
        when(tiles.update(any())).thenAnswer(call -> {
            ApplicationTile changed = call.getArgument(0);
            Connection connection = DataSourceUtils.getConnection(dataSource);
            try (var sql = connection.prepareStatement("UPDATE " + SCHEMA
                + ".application_tile SET provider=?,is_active=? WHERE application_tile_id=108")) {
                sql.setString(1, changed.getProvider());
                sql.setBoolean(2, changed.isActive());
                sql.executeUpdate();
            } finally {
                DataSourceUtils.releaseConnection(connection, dataSource);
            }
            return changed;
        });
        var audits = mock(ApplicationTileAuditService.class);
        when(audits.create(any())).thenAnswer(call -> {
            ApplicationTileAudit snapshot = call.getArgument(0);
            if ("maker".equals(snapshot.getTransactionMode())) {
                throw RecordNotCreatedException.builder().message("Synthetic audit failure").build();
            }
            Connection connection = DataSourceUtils.getConnection(dataSource);
            try (var sql = connection.prepareStatement("INSERT INTO " + SCHEMA
                + ".application_tile_audit(application_tile_id,is_active,transaction_mode,provider,ems3_app_id,ems3_app_name,ems3_subject)"
                + " VALUES(?,?,?,?,?,?,?)")) {
                sql.setLong(1, snapshot.getApplicationTileId());
                sql.setBoolean(2, snapshot.isActive());
                sql.setString(3, snapshot.getTransactionMode());
                sql.setString(4, snapshot.getProvider());
                sql.setString(5, snapshot.getEms3AppId());
                sql.setString(6, snapshot.getEms3AppName());
                sql.setString(7, snapshot.getEms3Subject());
                sql.executeUpdate();
            } finally {
                DataSourceUtils.releaseConnection(connection, dataSource);
            }
            return snapshot;
        });
        var categories = mock(ApplicationCategoryService.class);
        when(categories.getById(7L)).thenReturn(Optional.of(category));
        var modules = mock(ImportMapService.class);
        when(modules.getById(27L)).thenReturn(Optional.of(module));
        var admin = spy(new AdminModuleUtil(null, null, null, null));
        doReturn(Map.of("sub", "operator", "ems2Role", "RATAN_ADMIN")).when(admin).validate(any(), any());
        var controller = new ApplicationTileController();
        ReflectionTestUtils.setField(controller, "applicationTileService", tiles);
        ReflectionTestUtils.setField(controller, "applicationTileAuditService", audits);
        ReflectionTestUtils.setField(controller, "applicationCategoryService", categories);
        ReflectionTestUtils.setField(controller, "importMapService", modules);
        ReflectionTestUtils.setField(controller, "adminModuleUtil", admin);
        var proxy = new ProxyFactory(controller);
        proxy.setProxyTargetClass(true);
        var transaction = new TransactionInterceptor();
        transaction.setTransactionManager(new DataSourceTransactionManager(dataSource));
        transaction.setTransactionAttributeSource(new AnnotationTransactionAttributeSource());
        proxy.addAdvice(transaction);
        var api = (ApplicationTileController) proxy.getProxy();
        var requestedCategory = new RequestOfApplicationCategory();
        requestedCategory.setApplicationCategoryId(7);
        var requestedModule = new RequestOfImportMap();
        requestedModule.setImportMapId(27);
        var request = new RequestOfApplicationTile();
        request.setApplicationTileId(108);
        request.setApplicationCategory(requestedCategory);
        request.setImportMap(requestedModule);
        request.setTitle("FlowZero changed");
        request.setModule("flowzero");
        request.setTile("launch");
        request.setEms2Entities("FLOW_ZERO");
        request.setEms2Subject("FLOW_ZERO_RAISE REQUEST");
        request.setProvider("EMS2");
        request.setMode("maker");
        var response = api.update(request, new MockHttpServletRequest());
        assertEquals(400, response.getStatusCode().value());
        assertEquals(1, count("application_tile", "application_tile_id=108 AND provider='EMS3' AND is_active"));
        assertEquals(0, count("application_tile_audit", "application_tile_id=108"));
    }

    @Test
    void incompleteEms3AndUnknownProvidersAreRejected() throws Exception {
        for (String assignment : List.of("provider='OTHER'", "provider='EMS3'",
            "provider='EMS3',ems3_app_id='51358',ems3_app_name='RATAN',ems3_subject='feature',is_template=true",
            "provider='EMS3',ems3_app_id='51358',ems3_app_name='RATAN',ems3_subject='feature',ems2_entities='X_RATANONE,STAMP_STATIC'",
            "provider='EMS3',ems3_app_id='51358',ems3_app_name='RATAN',ems3_subject='feature',ems2_subject=''")) {
            try (var connection = connect(); var sql = connection.createStatement()) {
                var error = assertThrows(SQLException.class,
                    () -> sql.execute("UPDATE " + SCHEMA + ".application_tile SET " + assignment + " WHERE application_tile_id=37"));
                assertTrue(List.of("23514", "22001").contains(error.getSQLState()));
            }
        }
    }

    @Test
    void concurrentConflictingBindingsCannotBothBePublished() throws Exception {
        var executor = Executors.newSingleThreadExecutor();
        try (var first = connect()) {
            first.setAutoCommit(false);
            insertConcurrent(first, 701, "APP_A");
            var attempted = new CountDownLatch(1);
            var second = executor.submit(() -> {
                try (var connection = connect()) {
                    connection.setAutoCommit(false);
                    attempted.countDown();
                    try {
                        insertConcurrent(connection, 702, "APP_B");
                        connection.commit();
                        return "committed";
                    } catch (SQLException failure) {
                        connection.rollback();
                        return failure.getSQLState();
                    }
                }
            });
            assertTrue(attempted.await(5, TimeUnit.SECONDS));
            assertThrows(TimeoutException.class, () -> second.get(100, TimeUnit.MILLISECONDS));
            first.commit();
            assertEquals("23514", second.get(5, TimeUnit.SECONDS));
        } finally {
            executor.shutdownNow();
        }
        assertEquals(1, count("application_tile", "ems2_entities='CONCURRENT_APP'"));
    }

    private static void switchTile(Connection connection, long id) throws SQLException {
        try (var sql = connection.createStatement()) {
            sql.execute("UPDATE " + SCHEMA + ".application_tile SET provider='EMS3',ems3_app_id='51358',"
                + "ems3_app_name='RATAN_ENTITLEMENT_RULE',ems3_subject='RATAN_STRATEGIC_CASHFLOW_BLOTTER'"
                + " WHERE application_tile_id=" + id);
        }
    }

    private static void auditTile(Connection connection, long id) throws SQLException {
        try (var sql = connection.createStatement()) {
            sql.execute("INSERT INTO " + SCHEMA + ".application_tile_audit(application_tile_id,is_active,transaction_mode,"
                + "provider,ems3_app_id,ems3_app_name,ems3_subject) SELECT application_tile_id,is_active,'checker',"
                + "provider,ems3_app_id,ems3_app_name,ems3_subject FROM " + SCHEMA + ".application_tile WHERE application_tile_id=" + id);
        }
    }

    private static void insertConcurrent(Connection connection, long id, String app) throws SQLException {
        try (var sql = connection.prepareStatement("INSERT INTO " + SCHEMA + ".application_tile(application_tile_id,"
            + "ems2_entities,ems2_subject,provider,ems3_app_id,ems3_app_name,ems3_subject) VALUES(?,'CONCURRENT_APP','FEATURE','EMS3','51358',?,'FEATURE')")) {
            sql.setLong(1, id);
            sql.setString(2, app);
            sql.executeUpdate();
        }
    }

    private static int count(String table, String condition) throws SQLException {
        try (var connection = connect(); var sql = connection.createStatement();
             var rows = sql.executeQuery("SELECT count(*) FROM " + SCHEMA + "." + table + " WHERE " + condition)) {
            rows.next();
            return rows.getInt(1);
        }
    }

    private static Connection connect() throws SQLException { return DriverManager.getConnection(jdbcUrl, USER, ""); }

    private static void run(String... args) throws Exception {
        var command = new java.util.ArrayList<String>();
        command.add(POSTGRES_BIN.resolve(args[0]).toString());
        command.addAll(List.of(args).subList(1, args.length));
        var process = new ProcessBuilder(command).redirectErrorStream(true).start();
        if (!process.waitFor(30, TimeUnit.SECONDS)) {
            process.destroyForcibly();
            throw new IOException("Temporary PostgreSQL command timed out: " + args[0]);
        }
        String output = new String(process.getInputStream().readAllBytes(), java.nio.charset.StandardCharsets.UTF_8);
        if (process.exitValue() != 0) throw new IOException("Temporary PostgreSQL command failed: " + args[0] + "\n" + output);
    }
}
