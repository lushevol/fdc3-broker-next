package com.scb.sso.singleuibff.configuration;

import com.scb.sso.singleuibff.config.FmaaProperties;
import com.scb.sso.singleuibff.controller.v1.ApplicationConfigController;
import com.scb.sso.singleuibff.dto.config.ApplicationTileConfig;
import com.scb.sso.singleuibff.entity.ApplicationCategory;
import com.scb.sso.singleuibff.entity.ApplicationTile;
import com.scb.sso.singleuibff.entity.ApplicationTileAudit;
import com.scb.sso.singleuibff.entity.ImportMap;
import com.scb.sso.singleuibff.exceptions.RecordNotCreatedException;
import com.scb.sso.singleuibff.repository.ApplicationTileRepo;
import com.scb.sso.singleuibff.service.v1.ApplicationTileAuditService;
import com.scb.sso.singleuibff.service.v1.implementation.ApplicationTileServiceImpl;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class TileConfigurationBulkTest {
    @Test
    void legacyCsvConfigurationPreservesExistingFlowZeroRoutingAndAuditsIt() throws Exception {
        var current = ApplicationTile.builder().applicationTileId(108).ems2Role("RATAN_ADMIN")
            .ems2Entities("FLOW_ZERO").ems2Subject("FLOW_ZERO_RAISE REQUEST")
            .provider("EMS3").ems3AppId("51358").ems3AppName("FLOWZERO").ems3Subject("RAISE_REQUEST").build();
        var harness = new Harness(List.of(current));
        var request = config(108, "FLOW_ZERO", "FLOW_ZERO_RAISE REQUEST", null);
        var saved = harness.write(List.of(request)).get(0);
        assertEquals("EMS3", saved.getProvider());
        assertEquals("51358", saved.getEms3AppId());
        assertEquals("FLOWZERO", saved.getEms3AppName());
        assertEquals("RAISE_REQUEST", saved.getEms3Subject());
        assertEquals("EMS3", harness.audit.get(0).getProvider());
        assertEquals("FLOWZERO", harness.audit.get(0).getEms3AppName());
    }

    @Test
    void allSixStrategicCsvRowsAreValidatedAndAuditedAsOneBatch() throws Exception {
        var ids = List.of(37L, 39L, 144L, 152L, 161L, 165L);
        var harness = new Harness(ids.stream().map(TileConfigurationBulkTest::strategic).toList());
        var changes = ids.stream().map(id -> config(id, "X_RATANONE", "RATAN_STRATEGIC_CASHFLOW_BLOTTER", "EMS3")).toList();
        var saved = harness.write(changes);
        assertEquals(6, saved.size());
        assertTrue(saved.stream().allMatch(tile -> "EMS3".equals(tile.getProvider())));
        assertEquals(6, harness.audit.size());
        assertTrue(harness.audit.stream().allMatch(row -> "RATAN_ENTITLEMENT_RULE".equals(row.getEms3AppName())));
    }

    @Test
    void partialStrategicCsvCannotSaveOrAuditAConflictingProvider() {
        var harness = new Harness(List.of(strategic(37), strategic(39)));
        assertThrows(RecordNotCreatedException.class, () -> harness.write(List.of(
            config(37, "X_RATANONE", "RATAN_STRATEGIC_CASHFLOW_BLOTTER", "EMS3"))));
        verify(harness.repo, never()).saveAll(any());
        assertTrue(harness.audit.isEmpty());
    }

    private static ApplicationTile strategic(long id) {
        return ApplicationTile.builder().applicationTileId(id).ems2Role("RATAN_ADMIN")
            .ems2Entities("X_RATANONE").ems2Subject("RATAN_STRATEGIC_CASHFLOW_BLOTTER").build();
    }

    private static ApplicationTileConfig config(long id, String entity, String subject, String provider) {
        return ApplicationTileConfig.builder().applicationTileId(id).ems2Role("RATAN_ADMIN")
            .title("Example tile").module("example").tile("launch").ems2Entities(entity).ems2Subject(subject)
            .applicationCategoryId(7).importMapId(27).provider(provider).isActive(true)
            .ems3AppId(provider == null ? null : "51358")
            .ems3AppName(provider == null ? null : "RATAN_ENTITLEMENT_RULE")
            .ems3Subject(provider == null ? null : "RATAN_STRATEGIC_CASHFLOW_BLOTTER").build();
    }

    private static final class Harness {
        final ApplicationTileRepo repo = mock(ApplicationTileRepo.class);
        final List<ApplicationTileAudit> audit = new ArrayList<>();
        final ApplicationConfigController api = new ApplicationConfigController();
        Harness(List<ApplicationTile> persisted) {
            when(repo.findAll()).thenReturn(persisted);
            for (var tile : persisted) when(repo.findById(tile.getApplicationTileId())).thenReturn(java.util.Optional.of(tile));
            var audits = mock(ApplicationTileAuditService.class);
            try {
                doAnswer(call -> { audit.addAll(call.getArgument(0)); return null; }).when(audits).saveAll(any());
            } catch (RecordNotCreatedException failure) { throw new AssertionError(failure); }
            ReflectionTestUtils.setField(api, "applicationTileService", new ApplicationTileServiceImpl(new FmaaProperties(), repo));
            ReflectionTestUtils.setField(api, "applicationTileAuditService", audits);
        }
        List<ApplicationTile> write(List<ApplicationTileConfig> changes) throws RecordNotCreatedException {
            return api.handleApplicationTile(changes, List.of(ImportMap.builder().importMapId(27).build()),
                List.of(ApplicationCategory.builder().applicationCategoryId(7).build()), "RATAN_ADMIN");
        }
    }
}
