package com.scb.sso.singleuibff.poc;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.auth0.jwt.JWT;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.sso.singleuibff.dto.ems2.v2.Action;
import com.scb.sso.singleuibff.dto.ems2.v2.Ems2Result;
import com.scb.sso.singleuibff.dto.ems2.v2.Entity;
import com.scb.sso.singleuibff.dto.ems2.v2.Subject;
import java.time.Duration;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;
import org.junit.jupiter.api.Test;

class PocSessionTest {
    private static final List<String> ENTITIES = List.of("X_RATANONE", "FMO PORTAL ADMIN");

    @Test
    void showsExactlyTheRatanTilesForAnAssignedRatanRole() {
        var session = new PocSession((user, entities) -> grants(ratan()));

        var result = session.authorize("poc-ratan", ENTITIES);

        assertEquals(List.of(54L, 104L, 105L, 9001L, 9002L, 9004L), tileIds(result));
        assertEquals(4, result.drawers().size());
        assertSame(result, session.current());
        assertEquals(1L, session.issuedTokens());
    }

    @Test
    void issuesAnIsolatedPocTokenWithEachRolesOwnGrantsAndNoDuplicateTiles() throws Exception {
        var session = new PocSession((user, entities) -> grants(ratan(),
            entity("X_RATANONE", "RATAN_ENTITLEMENT_COMMON", subject("Reports", "/Reports", "View")),
            entity("FMO PORTAL ADMIN", "FMO_ADMIN", subject("/importmap", "/importmap", "Create", "Delete"),
                subject("/category", "/category", "Write"), subject("/tile", "/tile", "Read"))));

        var result = session.authorize("poc-both", ENTITIES);
        var token = JWT.decode(result.entitlementsToken());

        assertEquals("HS256", token.getAlgorithm());
        assertEquals("ems3-function-poc", token.getIssuer());
        assertEquals("poc-both", token.getSubject());
        assertEquals(Duration.ofMinutes(5), Duration.between(token.getIssuedAtAsInstant(), token.getExpiresAtAsInstant()));
        assertEquals(result.entitlements(), token.getClaim("entitlements").asString());
        var json = new ObjectMapper();
        assertEquals(json.readTree("""
            {"X_RATANONE:FMO_COO_SUP":{
               "RATAN_TRADE_BLOTTER":["View"],
               "RATAN_FM_COO_RULE":["ACCESS_FMO_POST_TRADE_PORTAL"],
               "RATAN_FM_COO_EXCEPTION":["ACCESS_FMO_POST_TRADE_PORTAL"]},
             "X_RATANONE:RATAN_ENTITLEMENT_COMMON":{"Reports":["View"]},
             "FMO PORTAL ADMIN:FMO_ADMIN":{"/importmap":["Create","Delete"],"/category":["Write"],"/tile":["Read"]}}
            """), json.readTree(result.entitlements()));
        assertEquals(List.of(1L, 2L, 3L, 4L, 54L, 104L, 105L, 9001L, 9002L, 9004L), tileIds(result));
        assertEquals(3, result.entities().size());
    }

    @Test
    void clearsAllCurrentAccessAndIssuesNoTokenAfterAFailedRecheck() {
        var fault = new AtomicReference<RuntimeException>();
        var session = new PocSession((user, entities) -> {
            if (fault.get() != null) {
                throw fault.get();
            }
            assertEquals("poc-ratan", user);
            assertEquals(ENTITIES, entities);
            return grants(ratan());
        });
        assertNull(session.current());
        assertEquals(0L, session.issuedTokens());
        session.authorize("poc-ratan", ENTITIES);
        var timeout = new IllegalStateException("Synthetic API timeout");
        fault.set(timeout);

        var failed = assertThrows(IllegalStateException.class, () -> session.authorize("poc-ratan", ENTITIES));

        assertEquals("Authorization unavailable", failed.getMessage());
        assertSame(timeout, failed.getCause());
        assertNull(session.current());
        assertEquals(1L, session.issuedTokens());
    }

    @Test
    void removesRevokedRoleGrantsAndAllowsTemplatesOnlyOnAValidEmptyLookup() throws Exception {
        var admin = entity("FMO PORTAL ADMIN", "FMO_ADMIN", subject("/importmap", "/importmap", "Read"),
            subject("/category", "/category", "Read"), subject("/tile", "/tile", "Read"));
        var assigned = new AtomicReference<>(grants(ratan(), admin));
        var session = new PocSession((user, entities) -> assigned.get());
        session.authorize("poc-both", ENTITIES);

        assigned.set(grants(admin));
        var adminOnly = session.authorize("poc-both", ENTITIES);
        assertEquals(List.of(1L, 2L, 3L, 4L, 9001L), tileIds(adminOnly));
        assertEquals(List.of("FMO PORTAL ADMIN:FMO_ADMIN"),
            new ObjectMapper().readTree(adminOnly.entitlements()).properties().stream().map(entry -> entry.getKey()).toList());

        assigned.set(grants());
        var empty = session.authorize("poc-both", ENTITIES);
        assertEquals(List.of(9001L), tileIds(empty));
        assertEquals(1, empty.drawers().size());
        assertEquals(List.of(), empty.entities());
        assertEquals("{}", empty.entitlements());
        assertEquals("{}", JWT.decode(empty.entitlementsToken()).getClaim("entitlements").asString());
        assertEquals(3L, session.issuedTokens());
    }

    @Test
    void preservesCaseInsensitiveSubjectsWithoutRequiringAnActionForTileVisibility() {
        var session = new PocSession((user, entities) -> grants(entity("X_RATANONE", "FMO_COO_SUP",
            subject("ratan_trade_blotter", null))));

        var result = session.authorize("poc-ratan", ENTITIES);

        assertEquals(List.of(54L, 9001L, 9002L), tileIds(result));
        assertEquals("{\"X_RATANONE:FMO_COO_SUP\":{\"ratan_trade_blotter\":[]}}", result.entitlements());
    }

    @Test
    void requiresExactEntityNamesEvenWhenARoleAndSubjectMatch() {
        var session = new PocSession((user, entities) -> grants(entity("x_ratanone", "FMO_COO_SUP",
            subject("RATAN_TRADE_BLOTTER", "/RATAN_TRADE_BLOTTER", "View"))));

        assertEquals(List.of(9001L), tileIds(session.authorize("poc-ratan", ENTITIES)));
    }

    @Test
    void cannotShowAdminTilesJustBecauseAnotherApplicationHasTheAdminRoleName() {
        var session = new PocSession((user, entities) -> grants(entity("X_RATANONE", "FMO_ADMIN",
            subject("/tile", "/tile", "Read"))));

        assertEquals(List.of(9001L, 9002L), tileIds(session.authorize("poc-ratan", ENTITIES)));
    }

    @Test
    void rejectsBrokenAuthorizationResultsAndClearsPreviousPermissions() {
        var assigned = new AtomicReference<>(grants(ratan()));
        var session = new PocSession((user, entities) -> assigned.get());
        session.authorize("poc-ratan", ENTITIES);
        assigned.set(null);
        assertThrows(IllegalStateException.class, () -> session.authorize("poc-ratan", ENTITIES));
        assertNull(session.current());

        assigned.set(new Ems2Result());
        assertThrows(IllegalStateException.class, () -> session.authorize("poc-ratan", ENTITIES));
        assertNull(session.current());
        assertEquals(1L, session.issuedTokens());
    }

    private static List<Long> tileIds(PocSession.Result result) {
        return result.drawers().stream().flatMap(drawer -> drawer.tiles().stream())
            .map(PocSession.Tile::id).sorted().toList();
    }

    private static Ems2Result grants(Entity... entities) {
        var result = new Ems2Result();
        result.setEntities(List.of(entities));
        return result;
    }

    private static Entity ratan() {
        return entity("X_RATANONE", "FMO_COO_SUP",
            subject("RATAN_TRADE_BLOTTER", "/RATAN_TRADE_BLOTTER", "View"),
            subject("RATAN_FM_COO_RULE", "/RATAN_FM_COO_RULE", "ACCESS_FMO_POST_TRADE_PORTAL"),
            subject("RATAN_FM_COO_EXCEPTION", "/RATAN_FM_COO_EXCEPTION", "ACCESS_FMO_POST_TRADE_PORTAL"));
    }

    private static Entity entity(String name, String role, Subject... subjects) {
        var entity = new Entity();
        entity.setName(name);
        entity.setRoleName(role);
        entity.setSubjects(List.of(subjects));
        return entity;
    }

    private static Subject subject(String name, String longName, String... actionNames) {
        var subject = new Subject();
        subject.setName(name);
        subject.setLongName(longName);
        subject.setActions(List.of(actionNames).stream().map(nameOfAction -> {
            var action = new Action();
            action.setName(nameOfAction);
            return action;
        }).toList());
        return subject;
    }
}
