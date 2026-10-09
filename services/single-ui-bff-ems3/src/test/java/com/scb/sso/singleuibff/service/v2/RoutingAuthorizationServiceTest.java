package com.scb.sso.singleuibff.service.v2;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.sso.singleuibff.config.TileEntitlementProperties;
import com.scb.sso.singleuibff.dto.ems2.v2.Action;
import com.scb.sso.singleuibff.dto.ems2.v2.Ems2Result;
import com.scb.sso.singleuibff.dto.ems2.v2.Entity;
import com.scb.sso.singleuibff.dto.ems2.v2.Subject;
import com.scb.sso.singleuibff.repository.ApplicationCategoryRepo;
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
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Consumer;
import java.util.stream.Stream;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class RoutingAuthorizationServiceTest {
    private static final String USER = "tile-test-user";
    private static final String RATAN = "X_RATANONE";
    private static final String STRATEGIC = "RATAN_STRATEGIC_CASHFLOW_BLOTTER";
    private static final String BAU = "RATAN_CASHFLOW_BLOTTER";
    private static final String CES_RATAN = "RATAN_ENTITLEMENT_RULE";
    private static final String FLOW = "FLOW_ZERO";
    private static final String FLOW_SUBJECT = "FLOW_ZERO_RAISE REQUEST";

    @Test
    void splitsRatanSubjectsByProviderAndMergesTheSameUserRoleWithoutLeakingLegacyGrants() {
        var rows = List.of(tile(36, RATAN, BAU, "EMS2"), tile(37, RATAN, STRATEGIC, "EMS3"),
            tile(39, RATAN, STRATEGIC, "EMS3"), tile(48, "STAMP_STATIC", "Mapping Query", "EMS2"));
        var repository = repository(rows);
        var legacyCalls = new ArrayList<List<String>>();
        var modernCalls = new AtomicInteger();
        var service = router(repository, (user, scope) -> {
            legacyCalls.add(scope);
            var response = result(entity(RATAN, 7, "FMO_OPS_BO", 100,
                subject(BAU, "Read"), subject(STRATEGIC, "LEGACY_MUST_NOT_LEAK"), subject("RATAN_FLOW_ZERO", "F_WORKFLOW_QUERY")),
                entity("STAMP_STATIC", 9, "VIEW_ONLY", 101, subject("Mapping Query", "Read")));
            response.setFullName("Test User");
            return response;
        }, (user, scope) -> {
            modernCalls.incrementAndGet();
            assertEquals(1, scope.size());
            return result(entity(CES_RATAN, 70, "FMO_OPS_BO", 9001,
                subject(STRATEGIC, "F_Export_Data", "F_Hold"), subject("OTHER_CES_FEATURE", "OTHER")));
        });

        var response = service.getEntitlements(USER, List.of());

        assertTrue(service.usesTileSnapshot());
        assertEquals(List.of(List.of(RATAN, "STAMP_STATIC")), legacyCalls);
        assertEquals(1, modernCalls.get());
        assertEquals(List.of(RATAN, "STAMP_STATIC"), response.getEntities().stream().map(Entity::getName).toList());
        var ratan = response.getEntities().get(0);
        assertEquals(7L, ratan.getId());
        assertEquals(100L, ratan.getRoleId());
        assertEquals(List.of("Read"), permissions(ratan).get(BAU));
        assertEquals(List.of("F_Export_Data", "F_Hold"), permissions(ratan).get(STRATEGIC));
        assertEquals(List.of("F_WORKFLOW_QUERY"), permissions(ratan).get("RATAN_FLOW_ZERO"));
        assertFalse(permissions(ratan).containsKey("OTHER_CES_FEATURE"));
        assertEquals("/" + STRATEGIC, ratan.getSubjects().stream().filter(s -> STRATEGIC.equals(s.getName())).findFirst().orElseThrow().getLongName());
        assertEquals(List.of(36L, 37L, 39L, 48L), visibleIds(response));
        assertEquals("Test User", response.getFullName());
        verify(repository, times(1)).getAuthorizationTiles();
    }

    @Test
    void aliasesFlowzeroNameAndPathAndKeepsNativeCesRoleIdsForCesOnlyRoles() throws Exception {
        var service = router(repository(List.of(tile(108, FLOW, FLOW_SUBJECT, "EMS3"))), mock(AuthorizationService.class),
            (user, scope) -> result(entity("FLOWZERO", 11, "Global_Onboard_BatchOps", 351,
                subject("RAISE_REQUEST", "RAISE_NEW_REQUEST", "BATCH_IMPORT"), subject("DESIGNER", "DESIGN"))));
        var response = service.getEntitlements(USER, List.of());
        var flow = response.getEntities().get(0);
        assertEquals(FLOW, flow.getName());
        assertEquals(8L, flow.getId());
        assertEquals(351L, flow.getRoleId());
        assertEquals(Map.of(FLOW_SUBJECT, List.of("RAISE_NEW_REQUEST", "BATCH_IMPORT")), permissions(flow));
        assertEquals(FLOW_SUBJECT, flow.getSubjects().get(0).getLongName());
        assertEquals(List.of(108L), visibleIds(response));
        assertFalse(new ObjectMapper().writeValueAsString(response).contains("authorizedTiles"));
    }

    @Test
    void legacyGrantsCannotShowCesTileWhenTheCesLookupSuccessfullyReturnsNoFeature() {
        var service = router(repository(List.of(tile(36, RATAN, BAU, "EMS2"), tile(37, RATAN, STRATEGIC, "EMS3"))),
            (user, scope) -> result(entity(RATAN, 7, "ROLE", 100, subject(BAU, "Read"), subject(STRATEGIC, "ACCESS"))),
            (user, scope) -> result(entity(CES_RATAN, 70, "ROLE", 900, subject("OTHER", "Read"))));
        var response = service.getEntitlements(USER, List.of());
        assertEquals(List.of(36L), visibleIds(response));
        assertEquals(Map.of(BAU, List.of("Read")), permissions(response.getEntities().get(0)));
    }

    @Test
    void inactiveCesOwnedSubjectsAreRemovedFromEveryLegacyRoleWithoutCallingCes() {
        var inactive = tile(37, RATAN, STRATEGIC, "EMS3");
        inactive.put("visible_candidate", false);
        var modern = mock(MappedAuthorizationProvider.class);
        var service = router(repository(List.of(tile(36, RATAN, BAU, "EMS2"), inactive)),
            (user, scope) -> result(entity(RATAN, 7, "ONE", 1, subject(BAU, "Read"), subject(STRATEGIC, "Write")),
                entity(RATAN, 7, "TWO", 2, subject(STRATEGIC, "Write"), subject("UNTILED", "Read"))), modern);
        var response = service.getEntitlements(USER, List.of());
        assertEquals(List.of(36L), visibleIds(response));
        assertTrue(response.getEntities().stream().noneMatch(entity -> permissions(entity).containsKey(STRATEGIC)));
        assertTrue(response.getEntities().stream().anyMatch(entity -> permissions(entity).containsKey("UNTILED")));
        verifyNoInteractions(modern);
    }

    @Test
    void anUnapprovedNewCesTileDoesNotClaimOwnershipOfExistingLegacyFunctions() {
        var pending = tile(37, RATAN, STRATEGIC, "EMS3");
        pending.put("visible_candidate", false); pending.put("ownership_present", false);
        var modern = mock(MappedAuthorizationProvider.class);
        var service = router(repository(List.of(tile(36, RATAN, BAU, "EMS2"), pending)),
            (user, scope) -> result(entity(RATAN, 7, "ROLE", 1, subject(BAU, "Read"), subject(STRATEGIC, "Write"))), modern);
        var response = service.getEntitlements(USER, List.of());
        assertEquals(List.of(36L), visibleIds(response));
        assertEquals(List.of("Write"), permissions(response.getEntities().get(0)).get(STRATEGIC));
        verifyNoInteractions(modern);
    }

    @Test
    void legacyBlankSubjectTileRequiresALegacyRoleEvenIfCesReturnsTheSameEntity() {
        var service = router(repository(List.of(tile(193, RATAN, "", "EMS2"), tile(37, RATAN, STRATEGIC, "EMS3"))),
            (user, scope) -> result(),
            (user, scope) -> result(entity(CES_RATAN, 70, "ROLE", 900, subject(STRATEGIC, "Read"))));
        assertEquals(List.of(37L), visibleIds(service.getEntitlements(USER, List.of())));
    }

    @Test
    void templatesAndLegacyBlankSubjectBehaviorRemainCompatibleWithoutCesCredentials() {
        var template = tile(1, "", "", "EMS2");
        template.put("is_template", true);
        var modern = mock(MappedAuthorizationProvider.class);
        var service = router(repository(List.of(template, tile(193, RATAN, "", "EMS2"),
            tile(36, RATAN + ", STAMP_STATIC", BAU, "EMS2"))),
            (user, scope) -> result(entity(RATAN, 7, "ROLE", 1, subject(BAU, "Read"))), modern);
        assertEquals(List.of(1L, 193L, 36L), visibleIds(service.getEntitlements(USER, List.of())));
        verifyNoInteractions(modern);
    }

    @Test
    void siblingLegacyTilesKeepBothVariantsAndAllowMissingOptionalLegacyProfileMetadata() {
        var modern = mock(MappedAuthorizationProvider.class);
        var legacy = result(entity(RATAN, 7, "ROLE", 1, subject(BAU, "Read")));
        legacy.setAccountName(null); legacy.setStatus(null);
        legacy.setAccountOwner("owner"); legacy.setAccountType("User"); legacy.setAccountStatus("A");
        var service = router(repository(List.of(tile(36, RATAN, BAU, "EMS2"), tile(38, RATAN, BAU, "EMS2"))),
            (user, scope) -> legacy, modern);
        var response = service.getEntitlements(USER, List.of());
        assertEquals(List.of(36L, 38L), visibleIds(response));
        assertEquals(USER, response.getAccountName());
        assertEquals("owner", response.getAccountOwner());
        assertEquals("User", response.getAccountType());
        assertEquals("A", response.getAccountStatus());
        legacy.setStatus(" ");
        assertEquals(List.of(36L, 38L), visibleIds(service.getEntitlements(USER, List.of())));
        verifyNoInteractions(modern);
    }

    @Test
    void subsequentAuthorizationUsesNewTileConfigurationAndAllCesAvoidsLegacyCalls() {
        var row = tile(108, FLOW, FLOW_SUBJECT, "EMS2");
        var legacyCalls = new AtomicInteger();
        var modernCalls = new AtomicInteger();
        var service = router(repository(List.of(row)), (user, scope) -> {
            legacyCalls.incrementAndGet();
            return result(entity(FLOW, 8, "ROLE", 100, subject(FLOW_SUBJECT, "Read")));
        }, (user, scope) -> {
            modernCalls.incrementAndGet();
            return result(entity("FLOWZERO", 11, "ROLE", 900, subject("RAISE_REQUEST", "Read")));
        });
        assertEquals(List.of(108L), visibleIds(service.getEntitlements(USER, List.of())));
        row.put("provider", "EMS3");
        assertEquals(List.of(108L), visibleIds(service.getEntitlements(USER, List.of())));
        assertEquals(1, legacyCalls.get());
        assertEquals(1, modernCalls.get());
    }

    @Test
    void explicitlyRetainedUntiledLegacyFunctionsSurviveAFlowzeroLaunchTileMigration() {
        var properties = new TileEntitlementProperties();
        properties.setEntityIds(Map.of(FLOW, 8L));
        properties.setRetainEms2Entities(java.util.Set.of(FLOW));
        var service = new RoutingAuthorizationService(repository(List.of(tile(108, FLOW, FLOW_SUBJECT, "EMS3"))),
            (user, scope) -> {
                assertEquals(List.of(FLOW), scope);
                return result(entity(FLOW, 8, "ROLE", 100, subject(FLOW_SUBJECT, "OLD_LAUNCH"),
                    subject("UNMIGRATED_DESIGNER", "DESIGN")));
            }, (user, scope) -> result(entity("FLOWZERO", 11, "ROLE", 900, subject("RAISE_REQUEST", "NEW_LAUNCH"))), properties);
        var response = service.getEntitlements(USER, List.of());
        assertEquals(Map.of(FLOW_SUBJECT, List.of("NEW_LAUNCH"), "UNMIGRATED_DESIGNER", List.of("DESIGN")),
            permissions(response.getEntities().get(0)));
        assertEquals(100L, response.getEntities().get(0).getRoleId());
        assertEquals(List.of(108L), visibleIds(response));
    }

    @Test
    void oneSharedPortalRegistrationProjectsOnlyTheTwoExplicitTileFeatureBindings() {
        var ratan = tile(37, RATAN, STRATEGIC, "EMS3");
        var flow = tile(108, FLOW, FLOW_SUBJECT, "EMS3");
        ratan.put("ems3_app_name", "PORTAL"); flow.put("ems3_app_name", "PORTAL");
        ratan.put("ems3_subject", "RATAN_FEATURE"); flow.put("ems3_subject", "FLOWZERO_FEATURE");
        var calls = new AtomicInteger();
        var service = router(repository(List.of(ratan, flow)), mock(AuthorizationService.class), (user, scope) -> {
            calls.incrementAndGet(); assertEquals(1, scope.size());
            return result(entity("PORTAL", 11, "ROLE", 900, subject("RATAN_FEATURE", "Export"),
                subject("FLOWZERO_FEATURE", "Raise"), subject("UNRELATED", "Admin")));
        });
        var response = service.getEntitlements(USER, List.of());
        assertEquals(1, calls.get());
        assertEquals(Map.of(STRATEGIC, List.of("Export")), permissions(response.getEntities().get(0)));
        assertEquals(Map.of(FLOW_SUBJECT, List.of("Raise")), permissions(response.getEntities().get(1)));
    }

    @Test
    void pathOnlyTileBindingPreservesTheOldJwtSubjectNameThroughExplicitCompatibilityMetadata() {
        var row = tile(1, "FMO PORTAL ADMIN", "/importmap", "EMS3");
        row.put("ems3_app_name", "FMO_PORTAL_ADMIN"); row.put("ems3_subject", "IMPORT_MAP");
        var properties = new TileEntitlementProperties();
        properties.setEntityIds(Map.of("FMO PORTAL ADMIN", 5L));
        properties.setSubjectPaths(Map.of("FMO PORTAL ADMIN//importmap", "/importmap"));
        properties.setSubjectNames(Map.of("FMO PORTAL ADMIN//importmap", "importmap"));
        var service = new RoutingAuthorizationService(repository(List.of(row)), mock(AuthorizationService.class),
            (user, scope) -> result(entity("FMO_PORTAL_ADMIN", 100, "FMO_ADMIN", 900, subject("IMPORT_MAP", "Read"))), properties);
        var response = service.getEntitlements(USER, List.of());
        assertEquals(Map.of("importmap", List.of("Read")), permissions(response.getEntities().get(0)));
        assertEquals("/importmap", response.getEntities().get(0).getSubjects().get(0).getLongName());
        assertEquals(List.of(1L), visibleIds(response));
    }

    @Test
    void providerMutationCannotChangeTheSnapshotUsedForVisibilityOrMapping() {
        var row = tile(108, FLOW, FLOW_SUBJECT, "EMS3");
        var response = router(repository(List.of(tile(36, RATAN, BAU, "EMS2"), row)),
            (user, scope) -> {
                row.put("ems3_app_name", "MUTATED");
                row.put("ems2_subject", "MUTATED");
                row.put("visible_candidate", false);
                return result(entity(RATAN, 7, "ROLE", 1, subject(BAU, "Read")));
            }, (user, scope) -> result(entity("FLOWZERO", 11, "ROLE", 900, subject("RAISE_REQUEST", "Read"))))
            .getEntitlements(USER, List.of());
        assertEquals(List.of(36L, 108L), visibleIds(response));
        assertEquals(FLOW_SUBJECT, response.getEntities().get(1).getSubjects().get(0).getName());
    }

    @Test
    void requestedEntityScopeCanLimitTilesAndAnEmptyCatalogueDoesNotCallProviders() {
        var ems2 = mock(AuthorizationService.class);
        var ems3 = mock(MappedAuthorizationProvider.class);
        var empty = router(repository(List.of()), ems2, ems3).getEntitlements(USER, List.of());
        assertTrue(empty.getEntities().isEmpty());
        assertEquals(List.of(), empty.getAuthorizedTiles());
        verifyNoInteractions(ems2, ems3);
        var scoped = router(repository(List.of(tile(36, RATAN, BAU, "EMS2"), tile(108, FLOW, FLOW_SUBJECT, "EMS3"))),
            (user, scope) -> result(entity(RATAN, 7, "ROLE", 1, subject(BAU, "Read"))), ems3)
            .getEntitlements(USER, List.of(RATAN));
        assertEquals(List.of(36L), visibleIds(scoped));
        verifyNoInteractions(ems3);
    }

    @Test
    void unknownRequestedEntityOrDamagedTileIdentitiesFailBeforeFetchingPermissions() {
        var ems2 = mock(AuthorizationService.class);
        var ems3 = mock(MappedAuthorizationProvider.class);
        var row = tile(108, FLOW, FLOW_SUBJECT, "EMS3");
        assertThrows(AuthorizationUnavailableException.class,
            () -> router(repository(List.of(row)), ems2, ems3).getEntitlements(USER, List.of("UNKNOWN")));
        assertThrows(AuthorizationUnavailableException.class,
            () -> router(repository(Arrays.asList((Map<String, Object>) null)), ems2, ems3).getEntitlements(USER, List.of()));
        assertThrows(AuthorizationUnavailableException.class,
            () -> router(repository(List.of(row, new HashMap<>(row))), ems2, ems3).getEntitlements(USER, List.of()));
        row.put("application_tile_id", "not-a-number");
        assertThrows(AuthorizationUnavailableException.class,
            () -> router(repository(List.of(row)), ems2, ems3).getEntitlements(USER, List.of()));
        verifyNoInteractions(ems2, ems3);
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("invalidRows")
    void malformedTileConfigurationFailsBeforeCallingProviders(String label, Consumer<Map<String, Object>> mutation) {
        var row = tile(108, FLOW, FLOW_SUBJECT, "EMS3");
        mutation.accept(row);
        var ems2 = mock(AuthorizationService.class);
        var ems3 = mock(MappedAuthorizationProvider.class);
        assertThrows(AuthorizationUnavailableException.class, () -> router(repository(List.of(row)), ems2, ems3).getEntitlements(USER, List.of()));
        verifyNoInteractions(ems2, ems3);
    }

    static Stream<Arguments> invalidRows() {
        return Stream.of(
            invalid("unknown provider", row -> row.put("provider", "UNKNOWN")),
            invalid("missing provider", row -> row.put("provider", null)),
            invalid("missing app ID", row -> row.put("ems3_app_id", null)),
            invalid("blank app ID", row -> row.put("ems3_app_id", " ")),
            invalid("missing app name", row -> row.put("ems3_app_name", null)),
            invalid("blank feature", row -> row.put("ems3_subject", " ")),
            invalid("blank Portal subject", row -> row.put("ems2_subject", " ")),
            invalid("missing Portal entity", row -> row.put("ems2_entities", "")),
            invalid("EMS3 template bypass", row -> row.put("is_template", true)),
            invalid("multiple Portal entities", row -> row.put("ems2_entities", FLOW + ", " + RATAN)));
    }

    @Test
    void conflictingSharedPermissionProvidersOrMappingsFailBeforeCallingProviders() {
        var ems2 = mock(AuthorizationService.class);
        var ems3 = mock(MappedAuthorizationProvider.class);
        var first = tile(37, RATAN, STRATEGIC, "EMS3");
        for (String field : List.of("provider", "ems3_app_id", "ems3_app_name", "ems3_subject")) {
            var other = tile(39, RATAN, STRATEGIC, "EMS3");
            other.put(field, field.equals("provider") ? "EMS2" : "CONFLICT");
            assertThrows(AuthorizationUnavailableException.class,
                () -> router(repository(List.of(first, other)), ems2, ems3).getEntitlements(USER, List.of()));
        }
        verifyNoInteractions(ems2, ems3);
    }

    @Test
    void compatibilityIdsAreRequiredAndValidatedAgainstLegacyMetadata() {
        var repository = repository(List.of(tile(36, RATAN, BAU, "EMS2"), tile(37, RATAN, STRATEGIC, "EMS3")));
        var ems2 = mock(AuthorizationService.class);
        var ems3 = mock(MappedAuthorizationProvider.class);
        var missing = new TileEntitlementProperties();
        assertThrows(AuthorizationUnavailableException.class,
            () -> new RoutingAuthorizationService(repository, ems2, ems3, missing).getEntitlements(USER, List.of()));
        verifyNoInteractions(ems2, ems3);
        when(ems2.getEntitlements(USER, List.of(RATAN))).thenReturn(result(entity(RATAN, 999, "ROLE", 1, subject(BAU, "Read"))));
        when(ems3.getEntitlements(eq(USER), any())).thenReturn(result(entity(CES_RATAN, 70, "ROLE", 9, subject(STRATEGIC, "Read"))));
        assertThrows(AuthorizationUnavailableException.class, () -> router(repository, ems2, ems3).getEntitlements(USER, List.of()));
    }

    @Test
    void compatibilityEntityIdCannotDisagreeWithLegacyWhenTheProvidersHaveDifferentRoles() {
        var service = router(repository(List.of(tile(36, RATAN, BAU, "EMS2"), tile(37, RATAN, STRATEGIC, "EMS3"))),
            (user, scope) -> result(entity(RATAN, 999, "LEGACY_ROLE", 1, subject(BAU, "Read"))),
            (user, scope) -> result(entity(CES_RATAN, 70, "CES_ROLE", 9, subject(STRATEGIC, "Read"))));
        assertThrows(AuthorizationUnavailableException.class, () -> service.getEntitlements(USER, List.of()));
    }

    @Test
    void invalidCompatibilityIdsNamesAndPathsCannotAuthorizeCesFeatures() {
        var row = tile(108, FLOW, FLOW_SUBJECT, "EMS3");
        var properties = new TileEntitlementProperties();
        properties.setEntityIds(Map.of(FLOW, 0L));
        var service = new RoutingAuthorizationService(repository(List.of(row)), mock(AuthorizationService.class),
            (user, scope) -> result(entity("FLOWZERO", 11, "ROLE", 900, subject("RAISE_REQUEST", "Read"))), properties);
        assertThrows(AuthorizationUnavailableException.class, () -> service.getEntitlements(USER, List.of()));
        properties.setEntityIds(Map.of(FLOW, 8L));
        properties.setSubjectPaths(Map.of(FLOW + "/" + FLOW_SUBJECT, ""));
        assertThrows(AuthorizationUnavailableException.class, () -> service.getEntitlements(USER, List.of()));
        properties.setSubjectPaths(Map.of());
        properties.setSubjectNames(Map.of(FLOW + "/" + FLOW_SUBJECT, ""));
        assertThrows(AuthorizationUnavailableException.class, () -> service.getEntitlements(USER, List.of()));
    }

    @Test
    void invalidUserScopeOrDatabaseFailureBlocksAuthorization() {
        var repository = mock(ApplicationCategoryRepo.class);
        var ems2 = mock(AuthorizationService.class);
        var ems3 = mock(MappedAuthorizationProvider.class);
        var service = router(repository, ems2, ems3);
        for (String user : Arrays.asList(null, "", " ")) assertThrows(AuthorizationUnavailableException.class, () -> service.getEntitlements(user, List.of()));
        for (List<String> scope : Arrays.asList(null, List.of(""), List.of(RATAN, RATAN)))
            assertThrows(AuthorizationUnavailableException.class, () -> service.getEntitlements(USER, scope));
        when(repository.getAuthorizationTiles()).thenReturn(Optional.empty());
        assertThrows(AuthorizationUnavailableException.class, () -> service.getEntitlements(USER, List.of()));
        when(repository.getAuthorizationTiles()).thenThrow(new IllegalStateException("Database unavailable"));
        assertThrows(AuthorizationUnavailableException.class, () -> service.getEntitlements(USER, List.of()));
        verifyNoInteractions(ems2, ems3);
    }

    @ParameterizedTest
    @MethodSource("providerFailures")
    void selectedProviderFailureCannotReturnPartialPermissionsOrFallback(String provider) {
        var modernCalls = new AtomicInteger();
        var legacyCalls = new AtomicInteger();
        var response = new IllegalStateException("Provider unavailable");
        var service = router(repository(List.of(tile(36, RATAN, BAU, "EMS2"), tile(108, FLOW, FLOW_SUBJECT, "EMS3"))),
            (user, scope) -> {
                legacyCalls.incrementAndGet();
                if (provider.equals("EMS2")) throw response;
                return result(entity(RATAN, 7, "ROLE", 1, subject(BAU, "Read")));
            }, (user, scope) -> {
                modernCalls.incrementAndGet();
                throw response;
            });
        assertThrows(AuthorizationUnavailableException.class, () -> service.getEntitlements(USER, List.of()));
        assertEquals(1, legacyCalls.get());
        assertEquals(provider.equals("EMS2") ? 0 : 1, modernCalls.get());
    }

    static Stream<String> providerFailures() { return Stream.of("EMS2", "EMS3"); }

    @ParameterizedTest
    @MethodSource("invalidResponses")
    void malformedProviderResponsesCannotProducePermissionTokens(String label, Ems2Result response) {
        var service = router(repository(List.of(tile(108, FLOW, FLOW_SUBJECT, "EMS3"))), mock(AuthorizationService.class),
            (user, scope) -> response);
        assertThrows(AuthorizationUnavailableException.class, () -> service.getEntitlements(USER, List.of()));
    }

    static Stream<Arguments> invalidResponses() {
        var wrongUser = result(); wrongUser.setAccountName("other-user");
        var failed = result(); failed.setStatus("FAILURE");
        var missingSubjects = entity("FLOWZERO", 1, "ROLE", 1); missingSubjects.setSubjects(null);
        var badActions = subject("RAISE_REQUEST", "Read"); badActions.setActions(null);
        var duplicateRole = entity("FLOWZERO", 11, "ROLE", 900, subject("RAISE_REQUEST", "Read"));
        var nullEntity = result(); nullEntity.setEntities(Arrays.asList((Entity) null));
        var nullSubject = entity("FLOWZERO", 11, "ROLE", 900); nullSubject.setSubjects(Arrays.asList((Subject) null));
        var nullAction = subject("RAISE_REQUEST"); nullAction.setActions(Arrays.asList((Action) null));
        var blankAction = subject("RAISE_REQUEST", " ");
        return Stream.of(Arguments.of("missing response", (Object) null), Arguments.of("missing entities", new Ems2Result()),
            Arguments.of("wrong user", wrongUser), Arguments.of("failure status", failed),
            Arguments.of("missing subjects", result(missingSubjects)),
            Arguments.of("missing actions", result(entity("FLOWZERO", 1, "ROLE", 1, badActions))),
            Arguments.of("null entity", nullEntity), Arguments.of("null subject", result(nullSubject)),
            Arguments.of("null action", result(entity("FLOWZERO", 11, "ROLE", 900, nullAction))),
            Arguments.of("blank action", result(entity("FLOWZERO", 11, "ROLE", 900, blankAction))),
            Arguments.of("unexpected application", result(entity("UNRELATED", 11, "ROLE", 900, subject("RAISE_REQUEST", "Read")))),
            Arguments.of("duplicate role", result(duplicateRole, duplicateRole)),
            invalidEntity("blank entity name", entity -> entity.setName(" ")),
            invalidEntity("blank role", entity -> entity.setRoleName(" ")),
            invalidEntity("application metadata mismatch", entity -> entity.setApplicationName("OTHER")),
            invalidEntity("blank subject", entity -> entity.getSubjects().get(0).setName(" ")),
            invalidEntity("missing subject path", entity -> entity.getSubjects().get(0).setLongName(null)),
            invalidEntity("duplicate subject", entity -> entity.setSubjects(List.of(subject("RAISE_REQUEST", "Read"), subject("RAISE_REQUEST", "Write")))),
            invalidEntity("duplicate action", entity -> entity.setSubjects(List.of(subject("RAISE_REQUEST", "Read", "Read")))));
    }

    private static Arguments invalidEntity(String label, Consumer<Entity> mutation) {
        var entity = entity("FLOWZERO", 11, "ROLE", 900, subject("RAISE_REQUEST", "Read"));
        mutation.accept(entity); return Arguments.of(label, result(entity));
    }

    private static Arguments invalid(String label, Consumer<Map<String, Object>> mutation) { return Arguments.of(label, mutation); }
    private static ApplicationCategoryRepo repository(List<Map<String, Object>> rows) {
        var repository = mock(ApplicationCategoryRepo.class);
        when(repository.getAuthorizationTiles()).thenReturn(Optional.of(rows));
        return repository;
    }
    private static RoutingAuthorizationService router(ApplicationCategoryRepo repository, AuthorizationService legacy, MappedAuthorizationProvider modern) {
        var properties = new TileEntitlementProperties();
        properties.setEntityIds(Map.of(RATAN, 7L, FLOW, 8L));
        properties.setSubjectPaths(Map.of(RATAN + "/" + STRATEGIC, "/" + STRATEGIC, FLOW + "/" + FLOW_SUBJECT, FLOW_SUBJECT));
        return new RoutingAuthorizationService(repository, legacy, modern, properties);
    }
    public static Map<String, Object> tile(long id, String entity, String subject, String provider) {
        var row = new HashMap<String, Object>();
        row.put("application_tile_id", id); row.put("application_category_id", 1L); row.put("label", "Tests");
        row.put("key_name", "test_container"); row.put("module", "tests"); row.put("tile", "tile_" + id); row.put("title", "Tile " + id);
        row.put("ems2_entities", entity); row.put("ems2_subject", subject); row.put("provider", provider);
        row.put("ems3_app_id", "51358"); row.put("ems3_app_name", entity.equals(FLOW) ? "FLOWZERO" : CES_RATAN);
        row.put("ems3_subject", entity.equals(FLOW) ? "RAISE_REQUEST" : subject);
        row.put("is_active", true); row.put("visible_candidate", true); row.put("is_template", false);
        return row;
    }
    private static Entity entity(String name, long id, String role, long roleId, Subject... subjects) {
        var entity = new Entity(); entity.setName(name); entity.setApplicationName(name); entity.setId(id);
        entity.setRoleName(role); entity.setRoleId(roleId); entity.setSubjects(List.of(subjects)); return entity;
    }
    private static Subject subject(String name, String... actions) {
        var subject = new Subject(); subject.setName(name); subject.setLongName("/" + name); subject.setId(1L);
        subject.setActions(Arrays.stream(actions).map(nameOfAction -> {
            var action = new Action(); action.setName(nameOfAction); action.setId(2L); return action;
        }).toList()); return subject;
    }
    private static Ems2Result result(Entity... entities) {
        var result = new Ems2Result(); result.setAccountName(USER); result.setStatus("SUCCESS"); result.setEntities(List.of(entities)); return result;
    }
    private static Map<String, List<String>> permissions(Entity entity) {
        var permissions = new HashMap<String, List<String>>();
        for (var subject : entity.getSubjects()) permissions.put(subject.getName(), subject.getActions().stream().map(Action::getName).toList());
        return permissions;
    }
    private static List<Long> visibleIds(Ems2Result result) {
        return result.getAuthorizedTiles().stream().map(row -> ((Number) row.get("application_tile_id")).longValue()).toList();
    }
}
