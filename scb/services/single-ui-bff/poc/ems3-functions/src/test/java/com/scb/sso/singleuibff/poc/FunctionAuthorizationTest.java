package com.scb.sso.singleuibff.poc;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

class FunctionAuthorizationTest {
    private FixtureEms3 ems3;

    @BeforeEach
    void start() throws Exception {
        ems3 = new FixtureEms3();
    }

    @AfterEach
    void stop() {
        ems3.close();
    }

    @Test
    void obtainsRatanPermissionsThroughTheExistingBffContract() {
        var authorization = new FunctionAuthorization(ems3.uri());
        var result = authorization.getEntitlements("poc-ratan", List.of("X_RATANONE"));
        assertEquals("FMO_COO_SUP", result.getEntities().get(0).getRoleName());
    }

    @Test
    void deniesAuthorizationWhenHeadersArriveButTheResponseBodyStalls() {
        ems3.bodyDelay("aggregate", 1500);
        var session = new PocSession(new FunctionAuthorization(ems3.uri(), Duration.ofMillis(500)));

        assertThrows(IllegalStateException.class,
            () -> session.authorize("poc-ratan", List.of("X_RATANONE")));
        assertNull(session.current());
        assertEquals(0, session.issuedTokens());
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("accounts")
    void eachTestAccountGetsExactlyItsExpectedTiles(String user, List<Long> expected) {
        var session = new PocSession(new FunctionAuthorization(ems3.uri()));
        var result = session.authorize(user, List.of("X_RATANONE", "FMO PORTAL ADMIN"));
        assertEquals(expected, tileIds(result));
    }

    static Stream<Arguments> accounts() {
        return Stream.of(
            Arguments.of("poc-ratan", List.of(54L, 104L, 105L, 9001L, 9002L, 9004L)),
            Arguments.of("poc-admin", List.of(1L, 2L, 3L, 4L, 9001L)),
            Arguments.of("poc-both", List.of(1L, 2L, 3L, 4L, 54L, 104L, 105L, 9001L, 9002L, 9004L)),
            Arguments.of("poc-two-roles", List.of(18L, 54L, 104L, 105L, 9001L, 9002L, 9004L)),
            Arguments.of("poc-none", List.of(9001L)));
    }

    @Test
    void twoRolesWithinAnApplicationKeepTheirOwnSubjectsAndActions() {
        var result = new FunctionAuthorization(ems3.uri()).getEntitlements("poc-two-roles", List.of("X_RATANONE"));
        var coo = result.getEntities().get(0);
        var kr = result.getEntities().get(1);
        assertEquals(List.of("FMO_COO_SUP", "FMO_KR_OPS"), result.getEntities().stream().map(entity -> entity.getRoleName()).toList());
        assertEquals(List.of("RATAN_FLOW_ZERO", "RATAN_FM_COO_EXCEPTION", "RATAN_FM_COO_RULE",
            "RATAN_RULE_ENGINE", "RATAN_TRADE_BLOTTER"), coo.getSubjects().stream().map(subject -> subject.getName()).toList());
        assertEquals(21, coo.getSubjects().stream().mapToInt(subject -> subject.getActions().size()).sum());
        assertEquals(List.of("RATAN_KR_EXCEPTION"), kr.getSubjects().stream().map(subject -> subject.getName()).toList());
        assertEquals(5, kr.getSubjects().get(0).getActions().size());
        assertEquals("/RATAN_KR_EXCEPTION", kr.getSubjects().get(0).getLongName());
    }

    @Test
    void removingOnlyOneRoleClearsOnlyThatRolesTilesAndClaims() throws Exception {
        var session = new PocSession(new FunctionAuthorization(ems3.uri()));
        session.authorize("poc-two-roles", List.of("X_RATANONE"));
        ems3.assign("poc-two-roles", List.of(Map.of("entityName", "X_RATANONE", "roleName", "FMO_KR_OPS")));
        var result = session.authorize("poc-two-roles", List.of("X_RATANONE"));
        assertEquals(List.of(18L, 9001L, 9002L), tileIds(result));
        assertEquals(1, FixtureEms3.JSON.readTree(result.entitlements()).size());
        assertEquals("FMO_KR_OPS", result.entities().get(0).getRoleName());
    }

    @Test
    void revokingAllRolesThroughTheHttpServiceLeavesOnlyTheTemplate() {
        var session = new PocSession(new FunctionAuthorization(ems3.uri()));
        session.authorize("poc-ratan", List.of("X_RATANONE"));
        ems3.revoke("poc-ratan");
        var result = session.authorize("poc-ratan", List.of("X_RATANONE"));
        assertEquals(List.of(9001L), tileIds(result));
        assertEquals(List.of(), result.entities());
        assertEquals("{}", result.entitlements());
    }

    @Test
    void aValidatedRoleWithExplicitlyEmptyGrantsKeepsOnlyItsBlankSubjectTile() {
        var detail = ems3.detailed("poc-ratan");
        ((com.fasterxml.jackson.databind.node.ArrayNode) detail.get(0).get("featureActionDtos")).removeAll();
        var aggregate = ems3.aggregate("poc-ratan");
        ((com.fasterxml.jackson.databind.node.ArrayNode) aggregate.get(0).get("entitlements").get("role_entitlements")).removeAll();
        ems3.override("detail", 200, detail.toString());
        ems3.override("aggregate", 200, aggregate.toString());
        var result = new PocSession(new FunctionAuthorization(ems3.uri())).authorize("poc-ratan", List.of("X_RATANONE"));
        assertEquals(List.of(9001L, 9002L), tileIds(result));
        assertEquals(1, result.entities().size());
        assertEquals(List.of(), result.entities().get(0).getSubjects());
    }

    private static List<Long> tileIds(PocSession.Result result) {
        return result.drawers().stream().flatMap(drawer -> drawer.tiles().stream())
            .map(PocSession.Tile::id).sorted().toList();
    }
}
