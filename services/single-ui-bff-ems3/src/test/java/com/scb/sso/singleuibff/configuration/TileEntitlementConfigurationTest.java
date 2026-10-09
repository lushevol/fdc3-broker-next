package com.scb.sso.singleuibff.configuration;

import com.scb.sso.singleuibff.entity.ApplicationTile;
import com.scb.sso.singleuibff.util.TileEntitlementConfiguration;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.function.Consumer;
import java.util.stream.Stream;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import static org.junit.jupiter.api.Assertions.*;

class TileEntitlementConfigurationTest {
    @Test
    void partialStrategicCutoverCannotMixProvidersEvenWhenTheSiblingIsInactive() {
        var migrated = strategic(37, "EMS3");
        var sibling = strategic(39, "EMS2");
        sibling.setActive(false);
        assertThrows(IllegalArgumentException.class,
            () -> TileEntitlementConfiguration.validateTiles(List.of(migrated, sibling)));
    }

    @Test
    void allSixStrategicVariantsCanSwitchTogetherWhileBauAndStampStayOnEms2() {
        var ids = List.of(37L, 39L, 144L, 152L, 161L, 165L);
        var persisted = new ArrayList<ApplicationTile>();
        for (long id : ids) persisted.add(strategic(id, "EMS2"));
        persisted.add(ApplicationTile.builder().applicationTileId(36).ems2Entities("X_RATANONE")
            .ems2Subject("RATAN_CASHFLOW_BLOTTER").build());
        persisted.add(ApplicationTile.builder().applicationTileId(48).ems2Entities("STAMP_STATIC").ems2Subject("Mapping Query").build());
        var changes = ids.stream().map(id -> strategic(id, "EMS3")).toList();
        assertDoesNotThrow(() -> TileEntitlementConfiguration.validateChanges(persisted, changes));
        assertEquals("EMS2", persisted.get(0).getProvider());
    }

    @Test
    void anOldUpdateLeavesTheSavedEms3RouteIntact() {
        var flowzero = flowzero();
        TileEntitlementConfiguration.applyOverrides(flowzero, null, null, null, null);
        assertEquals("EMS3", flowzero.getProvider());
        assertEquals("51358", flowzero.getEms3AppId());
        assertEquals("FLOWZERO", flowzero.getEms3AppName());
        assertEquals("RAISE_REQUEST", flowzero.getEms3Subject());
    }

    @Test
    void newLegacyTilesDefaultToEms2AndExplicitValuesAreTrimmed() {
        var legacy = ApplicationTile.builder().build();
        TileEntitlementConfiguration.applyOverrides(legacy, null, null, null, null);
        assertEquals("EMS2", legacy.getProvider());
        var migrated = flowzero();
        TileEntitlementConfiguration.applyOverrides(migrated, " ems3 ", " 51358 ", " FLOWZERO ", " RAISE_REQUEST ");
        assertEquals("EMS3", migrated.getProvider());
        assertEquals("51358", migrated.getEms3AppId());
        assertEquals("FLOWZERO", migrated.getEms3AppName());
        assertEquals("RAISE_REQUEST", migrated.getEms3Subject());
        assertDoesNotThrow(() -> TileEntitlementConfiguration.validateTiles(List.of(migrated)));
    }

    @Test
    void explicitBlankCannotClearARequiredEms3Identity() {
        var migrated = flowzero();
        TileEntitlementConfiguration.applyOverrides(migrated, null, "", null, null);
        assertThrows(IllegalArgumentException.class, () -> TileEntitlementConfiguration.validateTiles(List.of(migrated)));
    }

    @Test
    void legacyTemplatesMultiEntityTilesAndEntityOnlyTilesKeepTheirExistingMeaning() {
        var template = ApplicationTile.builder().applicationTileId(65).isTemplate(true).build();
        var multi = ApplicationTile.builder().applicationTileId(19).ems2Entities(" FSS_SG, FSS_TH, FSS_SG,, ")
            .ems2Subject("Payments").build();
        var entityOnly = ApplicationTile.builder().applicationTileId(193).ems2Entities("X_RATANONE").build();
        var noEntity = ApplicationTile.builder().applicationTileId(999).ems2Entities(null).ems2Subject("legacy").build();
        assertDoesNotThrow(() -> TileEntitlementConfiguration.validateTiles(List.of(template, multi, entityOnly, noEntity)));
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("invalidRoutes")
    void invalidEms3ConfigurationIsRejected(String reason, Consumer<ApplicationTile> change) {
        var route = flowzero();
        change.accept(route);
        assertThrows(IllegalArgumentException.class, () -> TileEntitlementConfiguration.validateTiles(List.of(route)));
    }

    private static Stream<Arguments> invalidRoutes() {
        return Stream.of(
            bad("unknown provider", tile -> tile.setProvider("EMS4")),
            bad("missing provider", tile -> tile.setProvider(null)),
            bad("template bypass", tile -> tile.setTemplate(true)),
            bad("missing Portal entity", tile -> tile.setEms2Entities(null)),
            bad("blank Portal entity", tile -> tile.setEms2Entities(" ")),
            bad("multiple Portal entities", tile -> tile.setEms2Entities("FLOW_ZERO,X_RATANONE")),
            bad("blank Portal subject", tile -> tile.setEms2Subject(" ")),
            bad("missing app ID", tile -> tile.setEms3AppId(null)),
            bad("missing app name", tile -> tile.setEms3AppName(null)),
            bad("missing feature", tile -> tile.setEms3Subject(null)));
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("conflictingBindings")
    void samePortalPermissionCannotPointAtDifferentEms3Bindings(String reason, Consumer<ApplicationTile> change) {
        var first = strategic(37, "EMS3");
        var second = strategic(39, "EMS3");
        change.accept(second);
        assertThrows(IllegalArgumentException.class, () -> TileEntitlementConfiguration.validateTiles(List.of(first, second)));
    }

    private static Stream<Arguments> conflictingBindings() {
        return Stream.of(bad("different registration", tile -> tile.setEms3AppId("999")),
            bad("different app", tile -> tile.setEms3AppName("OTHER")),
            bad("different feature", tile -> tile.setEms3Subject("OTHER_FEATURE")),
            bad("case-insensitive subject collision", tile -> {
                tile.setEms2Subject("ratan_strategic_cashflow_blotter"); tile.setProvider("EMS2");
            }));
    }

    @Test
    void incompleteSnapshotsAndDuplicateBatchRowsAreRejected() {
        assertThrows(IllegalArgumentException.class, () -> TileEntitlementConfiguration.validateTiles(null));
        assertThrows(IllegalArgumentException.class, () -> TileEntitlementConfiguration.validateTiles(Arrays.asList((ApplicationTile) null)));
        assertThrows(IllegalArgumentException.class, () -> TileEntitlementConfiguration.applyOverrides(null, null, null, null, null));
        assertThrows(IllegalArgumentException.class, () -> TileEntitlementConfiguration.validateChanges(null, List.of()));
        assertThrows(IllegalArgumentException.class, () -> TileEntitlementConfiguration.validateChanges(List.of(), null));
        assertThrows(IllegalArgumentException.class, () -> TileEntitlementConfiguration.validateChanges(Arrays.asList((ApplicationTile) null), List.of()));
        assertThrows(IllegalArgumentException.class, () -> TileEntitlementConfiguration.validateChanges(List.of(), Arrays.asList((ApplicationTile) null)));
        assertThrows(IllegalArgumentException.class, () -> TileEntitlementConfiguration.validateChanges(List.of(), List.of(flowzero(), flowzero())));
        assertDoesNotThrow(() -> TileEntitlementConfiguration.validateTiles(List.of()));
    }

    private static Arguments bad(String reason, Consumer<ApplicationTile> change) { return Arguments.of(reason, change); }

    private static ApplicationTile flowzero() {
        return ApplicationTile.builder().applicationTileId(108).ems2Entities("FLOW_ZERO")
            .ems2Subject("FLOW_ZERO_RAISE REQUEST").provider("EMS3").ems3AppId("51358")
            .ems3AppName("FLOWZERO").ems3Subject("RAISE_REQUEST").isActive(true).build();
    }

    private static ApplicationTile strategic(long id, String provider) {
        return ApplicationTile.builder().applicationTileId(id).ems2Entities("X_RATANONE")
            .ems2Subject("RATAN_STRATEGIC_CASHFLOW_BLOTTER").provider(provider).ems3AppId("51358")
            .ems3AppName("RATAN_ENTITLEMENT_RULE").ems3Subject("RATAN_STRATEGIC_CASHFLOW_BLOTTER").isActive(true).build();
    }
}
