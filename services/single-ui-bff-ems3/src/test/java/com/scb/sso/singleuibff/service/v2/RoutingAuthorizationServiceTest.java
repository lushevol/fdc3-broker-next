package com.scb.sso.singleuibff.service.v2;

import com.scb.sso.singleuibff.dto.ems2.v2.Action;
import com.scb.sso.singleuibff.dto.ems2.v2.Ems2Result;
import com.scb.sso.singleuibff.dto.ems2.v2.Entity;
import com.scb.sso.singleuibff.dto.ems2.v2.Subject;
import com.scb.sso.singleuibff.entity.AuthorizationApplication;
import com.scb.sso.singleuibff.repository.AuthorizationApplicationRepo;
import com.scb.sso.singleuibff.service.v2.implementation.RoutingAuthorizationService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Consumer;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;

class RoutingAuthorizationServiceTest {

    private static final String USER = "poc-both";
    private static final String RATAN = "X_RATANONE";
    private static final String ADMIN = "FMO PORTAL ADMIN";

    @Test
    void callsEachApplicationsSelectedProviderAndMergesTheExistingContract() {
        var repository = mock(AuthorizationApplicationRepo.class);
        var scope = List.of(ADMIN, RATAN);
        when(repository.findByBffEntityNameIn(scope)).thenReturn(List.of(route(RATAN, "EMS2"), route(ADMIN, "EMS3")));
        var ems2Scope = new AtomicReference<List<String>>();
        var ems3Scope = new AtomicReference<List<AuthorizationApplication>>();
        var service = new RoutingAuthorizationService(repository, (user, entities) -> {
            assertEquals(USER, user);
            ems2Scope.set(entities);
            return result(entity(RATAN, "COO", null));
        }, (user, applications) -> {
            assertEquals(USER, user);
            ems3Scope.set(applications);
            return result(entity(ADMIN, "ADMIN", "FMO_PORTAL_ADMIN"));
        });

        var grants = service.getEntitlements(USER, scope);

        assertEquals(scope, grants.getEntities().stream().map(Entity::getName).toList());
        assertEquals(List.of(RATAN), ems2Scope.get());
        assertEquals(List.of(ADMIN), ems3Scope.get().stream().map(AuthorizationApplication::getBffEntityName).toList());
        assertEquals(USER, grants.getAccountName());
        assertEquals("SUCCESS", grants.getStatus());
        verify(repository).findByBffEntityNameIn(scope);
    }

    @Test
    void theNextLookupUsesTheLatestDatabaseChoiceAndCanFinishWithOnlyEms3() {
        var repository = mock(AuthorizationApplicationRepo.class);
        var ratan = route(RATAN, "EMS2");
        var admin = route(ADMIN, "EMS3");
        var scope = List.of(RATAN, ADMIN);
        when(repository.findByBffEntityNameIn(scope)).thenReturn(List.of(ratan, admin));
        var ems2Scopes = new ArrayList<List<String>>();
        var ems3Scopes = new ArrayList<List<String>>();
        var service = new RoutingAuthorizationService(repository, (user, entities) -> {
            ems2Scopes.add(entities);
            return result(entity(RATAN, "COO", null));
        }, (user, applications) -> {
            ems3Scopes.add(applications.stream().map(AuthorizationApplication::getBffEntityName).toList());
            return result(applications.stream().map(application -> entity(application.getBffEntityName(),
                "ROLE", application.getEms3AppName())).toArray(Entity[]::new));
        });

        assertEquals(2, service.getEntitlements(USER, scope).getEntities().size());
        ratan.setProvider("EMS3");
        ratan.setMappingVersion(1);
        var migrated = service.getEntitlements(USER, scope);

        assertEquals(scope, migrated.getEntities().stream().map(Entity::getName).toList());
        assertEquals(List.of(List.of(RATAN)), ems2Scopes);
        assertEquals(List.of(List.of(ADMIN), scope), ems3Scopes);
        verify(repository, times(2)).findByBffEntityNameIn(scope);
    }

    @Test
    void anEmptyRequestedScopeNeedsNeitherDatabaseMappingsNorProviders() {
        var repository = mock(AuthorizationApplicationRepo.class);
        var ems2 = mock(AuthorizationService.class);
        var ems3 = mock(MappedAuthorizationProvider.class);

        var result = new RoutingAuthorizationService(repository, ems2, ems3).getEntitlements(USER, List.of());

        assertEquals(List.of(), result.getEntities());
        assertEquals(USER, result.getAccountName());
        assertEquals("SUCCESS", result.getStatus());
        verifyNoInteractions(repository, ems2, ems3);
    }

    @Test
    void rejectsInvalidInputBeforeReadingMappingsOrCallingProviders() {
        var repository = mock(AuthorizationApplicationRepo.class);
        var ems2 = mock(AuthorizationService.class);
        var ems3 = mock(MappedAuthorizationProvider.class);
        var service = new RoutingAuthorizationService(repository, ems2, ems3);

        for (String user : Arrays.asList(null, "", " ")) {
            assertThrows(AuthorizationUnavailableException.class, () -> service.getEntitlements(user, List.of(RATAN)));
        }
        for (List<String> scope : Arrays.asList(null, List.of(""), List.of(" "),
            Arrays.asList((String) null), List.of(RATAN, RATAN))) {
            assertThrows(AuthorizationUnavailableException.class, () -> service.getEntitlements(USER, scope));
        }
        verifyNoInteractions(repository, ems2, ems3);
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("invalidRoutes")
    void rejectsIncompleteOrConflictingMappingsBeforeCallingEitherProvider(String description,
        List<AuthorizationApplication> routes) {
        var repository = mock(AuthorizationApplicationRepo.class);
        var ems2 = mock(AuthorizationService.class);
        var ems3 = mock(MappedAuthorizationProvider.class);
        when(repository.findByBffEntityNameIn(List.of(ADMIN))).thenReturn(routes);

        assertThrows(AuthorizationUnavailableException.class,
            () -> new RoutingAuthorizationService(repository, ems2, ems3).getEntitlements(USER, List.of(ADMIN)));

        verifyNoInteractions(ems2, ems3);
    }

    static Stream<Arguments> invalidRoutes() {
        return Stream.of(
            Arguments.of("database returned null", (Object) null),
            Arguments.of("missing entity", List.of()),
            Arguments.of("null route", Arrays.asList((AuthorizationApplication) null)),
            Arguments.of("duplicate entity", List.of(route(ADMIN, "EMS3"), route(ADMIN, "EMS2"))),
            Arguments.of("unrequested entity", List.of(route(RATAN, "EMS2"))),
            invalidRoute("blank entity", route -> route.setBffEntityName(" ")),
            invalidRoute("inactive entity", route -> route.setActive(false)),
            invalidRoute("unknown provider", route -> route.setProvider("UNKNOWN")),
            invalidRoute("null provider", route -> route.setProvider(null)),
            invalidRoute("negative version", route -> route.setMappingVersion(-1)),
            invalidRoute("missing BFF ID", route -> route.setBffEntityId(null)),
            invalidRoute("invalid BFF ID", route -> route.setBffEntityId(0L)),
            invalidRoute("missing app name", route -> route.setEms3AppName(null)),
            invalidRoute("blank app name", route -> route.setEms3AppName(" ")),
            invalidRoute("missing app ID", route -> route.setEms3AppId(null)),
            invalidRoute("blank app ID", route -> route.setEms3AppId(" ")),
            invalidRoute("missing ITAM ID", route -> route.setEms3ItamId(null)),
            invalidRoute("blank ITAM ID", route -> route.setEms3ItamId(" ")),
            invalidRoute("missing app UID", route -> route.setEms3AppUid(null)),
            invalidRoute("invalid app UID", route -> route.setEms3AppUid(-1L)),
            invalidRoute("missing subject mapping", route -> route.setSubjectLongNames(null)),
            invalidRoute("blank subject key", route -> route.setSubjectLongNames(Map.of(" ", "/SUBJECT"))),
            invalidRoute("blank subject path", route -> route.setSubjectLongNames(Map.of("SUBJECT", " "))),
            invalidRoute("null subject key", route -> {
                var names = new HashMap<String, String>();
                names.put(null, "/SUBJECT");
                route.setSubjectLongNames(names);
            }));
    }

    @ParameterizedTest
    @MethodSource("duplicateApplications")
    void rejectsTwoSelectedEntitiesMappedToTheSameEms3Application(String duplicate) {
        var repository = mock(AuthorizationApplicationRepo.class);
        var ratan = route(RATAN, "EMS3");
        var admin = route(ADMIN, "EMS3");
        if (duplicate.equals("name")) {
            ratan.setEms3AppName(admin.getEms3AppName());
        } else {
            ratan.setEms3AppUid(admin.getEms3AppUid());
        }
        var ems2 = mock(AuthorizationService.class);
        var ems3 = mock(MappedAuthorizationProvider.class);
        var scope = List.of(RATAN, ADMIN);
        when(repository.findByBffEntityNameIn(scope)).thenReturn(List.of(ratan, admin));

        assertThrows(AuthorizationUnavailableException.class,
            () -> new RoutingAuthorizationService(repository, ems2, ems3).getEntitlements(USER, scope));

        verifyNoInteractions(ems2, ems3);
    }

    static Stream<String> duplicateApplications() {
        return Stream.of("name", "uid");
    }

    @Test
    void providersReceiveAnIsolatedMappingSnapshotForTheWholeLookup() {
        var repository = mock(AuthorizationApplicationRepo.class);
        var scope = List.of(RATAN, ADMIN);
        var ratan = route(RATAN, "EMS2");
        var admin = route(ADMIN, "EMS3");
        var names = new HashMap<>(admin.getSubjectLongNames());
        admin.setSubjectLongNames(names);
        when(repository.findByBffEntityNameIn(scope)).thenReturn(List.of(ratan, admin));
        var service = new RoutingAuthorizationService(repository, (user, entities) -> {
            admin.setEms3AppName("CHANGED_DURING_REQUEST");
            admin.setMappingVersion(9);
            names.put("PERMISSION", "/CHANGED_DURING_REQUEST");
            return result(entity(RATAN, "COO", null));
        }, (user, applications) -> {
            assertEquals("FMO_PORTAL_ADMIN", applications.get(0).getEms3AppName());
            assertEquals(0, applications.get(0).getMappingVersion());
            assertEquals("/PERMISSION", applications.get(0).getSubjectLongNames().get("PERMISSION"));
            assertThrows(UnsupportedOperationException.class,
                () -> applications.get(0).getSubjectLongNames().put("OTHER", "/OTHER"));
            return result(entity(ADMIN, "ADMIN", "FMO_PORTAL_ADMIN"));
        });

        assertEquals(2, service.getEntitlements(USER, scope).getEntities().size());
    }

    @Test
    void ems2OnlyWorksWithoutEms3MappingsAndPreservesLegacyProfileAndMultipleRoles() {
        var repository = mock(AuthorizationApplicationRepo.class);
        var application = new AuthorizationApplication();
        application.setBffEntityName(RATAN);
        when(repository.findByBffEntityNameIn(List.of(RATAN))).thenReturn(List.of(application));
        var legacy = result(entity(RATAN, "ROLE_ONE", null), entity(RATAN, "ROLE_TWO", null));
        legacy.setAccountName(null);
        legacy.setStatus("");
        legacy.setFullName("Test User");
        legacy.setAccountOwner("OWNER");
        legacy.setAccountStatus("A");
        legacy.setAccountType("User");
        var ems3 = mock(MappedAuthorizationProvider.class);

        var grants = new RoutingAuthorizationService(repository, (user, entities) -> legacy, ems3)
            .getEntitlements(USER, List.of(RATAN));

        assertEquals(List.of("ROLE_ONE", "ROLE_TWO"), grants.getEntities().stream().map(Entity::getRoleName).toList());
        assertEquals("Test User", grants.getFullName());
        assertEquals("OWNER", grants.getAccountOwner());
        assertEquals("A", grants.getAccountStatus());
        assertEquals("User", grants.getAccountType());
        assertEquals(USER, grants.getAccountName());
        verifyNoInteractions(ems3);
    }

    @ParameterizedTest
    @MethodSource("providers")
    void aSelectedProviderFailureCannotReturnPartialResultsRetryOrFallback(String provider) {
        var repository = mock(AuthorizationApplicationRepo.class);
        var scope = List.of(RATAN, ADMIN);
        when(repository.findByBffEntityNameIn(scope)).thenReturn(List.of(route(RATAN, "EMS2"), route(ADMIN, "EMS3")));
        var ems2Calls = new AtomicInteger();
        var ems3Calls = new AtomicInteger();
        var failure = new AtomicReference<RuntimeException>();
        var service = new RoutingAuthorizationService(repository, (user, entities) -> {
            assertEquals(List.of(RATAN), entities);
            ems2Calls.incrementAndGet();
            if (failure.get() != null && provider.equals("EMS2")) {
                throw failure.get();
            }
            return result(entity(RATAN, "COO", null));
        }, (user, applications) -> {
            assertEquals(List.of(ADMIN), applications.stream().map(AuthorizationApplication::getBffEntityName).toList());
            ems3Calls.incrementAndGet();
            if (failure.get() != null && provider.equals("EMS3")) {
                throw failure.get();
            }
            return result(entity(ADMIN, "ADMIN", "FMO_PORTAL_ADMIN"));
        });
        assertEquals(2, service.getEntitlements(USER, scope).getEntities().size());
        var unavailable = new IllegalStateException("Synthetic provider failure");
        failure.set(unavailable);

        var denied = assertThrows(AuthorizationUnavailableException.class, () -> service.getEntitlements(USER, scope));

        assertSame(unavailable, denied.getCause());
        assertEquals(2, ems2Calls.get());
        assertEquals(provider.equals("EMS2") ? 1 : 2, ems3Calls.get());
    }

    static Stream<String> providers() {
        return Stream.of("EMS2", "EMS3");
    }

    @Test
    void aDatabaseFailureCannotCallAnyProvider() {
        var repository = mock(AuthorizationApplicationRepo.class);
        var ems2 = mock(AuthorizationService.class);
        var ems3 = mock(MappedAuthorizationProvider.class);
        var databaseFailure = new IllegalStateException("Synthetic database failure");
        when(repository.findByBffEntityNameIn(List.of(RATAN))).thenThrow(databaseFailure);

        var denied = assertThrows(AuthorizationUnavailableException.class,
            () -> new RoutingAuthorizationService(repository, ems2, ems3).getEntitlements(USER, List.of(RATAN)));

        assertSame(databaseFailure, denied.getCause());
        verifyNoInteractions(ems2, ems3);
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("invalidResults")
    void invalidPermissionResultsCannotReturnAccess(String description, Ems2Result response) {
        var repository = mock(AuthorizationApplicationRepo.class);
        when(repository.findByBffEntityNameIn(List.of(ADMIN))).thenReturn(List.of(route(ADMIN, "EMS3")));
        var ems2 = mock(AuthorizationService.class);

        assertThrows(AuthorizationUnavailableException.class,
            () -> new RoutingAuthorizationService(repository, ems2, (user, applications) -> response)
                .getEntitlements(USER, List.of(ADMIN)));

        verifyNoInteractions(ems2);
    }

    static Stream<Arguments> invalidResults() {
        return Stream.of(
            Arguments.of("null result", (Object) null),
            Arguments.of("missing entity list", new Ems2Result()),
            invalidResult("wrong account", value -> value.setAccountName("ANOTHER_USER")),
            invalidResult("blank account", value -> value.setAccountName(" ")),
            invalidResult("unsuccessful status", value -> value.setStatus("FAILED")),
            invalidResult("null entity", value -> value.setEntities(Arrays.asList((Entity) null))),
            invalidResult("unrequested entity", value -> value.getEntities().get(0).setName(RATAN)),
            invalidResult("blank entity", value -> value.getEntities().get(0).setName(" ")),
            invalidResult("null entity name", value -> value.getEntities().get(0).setName(null)),
            invalidResult("wrong app", value -> value.getEntities().get(0).setApplicationName("OTHER_APP")),
            invalidResult("wrong BFF ID", value -> value.getEntities().get(0).setId(99L)),
            invalidResult("null role", value -> value.getEntities().get(0).setRoleName(null)),
            invalidResult("blank role", value -> value.getEntities().get(0).setRoleName(" ")),
            invalidResult("duplicate role", value -> value.setEntities(List.of(value.getEntities().get(0), value.getEntities().get(0)))),
            invalidResult("missing subjects", value -> value.getEntities().get(0).setSubjects(null)),
            invalidResult("null subject", value -> value.getEntities().get(0).setSubjects(Arrays.asList((Subject) null))),
            invalidResult("blank subject", value -> value.getEntities().get(0).getSubjects().get(0).setName(" ")),
            invalidResult("null subject path", value -> value.getEntities().get(0).getSubjects().get(0).setLongName(null)),
            invalidResult("duplicate subject", value -> {
                var subject = value.getEntities().get(0).getSubjects().get(0);
                value.getEntities().get(0).setSubjects(List.of(subject, subject));
            }),
            invalidResult("missing actions", value -> value.getEntities().get(0).getSubjects().get(0).setActions(null)),
            invalidResult("null action", value -> value.getEntities().get(0).getSubjects().get(0).setActions(Arrays.asList((Action) null))),
            invalidResult("blank action", value -> value.getEntities().get(0).getSubjects().get(0).getActions().get(0).setName(" ")),
            invalidResult("duplicate action", value -> {
                var subject = value.getEntities().get(0).getSubjects().get(0);
                subject.setActions(List.of(subject.getActions().get(0), subject.getActions().get(0)));
            }));
    }

    @Test
    void explicitNoGrantsAndEmptyRoleGrantsRemainSuccessful() {
        var repository = mock(AuthorizationApplicationRepo.class);
        when(repository.findByBffEntityNameIn(List.of(ADMIN))).thenReturn(List.of(route(ADMIN, "EMS3")));
        var response = new AtomicReference<>(result());
        var service = new RoutingAuthorizationService(repository, mock(AuthorizationService.class),
            (user, applications) -> response.get());

        assertEquals(List.of(), service.getEntitlements(USER, List.of(ADMIN)).getEntities());
        var empty = entity(ADMIN, "ADMIN", "FMO_PORTAL_ADMIN");
        empty.setSubjects(List.of());
        var granted = result(empty);
        granted.setStatus("success");
        response.set(granted);

        assertEquals(List.of(empty), service.getEntitlements(USER, List.of(ADMIN)).getEntities());
        assertNull(service.getEntitlements(USER, List.of(ADMIN)).getFullName());
    }

    @Test
    void anEms3ProviderCannotChangeItsSnapshotToClaimAnEms2Entity() {
        var repository = mock(AuthorizationApplicationRepo.class);
        var scope = List.of(RATAN, ADMIN);
        when(repository.findByBffEntityNameIn(scope)).thenReturn(List.of(route(RATAN, "EMS2"), route(ADMIN, "EMS3")));
        var service = new RoutingAuthorizationService(repository, (user, entities) -> result(entity(RATAN, "COO", null)),
            (user, applications) -> {
                applications.get(0).setBffEntityName(RATAN);
                return result(entity(RATAN, "WRONG_PROVIDER_ROLE", null));
            });

        assertThrows(AuthorizationUnavailableException.class, () -> service.getEntitlements(USER, scope));
    }

    private static Arguments invalidResult(String name, Consumer<Ems2Result> change) {
        var result = result(entity(ADMIN, "ADMIN", "FMO_PORTAL_ADMIN"));
        change.accept(result);
        return Arguments.of(name, result);
    }

    private static Arguments invalidRoute(String name, Consumer<AuthorizationApplication> change) {
        var route = route(ADMIN, "EMS3");
        change.accept(route);
        return Arguments.of(name, List.of(route));
    }

    private static AuthorizationApplication route(String entity, String provider) {
        var route = new AuthorizationApplication();
        route.setBffEntityName(entity);
        route.setProvider(provider);
        route.setBffEntityId(ADMIN.equals(entity) ? 2L : 1L);
        route.setEms3AppName(ADMIN.equals(entity) ? "FMO_PORTAL_ADMIN" : "RATAN_ENTITLEMENT_RULE");
        route.setEms3AppId("51358");
        route.setEms3ItamId("51358");
        route.setEms3AppUid(ADMIN.equals(entity) ? 11L : 10L);
        route.setActive(true);
        route.setSubjectLongNames(Map.of("PERMISSION", "/PERMISSION"));
        return route;
    }

    private static Ems2Result result(Entity... entities) {
        var result = new Ems2Result();
        result.setEntities(List.of(entities));
        result.setAccountName(USER);
        return result;
    }

    private static Entity entity(String name, String roleName, String appName) {
        var action = new Action();
        action.setId(100L);
        action.setName("Read");
        var subject = new Subject();
        subject.setId(200L);
        subject.setName("PERMISSION");
        subject.setLongName("/PERMISSION");
        subject.setActions(List.of(action));
        var entity = new Entity();
        entity.setId(ADMIN.equals(name) ? 2L : 1L);
        entity.setName(name);
        entity.setApplicationName(appName);
        entity.setRoleId(300L);
        entity.setRoleName(roleName);
        entity.setSubjects(List.of(subject));
        return entity;
    }
}
