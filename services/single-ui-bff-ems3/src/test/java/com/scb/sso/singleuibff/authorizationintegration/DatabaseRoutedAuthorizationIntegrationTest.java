package com.scb.sso.singleuibff.authorizationintegration;

import static com.scb.sso.singleuibff.util.Constant.HEADER_JWT_TOKEN;
import static com.scb.sso.singleuibff.util.Constant.HEADER_REFRESH_TOKEN;
import static com.scb.sso.singleuibff.util.Constant.JWT_ISSUER_ENTITLEMENT;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.scb.sso.singleuibff.config.EMS2ConfigProperties;
import com.scb.sso.singleuibff.config.EMS3ConfigProperties;
import com.scb.sso.singleuibff.config.JWTConfigProperties;
import com.scb.sso.singleuibff.config.TileEntitlementProperties;
import com.scb.sso.singleuibff.controller.v2.JwtAuthenticationController;
import com.scb.sso.singleuibff.dto.request.RequestOfAuthenticate;
import com.scb.sso.singleuibff.dto.request.RequestOfAuthenticateEntra;
import com.scb.sso.singleuibff.dto.request.RequestOfJWT;
import com.scb.sso.singleuibff.dto.request.RequestOfRelogin;
import com.scb.sso.singleuibff.dto.response.ResponseOfAuthenticate;
import com.scb.sso.singleuibff.entity.ApplicationSession;
import com.scb.sso.singleuibff.entity.ApplicationCategory;
import com.scb.sso.singleuibff.entity.ApplicationTile;
import com.scb.sso.singleuibff.entity.ImportMap;
import com.scb.sso.singleuibff.repository.ApplicationSessionRepo;
import com.scb.sso.singleuibff.repository.ApplicationCategoryRepo;
import com.scb.sso.singleuibff.service.v1.AnalyticService;
import com.scb.sso.singleuibff.service.v1.ApplicationCategoryService;
import com.scb.sso.singleuibff.service.v1.implementation.OUDAuthenticationService;
import com.scb.sso.singleuibff.service.v1.implementation.SessionServiceImplementation;
import com.scb.sso.singleuibff.service.v2.implementation.EMS2AuthorizationImplementation;
import com.scb.sso.singleuibff.service.v2.implementation.EMS3AuthorizationImplementation;
import com.scb.sso.singleuibff.service.v2.implementation.RoutingAuthorizationService;
import com.scb.sso.singleuibff.util.AdminModuleUtil;
import com.scb.sso.singleuibff.util.JwtTokenUtil;
import com.scb.sso.singleuibff.util.OudUtil;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.KeyPairGenerator;
import java.sql.Connection;
import java.sql.DriverManager;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import org.flywaydb.core.Flyway;
import org.hibernate.SessionFactory;
import org.hibernate.boot.MetadataSources;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfSystemProperty;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.data.jpa.repository.support.JpaRepositoryFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.jpa.SharedEntityManagerCreator;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

/** Synthetic accounts and app identities exercise the production BFF stack without live EMS access. */
@EnabledIfSystemProperty(named = "bff.verify.database", matches = "true")
class DatabaseRoutedAuthorizationIntegrationTest {
    private static final String SCHEMA = "post_trade_portal_service";
    private static final String USER = "poc-test-user";
    private static final String ALPHA = "X_POC_ALPHA";
    private static final String BETA = "X_POC_BETA";
    private static final ObjectMapper JSON = new ObjectMapper();
    private static final Path POSTGRES_BIN = Path.of(System.getProperty("bff.verify.postgres.bin",
        "/opt/homebrew/opt/postgresql@18/bin"));
    private static Path cluster;
    private static String jdbcUrl;
    private static SessionFactory sessionFactory;
    private static JwtTokenUtil tokens;

    @BeforeAll
    static void migrateIsolatedDatabaseAndCreateSigningKeys() throws Exception {
        cluster = Files.createTempDirectory(Path.of("/tmp"), "bff-integrated-");
        int port;
        try (var reservation = new ServerSocket(0)) {
            port = reservation.getLocalPort();
        }
        run("initdb", "-D", cluster.resolve("data").toString(), "-U", "bff_integration_test",
            "--auth-local=trust", "--auth-host=trust", "--no-locale", "--encoding=UTF8");
        run("pg_ctl", "-D", cluster.resolve("data").toString(), "-l", cluster.resolve("server.log").toString(),
            "-o", "-h 127.0.0.1 -p " + port + " -k " + cluster, "-w", "start");
        jdbcUrl = "jdbc:postgresql://127.0.0.1:" + port + "/postgres";
        execute("CREATE SCHEMA " + SCHEMA);
        execute("CREATE TABLE " + SCHEMA + ".application_category (application_category_id bigint PRIMARY KEY, label text, is_active boolean, order_no bigint)");
        execute("CREATE TABLE " + SCHEMA + ".import_map (import_map_id bigint PRIMARY KEY, key_name text, is_active boolean)");
        execute("CREATE TABLE " + SCHEMA + ".application_tile (application_tile_id bigint PRIMARY KEY, application_category_id bigint, import_map_id bigint, ems2_entities text, ems2_subject text, is_active boolean NOT NULL, is_template boolean, module text, tile text, title text, order_no bigint)");
        execute("CREATE TABLE " + SCHEMA + ".application_tile_audit (application_tile_audit_id bigint, application_tile_id bigint, ems2_entities text, ems2_subject text, is_active boolean, is_template boolean, transaction_mode text, created_at timestamp, updated_at timestamp)");
        execute("INSERT INTO " + SCHEMA + ".application_category VALUES (1, 'POC', true, 1)");
        execute("INSERT INTO " + SCHEMA + ".import_map VALUES (1, 'poc_container', true)");
        Path migrations = Files.createDirectory(cluster.resolve("migrations"));
        for (String name : List.of("V1_0_2__fmo_schema_config.sql", "V1_0_10__authorization_application.sql", "V1_0_11__tile_entitlement_provider.sql")) {
            try (var input = DatabaseRoutedAuthorizationIntegrationTest.class.getClassLoader()
                .getResourceAsStream("db/migration/" + name)) {
                if (input == null) throw new IOException("Migration resource unavailable: " + name);
                Files.copy(input, migrations.resolve(name));
            }
        }
        Flyway.configure().dataSource(jdbcUrl, "bff_integration_test", "")
            .locations("filesystem:" + migrations).schemas(SCHEMA)
            .baselineOnMigrate(true).baselineVersion("1.0.1").load().migrate();
        var registry = new StandardServiceRegistryBuilder()
            .applySetting("hibernate.connection.url", jdbcUrl + "?currentSchema=" + SCHEMA)
            .applySetting("hibernate.connection.username", "bff_integration_test")
            .applySetting("hibernate.connection.password", "")
            .applySetting("hibernate.hbm2ddl.auto", "none")
            .applySetting("hibernate.physical_naming_strategy", "org.hibernate.boot.model.naming.CamelCaseToUnderscoresNamingStrategy")
            .build();
        sessionFactory = new MetadataSources(registry).addAnnotatedClass(ApplicationCategory.class)
            .addAnnotatedClass(ApplicationTile.class).addAnnotatedClass(ImportMap.class)
            .addAnnotatedClass(ApplicationSession.class).buildMetadata().buildSessionFactory();
        var generator = KeyPairGenerator.getInstance("RSA");
        generator.initialize(2048);
        var keys = generator.generateKeyPair();
        var jwt = new JWTConfigProperties();
        jwt.setPrv(Base64.getEncoder().encodeToString(keys.getPrivate().getEncoded()));
        jwt.setPub(Base64.getEncoder().encodeToString(keys.getPublic().getEncoded()));
        jwt.setTokenExpiration(15);
        jwt.setReTokenExpiration(60);
        jwt.setAbsoluteExpiration(90);
        tokens = new JwtTokenUtil(jwt);
    }

    @AfterAll
    static void stopIsolatedDatabase() throws Exception {
        if (sessionFactory != null) sessionFactory.close();
        if (cluster != null && Files.exists(cluster.resolve("data/postmaster.pid"))) {
            run("pg_ctl", "-D", cluster.resolve("data").toString(), "-m", "immediate", "-w", "stop");
        }
    }

    @BeforeEach
    void startWithOneLegacyAndOneModernApplication() throws Exception {
        execute("DELETE FROM " + SCHEMA + ".application_tile_audit");
        execute("DELETE FROM " + SCHEMA + ".application_tile");
        execute("INSERT INTO " + SCHEMA + ".application_tile (application_tile_id, application_category_id, import_map_id, ems2_entities, ems2_subject, is_active, is_template, module, tile, title, order_no) VALUES "
            + "(1,1,1,'" + ALPHA + "','ALPHA_FEATURE',true,false,'poc','alpha','alpha',1),"
            + "(2,1,1,'" + BETA + "','BETA_FEATURE',true,false,'poc','beta','beta',2),"
            + "(3,1,1,'" + ALPHA + "','NO_GRANTED_FEATURE',true,false,'poc','hidden','hidden',3),"
            + "(4,1,1,'','',true,true,'poc','template','template',4)");
        switchToEms3(BETA, 8, 11);
    }

    @Test
    void databaseSwitchIsUsedByNextLoginAndValidationWithSameTilesAndSignedClaims() throws Exception {
        try (var fixture = new ProviderFixture()) {
            var controller = controller(fixture);
            var mixedHttp = new MockHttpServletResponse();
            var mixed = login(controller, mixedHttp);
            assertSuccessful(mixed);
            assertEntitiesAndTiles(mixed.getBody(), 199L);
            assertEquals(9001L, mixed.getBody().getEntities().get(0).getSubjects().get(0).getActions().get(0).getEntitlementId());
            assertEquals(List.of(List.of(ALPHA)), fixture.legacyScopes);
            String mixedClaims = entitlementClaims(mixed.getBody());
            assertEquals(Map.of(ALPHA + ":TEST_OPERATOR", Map.of("ALPHA_FEATURE", List.of("ACCESS")),
                BETA + ":TEST_OPERATOR", Map.of("BETA_FEATURE", List.of("ACCESS"))), JSON.readValue(mixedClaims, Map.class));
            String sessionToken = tokens.retrieveHeaderToken(mixedHttp.getHeader(HEADER_JWT_TOKEN));
            assertTrue(tokens.validateToken(sessionToken));
            assertEquals(USER, JSON.readTree(tokens.retrieveUserInfoFromToken(sessionToken)).path("sub").asText());
            assertEquals("poc-session", JSON.readTree(tokens.retrieveUserInfoFromToken(sessionToken)).path("id").asText());

            switchToEms3(ALPHA, 7, 10);
            var nextHttp = new MockHttpServletResponse();
            var next = login(controller, nextHttp);
            assertSuccessful(next);
            assertEntitiesAndTiles(next.getBody(), 299L);
            assertNull(next.getBody().getEntities().get(0).getSubjects().get(0).getActions().get(0).getEntitlementId());
            assertEquals(mixedClaims, entitlementClaims(next.getBody()));
            var validateHttp = new MockHttpServletResponse();
            var validated = controller.checkTokenValidity(jwtRequest(mixedHttp), validateHttp);
            assertSuccessful(validated);
            assertEntitiesAndTiles(validated.getBody(), 299L);
            assertEquals(mixedClaims, entitlementClaims(validated.getBody()));
            assertNotNull(validateHttp.getHeader(HEADER_JWT_TOKEN));
            assertEquals(1, fixture.calls("roles"));
            assertEquals(1, fixture.calls("grants"));
            assertEquals(3, fixture.calls("token"));
            assertEquals(3, fixture.calls("detail"));
            assertEquals(3, fixture.calls("aggregate"));
            var routes = routes().getAuthorizationTiles().orElseThrow();
            assertTrue(routes.stream().filter(row -> !Boolean.TRUE.equals(row.get("is_template")))
                .allMatch(row -> "EMS3".equals(row.get("provider"))));
        }
    }

    @Test
    void explicitRevocationReplacesEntitiesTilesAndClaimsOnAnExistingLogin() throws Exception {
        switchToEms3(ALPHA, 7, 10);
        try (var fixture = new ProviderFixture()) {
            var controller = controller(fixture);
            var loginHttp = new MockHttpServletResponse();
            assertSuccessful(login(controller, loginHttp));
            fixture.revoke = true;
            var validateHttp = new MockHttpServletResponse();
            var revoked = controller.checkTokenValidity(jwtRequest(loginHttp), validateHttp);
            assertSuccessful(revoked);
            assertTrue(revoked.getBody().getEntities().isEmpty());
            assertEquals(List.of("template"), tiles(revoked.getBody()));
            assertEquals("{}", entitlementClaims(revoked.getBody()));
            assertEquals(0, fixture.calls("roles"));
            assertEquals(0, fixture.calls("grants"));
            assertEquals(2, fixture.calls("detail"));
        }
    }

    @Test
    void pendingCesMakerEditDoesNotReplaceThePublishedLegacyFunctionalOwnership() throws Exception {
        try (var fixture = new ProviderFixture()) {
            var controller = controller(fixture);
            assertSuccessful(login(controller, new MockHttpServletResponse()));
            execute("INSERT INTO " + SCHEMA + ".application_tile_audit (application_tile_audit_id, application_tile_id, ems2_entities, ems2_subject, is_active, is_template, transaction_mode, provider) VALUES "
                + "(1,1,'" + ALPHA + "','ALPHA_FEATURE',true,false,'checker','EMS2')");
            execute("UPDATE " + SCHEMA + ".application_tile SET provider='EMS3', ems3_app_id='poc-itam', ems3_app_name='" + ALPHA + "_APP', ems3_subject='ALPHA_FEATURE', is_active=false WHERE application_tile_id=1");
            execute("INSERT INTO " + SCHEMA + ".application_tile_audit (application_tile_audit_id, application_tile_id, ems2_entities, ems2_subject, is_active, is_template, transaction_mode, provider, ems3_app_id, ems3_app_name, ems3_subject) VALUES "
                + "(2,1,'" + ALPHA + "','ALPHA_FEATURE',false,false,'maker','EMS3','poc-itam','" + ALPHA + "_APP','ALPHA_FEATURE')");
            var pending = routes().getAuthorizationTiles().orElseThrow().stream()
                .filter(row -> ((Number) row.get("application_tile_id")).longValue() == 1).findFirst().orElseThrow();
            assertEquals("EMS3", pending.get("provider"));
            assertEquals("EMS2", pending.get("ownership_provider"));
            assertEquals(false, pending.get("visible_candidate"));
            var checked = login(controller, new MockHttpServletResponse());
            assertSuccessful(checked);
            assertEquals(List.of("beta", "template"), tiles(checked.getBody()));
            assertEquals(JSON.readTree("[\"ACCESS\"]"), JSON.readTree(entitlementClaims(checked.getBody()))
                .path(ALPHA + ":TEST_OPERATOR").path("ALPHA_FEATURE"));
        }
    }

    @Test
    void pendingLegacyMakerEditCannotReintroduceThePublishedCesSubjectThroughLegacyGrants() throws Exception {
        switchToEms3(ALPHA, 7, 10);
        execute("INSERT INTO " + SCHEMA + ".application_tile (application_tile_id, application_category_id, import_map_id, ems2_entities, ems2_subject, is_active, is_template, module, tile, title, order_no) VALUES "
            + "(5,1,1,'" + ALPHA + "','',true,false,'poc','entity_only','entity_only',5)");
        execute("INSERT INTO " + SCHEMA + ".application_tile_audit (application_tile_audit_id, application_tile_id, ems2_entities, ems2_subject, is_active, is_template, transaction_mode, provider, ems3_app_id, ems3_app_name, ems3_subject) VALUES "
            + "(1,1,'" + ALPHA + "','ALPHA_FEATURE',false,false,'DEACTIVATE','EMS3','poc-itam','" + ALPHA + "_APP','ALPHA_FEATURE')");
        execute("UPDATE " + SCHEMA + ".application_tile SET provider='EMS2', is_active=false WHERE application_tile_id=1");
        execute("INSERT INTO " + SCHEMA + ".application_tile_audit (application_tile_audit_id, application_tile_id, ems2_entities, ems2_subject, is_active, is_template, transaction_mode, provider) VALUES "
            + "(2,1,'" + ALPHA + "','ALPHA_FEATURE',false,false,'MAKER','EMS2')");
        try (var fixture = new ProviderFixture()) {
            var checked = login(controller(fixture), new MockHttpServletResponse());
            assertSuccessful(checked);
            assertFalse(JSON.readTree(entitlementClaims(checked.getBody())).path(ALPHA + ":TEST_OPERATOR").has("ALPHA_FEATURE"));
            assertEquals(List.of("beta", "template", "entity_only"), tiles(checked.getBody()));
        }
    }

    @ParameterizedTest
    @ValueSource(strings = {"token", "detail", "aggregate", "malformed", "partial"})
    void providerFailureAfterSuccessfulMixedLoginCannotIssuePartialGrantsOrFallback(String failure) throws Exception {
        try (var fixture = new ProviderFixture()) {
            var controller = controller(fixture);
            var initialHttp = new MockHttpServletResponse();
            assertSuccessful(login(controller, initialHttp));
            if (failure.equals("malformed") || failure.equals("partial")) fixture.badPayload = failure;
            else fixture.statuses.put(failure, 503);

            var validateHttp = new MockHttpServletResponse();
            var rejected = controller.checkTokenValidity(jwtRequest(initialHttp), validateHttp);
            assertRejected(rejected, validateHttp);
            assertEquals(503, rejected.getStatusCode().value());
            var loginHttp = new MockHttpServletResponse();
            assertRejected(login(controller, loginHttp), loginHttp);
            var entraHttp = new MockHttpServletResponse();
            var entra = new RequestOfAuthenticateEntra();
            entra.setUsername(USER);
            assertRejected(controller.authenticateEntra(entra, new MockHttpServletRequest(), entraHttp), entraHttp);
            var extendHttp = new MockHttpServletResponse();
            assertRejected(controller.extend(jwtRequest(initialHttp), extendHttp), extendHttp);
            var refreshHttp = new MockHttpServletResponse();
            assertRejected(controller.refreshtoken(jwtRequest(initialHttp), refreshHttp), refreshHttp);
            var reloginHttp = new MockHttpServletResponse();
            var reloginRequest = new MockHttpServletRequest();
            reloginRequest.addHeader(HEADER_REFRESH_TOKEN, "Bearer " + tokens.generateReToken(USER,
                Map.of("oud", "{}", "id", "poc-session")));
            assertRejected(controller.relogin(new RequestOfRelogin(), reloginRequest, reloginHttp), reloginHttp);
            assertEquals(java.util.Collections.nCopies(7, List.of(ALPHA)), fixture.legacyScopes);
            assertEquals(7, fixture.calls("roles"));
            assertEquals(7, fixture.calls("grants"));
        }
    }

    @ParameterizedTest
    @ValueSource(strings = {"ems3_app_id", "ems3_app_name", "ems3_subject"})
    void malformedDatabaseMappingBlocksBeforeCallingEitherProvider(String field) throws Exception {
        try (var fixture = new ProviderFixture()) {
            var controller = controller(fixture);
            var initialHttp = new MockHttpServletResponse();
            assertSuccessful(login(controller, initialHttp));
            // Bypass the database constraint to prove runtime validation of a damaged external record.
            var repository = mock(ApplicationCategoryRepo.class);
            var damagedRows = new ArrayList<>(routes().getAuthorizationTiles().orElseThrow());
            var damaged = new HashMap<>(damagedRows.get(1));
            damaged.put(field, null);
            damagedRows.set(1, damaged);
            when(repository.getAuthorizationTiles()).thenReturn(Optional.of(damagedRows));
            ReflectionTestUtils.setField(controller, "authorizationService", router(fixture, repository));
            int before = fixture.totalCalls();
            var validateHttp = new MockHttpServletResponse();
            assertRejected(controller.checkTokenValidity(jwtRequest(initialHttp), validateHttp), validateHttp);
            var loginHttp = new MockHttpServletResponse();
            assertRejected(login(controller, loginHttp), loginHttp);
            assertEquals(before, fixture.totalCalls());
        }
    }

    private static JwtAuthenticationController controller(ProviderFixture fixture) throws Exception {
        var sharedManager = SharedEntityManagerCreator.createSharedEntityManager(sessionFactory);
        var factory = new JpaRepositoryFactory(sharedManager);
        var sessions = new SessionServiceImplementation(factory.getRepository(ApplicationSessionRepo.class));
        var legacyConfig = new EMS2ConfigProperties();
        legacyConfig.setUserRoles(fixture.url("roles") + "/%s");
        legacyConfig.setNewUserAuthorizationOnEntity(fixture.url("grants"));
        var router = router(fixture, factory.getRepository(ApplicationCategoryRepo.class));
        var categories = mock(ApplicationCategoryService.class);
        when(categories.getDrawers()).thenAnswer(invocation -> Optional.of(drawerRows()));
        var oud = mock(OUDAuthenticationService.class);
        when(oud.authenticate(any())).thenAnswer(invocation -> new HashMap<>(Map.of("fullName", "POC Test User")));
        var controller = new JwtAuthenticationController();
        ReflectionTestUtils.setField(controller, "authorizationService", router);
        ReflectionTestUtils.setField(controller, "objectMapper", JSON);
        ReflectionTestUtils.setField(controller, "jwtTokenUtil", tokens);
        ReflectionTestUtils.setField(controller, "httpSession", new MockHttpSession(null, "poc-session"));
        ReflectionTestUtils.setField(controller, "sessionService", sessions);
        ReflectionTestUtils.setField(controller, "applicationCategoryService", categories);
        ReflectionTestUtils.setField(controller, "adminModuleUtil", new AdminModuleUtil(tokens, JSON, sessions, legacyConfig));
        ReflectionTestUtils.setField(controller, "oudAuthenticationService", oud);
        ReflectionTestUtils.setField(controller, "oudUtil", mock(OudUtil.class));
        ReflectionTestUtils.setField(controller, "analyticService", mock(AnalyticService.class));
        return controller;
    }

    private static ApplicationCategoryRepo routes() {
        return new JpaRepositoryFactory(SharedEntityManagerCreator.createSharedEntityManager(sessionFactory))
            .getRepository(ApplicationCategoryRepo.class);
    }

    private static RoutingAuthorizationService router(ProviderFixture fixture, ApplicationCategoryRepo repository) {
        var legacyConfig = new EMS2ConfigProperties();
        legacyConfig.setUserRoles(fixture.url("roles") + "/%s");
        legacyConfig.setNewUserAuthorizationOnEntity(fixture.url("grants"));
        var properties = new TileEntitlementProperties();
        properties.setEntityIds(Map.of(ALPHA, 7L, BETA, 8L));
        properties.setSubjectPaths(Map.of(ALPHA + "/ALPHA_FEATURE", "/ALPHA_FEATURE"));
        return new RoutingAuthorizationService(repository,
            new EMS2AuthorizationImplementation(new RestTemplate(), JSON, legacyConfig),
            new EMS3AuthorizationImplementation(fixture.modernConfig()), properties);
    }

    private static ResponseEntity<ResponseOfAuthenticate> login(JwtAuthenticationController controller,
        MockHttpServletResponse response) throws Exception {
        var request = new RequestOfAuthenticate();
        request.setUsername(USER);
        return controller.authenticate(request, new MockHttpServletRequest(), response);
    }

    private static RequestOfJWT jwtRequest(MockHttpServletResponse response) {
        var request = new RequestOfJWT();
        request.setSingleUIAuthorization(response.getHeader(HEADER_JWT_TOKEN));
        return request;
    }

    private static void assertSuccessful(ResponseEntity<ResponseOfAuthenticate> response) {
        assertEquals(200, response.getStatusCode().value(), () -> response.getBody().getErrorMessage());
        assertTrue(response.getBody().isResult());
        assertNotNull(response.getBody().getEntitlementsToken());
    }

    private static void assertRejected(ResponseEntity<ResponseOfAuthenticate> response, MockHttpServletResponse http) {
        assertEquals(503, response.getStatusCode().value());
        assertFalse(response.getBody().isResult());
        assertEquals("AUTHORIZATION_UNAVAILABLE", response.getBody().getErrorMessage());
        assertNull(response.getBody().getEntities());
        assertNull(response.getBody().getDrawers());
        assertNull(response.getBody().getEntitlementsToken());
        assertNull(http.getHeader(HEADER_JWT_TOKEN));
        assertNull(http.getHeader(HEADER_REFRESH_TOKEN));
    }

    private static void assertEntitiesAndTiles(ResponseOfAuthenticate response, long alphaRoleId) {
        assertEquals(List.of(ALPHA, BETA), response.getEntities().stream().map(entity -> entity.getName()).toList());
        assertEquals(List.of("TEST_OPERATOR", "TEST_OPERATOR"), response.getEntities().stream().map(entity -> entity.getRoleName()).toList());
        assertEquals(alphaRoleId, response.getEntities().get(0).getRoleId());
        assertEquals(300L, response.getEntities().get(1).getRoleId());
        assertEquals(7L, response.getEntities().get(0).getId());
        assertEquals(8L, response.getEntities().get(1).getId());
        assertEquals("/ALPHA_FEATURE", response.getEntities().get(0).getSubjects().get(0).getLongName());
        assertEquals(List.of("alpha", "beta", "template"), tiles(response));
    }

    private static List<String> tiles(ResponseOfAuthenticate response) {
        return response.getDrawers().stream().flatMap(drawer -> ((List<Map<String, Object>>) drawer.get("tiles")).stream())
            .map(tile -> ((String) tile.get("tile")).substring(1)).toList();
    }

    private static String entitlementClaims(ResponseOfAuthenticate response) throws Exception {
        assertTrue(tokens.validateToken(response.getEntitlementsToken()));
        tokens.handleIssuer(response.getEntitlementsToken(), JWT_ISSUER_ENTITLEMENT);
        return JSON.readTree(tokens.retrieveUserInfoFromToken(response.getEntitlementsToken())).path("entitlements").asText();
    }

    private static List<Map<String, Object>> drawerRows() {
        var rows = new ArrayList<Map<String, Object>>();
        rows.add(tileRow(1, "alpha", ALPHA, "ALPHA_FEATURE", false));
        rows.add(tileRow(2, "beta", BETA, "BETA_FEATURE", false));
        rows.add(tileRow(3, "hidden", ALPHA, "NO_GRANTED_FEATURE", false));
        rows.add(tileRow(4, "template", "", "", true));
        return rows;
    }

    private static Map<String, Object> tileRow(int id, String tile, String entity, String subject, boolean template) {
        var row = new HashMap<String, Object>();
        row.put("application_tile_id", id);
        row.put("application_category_id", 1);
        row.put("key_name", "poc_container");
        row.put("ems2_entities", entity);
        row.put("ems2_subject", subject);
        row.put("is_template", template);
        row.put("module", "poc");
        row.put("tile", tile);
        row.put("title", tile);
        row.put("label", "POC");
        return row;
    }

    private static void switchToEms3(String entity, long bffId, long uid) throws Exception {
        // Fixture mappings are intentionally unrelated to production CES registrations.
        try (var connection = connect(); var statement = connection.prepareStatement("UPDATE " + SCHEMA
            + ".application_tile SET provider = 'EMS3', ems3_app_name = ?,"
            + " ems3_app_id = 'poc-itam', ems3_subject = ems2_subject WHERE ems2_entities = ?")) {
            statement.setString(1, entity + "_APP");
            statement.setString(2, entity);
            assertTrue(statement.executeUpdate() > 0);
        }
    }

    private static Connection connect() throws Exception {
        return DriverManager.getConnection(jdbcUrl, "bff_integration_test", "");
    }

    private static void execute(String sql) throws Exception {
        try (var connection = connect(); var statement = connection.createStatement()) {
            statement.execute(sql);
        }
    }

    private static void run(String executable, String... arguments) throws Exception {
        var command = new ArrayList<String>();
        command.add(POSTGRES_BIN.resolve(executable).toString());
        command.addAll(List.of(arguments));
        Path output = cluster.resolve(executable + "-" + System.nanoTime() + ".log");
        Process process = new ProcessBuilder(command).redirectErrorStream(true).redirectOutput(output.toFile()).start();
        if (!process.waitFor(30, TimeUnit.SECONDS)) {
            process.destroyForcibly();
            throw new IOException("PostgreSQL command timed out: " + executable);
        }
        if (process.exitValue() != 0) throw new IOException("PostgreSQL command failed: " + Files.readString(output));
    }

    private static final class ProviderFixture implements AutoCloseable {
        private final HttpServer server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        private final Map<String, AtomicInteger> counts = new ConcurrentHashMap<>();
        private final Map<String, Integer> statuses = new ConcurrentHashMap<>();
        private final List<List<String>> legacyScopes = new CopyOnWriteArrayList<>();
        private volatile boolean revoke;
        private volatile String badPayload;

        private ProviderFixture() throws IOException {
            server.createContext("/", this::respond);
            server.start();
        }

        private void respond(HttpExchange exchange) throws IOException {
            String endpoint = exchange.getRequestURI().getPath().split("/")[1];
            counts.computeIfAbsent(endpoint, unused -> new AtomicInteger()).incrementAndGet();
            String body;
            switch (endpoint) {
                case "roles" -> body = rolesPayload().toString();
                case "grants" -> {
                    var scope = JSON.readTree(exchange.getRequestBody()).path(USER);
                    var names = new ArrayList<String>();
                    scope.forEach(entity -> names.add(entity.asText()));
                    legacyScopes.add(List.copyOf(names));
                    body = grantsPayload(names).toString();
                }
                case "token" -> body = "{\"access_token\":\"poc-service-token\",\"token_type\":\"Bearer\",\"expires_in\":300}";
                case "detail" -> body = "malformed".equals(badPayload) ? "{" : detailPayload().toString();
                case "aggregate" -> body = "partial".equals(badPayload) ? "[]" : aggregatePayload().toString();
                default -> body = "{}";
            }
            byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(statuses.getOrDefault(endpoint, 200), bytes.length);
            try (var stream = exchange.getResponseBody()) { stream.write(bytes); }
            exchange.close();
        }

        private ObjectNode rolesPayload() {
            var root = JSON.createObjectNode().put("accountName", USER).put("status", "SUCCESS");
            root.putArray("entitlementTypes").addObject().put("uniqueName", "7|" + ALPHA + "|199|TEST_OPERATOR")
                .put("applicationName", ALPHA + "_APP");
            return root;
        }

        private ObjectNode grantsPayload(List<String> scope) {
            var root = JSON.createObjectNode();
            var grants = root.putObject(USER).putArray("entitlements");
            if (scope.contains(ALPHA)) {
                var grant = grants.addObject().put("id", 9001);
                component(grant.putObject("role"), "TEST_OPERATOR", 199);
                component(grant.putObject("subject").put("longName", "/ALPHA_FEATURE"), "ALPHA_FEATURE", 172);
                component(grant.putObject("action"), "ACCESS", 193);
            }
            ((ObjectNode) root.get(USER)).put("count", grants.size());
            return root;
        }

        private void component(ObjectNode node, String name, int id) {
            node.put("name", name).put("id", id).putObject("entity").put("name", ALPHA).put("id", 7);
        }

        private ArrayNode detailPayload() {
            var root = JSON.createArrayNode();
            if (!revoke) {
                addDetail(root, ALPHA, 10, "ALPHA_FEATURE", 299, 272, 293);
                addDetail(root, BETA, 11, "BETA_FEATURE", 300, 273, 294);
            }
            return root;
        }

        private void addDetail(ArrayNode root, String entity, int uid, String feature, int roleId, int featureId, int actionId) {
            var app = root.addObject().put("appName", entity + "_APP").put("appId", "poc-itam")
                .put("appUID", uid).put("itamId", "poc-itam").put("entitlementName", "TEST_OPERATOR")
                .put("entitlementId", Integer.toString(roleId));
            var pair = app.putArray("featureActionDtos").addObject();
            pair.putObject("features").put("featureName", feature).put("featureId", featureId)
                .putObject("applicationDto").put("appName", entity + "_APP").put("appUID", uid);
            pair.putObject("actions").put("actionName", "ACCESS").put("actionId", actionId)
                .putObject("applicationDto").put("appName", entity + "_APP").put("appUID", uid);
        }

        private ArrayNode aggregatePayload() {
            var root = JSON.createArrayNode();
            for (String entity : List.of(ALPHA, BETA)) {
                var app = root.addObject();
                app.putObject("user_data").put("app_name", entity + "_APP").put("itam_id", "poc-itam").put("user_id", USER);
                var grants = app.putObject("entitlements");
                var roles = grants.putArray("entitlement_name");
                var permissions = grants.putArray("role_entitlements");
                if (!revoke) {
                    roles.add("TEST_OPERATOR");
                    permissions.addObject().put("feature", entity.equals(ALPHA) ? "ALPHA_FEATURE" : "BETA_FEATURE").put("action", "ACCESS");
                }
            }
            return root;
        }

        private String url(String endpoint) {
            return "http://127.0.0.1:" + server.getAddress().getPort() + "/" + endpoint;
        }

        private EMS3ConfigProperties modernConfig() {
            var config = new EMS3ConfigProperties();
            config.setTokenUrl(URI.create(url("token")));
            config.setDetailUrl(URI.create(url("detail")));
            config.setAggregateUrl(URI.create(url("aggregate")));
            config.setClientId("poc-client");
            config.setClientSecret("synthetic-test-secret");
            config.setScope("api://poc/.default");
            config.setConnectTimeout(Duration.ofSeconds(1));
            config.setReadTimeout(Duration.ofSeconds(2));
            config.setAllowInsecureLocalhost(true);
            return config;
        }

        private int calls(String endpoint) { return counts.getOrDefault(endpoint, new AtomicInteger()).get(); }
        private int totalCalls() { return counts.values().stream().mapToInt(AtomicInteger::get).sum(); }
        @Override public void close() { server.stop(0); }
    }
}
