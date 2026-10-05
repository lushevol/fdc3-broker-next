package com.scb.sso.singleuibff.poc;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.net.URI;
import java.time.Duration;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Stream;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.junit.jupiter.params.provider.ValueSource;

class FunctionAuthorizationFailureTest {
    private static final List<String> ENTITIES = List.of("X_RATANONE", "FMO PORTAL ADMIN");
    private FixtureEms3 ems3;
    private PocSession session;

    @BeforeEach
    void start() throws Exception {
        ems3 = new FixtureEms3();
        session = new PocSession(new FunctionAuthorization(ems3.uri()));
    }

    @AfterEach
    void stop() {
        if (ems3 != null) {
            ems3.close();
        }
    }

    @ParameterizedTest(name = "{0} HTTP {1}")
    @MethodSource("httpFailures")
    void anyRequiredApiFailureClearsPriorGrantsAndCannotIssueTokens(String endpoint, int status) {
        session.authorize("poc-both", ENTITIES);
        ems3.override(endpoint, status, "{}");
        denied("poc-both", 1);
    }

    static Stream<Arguments> httpFailures() {
        return Stream.of("token", "detail", "aggregate").flatMap(endpoint ->
            Stream.of(204, 206, 301, 401, 403, 404, 429, 500, 503).map(status -> Arguments.of(endpoint, status)));
    }

    @ParameterizedTest(name = "invalid {0}: {1}")
    @MethodSource("invalidBodies")
    void invalidJsonOrTopLevelShapeCannotGrantAccess(String endpoint, String body) {
        ems3.override(endpoint, 200, body);
        denied("poc-ratan", 0);
    }

    static Stream<Arguments> invalidBodies() {
        return Stream.of("token", "detail", "aggregate").flatMap(endpoint ->
            Stream.of("", "null", "{}", "[]", "[1]", "[null]", "not-json", "{} {}")
                .map(body -> Arguments.of(endpoint, body)));
    }

    @ParameterizedTest(name = "{0} {1} = {2}")
    @MethodSource("invalidFields")
    void rejectsMissingNullWrongTypeAndUnmappedResponseFields(String endpoint, String path, String value)
        throws Exception {
        JsonNode body = endpoint.equals("detail") ? ems3.detailed("poc-ratan") : ems3.aggregate("poc-ratan");
        replace(body, path, value);
        ems3.override(endpoint, 200, body.toString());
        denied("poc-ratan", 0);
    }

    static Stream<Arguments> invalidFields() {
        var detail = Stream.of("/0/appName", "/0/appId", "/0/appUID", "/0/entitlementName", "/0/entitlementId",
            "/0/featureActionDtos", "/0/featureActionDtos/0/features", "/0/featureActionDtos/0/actions",
            "/0/featureActionDtos/0/features/featureName", "/0/featureActionDtos/0/features/featureId",
            "/0/featureActionDtos/0/features/applicationDto", "/0/featureActionDtos/0/features/applicationDto/appName",
            "/0/featureActionDtos/0/features/applicationDto/appUID", "/0/featureActionDtos/0/actions/actionName",
            "/0/featureActionDtos/0/actions/actionId", "/0/featureActionDtos/0/actions/applicationDto",
            "/0/featureActionDtos/0/actions/applicationDto/appName", "/0/featureActionDtos/0/actions/applicationDto/appUID")
            .flatMap(path -> Stream.of("missing", "null", "false", "\"\"", "999999")
                .map(value -> Arguments.of("detail", path, value)));
        var aggregate = Stream.of("/0/user_data", "/0/user_data/app_name", "/0/user_data/itam_id", "/0/user_data/user_id",
            "/0/entitlements", "/0/entitlements/entitlement_name", "/0/entitlements/entitlement_name/0",
            "/0/entitlements/role_entitlements", "/0/entitlements/role_entitlements/0/feature",
            "/0/entitlements/role_entitlements/0/action")
            .flatMap(path -> Stream.of("missing", "null", "false", "\"\"", "999999")
                .map(value -> Arguments.of("aggregate", path, value)));
        return Stream.concat(detail, aggregate);
    }

    @ParameterizedTest
    @ValueSource(strings = {"access_token", "token_type", "expires_in"})
    void rejectsInvalidTokenFields(String field) throws Exception {
        for (String value : List.of("missing", "null", "false", "\"\"", "-1", "1.5", "9223372036854775808")) {
            JsonNode token = FixtureEms3.JSON.readTree("{\"access_token\":\"fixture-only-token\",\"token_type\":\"Bearer\",\"expires_in\":300}");
            replace(token, "/" + field, value);
            ems3.override("token", 200, token.toString());
            denied("poc-ratan", 0);
        }
    }

    @Test
    void rejectsAClaimForAnotherUser() {
        var body = ems3.aggregate("poc-ratan");
        ((ObjectNode) body.get(0).get("user_data")).put("user_id", "poc-admin");
        ems3.override("aggregate", 200, body.toString());
        denied("poc-ratan", 0);
    }

    @ParameterizedTest
    @ValueSource(strings = {"role", "detail-pair", "app", "aggregate-role", "aggregate-pair"})
    void rejectsDuplicateOrConflictingPermissionRecords(String duplicate) {
        var detail = (ArrayNode) ems3.detailed("poc-ratan");
        var aggregate = (ArrayNode) ems3.aggregate("poc-ratan");
        switch (duplicate) {
            case "role" -> detail.add(detail.get(0).deepCopy());
            case "detail-pair" -> {
                var pairs = (ArrayNode) detail.get(0).get("featureActionDtos");
                pairs.add(pairs.get(0).deepCopy());
            }
            case "app" -> aggregate.add(aggregate.get(0).deepCopy());
            case "aggregate-role" -> ((ArrayNode) aggregate.get(0).get("entitlements").get("entitlement_name"))
                .add("FMO_COO_SUP");
            case "aggregate-pair" -> {
                var pairs = (ArrayNode) aggregate.get(0).get("entitlements").get("role_entitlements");
                pairs.add(pairs.get(0).deepCopy());
            }
            default -> throw new AssertionError(duplicate);
        }
        ems3.override("detail", 200, detail.toString());
        ems3.override("aggregate", 200, aggregate.toString());
        denied("poc-ratan", 0);
    }

    @Test
    void partialMultiApplicationResultCannotKeepTheSuccessfulApplication() {
        session.authorize("poc-both", ENTITIES);
        var partial = (ArrayNode) ems3.aggregate("poc-both");
        partial.remove(1);
        ems3.override("aggregate", 200, partial.toString());
        denied("poc-both", 1);
    }

    @Test
    void evenAnUnassignedAppMustHaveAnExplicitEmptyRecord() {
        var partial = (ArrayNode) ems3.aggregate("poc-none");
        partial.remove(1);
        ems3.override("aggregate", 200, partial.toString());
        denied("poc-none", 0);
    }

    @Test
    void rejectsDuplicateJsonKeys() {
        ems3.override("token", 200,
            "{\"access_token\":\"fixture-only-token\",\"access_token\":\"other\",\"token_type\":\"Bearer\",\"expires_in\":300}");
        denied("poc-ratan", 0);
    }

    @Test
    void rejectsBodiesAboveTheByteLimit() {
        ems3.override("token", 200, " ".repeat(1_048_577));
        denied("poc-ratan", 0);
    }

    @ParameterizedTest
    @ValueSource(strings = {"token", "detail", "aggregate"})
    void headerTimeoutCannotGrantAccess(String endpoint) {
        ems3.delay(endpoint, 1500);
        session = new PocSession(new FunctionAuthorization(ems3.uri(), Duration.ofMillis(500)));
        denied("poc-ratan", 0);
    }

    @Test
    void connectionFailureCannotReusePriorSuccess() {
        session.authorize("poc-both", ENTITIES);
        ems3.close();
        ems3 = null;
        denied("poc-both", 1);
    }

    @Test
    void interruptedRequestDeniesAccessAndPreservesTheInterrupt() {
        Thread.currentThread().interrupt();
        try {
            denied("poc-ratan", 0);
            assertTrue(Thread.currentThread().isInterrupted());
        } finally {
            Thread.interrupted();
        }
    }

    @Test
    void invalidAccountAndEntityScopeCannotGrantAccess() {
        var adapter = new FunctionAuthorization(ems3.uri());
        for (String user : Arrays.asList(null, "", "../poc-ratan", "user with spaces")) {
            assertThrows(IllegalStateException.class, () -> adapter.getEntitlements(user, ENTITIES));
        }
        for (List<String> scope : Arrays.asList(null, List.<String>of(), List.of("OTHER"),
            List.of("X_RATANONE", "X_RATANONE"), Arrays.asList((String) null))) {
            assertThrows(IllegalStateException.class, () -> adapter.getEntitlements("poc-ratan", scope));
        }
        assertThrows(IllegalStateException.class, () -> adapter.getEntitlements("unknown-account", ENTITIES));
    }

    @ParameterizedTest
    @ValueSource(strings = {"https://127.0.0.1/", "http://example.com/", "http://127.0.0.1/path",
        "http://user@127.0.0.1/", "http://127.0.0.1/?secret=value", "http://127.0.0.1/#fragment"})
    void syntheticCredentialsCannotBeSentToLiveOrAmbiguousUrls(String url) {
        assertThrows(IllegalStateException.class, () -> new FunctionAuthorization(URI.create(url)));
    }

    @Test
    void timeoutMustBeExplicitAndPositive() {
        assertThrows(IllegalStateException.class, () -> new FunctionAuthorization(null));
        for (Duration timeout : Arrays.asList(null, Duration.ZERO, Duration.ofMillis(-1))) {
            assertThrows(IllegalStateException.class, () -> new FunctionAuthorization(ems3.uri(), timeout));
        }
    }

    private void denied(String user, long issuedBefore) {
        assertThrows(IllegalStateException.class, () -> session.authorize(user, ENTITIES));
        assertNull(session.current());
        assertEquals(issuedBefore, session.issuedTokens());
    }

    private static void replace(JsonNode body, String path, String value) throws Exception {
        int slash = path.lastIndexOf('/');
        JsonNode parent = body.at(path.substring(0, slash));
        String field = path.substring(slash + 1);
        if (parent.isArray()) {
            if (value.equals("missing")) {
                ((ArrayNode) parent).remove(Integer.parseInt(field));
            } else {
                ((ArrayNode) parent).set(Integer.parseInt(field), FixtureEms3.JSON.readTree(value));
            }
        } else if (value.equals("missing")) {
            ((ObjectNode) parent).remove(field);
        } else {
            ((ObjectNode) parent).set(field, FixtureEms3.JSON.readTree(value));
        }
    }
}
