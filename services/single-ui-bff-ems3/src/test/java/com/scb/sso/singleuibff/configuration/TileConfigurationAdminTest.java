package com.scb.sso.singleuibff.configuration;

import com.scb.sso.singleuibff.controller.v1.ApplicationTileController;
import com.scb.sso.singleuibff.dto.request.RequestOfApplicationCategory;
import com.scb.sso.singleuibff.dto.request.RequestOfApplicationTile;
import com.scb.sso.singleuibff.dto.request.RequestOfImportMap;
import com.scb.sso.singleuibff.dto.response.ResponseOfAdminModule;
import com.scb.sso.singleuibff.entity.ApplicationCategory;
import com.scb.sso.singleuibff.entity.ApplicationTile;
import com.scb.sso.singleuibff.entity.ApplicationTileAudit;
import com.scb.sso.singleuibff.entity.ImportMap;
import com.scb.sso.singleuibff.service.v1.ApplicationCategoryService;
import com.scb.sso.singleuibff.service.v1.ApplicationTileAuditService;
import com.scb.sso.singleuibff.service.v1.ApplicationTileService;
import com.scb.sso.singleuibff.service.v1.ImportMapService;
import com.scb.sso.singleuibff.util.AdminModuleUtil;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.util.ReflectionTestUtils;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class TileConfigurationAdminTest {
    private ApplicationTileController controller;
    private ApplicationTile current;
    private ApplicationTileService tiles;
    private List<ApplicationTileAudit> audit;

    @BeforeEach
    void setup() throws Exception {
        controller = new ApplicationTileController();
        audit = new ArrayList<>();
        var category = ApplicationCategory.builder().applicationCategoryId(7).ems2Role("RATAN_ADMIN").build();
        var module = ImportMap.builder().importMapId(27).ems2Role("RATAN_ADMIN").build();
        current = ApplicationTile.builder().applicationTileId(108).applicationCategory(category).importMap(module)
            .ems2Role("RATAN_ADMIN").title("FlowZero").module("flowzero").tile("launch")
            .ems2Entities("FLOW_ZERO").ems2Subject("FLOW_ZERO_RAISE REQUEST")
            .provider("EMS3").ems3AppId("51358").ems3AppName("FLOWZERO").ems3Subject("RAISE_REQUEST")
            .isActive(true).createdBy("original-maker").updatedBy("original-maker").build();
        tiles = mock(ApplicationTileService.class);
        when(tiles.getById(108L)).thenReturn(Optional.of(current));
        when(tiles.update(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(tiles.create(any())).thenAnswer(invocation -> invocation.getArgument(0));
        var categories = mock(ApplicationCategoryService.class);
        when(categories.getById(7L)).thenReturn(Optional.of(category));
        var modules = mock(ImportMapService.class);
        when(modules.getById(27L)).thenReturn(Optional.of(module));
        var audits = mock(ApplicationTileAuditService.class);
        when(audits.create(any())).thenAnswer(invocation -> {
            ApplicationTileAudit saved = invocation.getArgument(0);
            audit.add(saved);
            return saved;
        });
        var admin = spy(new AdminModuleUtil(null, null, null, null));
        doReturn(Map.of("sub", "current-operator", "ems2Role", "RATAN_ADMIN")).when(admin).validate(any(), any());
        ReflectionTestUtils.setField(controller, "applicationTileService", tiles);
        ReflectionTestUtils.setField(controller, "applicationCategoryService", categories);
        ReflectionTestUtils.setField(controller, "importMapService", modules);
        ReflectionTestUtils.setField(controller, "applicationTileAuditService", audits);
        ReflectionTestUtils.setField(controller, "adminModuleUtil", admin);
    }

    @Test
    void makerPreservesThePublishedRouteBeforeChangingAnActiveTileWithoutEarlierAudit() {
        var request = request("MAKER");
        request.setProvider("EMS2");
        var response = controller.update(request, new MockHttpServletRequest());
        assertEquals(200, response.getStatusCode().value());
        assertTrue(((ResponseOfAdminModule) response.getBody()).isResult());
        assertFalse(current.isActive());
        assertEquals("EMS2", current.getProvider());
        assertEquals(2, audit.size());
        assertEquals("published", audit.get(0).getTransactionMode());
        assertTrue(audit.get(0).isActive());
        assertEquals("EMS3", audit.get(0).getProvider());
        assertEquals("FLOWZERO", audit.get(0).getEms3AppName());
        assertEquals("maker", audit.get(1).getTransactionMode());
        assertFalse(audit.get(1).isActive());
    }

    @Test
    void aLegacyMakerRequestPreservesSavedEms3Fields() {
        var response = controller.update(request("maker"), new MockHttpServletRequest());
        assertEquals(200, response.getStatusCode().value());
        assertEquals("EMS3", current.getProvider());
        assertEquals("51358", current.getEms3AppId());
        assertEquals("FLOWZERO", current.getEms3AppName());
        assertEquals("RAISE_REQUEST", current.getEms3Subject());
        assertEquals("EMS3", audit.get(audit.size() - 1).getProvider());
    }

    @Test
    void checkerApprovesTheStoredRouteAndCannotInjectAProviderChange() {
        current.setActive(false);
        var request = request("CHECKER");
        request.setProvider("EMS2");
        request.setEms3AppName("UNAPPROVED_APP");
        var response = controller.update(request, new MockHttpServletRequest());
        assertEquals(200, response.getStatusCode().value());
        assertTrue(current.isActive());
        assertEquals("EMS3", current.getProvider());
        assertEquals("FLOWZERO", current.getEms3AppName());
        assertEquals(1, audit.size());
        assertEquals("checker", audit.get(0).getTransactionMode());
    }

    @Test
    void checkerCannotFallThroughAndModifyAnAlreadyActiveRoute() {
        var request = request("checker");
        request.setProvider("EMS2");
        var response = controller.update(request, new MockHttpServletRequest());
        assertEquals(400, response.getStatusCode().value());
        assertTrue(current.isActive());
        assertEquals("EMS3", current.getProvider());
        assertEquals("FlowZero", current.getTitle());
        assertTrue(audit.isEmpty());
    }

    @Test
    void unknownUpdateModesCannotPublishAnUnapprovedRoute() {
        var request = request("custom-mode");
        request.setProvider("EMS2");
        var response = controller.update(request, new MockHttpServletRequest());
        assertEquals(400, response.getStatusCode().value());
        assertEquals("EMS3", current.getProvider());
        assertTrue(audit.isEmpty());
    }

    @Test
    void legacyCreateDefaultsToEms2AndStartsPending() {
        var response = controller.create(request("create"), new MockHttpServletRequest());
        assertEquals(200, response.getStatusCode().value());
        var created = (ApplicationTile) ((ResponseOfAdminModule) response.getBody()).getData();
        assertEquals("EMS2", created.getProvider());
        assertFalse(created.isActive());
        assertNull(created.getEms3AppName());
        assertEquals("create", audit.get(0).getTransactionMode());
        assertEquals("EMS2", audit.get(0).getProvider());
    }

    private RequestOfApplicationTile request(String mode) {
        var category = new RequestOfApplicationCategory();
        category.setApplicationCategoryId(7);
        var module = new RequestOfImportMap();
        module.setImportMapId(27);
        var request = new RequestOfApplicationTile();
        request.setApplicationTileId(108);
        request.setApplicationCategory(category);
        request.setImportMap(module);
        request.setTitle("FlowZero edited");
        request.setModule("flowzero");
        request.setTile("launch");
        request.setEms2Entities("FLOW_ZERO");
        request.setEms2Subject("FLOW_ZERO_RAISE REQUEST");
        request.setMode(mode);
        return request;
    }
}
