package com.scb.sso.singleuibff.service.v2;

import com.scb.sso.singleuibff.config.EMS3ConfigProperties;
import com.scb.sso.singleuibff.entity.AuthorizationApplication;
import com.scb.sso.singleuibff.service.v2.implementation.EMS3AuthorizationImplementation;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.function.Consumer;
import java.util.stream.Stream;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import static org.junit.jupiter.api.Assertions.*;

class EMS3AuthorizationImplementationTest {
    private static final ObjectMapper JSON = new ObjectMapper();
    private static final String TOKEN = "{\"access_token\":\"service-token\",\"token_type\":\"Bearer\",\"expires_in\":300}";
    private static final String DETAIL = """
        [{"entitlementId":"199","entitlementName":"FMO_COO_SUP","appId":"51358",
          "appName":"RATAN_ENTITLEMENT_RULE","appUID":10,"itamId":null,
          "featureActionDtos":[{"features":{"featureId":172,"featureName":"RATAN_TRADE_BLOTTER",
            "applicationDto":{"appUID":10,"appName":"RATAN_ENTITLEMENT_RULE"}},
            "actions":{"actionId":193,"actionName":"ACCESS_FMO_POST_TRADE_PORTAL",
            "applicationDto":{"appUID":10,"appName":"RATAN_ENTITLEMENT_RULE"}}}]}]
        """;
    private static final String AGGREGATE = """
        [{"user_data":{"app_name":"RATAN_ENTITLEMENT_RULE","itam_id":"51358","user_id":"test-user"},
          "entitlements":{"entitlement_name":["FMO_COO_SUP"],"role_entitlements":[
            {"feature":"RATAN_TRADE_BLOTTER","action":"ACCESS_FMO_POST_TRADE_PORTAL"}]}}]
        """;

    @Test
    void returnsSelectedApplicationWithItsRoleAndLegacySubjectPath() throws Exception {
        try (var server = new Ems3Server()) {
            var result = new EMS3AuthorizationImplementation(server.config()).getEntitlements("test-user", List.of(ratan()));
            assertEquals(1, result.getEntities().size());
            var entity = result.getEntities().get(0);
            assertEquals(7L, entity.getId());
            assertEquals("X_RATANONE", entity.getName());
            assertEquals("RATAN_ENTITLEMENT_RULE", entity.getApplicationName());
            assertEquals(199L, entity.getRoleId());
            assertEquals("FMO_COO_SUP", entity.getRoleName());
            var subject = entity.getSubjects().get(0);
            assertEquals(172L, subject.getId());
            assertEquals("RATAN_TRADE_BLOTTER", subject.getName());
            assertEquals("/RATAN_TRADE_BLOTTER", subject.getLongName());
            var action = subject.getActions().get(0);
            assertEquals(193L, action.getId());
            assertEquals("ACCESS_FMO_POST_TRADE_PORTAL", action.getName());
            assertNull(action.getEntitlementId());
            assertEquals(3, server.requests);
            assertEquals("POST", server.methods.get("token"));
            assertEquals("application/x-www-form-urlencoded", server.contentType);
            assertEquals("grant_type=client_credentials&client_id=test-client&client_secret=test-secret&scope=api%3A%2F%2Ftest%2F.default", server.form);
            assertEquals("/detail/test-user", server.paths.get("detail"));
            assertEquals("Bearer service-token", server.authorization.get("detail"));
            assertEquals("Bearer service-token", server.authorization.get("aggregate"));
        }
    }

    @Test
    void constructionIsDormantWithoutEms3Configuration() {
        assertDoesNotThrow(() -> new EMS3AuthorizationImplementation(new EMS3ConfigProperties()));
    }

    @Test
    void ignoresUnrelatedIdentifiableApplicationsAndDoesNotRequireOtherProviders() throws Exception {
        try (var server = new Ems3Server()) {
            ArrayNode detail = (ArrayNode) JSON.readTree(DETAIL);
            detail.addObject().put("appName", "FLOWZERO").put("appUID", 65).put("appId", "51358");
            ArrayNode aggregate = (ArrayNode) JSON.readTree(AGGREGATE);
            aggregate.addObject().putObject("user_data").put("app_name", "FLOWZERO");
            server.bodies.put("detail", detail.toString());
            server.bodies.put("aggregate", aggregate.toString());
            var result = new EMS3AuthorizationImplementation(server.config()).getEntitlements("test-user", List.of(ratan()));
            assertEquals(List.of("X_RATANONE"), result.getEntities().stream().map(e -> e.getName()).toList());
        }
    }

    @Test
    void preservesSeparateRolesWithinOneApplicationAndDoesNotCacheOldGrants() throws Exception {
        try (var server = new Ems3Server()) {
            ArrayNode detail = (ArrayNode) JSON.readTree(DETAIL);
            ObjectNode second = detail.addObject();
            second.put("appName", "RATAN_ENTITLEMENT_RULE").put("appId", "51358").put("appUID", 10)
                .put("itamId", "51358").put("entitlementName", "FMO_KR_OPS").put("entitlementId", "201");
            ObjectNode grant = detail.get(0).at("/featureActionDtos/0").deepCopy();
            ((ObjectNode) grant.get("features")).put("featureId", 179).put("featureName", "RATAN_KR_EXCEPTION");
            second.putArray("featureActionDtos").add(grant);
            ArrayNode aggregate = (ArrayNode) JSON.readTree(AGGREGATE);
            ((ArrayNode) aggregate.at("/0/entitlements/entitlement_name")).add("FMO_KR_OPS");
            ((ArrayNode) aggregate.at("/0/entitlements/role_entitlements")).addObject()
                .put("feature", "RATAN_KR_EXCEPTION").put("action", "ACCESS_FMO_POST_TRADE_PORTAL");
            server.bodies.put("detail", detail.toString());
            server.bodies.put("aggregate", aggregate.toString());
            var adapter = new EMS3AuthorizationImplementation(server.config());
            var result = adapter.getEntitlements("test-user", List.of(ratan()));
            assertEquals(List.of("FMO_COO_SUP", "FMO_KR_OPS"), result.getEntities().stream().map(e -> e.getRoleName()).toList());
            assertEquals(List.of("RATAN_TRADE_BLOTTER"), result.getEntities().get(0).getSubjects().stream().map(s -> s.getName()).toList());
            assertEquals(List.of("RATAN_KR_EXCEPTION"), result.getEntities().get(1).getSubjects().stream().map(s -> s.getName()).toList());
            server.bodies.put("detail", "[]");
            server.bodies.put("aggregate", emptyAggregate());
            assertTrue(adapter.getEntitlements("test-user", List.of(ratan())).getEntities().isEmpty());
            assertEquals(6, server.requests);
        }
    }

    @Test
    void retainsAssignedRoleWhenItsFunctionGrantsAreExplicitlyEmpty() throws Exception {
        try (var server = new Ems3Server()) {
            server.bodies.put("detail", modified(DETAIL, "/0/featureActionDtos", JSON.createArrayNode(), false));
            server.bodies.put("aggregate", modified(AGGREGATE, "/0/entitlements/role_entitlements", JSON.createArrayNode(), false));
            var result = new EMS3AuthorizationImplementation(server.config()).getEntitlements("test-user", List.of(ratan()));
            assertEquals("FMO_COO_SUP", result.getEntities().get(0).getRoleName());
            assertTrue(result.getEntities().get(0).getSubjects().isEmpty());
        }
    }

    @Test
    void encodesAuthenticatedUserAsOnePathSegment() throws Exception {
        try (var server = new Ems3Server()) {
            String user = "test user+tag@example.com/other";
            server.bodies.put("aggregate", modified(AGGREGATE, "/0/user_data/user_id", JSON.getNodeFactory().textNode(user), false));
            var config = server.config();
            config.setDetailUrl(URI.create(config.getDetailUrl() + "/"));
            new EMS3AuthorizationImplementation(config).getEntitlements(user, List.of(ratan()));
            assertEquals("/detail/test%20user%2Btag%40example.com%2Fother", server.paths.get("detail"));
            assertEquals("/aggregate/test%20user%2Btag%40example.com%2Fother", server.paths.get("aggregate"));
        }
    }

    @Test
    void proxyIsUsedForServiceTokenOnly() throws Exception {
        try (var server = new Ems3Server()) {
            var config = server.config();
            config.setTokenProxyHost("127.0.0.1");
            config.setTokenProxyPort(server.server.getAddress().getPort());
            config.setTokenUrl(URI.create("http://127.0.0.1:1/token"));
            new EMS3AuthorizationImplementation(config).getEntitlements("test-user", List.of(ratan()));
            assertEquals(3, server.requests);
            assertEquals("/detail/test-user", server.paths.get("detail"));
        }
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("invalidSettings")
    void validatesConfigurationBeforeAnyServiceRequest(String name, Consumer<EMS3ConfigProperties> mutate) throws Exception {
        try (var server = new Ems3Server()) {
            var config = server.config();
            mutate.accept(config);
            assertThrows(AuthorizationUnavailableException.class,
                () -> new EMS3AuthorizationImplementation(config).getEntitlements("test-user", List.of(ratan())));
            assertEquals(0, server.requests);
        }
    }

    private static Stream<Arguments> invalidSettings() {
        return Stream.of(
            setting("missing token URL", c -> c.setTokenUrl(null)),
            setting("missing detail URL", c -> c.setDetailUrl(null)),
            setting("missing aggregate URL", c -> c.setAggregateUrl(null)),
            setting("relative URL", c -> c.setTokenUrl(URI.create("/token"))),
            setting("unrecognized host", c -> c.setTokenUrl(URI.create("https:/token"))),
            setting("URL userinfo", c -> c.setTokenUrl(URI.create("https://user@localhost/token"))),
            setting("URL query", c -> c.setTokenUrl(URI.create("https://localhost/token?a=b"))),
            setting("URL fragment", c -> c.setTokenUrl(URI.create("https://localhost/token#x"))),
            setting("local HTTP disabled", c -> c.setAllowInsecureLocalhost(false)),
            setting("HTTP remote host", c -> c.setTokenUrl(URI.create("http://ems3.example/token"))),
            setting("wrong URL scheme", c -> c.setTokenUrl(URI.create("ftp://localhost/token"))),
            setting("missing client ID", c -> c.setClientId(null)),
            setting("missing client secret", c -> c.setClientSecret(" ")),
            setting("missing scope", c -> c.setScope(null)),
            setting("null connect timeout", c -> c.setConnectTimeout(null)),
            setting("zero connect timeout", c -> c.setConnectTimeout(Duration.ZERO)),
            setting("negative connect timeout", c -> c.setConnectTimeout(Duration.ofSeconds(-1))),
            setting("unbounded connect timeout", c -> c.setConnectTimeout(Duration.ofMinutes(2))),
            setting("null read timeout", c -> c.setReadTimeout(null)),
            setting("zero read timeout", c -> c.setReadTimeout(Duration.ZERO)),
            setting("negative read timeout", c -> c.setReadTimeout(Duration.ofSeconds(-1))),
            setting("unbounded read timeout", c -> c.setReadTimeout(Duration.ofMinutes(2))),
            setting("proxy port without host", c -> c.setTokenProxyPort(8000)),
            setting("proxy host without port", c -> c.setTokenProxyHost("localhost")),
            setting("negative proxy port", c -> { c.setTokenProxyHost("localhost"); c.setTokenProxyPort(-1); }),
            setting("oversized proxy port", c -> { c.setTokenProxyHost("localhost"); c.setTokenProxyPort(65536); })
        );
    }

    private static Arguments setting(String name, Consumer<EMS3ConfigProperties> mutate) { return Arguments.of(name, mutate); }

    @ParameterizedTest(name = "{0}")
    @MethodSource("invalidMappings")
    void rejectsInvalidSelectedMappingBeforeCallingEms3(String name, Consumer<AuthorizationApplication> mutate) throws Exception {
        try (var server = new Ems3Server()) {
            var app = ratan();
            mutate.accept(app);
            assertThrows(AuthorizationUnavailableException.class,
                () -> new EMS3AuthorizationImplementation(server.config()).getEntitlements("test-user", List.of(app)));
            assertEquals(0, server.requests);
        }
    }

    private static Stream<Arguments> invalidMappings() {
        return Stream.of(
            mapping("missing BFF entity", a -> a.setBffEntityName(null)),
            mapping("blank BFF entity", a -> a.setBffEntityName(" ")),
            mapping("missing BFF ID", a -> a.setBffEntityId(null)),
            mapping("zero BFF ID", a -> a.setBffEntityId(0L)),
            mapping("missing EMS3 app name", a -> a.setEms3AppName(null)),
            mapping("missing EMS3 app ID", a -> a.setEms3AppId(null)),
            mapping("missing EMS3 app UID", a -> a.setEms3AppUid(null)),
            mapping("zero EMS3 app UID", a -> a.setEms3AppUid(0L)),
            mapping("missing EMS3 ITAM ID", a -> a.setEms3ItamId(null)),
            mapping("missing legacy subject map", a -> a.setSubjectLongNames(null)),
            mapping("blank legacy subject name", a -> a.setSubjectLongNames(Map.of(" ", "/x"))),
            mapping("blank legacy subject path", a -> a.setSubjectLongNames(Map.of("x", " ")))
        );
    }

    private static Arguments mapping(String name, Consumer<AuthorizationApplication> mutate) { return Arguments.of(name, mutate); }

    @Test
    void rejectsInvalidIdentityScopeAndDuplicateMappingsBeforeRequests() throws Exception {
        try (var server = new Ems3Server()) {
            var adapter = new EMS3AuthorizationImplementation(server.config());
            for (String user : new String[] {null, " ", "bad\nuser", "x".repeat(256)}) {
                assertThrows(AuthorizationUnavailableException.class, () -> adapter.getEntitlements(user, List.of(ratan())));
            }
            assertThrows(AuthorizationUnavailableException.class, () -> adapter.getEntitlements("test-user", null));
            assertThrows(AuthorizationUnavailableException.class, () -> adapter.getEntitlements("test-user", List.of()));
            assertThrows(AuthorizationUnavailableException.class, () -> adapter.getEntitlements("test-user", java.util.Arrays.asList((AuthorizationApplication) null)));
            assertThrows(AuthorizationUnavailableException.class, () -> new EMS3AuthorizationImplementation(null).getEntitlements("test-user", List.of(ratan())));
            assertThrows(AuthorizationUnavailableException.class, () -> adapter.getEntitlements("test-user", List.of(ratan(), ratan())));
            var sameUid = ratan();
            sameUid.setBffEntityName("SECOND");
            sameUid.setEms3AppName("SECOND_APP");
            assertThrows(AuthorizationUnavailableException.class, () -> adapter.getEntitlements("test-user", List.of(ratan(), sameUid)));
            var sameName = ratan();
            sameName.setBffEntityName("SECOND");
            sameName.setEms3AppUid(65L);
            assertThrows(AuthorizationUnavailableException.class, () -> adapter.getEntitlements("test-user", List.of(ratan(), sameName)));
            assertEquals(0, server.requests);
        }
    }

    @Test
    void acceptsExplicitEmptySelectedAggregateAsNoAccess() throws Exception {
        try (var server = new Ems3Server()) {
            server.bodies.put("detail", "[]");
            server.bodies.put("aggregate", emptyAggregate());
            var result = new EMS3AuthorizationImplementation(server.config()).getEntitlements("test-user", List.of(ratan()));
            assertTrue(result.getEntities().isEmpty());
        }
    }

    @Test
    void usesFeatureNameAsLongNameWhenThereIsNoLegacyPath() throws Exception {
        try (var server = new Ems3Server()) {
            var app = ratan();
            app.setSubjectLongNames(Map.of());
            var result = new EMS3AuthorizationImplementation(server.config()).getEntitlements("test-user", List.of(app));
            assertEquals("RATAN_TRADE_BLOTTER", result.getEntities().get(0).getSubjects().get(0).getLongName());
        }
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("invalidResponses")
    void rejectsMalformedIncompleteOrInconsistentSelectedResponses(String name, String endpoint, String body) throws Exception {
        try (var server = new Ems3Server()) {
            server.bodies.put(endpoint, body);
            assertThrows(AuthorizationUnavailableException.class,
                () -> new EMS3AuthorizationImplementation(server.config()).getEntitlements("test-user", List.of(ratan())));
        }
    }

    private static Stream<Arguments> invalidResponses() throws Exception {
        var cases = new ArrayList<Arguments>();
        var payloads = Map.of("token", TOKEN, "detail", DETAIL, "aggregate", AGGREGATE);
        for (var entry : payloads.entrySet()) {
            for (String malformed : List.of("", "null", "{", entry.getValue() + " {}")) {
                cases.add(Arguments.of(entry.getKey() + " malformed " + malformed.length(), entry.getKey(), malformed));
            }
        }
        cases.add(Arguments.of("duplicate token key", "token", TOKEN.replace("\"expires_in\":300", "\"expires_in\":300,\"expires_in\":600")));
        cases.add(Arguments.of("duplicate selected detail role", "detail", "[" + DETAIL.strip().substring(1, DETAIL.strip().length() - 1)
            + "," + DETAIL.strip().substring(1, DETAIL.strip().length() - 1) + "]"));
        cases.add(Arguments.of("duplicate selected aggregate app", "aggregate", "[" + AGGREGATE.strip().substring(1, AGGREGATE.strip().length() - 1)
            + "," + AGGREGATE.strip().substring(1, AGGREGATE.strip().length() - 1) + "]"));
        cases.add(Arguments.of("missing selected aggregate", "aggregate", "[]"));
        cases.add(Arguments.of("missing detailed roles", "detail", "[]"));
        cases.add(Arguments.of("false empty aggregate", "aggregate", emptyAggregate()));

        String[][] textFields = {
            {"token", "/access_token"}, {"token", "/token_type"},
            {"detail", "/0/appName"}, {"detail", "/0/appId"}, {"detail", "/0/entitlementName"}, {"detail", "/0/entitlementId"},
            {"detail", "/0/featureActionDtos/0/features/featureName"}, {"detail", "/0/featureActionDtos/0/actions/actionName"},
            {"detail", "/0/featureActionDtos/0/features/applicationDto/appName"},
            {"detail", "/0/featureActionDtos/0/actions/applicationDto/appName"},
            {"aggregate", "/0/user_data/app_name"}, {"aggregate", "/0/user_data/itam_id"}, {"aggregate", "/0/user_data/user_id"},
            {"aggregate", "/0/entitlements/role_entitlements/0/feature"}, {"aggregate", "/0/entitlements/role_entitlements/0/action"}
        };
        for (var field : textFields) {
            mutations(cases, field[0], payloads.get(field[0]), field[1], List.of("null", "true", "{}", "[]", "\" \""));
        }
        String[][] integerFields = {
            {"token", "/expires_in"}, {"detail", "/0/appUID"},
            {"detail", "/0/featureActionDtos/0/features/featureId"}, {"detail", "/0/featureActionDtos/0/actions/actionId"},
            {"detail", "/0/featureActionDtos/0/features/applicationDto/appUID"},
            {"detail", "/0/featureActionDtos/0/actions/applicationDto/appUID"}
        };
        for (var field : integerFields) {
            mutations(cases, field[0], payloads.get(field[0]), field[1], List.of("null", "\"1\"", "true", "0", "-1", "1.5", "9223372036854775808"));
        }
        String[][] containerFields = {
            {"detail", "/0/featureActionDtos"}, {"detail", "/0/featureActionDtos/0/features"},
            {"detail", "/0/featureActionDtos/0/actions"}, {"detail", "/0/featureActionDtos/0/features/applicationDto"},
            {"detail", "/0/featureActionDtos/0/actions/applicationDto"}, {"aggregate", "/0/user_data"},
            {"aggregate", "/0/entitlements"}, {"aggregate", "/0/entitlements/entitlement_name"},
            {"aggregate", "/0/entitlements/role_entitlements"}
        };
        for (var field : containerFields) {
            mutations(cases, field[0], payloads.get(field[0]), field[1], List.of("null", "true", "0", "\"x\""));
        }
        String[][] wrongValues = {
            {"token", "/access_token", "\"bad token\\r\\n\""}, {"token", "/token_type", "\"Basic\""},
            {"detail", "/0/appName", "\"WRONG_APP\""}, {"detail", "/0/appId", "\"WRONG_ID\""}, {"detail", "/0/appUID", "99"},
            {"detail", "/0/itamId", "\"WRONG_ITAM\""}, {"detail", "/0/itamId", "1"},
            {"detail", "/0/entitlementId", "\"0\""}, {"detail", "/0/entitlementId", "\"+1\""},
            {"detail", "/0/entitlementId", "\"9223372036854775808\""},
            {"detail", "/0/featureActionDtos/0/features/applicationDto/appName", "\"WRONG_APP\""},
            {"detail", "/0/featureActionDtos/0/features/applicationDto/appUID", "99"},
            {"detail", "/0/featureActionDtos/0/actions/applicationDto/appName", "\"WRONG_APP\""},
            {"detail", "/0/featureActionDtos/0/actions/applicationDto/appUID", "99"},
            {"aggregate", "/0/user_data/app_name", "\"WRONG_APP\""}, {"aggregate", "/0/user_data/itam_id", "\"WRONG_ITAM\""},
            {"aggregate", "/0/user_data/user_id", "\"wrong-user\""}, {"aggregate", "/0/entitlements/entitlement_name/0", "true"},
            {"aggregate", "/0/entitlements/entitlement_name/0", "\" \""}, {"aggregate", "/0/entitlements/entitlement_name/0", "\"WRONG_ROLE\""},
            {"aggregate", "/0/entitlements/role_entitlements/0/action", "\"WRONG_ACTION\""},
            {"aggregate", "/0/entitlements/role_entitlements/0/feature", "\"WRONG_FEATURE\""}
        };
        for (var value : wrongValues) {
            cases.add(Arguments.of(value[0] + " wrong " + value[1], value[0], modified(payloads.get(value[0]), value[1], JSON.readTree(value[2]), false)));
        }
        return cases.stream();
    }

    private static void mutations(List<Arguments> cases, String endpoint, String payload, String pointer, List<String> values) throws Exception {
        cases.add(Arguments.of(endpoint + " missing " + pointer, endpoint, modified(payload, pointer, null, true)));
        for (var value : values) {
            cases.add(Arguments.of(endpoint + " invalid " + pointer + " " + value, endpoint, modified(payload, pointer, JSON.readTree(value), false)));
        }
    }

    private static String modified(String payload, String pointer, JsonNode value, boolean remove) throws Exception {
        JsonNode root = JSON.readTree(payload);
        int split = pointer.lastIndexOf('/');
        JsonNode parent = root.at(pointer.substring(0, split));
        String key = pointer.substring(split + 1);
        if (parent.isObject()) {
            if (remove) {
                ((ObjectNode) parent).remove(key);
            } else {
                ((ObjectNode) parent).set(key, value);
            }
        } else {
            ((ArrayNode) parent).set(Integer.parseInt(key), value);
        }
        return root.toString();
    }

    private static String emptyAggregate() {
        return """
            [{"user_data":{"app_name":"RATAN_ENTITLEMENT_RULE","itam_id":"51358","user_id":"test-user"},
              "entitlements":{"entitlement_name":[],"role_entitlements":[]}}]
            """;
    }

    @ParameterizedTest
    @MethodSource("httpFailures")
    void rejectsEveryNon200StatusWithoutRetry(String endpoint, int status) throws Exception {
        try (var server = new Ems3Server()) {
            server.statuses.put(endpoint, status);
            assertThrows(AuthorizationUnavailableException.class,
                () -> new EMS3AuthorizationImplementation(server.config()).getEntitlements("test-user", List.of(ratan())));
            assertEquals(1, server.calls.get(endpoint));
        }
    }

    private static Stream<Arguments> httpFailures() {
        return Stream.of("token", "detail", "aggregate").flatMap(endpoint ->
            Stream.of(204, 206, 301, 401, 403, 404, 429, 500, 503).map(status -> Arguments.of(endpoint, status)));
    }

    @ParameterizedTest
    @MethodSource("transportFailures")
    void rejectsTimeoutsTruncatedAndOversizedBodiesIncludingAfterHeaders(String endpoint, String failure) throws Exception {
        try (var server = new Ems3Server()) {
            var config = server.config();
            config.setReadTimeout(Duration.ofMillis(300));
            switch (failure) {
                case "headers" -> server.delays.put(endpoint, 900L);
                case "body" -> server.bodyDelays.put(endpoint, 900L);
                case "truncated" -> server.truncated.add(endpoint);
                case "oversized" -> server.bodies.put(endpoint, " ".repeat(1_048_577));
                default -> throw new IllegalArgumentException(failure);
            }
            assertThrows(AuthorizationUnavailableException.class,
                () -> new EMS3AuthorizationImplementation(config).getEntitlements("test-user", List.of(ratan())));
            assertEquals(1, server.calls.get(endpoint));
        }
    }

    private static Stream<Arguments> transportFailures() {
        return Stream.of("token", "detail", "aggregate").flatMap(endpoint ->
            Stream.of("headers", "body", "truncated", "oversized").map(failure -> Arguments.of(endpoint, failure)));
    }

    @Test
    void connectionFailureAndInterruptionDenyAuthorization() throws Exception {
        try (var server = new Ems3Server(); var closedPort = new java.net.ServerSocket(0)) {
            var config = server.config();
            int port = closedPort.getLocalPort();
            closedPort.close();
            config.setTokenUrl(URI.create("http://127.0.0.1:" + port + "/token"));
            assertThrows(AuthorizationUnavailableException.class,
                () -> new EMS3AuthorizationImplementation(config).getEntitlements("test-user", List.of(ratan())));
            Thread.currentThread().interrupt();
            try {
                assertThrows(AuthorizationUnavailableException.class,
                    () -> new EMS3AuthorizationImplementation(server.config()).getEntitlements("test-user", List.of(ratan())));
                assertTrue(Thread.currentThread().isInterrupted());
            } finally {
                Thread.interrupted();
            }
        }
    }

    @Test
    void failureAfterSuccessCannotReturnPreviouslyFetchedPermissions() throws Exception {
        try (var server = new Ems3Server()) {
            var adapter = new EMS3AuthorizationImplementation(server.config());
            assertEquals(1, adapter.getEntitlements("test-user", List.of(ratan())).getEntities().size());
            server.statuses.put("aggregate", 503);
            assertThrows(AuthorizationUnavailableException.class, () -> adapter.getEntitlements("test-user", List.of(ratan())));
            assertEquals(2, server.calls.get("token"));
            assertEquals(2, server.calls.get("detail"));
            assertEquals(2, server.calls.get("aggregate"));
        }
    }

    @Test
    void concurrentLookupsHaveIndependentGrantResultsAndEachAcquireCurrentServiceToken() throws Exception {
        try (var server = new Ems3Server()) {
            var adapter = new EMS3AuthorizationImplementation(server.config());
            var pool = Executors.newFixedThreadPool(8);
            var start = new java.util.concurrent.CountDownLatch(1);
            try {
                var futures = new ArrayList<java.util.concurrent.Future<com.scb.sso.singleuibff.dto.ems2.v2.Ems2Result>>();
                for (int index = 0; index < 8; index++) {
                    futures.add(pool.submit(() -> {
                        start.await();
                        return adapter.getEntitlements("test-user", List.of(ratan()));
                    }));
                }
                start.countDown();
                for (var future : futures) {
                    var result = future.get(5, java.util.concurrent.TimeUnit.SECONDS);
                    assertEquals(1, result.getEntities().size());
                    assertEquals("FMO_COO_SUP", result.getEntities().get(0).getRoleName());
                }
                assertEquals(8, server.calls.get("token"));
                assertEquals(8, server.calls.get("detail"));
                assertEquals(8, server.calls.get("aggregate"));
            } finally {
                pool.shutdownNow();
            }
        }
    }

    @Test
    void rejectsPartialSuccessWhenAnotherSelectedApplicationIsMissing() throws Exception {
        try (var server = new Ems3Server()) {
            var other = ratan();
            other.setBffEntityName("FMO PORTAL ADMIN");
            other.setBffEntityId(8L);
            other.setEms3AppName("FMO_PORTAL_ADMIN");
            other.setEms3AppUid(11L);
            assertThrows(AuthorizationUnavailableException.class,
                () -> new EMS3AuthorizationImplementation(server.config()).getEntitlements("test-user", List.of(ratan(), other)));
            ArrayNode aggregate = (ArrayNode) JSON.readTree(AGGREGATE);
            ObjectNode emptyAdmin = (ObjectNode) JSON.readTree(emptyAggregate()).get(0);
            ((ObjectNode) emptyAdmin.get("user_data")).put("app_name", "FMO_PORTAL_ADMIN");
            aggregate.add(emptyAdmin);
            server.bodies.put("aggregate", aggregate.toString());
            var result = new EMS3AuthorizationImplementation(server.config()).getEntitlements("test-user", List.of(ratan(), other));
            assertEquals(List.of("X_RATANONE"), result.getEntities().stream().map(e -> e.getName()).toList());
        }
    }

    @ParameterizedTest
    @MethodSource("conflictingGrants")
    void rejectsDuplicateOrConflictingIdsAndNames(String name, String detailPayload, String aggregatePayload) throws Exception {
        try (var server = new Ems3Server()) {
            server.bodies.put("detail", detailPayload);
            server.bodies.put("aggregate", aggregatePayload);
            assertThrows(AuthorizationUnavailableException.class,
                () -> new EMS3AuthorizationImplementation(server.config()).getEntitlements("test-user", List.of(ratan())));
        }
    }

    private static Stream<Arguments> conflictingGrants() throws Exception {
        var cases = new ArrayList<Arguments>();
        for (String change : List.of("featureName", "featureId", "actionName", "actionId", "duplicatePair", "duplicateRoleId")) {
            ArrayNode detail = (ArrayNode) JSON.readTree(DETAIL);
            ObjectNode additional = detail.get(0).at("/featureActionDtos/0").deepCopy();
            switch (change) {
                case "featureName" -> ((ObjectNode) additional.get("features")).put("featureName", "OTHER_FEATURE");
                case "featureId" -> ((ObjectNode) additional.get("features")).put("featureId", 999);
                case "actionName" -> ((ObjectNode) additional.get("actions")).put("actionName", "OTHER_ACTION");
                case "actionId" -> ((ObjectNode) additional.get("actions")).put("actionId", 999);
                case "duplicateRoleId" -> {
                    ObjectNode second = detail.get(0).deepCopy();
                    second.put("entitlementName", "DIFFERENT_ROLE");
                    detail.add(second);
                }
                default -> { }
            }
            if (!change.equals("duplicateRoleId")) {
                ((ArrayNode) detail.get(0).get("featureActionDtos")).add(additional);
            }
            cases.add(Arguments.of(change, detail.toString(), AGGREGATE));
        }
        ArrayNode aggregate = (ArrayNode) JSON.readTree(AGGREGATE);
        ((ArrayNode) aggregate.at("/0/entitlements/entitlement_name")).add("FMO_COO_SUP");
        cases.add(Arguments.of("duplicate aggregate role", DETAIL, aggregate.toString()));
        aggregate = (ArrayNode) JSON.readTree(AGGREGATE);
        ((ArrayNode) aggregate.at("/0/entitlements/role_entitlements")).add(aggregate.at("/0/entitlements/role_entitlements/0").deepCopy());
        cases.add(Arguments.of("duplicate aggregate pair", DETAIL, aggregate.toString()));
        return cases.stream();
    }

    private static AuthorizationApplication ratan() {
        var app = new AuthorizationApplication();
        app.setBffEntityName("X_RATANONE");
        app.setBffEntityId(7L);
        app.setEms3AppName("RATAN_ENTITLEMENT_RULE");
        app.setEms3AppId("51358");
        app.setEms3AppUid(10L);
        app.setEms3ItamId("51358");
        app.setSubjectLongNames(Map.of("RATAN_TRADE_BLOTTER", "/RATAN_TRADE_BLOTTER"));
        return app;
    }

    private static final class Ems3Server implements AutoCloseable {
        private final HttpServer server;
        private final java.util.concurrent.ExecutorService executor = Executors.newCachedThreadPool();
        private final Map<String, String> bodies = new ConcurrentHashMap<>(Map.of("token", TOKEN, "detail", DETAIL, "aggregate", AGGREGATE));
        private final Map<String, Integer> statuses = new ConcurrentHashMap<>();
        private final Map<String, Integer> calls = new ConcurrentHashMap<>();
        private final Map<String, String> methods = new ConcurrentHashMap<>();
        private final Map<String, String> paths = new ConcurrentHashMap<>();
        private final Map<String, String> authorization = new ConcurrentHashMap<>();
        private final Map<String, Long> delays = new ConcurrentHashMap<>();
        private final Map<String, Long> bodyDelays = new ConcurrentHashMap<>();
        private final java.util.Set<String> truncated = ConcurrentHashMap.newKeySet();
        private String form;
        private String contentType;
        private int requests;

        private Ems3Server() throws IOException {
            server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
            server.setExecutor(executor);
            for (String endpoint : List.of("token", "detail", "aggregate")) {
                server.createContext("/" + endpoint, exchange -> {
                    requests++;
                    calls.merge(endpoint, 1, Integer::sum);
                    methods.put(endpoint, exchange.getRequestMethod());
                    paths.put(endpoint, exchange.getRequestURI().getRawPath());
                    if (endpoint.equals("token")) {
                        form = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
                        contentType = exchange.getRequestHeaders().getFirst("Content-Type");
                    } else {
                        authorization.put(endpoint, exchange.getRequestHeaders().getFirst("Authorization"));
                    }
                    delay(delays.getOrDefault(endpoint, 0L));
                    respond(exchange, endpoint, statuses.getOrDefault(endpoint, 200), bodies.get(endpoint));
                });
            }
            server.start();
        }

        private EMS3ConfigProperties config() {
            var config = new EMS3ConfigProperties();
            String base = "http://127.0.0.1:" + server.getAddress().getPort();
            config.setTokenUrl(URI.create(base + "/token"));
            config.setDetailUrl(URI.create(base + "/detail"));
            config.setAggregateUrl(URI.create(base + "/aggregate"));
            config.setClientId("test-client");
            config.setClientSecret("test-secret");
            config.setScope("api://test/.default");
            config.setConnectTimeout(Duration.ofSeconds(1));
            config.setReadTimeout(Duration.ofSeconds(1));
            config.setAllowInsecureLocalhost(true);
            return config;
        }

        private void respond(com.sun.net.httpserver.HttpExchange exchange, String endpoint, int status, String body) throws IOException {
            try (exchange) {
                byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
                exchange.sendResponseHeaders(status, status == 204 ? -1 : bytes.length + (truncated.contains(endpoint) ? 50 : 0));
                delay(bodyDelays.getOrDefault(endpoint, 0L));
                if (status != 204) {
                    exchange.getResponseBody().write(bytes);
                }
            }
        }

        private static void delay(long millis) {
            if (millis > 0) {
                try {
                    Thread.sleep(millis);
                } catch (InterruptedException interrupted) {
                    Thread.currentThread().interrupt();
                }
            }
        }

        @Override
        public void close() {
            server.stop(0);
            executor.shutdownNow();
        }
    }
}
