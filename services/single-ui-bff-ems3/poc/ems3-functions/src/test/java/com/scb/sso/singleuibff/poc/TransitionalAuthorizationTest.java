package com.scb.sso.singleuibff.poc;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.scb.sso.singleuibff.dto.ems2.v2.Ems2Result;
import com.scb.sso.singleuibff.dto.ems2.v2.Entity;
import com.scb.sso.singleuibff.service.v2.AuthorizationService;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import org.junit.jupiter.api.Test;

class TransitionalAuthorizationTest {
    private static final String RATAN = "X_RATANONE";
    private static final String ADMIN = "FMO PORTAL ADMIN";
    private static final String OTHER_RATAN = "X_OTHER";

    @Test
    void routesEachEntityToItsSelectedProviderAndMergesTheExistingResponse() {
        var ems2 = new RecordingProvider(result(entity(RATAN, "EMS2_ROLE")));
        var ems3 = new RecordingProvider(result(entity(ADMIN, "EMS3_ROLE")));
        var router = router(ems2, ems3);

        var result = router.getEntitlements("poc-both", List.of(RATAN, ADMIN));

        assertEquals(List.of(RATAN, ADMIN), result.getEntities().stream().map(Entity::getName).toList());
        assertEquals(List.of(List.of(RATAN)), ems2.scopes);
        assertEquals(List.of(List.of(ADMIN)), ems3.scopes);
        assertEquals("poc-both", result.getAccountName());
        assertEquals("SUCCESS", result.getStatus());
    }

    @Test
    void anEms2OnlySelectionNeverCallsEms3() {
        var ems2 = new RecordingProvider(result(entity(RATAN, "EMS2_ROLE")));
        var ems3 = new RecordingProvider(new IllegalStateException("EMS3 must not be called"));

        var result = router(ems2, ems3).getEntitlements("poc-ratan", List.of(RATAN));

        assertEquals(List.of(RATAN), result.getEntities().stream().map(Entity::getName).toList());
        assertEquals(1, ems2.calls.get());
        assertEquals(0, ems3.calls.get());
    }

    @Test
    void anEms3FailureFailsTheWholeRequestWithoutRetryingThroughEms2() {
        var ems2 = new RecordingProvider((user, entities) -> {
            if (entities.contains(ADMIN)) {
                throw new AssertionError("EMS3 entity was incorrectly sent to EMS2");
            }
            return result(entity(RATAN, "EMS2_ROLE"));
        });
        var ems3Failure = new IllegalStateException("EMS3 unavailable");
        var ems3 = new RecordingProvider(ems3Failure);

        var error = assertThrows(IllegalStateException.class,
            () -> router(ems2, ems3).getEntitlements("poc-both", List.of(RATAN, ADMIN)));

        assertEquals(ems3Failure, error);
        assertEquals(List.of(List.of(RATAN)), ems2.scopes);
        assertEquals(List.of(List.of(ADMIN)), ems3.scopes);
        assertEquals(1, ems2.calls.get());
        assertEquals(1, ems3.calls.get());
    }

    @Test
    void rejectsUnknownOrDuplicateEntityRequests() {
        var router = router(new RecordingProvider(result()), new RecordingProvider(result()));

        assertThrows(IllegalStateException.class,
            () -> router.getEntitlements(null, List.of(RATAN)));
        assertThrows(IllegalStateException.class,
            () -> router.getEntitlements(" ", List.of(RATAN)));
        assertThrows(IllegalStateException.class,
            () -> router.getEntitlements("user", List.of(RATAN, RATAN)));
        assertThrows(IllegalStateException.class,
            () -> router.getEntitlements("user", null));
        assertThrows(IllegalStateException.class,
            () -> router.getEntitlements("user", List.of("UNKNOWN")));
        assertThrows(IllegalStateException.class,
            () -> router.getEntitlements("user", List.of()));
    }

    @Test
    void rejectsInvalidRouteTablesBeforeAnyProviderCall() {
        var ems2 = new RecordingProvider(result());
        var ems3 = new RecordingProvider(result());

        assertThrows(IllegalStateException.class,
            () -> new TransitionalAuthorization(null, ems2, ems3));
        assertThrows(IllegalStateException.class,
            () -> new TransitionalAuthorization(List.of(), ems2, ems3));
        assertThrows(IllegalStateException.class,
            () -> new TransitionalAuthorization(List.of(
                new TransitionalAuthorization.ApplicationRoute(RATAN,
                    TransitionalAuthorization.Provider.EMS2, null),
                new TransitionalAuthorization.ApplicationRoute(RATAN,
                    TransitionalAuthorization.Provider.EMS3, ADMIN)), ems2, ems3));
        assertThrows(IllegalStateException.class,
            () -> new TransitionalAuthorization(List.of(
                new TransitionalAuthorization.ApplicationRoute(ADMIN,
                    TransitionalAuthorization.Provider.EMS3, "")), ems2, ems3));
        assertThrows(IllegalStateException.class,
            () -> new TransitionalAuthorization(List.of(
                new TransitionalAuthorization.ApplicationRoute(" ",
                    TransitionalAuthorization.Provider.EMS2, null)), ems2, ems3));
    }

    @Test
    void sendsMultipleEntitiesOnTheSameProviderInOneScopedCall() {
        var ems2 = new RecordingProvider(result(entity(RATAN, "EMS2_ROLE"), entity(OTHER_RATAN, "OTHER_ROLE")));
        var ems3 = new RecordingProvider(result());
        var router = new TransitionalAuthorization(List.of(
            new TransitionalAuthorization.ApplicationRoute(RATAN,
                TransitionalAuthorization.Provider.EMS2, null),
            new TransitionalAuthorization.ApplicationRoute(OTHER_RATAN,
                TransitionalAuthorization.Provider.EMS2, null)), ems2, ems3);

        var result = router.getEntitlements("poc-ratan", List.of(OTHER_RATAN, RATAN));

        assertEquals(List.of(OTHER_RATAN, RATAN), result.getEntities().stream().map(Entity::getName).toList());
        assertEquals(List.of(List.of(OTHER_RATAN, RATAN)), ems2.scopes);
        assertEquals(0, ems3.calls.get());
    }

    @Test
    void keepsMultipleRolesForOneEntityInTheMergedResponse() {
        var ems2 = new RecordingProvider(result(entity(RATAN, "ROLE_ONE"), entity(RATAN, "ROLE_TWO")));
        var router = router(ems2, new RecordingProvider(result()));

        var result = router.getEntitlements("poc-two-roles", List.of(RATAN));

        assertEquals(List.of("ROLE_ONE", "ROLE_TWO"),
            result.getEntities().stream().map(Entity::getRoleName).toList());
    }

    @Test
    void rejectsMalformedProviderResultsBeforeReturningAccess() {
        var invalid = new ArrayList<Ems2Result>();
        invalid.add(null);
        invalid.add(new Ems2Result());
        invalid.add(resultWithEntities(java.util.Collections.singletonList(null)));
        invalid.add(result(entity("", "ROLE")));
        invalid.add(result(entity(ADMIN, "ROLE")));
        invalid.add(result(entity(RATAN, "ROLE"), entity(RATAN, "ROLE")));
        invalid.add(result(entity(RATAN, null)));
        for (Ems2Result response : invalid) {
            assertThrows(IllegalStateException.class,
                () -> router(new RecordingProvider(response), new RecordingProvider(result()))
                    .getEntitlements("user", List.of(RATAN)));
        }

        var noSubjects = entity(RATAN, "ROLE");
        noSubjects.setSubjects(null);
        assertThrows(IllegalStateException.class,
            () -> router(new RecordingProvider(result(noSubjects)), new RecordingProvider(result()))
                .getEntitlements("user", List.of(RATAN)));

        var wrongApplication = entity(ADMIN, "ROLE");
        wrongApplication.setApplicationName("WRONG_APPLICATION");
        assertThrows(IllegalStateException.class,
            () -> router(new RecordingProvider(result()), new RecordingProvider(result(wrongApplication)))
                .getEntitlements("user", List.of(ADMIN)));
    }

    private static TransitionalAuthorization router(AuthorizationService ems2, AuthorizationService ems3) {
        return new TransitionalAuthorization(List.of(
            new TransitionalAuthorization.ApplicationRoute(RATAN,
                TransitionalAuthorization.Provider.EMS2, null),
            new TransitionalAuthorization.ApplicationRoute(ADMIN,
                TransitionalAuthorization.Provider.EMS3, "FMO_PORTAL_ADMIN")), ems2, ems3);
    }

    private static Ems2Result result(Entity... entities) {
        return resultWithEntities(List.of(entities));
    }

    private static Ems2Result resultWithEntities(List<Entity> entities) {
        var result = new Ems2Result();
        result.setEntities(entities);
        return result;
    }

    private static Entity entity(String name, String role) {
        var entity = new Entity();
        entity.setName(name);
        entity.setApplicationName(ADMIN.equals(name) ? "FMO_PORTAL_ADMIN" : null);
        entity.setRoleName(role);
        entity.setSubjects(List.of());
        return entity;
    }

    private static final class RecordingProvider implements AuthorizationService {
        private final List<List<String>> scopes = new ArrayList<>();
        private final AtomicInteger calls = new AtomicInteger();
        private final AuthorizationService delegate;

        private RecordingProvider(Ems2Result response) {
            this((user, entities) -> response);
        }

        private RecordingProvider(RuntimeException failure) {
            this((user, entities) -> { throw failure; });
        }

        private RecordingProvider(AuthorizationService delegate) {
            this.delegate = delegate;
        }

        @Override
        public Ems2Result getEntitlements(String userId, List<String> requestEntities) {
            calls.incrementAndGet();
            scopes.add(List.copyOf(requestEntities));
            return delegate.getEntitlements(userId, requestEntities);
        }
    }
}
