package com.scb.sso.singleuibff.configuration;

import com.scb.sso.singleuibff.config.FmaaProperties;
import com.scb.sso.singleuibff.entity.ApplicationTile;
import com.scb.sso.singleuibff.exceptions.RecordNotUpdatedException;
import com.scb.sso.singleuibff.repository.ApplicationTileRepo;
import com.scb.sso.singleuibff.service.v1.implementation.ApplicationTileServiceImpl;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class TileConfigurationPersistenceTest {
    @Test
    void updatingOnlyOneStrategicSiblingIsRejectedBeforeItIsSaved() {
        var repo = mock(ApplicationTileRepo.class);
        when(repo.existsById(37L)).thenReturn(true);
        when(repo.findAll()).thenReturn(List.of(strategic(37, "EMS2"), strategic(39, "EMS2")));
        var service = new ApplicationTileServiceImpl(new FmaaProperties(), repo);
        var error = assertThrows(RecordNotUpdatedException.class, () -> service.update(strategic(37, "EMS3")));
        assertTrue(error.getMessage().contains("same provider"));
        verify(repo, never()).save(any());
    }

    @Test
    void bulkCutoverValidatesAllSixChangesAsOneSnapshot() throws Exception {
        var ids = List.of(37L, 39L, 144L, 152L, 161L, 165L);
        var repo = mock(ApplicationTileRepo.class);
        when(repo.findAll()).thenReturn(ids.stream().map(id -> strategic(id, "EMS2")).toList());
        var changes = ids.stream().map(id -> strategic(id, "EMS3")).toList();
        new ApplicationTileServiceImpl(new FmaaProperties(), repo).saveAll(changes);
        verify(repo).saveAll(changes);
    }

    @Test
    void aNewLegacyTileKeepsEms2WhenTheCallerProvidesNoRoutingFields() throws Exception {
        var repo = mock(ApplicationTileRepo.class);
        when(repo.getApplicationTileSeq()).thenReturn(Optional.of(900L));
        when(repo.save(any())).thenAnswer(call -> call.getArgument(0));
        var properties = new FmaaProperties();
        properties.setCreationEnabled(true);
        var tile = ApplicationTile.builder().ems2Entities("STAMP_STATIC").ems2Subject("Mapping Query").build();
        var created = new ApplicationTileServiceImpl(properties, repo).create(tile);
        assertEquals(900, created.getApplicationTileId());
        assertEquals("EMS2", created.getProvider());
    }

    private static ApplicationTile strategic(long id, String provider) {
        return ApplicationTile.builder().applicationTileId(id).ems2Entities("X_RATANONE")
            .ems2Subject("RATAN_STRATEGIC_CASHFLOW_BLOTTER").provider(provider).ems3AppId("51358")
            .ems3AppName("RATAN_ENTITLEMENT_RULE").ems3Subject("RATAN_STRATEGIC_CASHFLOW_BLOTTER").build();
    }
}
