package com.scb.sso.singleuibff.controller.v1;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.sso.singleuibff.dto.request.RequestOfApplicationCategory;
import com.scb.sso.singleuibff.dto.request.RequestOfApplicationTile;
import com.scb.sso.singleuibff.dto.request.RequestOfImportMap;
import com.scb.sso.singleuibff.dto.response.ResponseOfAdminModule;
import com.scb.sso.singleuibff.entity.ApplicationCategory;
import com.scb.sso.singleuibff.entity.ApplicationTile;
import com.scb.sso.singleuibff.entity.ImportMap;
import com.scb.sso.singleuibff.service.v1.ApplicationCategoryService;
import com.scb.sso.singleuibff.service.v1.ApplicationTileAuditService;
import com.scb.sso.singleuibff.service.v1.ApplicationTileService;
import com.scb.sso.singleuibff.service.v1.ImportMapService;
import com.scb.sso.singleuibff.util.AdminModuleUtil;
import lombok.SneakyThrows;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@WebMvcTest(ApplicationTileController.class)
public class ApplicationTileControllerTest {

    @BeforeEach
    void preserveCheckerPredicate() {
        doAnswer(invocation -> invocation.getArgument(0) == null || invocation.getArgument(1) == null
            ? false : invocation.callRealMethod()).when(adminModuleUtil).validateChecker(any(), any());
    }

    private final String EMS2_ROLE = "FMO_ADMIN";
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @MockBean
    private ApplicationTileService applicationTileService;
    @MockBean
    private ApplicationTileAuditService applicationTileAuditService;
    @MockBean
    private ApplicationCategoryService applicationCategoryService;
    @MockBean
    private ImportMapService importMapService;
    @MockBean
    private AdminModuleUtil adminModuleUtil;

    private List<ApplicationCategory> getApplicationCategories() {
        return List.of(ApplicationCategory.builder()
            .label("Admin Module")
            .isActive(true).createdBy("2001208").createdAt(new Date()).updatedBy("2001208").updatedAt(new Date())
            .ems2Role(EMS2_ROLE).build());
    }

    private ApplicationCategory getApplicationCategory() {
        return ApplicationCategory.builder()
            .label("Admin Module")
            .isActive(true).createdBy("2001208").createdAt(new Date()).updatedBy("2001208").updatedAt(new Date())
            .ems2Role(EMS2_ROLE).build();
    }

    private List<ApplicationTile> getApplicationTiles() {
        ApplicationCategory applicationCategory = ApplicationCategory.builder()
            .label("Admin Module")
            .isActive(true).createdBy("2001208").createdAt(new Date()).updatedBy("2001208").updatedAt(new Date())
            .ems2Role(EMS2_ROLE).build();
        ImportMap container = ImportMap.builder().keyName("@fm/base").path("//localhost:8002/base.js").isActive(true).createdBy("2001208")
            .createdAt(new Date()).updatedBy("2001208").updatedAt(new Date()).ems2Role(EMS2_ROLE).build();
        return List.of(
            ApplicationTile.builder()
                .applicationCategory(applicationCategory)
                .importMap(container)
                .title("Import Map")
                .imageDarkTheme("darkIcons/icon12.svg")
                .imageLightTheme("lightIcons/icon12.svg")
                .module("/importmap")
                .tile("/importmap")
                .isTemplate(false)
                .ems2Entities("FMO PORTAL ADMIN")
                .ems2Subject("/importmap")
                .emailSupport("")
                .isActive(true).createdBy("2001208").createdAt(new Date()).updatedBy("2001208").updatedAt(new Date()).ems2Role(EMS2_ROLE)
                .build(),
            ApplicationTile.builder()
                .applicationCategory(applicationCategory)
                .importMap(container)
                .title("Drawer Category")
                .imageDarkTheme("darkIcons/icon13.svg")
                .imageLightTheme("lightIcons/icon13.svg")
                .module("/category")
                .tile("/category")
                .isTemplate(false)
                .ems2Entities("FMO PORTAL ADMIN")
                .ems2Subject("/category")
                .emailSupport("")
                .isActive(true).createdBy("2001208").createdAt(new Date()).updatedBy("2001208").updatedAt(new Date()).ems2Role(EMS2_ROLE)
                .build(),
            ApplicationTile.builder()
                .applicationCategory(applicationCategory)
                .importMap(container)
                .title("Tile Configuration")
                .imageDarkTheme("darkIcons/icon14.svg")
                .imageLightTheme("lightIcons/icon14.svg")
                .module("/tile")
                .tile("/tile")
                .isTemplate(false)
                .ems2Entities("FMO PORTAL ADMIN")
                .ems2Subject("/tile")
                .emailSupport("")
                .isActive(true).createdBy("2001208").createdAt(new Date()).updatedBy("2001208").updatedAt(new Date()).ems2Role(EMS2_ROLE)
                .build());
    }

    private ApplicationTile getApplicationTile() {
        ApplicationCategory applicationCategory = ApplicationCategory.builder()
            .label("Admin Module")
            .isActive(true).createdBy("2001208").createdAt(new Date()).updatedBy("2001208").updatedAt(new Date())
            .ems2Role(EMS2_ROLE).build();
        ImportMap container = ImportMap.builder().keyName("@fm/base").path("//localhost:8002/base.js").isActive(true).createdBy("2001208")
            .createdAt(new Date()).updatedBy("2001208").updatedAt(new Date()).ems2Role(EMS2_ROLE).build();
        return ApplicationTile.builder()
            .applicationCategory(applicationCategory)
            .importMap(container)
            .title("Import Map")
            .subtitle("sub title")
            .imageDarkTheme("darkIcons/icon12.svg")
            .imageLightTheme("lightIcons/icon12.svg")
            .module("/importmap")
            .tile("/importmap")
            .isTemplate(false)
            .ems2Entities("FMO PORTAL ADMIN")
            .ems2Subject("/importmap")
            .emailSupport("")
            .isActive(true).createdBy("2001208").createdAt(new Date()).updatedBy("2001208").updatedAt(new Date()).ems2Role(EMS2_ROLE)
            .build();
    }

    private ImportMap getImportMap() {
        return ImportMap.builder().keyName("single-spa").path("/js/external/single-spa.dev.js").isActive(true).createdBy("2001208")
            .createdAt(new Date()).updatedBy("2001208").updatedAt(new Date()).ems2Role(EMS2_ROLE).build();
    }

    private RequestOfApplicationCategory getRequestOfApplicationCategory() {
        RequestOfApplicationCategory requestOfApplicationCategory = new RequestOfApplicationCategory();
        requestOfApplicationCategory.setEntitlementsToken("123");
        requestOfApplicationCategory.setEms2Role("RATAN_ADMIN");
        return requestOfApplicationCategory;
    }

    private RequestOfImportMap getRequestOfImportMap() {
        RequestOfImportMap requestOfImportMap = new RequestOfImportMap();
        requestOfImportMap.setEntitlementsToken("123");
        requestOfImportMap.setEms2Role("RATAN_ADMIN");
        return requestOfImportMap;
    }

    private RequestOfApplicationTile getRequestOfApplicationTile() {
        RequestOfApplicationTile requestOfApplicationTile = new RequestOfApplicationTile();
        requestOfApplicationTile.setEntitlementsToken("123");
        requestOfApplicationTile.setEms2Role("RATAN_ADMIN");
        requestOfApplicationTile.setApplicationCategory(getRequestOfApplicationCategory());
        requestOfApplicationTile.setImportMap(getRequestOfImportMap());
        requestOfApplicationTile.setModule("Module");
        requestOfApplicationTile.setTitle("Title");
        requestOfApplicationTile.setTile("tile");
        return requestOfApplicationTile;
    }

    private RequestOfApplicationTile getRequestOfApplicationTile1() {
        RequestOfApplicationTile requestOfApplicationTile = new RequestOfApplicationTile();
        requestOfApplicationTile.setEntitlementsToken("123");
        requestOfApplicationTile.setEms2Role("RATAN_ADMIN");
        requestOfApplicationTile.setImportMap(getRequestOfImportMap());
        requestOfApplicationTile.setModule("Module");
        requestOfApplicationTile.setTitle("Title");
        requestOfApplicationTile.setTile("tile");
        return requestOfApplicationTile;
    }

    @SneakyThrows
    @Test
    void testGetData1() {
        Map<String, String> payload = new HashMap<>();
        payload.put("ems2Role", "FMO_ADMIN");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        when(applicationTileService.findByEms2Role(any())).thenReturn(Optional.ofNullable(getApplicationTiles()));
        String response = mockMvc.perform(post("/v1/fmo/admin/tile/data")
            .content(objectMapper.writeValueAsString(getRequestOfApplicationTile1()))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isOk()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertTrue(result.isResult());
    }

    @SneakyThrows
    @Test
    void testGetData2() {
        Map<String, String> payload = new HashMap<>();
        payload.put("ems2Role", "any");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        when(applicationTileService.findByApplicationCategoryIdEms2Role(anyLong(), anyString()))
            .thenReturn(Optional.ofNullable(getApplicationTiles()));
        String response = mockMvc.perform(post("/v1/fmo/admin/tile/data")
            .content(objectMapper.writeValueAsString(getRequestOfApplicationTile()))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isOk()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertTrue(result.isResult());
    }

    @SneakyThrows
    @Test
    void testGetDataFail() {
        Map<String, String> payload = new HashMap<>();
        payload.put("ems2Role", "any");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        doThrow(new NoSuchElementException("Record not found.")).when(applicationTileService).findByApplicationCategoryIdEms2Role(anyLong(),
            anyString());
        String response = mockMvc.perform(post("/v1/fmo/admin/tile/data")
            .content(objectMapper.writeValueAsString(getRequestOfApplicationTile()))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isBadRequest()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testGetAuditData() {
        Map<String, String> payload = new HashMap<>();
        payload.put("ems2Role", "FMO_ADMIN");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        when(applicationTileAuditService.findByApplicationTileId(anyLong())).thenReturn(Optional.ofNullable(new ArrayList<>()));
        String response = mockMvc.perform(post("/v1/fmo/admin/tile/audit")
            .content(objectMapper.writeValueAsString(getRequestOfApplicationTile()))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isOk()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertTrue(result.isResult());
    }

    @SneakyThrows
    @Test
    void testGetAuditDataFail() {
        Map<String, String> payload = new HashMap<>();
        payload.put("ems2Role", "FMO_ADMIN");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        doThrow(new NoSuchElementException("Record not found.")).when(applicationTileAuditService)
            .findByApplicationTileId(anyLong());
        String response = mockMvc.perform(post("/v1/fmo/admin/tile/audit")
            .content(objectMapper.writeValueAsString(getRequestOfApplicationTile()))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isBadRequest()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testCreate() {
        Map<String, String> payload = new HashMap<>();
        payload.put("sub", "123");
        payload.put("ems2Role", "FMO_ADMIN");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        when(applicationCategoryService.getById(any())).thenReturn(Optional.ofNullable(getApplicationCategory()));
        when(importMapService.getById(any())).thenReturn(Optional.ofNullable(getImportMap()));
        when(applicationTileService.create(any())).thenReturn(getApplicationTile());
        RequestOfApplicationTile requestOfApplicationTile = getRequestOfApplicationTile();
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getModule(), "")).thenReturn(requestOfApplicationTile.getModule());
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getTile(), "")).thenReturn(requestOfApplicationTile.getTile());
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getTitle(), "")).thenReturn(requestOfApplicationTile.getTitle());
        String response = mockMvc.perform(post("/v1/fmo/admin/tile/create")
            .content(objectMapper.writeValueAsString(requestOfApplicationTile))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isOk()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertTrue(result.isResult());
    }

    @SneakyThrows
    @Test
    void testCreate1() {
        Map<String, String> payload = new HashMap<>();
        payload.put("sub", "123");
        payload.put("ems2Role", "FMO_ADMIN");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        when(applicationCategoryService.getById(any())).thenReturn(Optional.ofNullable(getApplicationCategory()));
        when(importMapService.getById(any())).thenReturn(Optional.ofNullable(getImportMap()));
        when(applicationTileService.create(any())).thenReturn(getApplicationTile());
        RequestOfApplicationTile requestOfApplicationTile = getRequestOfApplicationTile();
        requestOfApplicationTile.setTitle("title");
        requestOfApplicationTile.setSubtitle("subtitle");
        requestOfApplicationTile.setEmailSupport("email");
        requestOfApplicationTile.setEms2Subject("ems2Subject");
        requestOfApplicationTile.setEms2Entities("ems2Entities");
        requestOfApplicationTile.setTile("tile");
        requestOfApplicationTile.setModule("module");
        requestOfApplicationTile.setImageLightTheme("image");
        requestOfApplicationTile.setImageDarkTheme("image");
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getModule(), "")).thenReturn(requestOfApplicationTile.getModule());
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getTile(), "")).thenReturn(requestOfApplicationTile.getTile());
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getTitle(), "")).thenReturn(requestOfApplicationTile.getTitle());
        String response = mockMvc.perform(post("/v1/fmo/admin/tile/create")
            .content(objectMapper.writeValueAsString(requestOfApplicationTile))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isOk()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertTrue(result.isResult());
    }

    @SneakyThrows
    @Test
    void testCreate2() {
        Map<String, String> payload = new HashMap<>();
        payload.put("sub", "123");
        payload.put("ems2Role", "RATAN_ADMIN");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        when(applicationCategoryService.getById(any())).thenReturn(Optional.ofNullable(getApplicationCategory()));
        when(importMapService.getById(any())).thenReturn(Optional.ofNullable(getImportMap()));
        when(applicationTileService.create(any())).thenReturn(getApplicationTile());
        RequestOfApplicationTile requestOfApplicationTile = getRequestOfApplicationTile();
        requestOfApplicationTile.setTitle("title");
        requestOfApplicationTile.setSubtitle("subtitle");
        requestOfApplicationTile.setEmailSupport("email");
        requestOfApplicationTile.setEms2Subject("ems2Subject");
        requestOfApplicationTile.setEms2Entities("ems2Entities");
        requestOfApplicationTile.setTile("tile");
        requestOfApplicationTile.setModule("module");
        requestOfApplicationTile.setImageLightTheme("image");
        requestOfApplicationTile.setImageDarkTheme("image");
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getModule(), "")).thenReturn(requestOfApplicationTile.getModule());
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getTile(), "")).thenReturn(requestOfApplicationTile.getTile());
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getTitle(), "")).thenReturn(requestOfApplicationTile.getTitle());
        String response = mockMvc.perform(post("/v1/fmo/admin/tile/create")
            .content(objectMapper.writeValueAsString(requestOfApplicationTile))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isOk()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertTrue(result.isResult());
    }

    @SneakyThrows
    @Test
    void testCreateFail() {
        Map<String, String> payload = new HashMap<>();
        payload.put("sub", "123");
        payload.put("ems2Role", "RATAN_ADMIN");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        when(applicationCategoryService.getById(any())).thenReturn(Optional.ofNullable(getApplicationCategory()));
        when(importMapService.getById(any())).thenReturn(Optional.ofNullable(getImportMap()));
        doThrow(new NoSuchElementException("Record not created.")).when(applicationTileService)
            .create(any());
        RequestOfApplicationTile requestOfApplicationTile = getRequestOfApplicationTile();
        requestOfApplicationTile.setTitle("title");
        requestOfApplicationTile.setSubtitle("subtitle");
        requestOfApplicationTile.setEmailSupport("email");
        requestOfApplicationTile.setEms2Subject("ems2Subject");
        requestOfApplicationTile.setEms2Entities("ems2Entities");
        requestOfApplicationTile.setTile("tile");
        requestOfApplicationTile.setModule("module");
        requestOfApplicationTile.setImageLightTheme("image");
        requestOfApplicationTile.setImageDarkTheme("image");
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getModule(), "")).thenReturn(requestOfApplicationTile.getModule());
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getTile(), "")).thenReturn(requestOfApplicationTile.getTile());
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getTitle(), "")).thenReturn(requestOfApplicationTile.getTitle());
        String response = mockMvc.perform(post("/v1/fmo/admin/tile/create")
            .content(objectMapper.writeValueAsString(requestOfApplicationTile))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isBadRequest()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testCreateFail1() {
        Map<String, String> payload = new HashMap<>();
        payload.put("sub", "123");
        payload.put("ems2Role", "FMO_ADMIN");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        when(applicationCategoryService.getById(any())).thenReturn(Optional.ofNullable(getApplicationCategory()));
        when(importMapService.getById(any())).thenReturn(Optional.ofNullable(getImportMap()));
        when(applicationTileService.create(any())).thenReturn(getApplicationTile());
        RequestOfApplicationTile requestOfApplicationTile = getRequestOfApplicationTile();
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getModule(), "")).thenReturn("");
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getTile(), "")).thenReturn(requestOfApplicationTile.getTile());
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getTitle(), "")).thenReturn(requestOfApplicationTile.getTitle());
        String response = mockMvc.perform(post("/v1/fmo/admin/tile/create")
            .content(objectMapper.writeValueAsString(requestOfApplicationTile))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isBadRequest()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testCreateFail11() {
        Map<String, String> payload = new HashMap<>();
        payload.put("sub", "123");
        payload.put("ems2Role", "FMO_ADMIN");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        when(applicationCategoryService.getById(any())).thenReturn(Optional.ofNullable(getApplicationCategory()));
        when(importMapService.getById(any())).thenReturn(Optional.ofNullable(getImportMap()));
        when(applicationTileService.create(any())).thenReturn(getApplicationTile());
        RequestOfApplicationTile requestOfApplicationTile = getRequestOfApplicationTile();
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getModule(), "")).thenReturn(requestOfApplicationTile.getModule());
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getTile(), "")).thenReturn("");
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getTitle(), "")).thenReturn(requestOfApplicationTile.getTitle());
        String response = mockMvc.perform(post("/v1/fmo/admin/tile/create")
            .content(objectMapper.writeValueAsString(requestOfApplicationTile))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isBadRequest()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testCreateFail111() {
        Map<String, String> payload = new HashMap<>();
        payload.put("sub", "123");
        payload.put("ems2Role", "FMO_ADMIN");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        when(applicationCategoryService.getById(any())).thenReturn(Optional.ofNullable(getApplicationCategory()));
        when(importMapService.getById(any())).thenReturn(Optional.ofNullable(getImportMap()));
        when(applicationTileService.create(any())).thenReturn(getApplicationTile());
        RequestOfApplicationTile requestOfApplicationTile = getRequestOfApplicationTile();
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getModule(), "")).thenReturn(requestOfApplicationTile.getModule());
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getTile(), "")).thenReturn(requestOfApplicationTile.getTile());
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getTitle(), "")).thenReturn("");
        String response = mockMvc.perform(post("/v1/fmo/admin/tile/create")
            .content(objectMapper.writeValueAsString(requestOfApplicationTile))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isBadRequest()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testCreateFail2() {
        Map<String, String> payload = new HashMap<>();
        payload.put("sub", "123");
        payload.put("ems2Role", "FMO_ADMIN");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        when(applicationCategoryService.getById(any())).thenReturn(Optional.ofNullable(getApplicationCategory()));
        when(importMapService.getById(any())).thenReturn(Optional.ofNullable(getImportMap()));
        when(applicationTileService.create(any())).thenReturn(getApplicationTile());
        RequestOfApplicationTile requestOfApplicationTile = getRequestOfApplicationTile();
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getModule(), "")).thenReturn(" ");
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getTile(), "")).thenReturn(requestOfApplicationTile.getTile());
        String response = mockMvc.perform(post("/v1/fmo/admin/tile/create")
            .content(objectMapper.writeValueAsString(requestOfApplicationTile))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isBadRequest()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testCreateFail22() {
        Map<String, String> payload = new HashMap<>();
        payload.put("sub", "123");
        payload.put("ems2Role", "FMO_ADMIN");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        when(applicationCategoryService.getById(any())).thenReturn(Optional.ofNullable(getApplicationCategory()));
        when(importMapService.getById(any())).thenReturn(Optional.ofNullable(getImportMap()));
        when(applicationTileService.create(any())).thenReturn(getApplicationTile());
        RequestOfApplicationTile requestOfApplicationTile = getRequestOfApplicationTile();
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getModule(), "")).thenReturn(requestOfApplicationTile.getModule());
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getTile(), "")).thenReturn(" ");
        String response = mockMvc.perform(post("/v1/fmo/admin/tile/create")
            .content(objectMapper.writeValueAsString(requestOfApplicationTile))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isBadRequest()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testUpdate() {
        Map<String, String> payload = new HashMap<>();
        payload.put("sub", "123");
        payload.put("ems2Role", "FMO_ADMIN");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        when(applicationCategoryService.getById(any())).thenReturn(Optional.ofNullable(getApplicationCategory()));
        when(importMapService.getById(any())).thenReturn(Optional.ofNullable(getImportMap()));
        ApplicationTile applicationTile = getApplicationTile();
        applicationTile.setApplicationTileId(123);
        applicationTile.setActive(false);
        when(applicationTileService.getById(any())).thenReturn(Optional.ofNullable(applicationTile));
        when(applicationTileService.update(any())).thenReturn(applicationTile);
        RequestOfApplicationTile requestOfApplicationTile = getRequestOfApplicationTile();
        requestOfApplicationTile.setMode("checker");
        requestOfApplicationTile.setActive(true);
        requestOfApplicationTile.setApplicationTileId(123);
        String response = mockMvc.perform(post("/v1/fmo/admin/tile/update")
            .content(objectMapper.writeValueAsString(requestOfApplicationTile))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isOk()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertTrue(result.isResult());
    }

    @SneakyThrows
    @Test
    void testUpdate2() {
        Map<String, String> payload = new HashMap<>();
        payload.put("sub", "123");
        payload.put("ems2Role", "RATAN_ADMIN");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        ApplicationCategory applicationCategory = getApplicationCategory();
        applicationCategory.setEms2Role("RATAN_ADMIN");
        when(applicationCategoryService.getById(any())).thenReturn(Optional.ofNullable(applicationCategory));
        ImportMap importMap = getImportMap();
        importMap.setEms2Role("RATAN_ADMIN");
        when(importMapService.getById(any())).thenReturn(Optional.ofNullable(importMap));
        ApplicationTile applicationTile = getApplicationTile();
        applicationTile.setApplicationTileId(123);
        applicationTile.setActive(false);
        applicationTile.setEms2Role("RATAN_ADMIN");
        when(applicationTileService.getById(any())).thenReturn(Optional.ofNullable(applicationTile));
        when(applicationTileService.update(any())).thenReturn(applicationTile);
        RequestOfApplicationTile requestOfApplicationTile = getRequestOfApplicationTile();
        requestOfApplicationTile.setMode("checker");
        requestOfApplicationTile.setActive(true);
        requestOfApplicationTile.setApplicationTileId(123);
        String response = mockMvc.perform(post("/v1/fmo/admin/tile/update")
            .content(objectMapper.writeValueAsString(requestOfApplicationTile))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isOk()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertTrue(result.isResult());
    }

    @SneakyThrows
    @Test
    void testUpdate3() {
        Map<String, String> payload = new HashMap<>();
        payload.put("sub", "123");
        payload.put("ems2Role", "RATAN_ADMIN");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        ApplicationCategory applicationCategory = getApplicationCategory();
        applicationCategory.setEms2Role("RATAN_ADMIN");
        when(applicationCategoryService.getById(any())).thenReturn(Optional.ofNullable(applicationCategory));
        ImportMap importMap = getImportMap();
        importMap.setEms2Role("RATAN_ADMIN");
        when(importMapService.getById(any())).thenReturn(Optional.ofNullable(importMap));
        ApplicationTile applicationTile = getApplicationTile();
        applicationTile.setApplicationTileId(123);
        applicationTile.setActive(true);
        applicationTile.setEms2Role("RATAN_ADMIN");
        when(applicationTileService.getById(any())).thenReturn(Optional.ofNullable(applicationTile));
        when(applicationTileService.update(any())).thenReturn(applicationTile);
        RequestOfApplicationTile requestOfApplicationTile = getRequestOfApplicationTile();
        requestOfApplicationTile.setMode("checker");
        requestOfApplicationTile.setActive(true);
        requestOfApplicationTile.setApplicationTileId(123);
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getModule(), "")).thenReturn(requestOfApplicationTile.getModule());
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getTile(), "")).thenReturn(requestOfApplicationTile.getTile());
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getTitle(), "")).thenReturn(requestOfApplicationTile.getTitle());
        String response = mockMvc.perform(post("/v1/fmo/admin/tile/update")
            .content(objectMapper.writeValueAsString(requestOfApplicationTile))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isBadRequest()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testUpdate5() {
        Map<String, String> payload = new HashMap<>();
        payload.put("sub", "123");
        payload.put("ems2Role", "FMO_ADMIN");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        ApplicationCategory applicationCategory = getApplicationCategory();
        applicationCategory.setEms2Role("FMO_ADMIN");
        when(applicationCategoryService.getById(any())).thenReturn(Optional.ofNullable(applicationCategory));
        ImportMap importMap = getImportMap();
        importMap.setEms2Role("FMO_ADMIN");
        when(importMapService.getById(any())).thenReturn(Optional.ofNullable(importMap));
        ApplicationTile applicationTile = getApplicationTile();
        applicationTile.setApplicationTileId(123);
        applicationTile.setActive(true);
        applicationTile.setEms2Role("FMO_ADMIN");
        when(applicationTileService.getById(any())).thenReturn(Optional.ofNullable(applicationTile));
        when(applicationTileService.update(any())).thenReturn(applicationTile);
        RequestOfApplicationTile requestOfApplicationTile = getRequestOfApplicationTile();
        requestOfApplicationTile.setMode("checker");
        requestOfApplicationTile.setActive(true);
        requestOfApplicationTile.setApplicationTileId(123);
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getModule(), "")).thenReturn(requestOfApplicationTile.getModule());
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getTile(), "")).thenReturn(requestOfApplicationTile.getTile());
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getTitle(), "")).thenReturn(requestOfApplicationTile.getTitle());
        String response = mockMvc.perform(post("/v1/fmo/admin/tile/update")
            .content(objectMapper.writeValueAsString(requestOfApplicationTile))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isBadRequest()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testUpdateFailCheckEms2Role() {
        Map<String, String> payload = new HashMap<>();
        payload.put("sub", "123");
        payload.put("ems2Role", "FMO_ADMIN");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        ApplicationCategory applicationCategory = getApplicationCategory();
        applicationCategory.setEms2Role("FMO_ADMIN");
        when(applicationCategoryService.getById(any())).thenReturn(Optional.ofNullable(applicationCategory));
        ImportMap importMap = getImportMap();
        importMap.setEms2Role("FMO_ADMIN");
        when(importMapService.getById(any())).thenReturn(Optional.ofNullable(importMap));
        ApplicationTile applicationTile = getApplicationTile();
        applicationTile.setApplicationTileId(123);
        applicationTile.setActive(true);
        applicationTile.setEms2Role("FMO_ADMIN");
        when(applicationTileService.getById(any())).thenReturn(Optional.ofNullable(applicationTile));
        when(applicationTileService.update(any())).thenReturn(applicationTile);
        RequestOfApplicationTile requestOfApplicationTile = getRequestOfApplicationTile();
        requestOfApplicationTile.setMode("checker");
        requestOfApplicationTile.setActive(true);
        requestOfApplicationTile.setApplicationTileId(123);
        when(adminModuleUtil.checkEms2Role(anyString(), any(), any(), any())).thenReturn(true);
        String response = mockMvc.perform(post("/v1/fmo/admin/tile/update")
            .content(objectMapper.writeValueAsString(requestOfApplicationTile))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isBadRequest()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testUpdateFailValidateChecker() {
        Map<String, String> payload = new HashMap<>();
        payload.put("sub", "123");
        payload.put("ems2Role", "FMO_ADMIN");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        ApplicationCategory applicationCategory = getApplicationCategory();
        applicationCategory.setEms2Role("FMO_ADMIN");
        when(applicationCategoryService.getById(any())).thenReturn(Optional.ofNullable(applicationCategory));
        ImportMap importMap = getImportMap();
        importMap.setEms2Role("FMO_ADMIN");
        when(importMapService.getById(any())).thenReturn(Optional.ofNullable(importMap));
        ApplicationTile applicationTile = getApplicationTile();
        applicationTile.setApplicationTileId(123);
        applicationTile.setActive(true);
        applicationTile.setEms2Role("FMO_ADMIN");
        applicationTile.setUpdatedBy("123");
        when(applicationTileService.getById(any())).thenReturn(Optional.ofNullable(applicationTile));
        when(applicationTileService.update(any())).thenReturn(applicationTile);
        RequestOfApplicationTile requestOfApplicationTile = getRequestOfApplicationTile();
        requestOfApplicationTile.setMode("checker");
        requestOfApplicationTile.setActive(false);
        requestOfApplicationTile.setApplicationTileId(123);
        when(adminModuleUtil.checkEms2Role(anyString(), any(), any(), any())).thenReturn(false);
        when(adminModuleUtil.validateChecker(any(), any())).thenReturn(true);
        String response = mockMvc.perform(post("/v1/fmo/admin/tile/update")
            .content(objectMapper.writeValueAsString(requestOfApplicationTile))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isBadRequest()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testUpdateSuccessValidateChecker() {
        Map<String, String> payload = new HashMap<>();
        payload.put("sub", "123");
        payload.put("ems2Role", "FMO_ADMIN");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        ApplicationCategory applicationCategory = getApplicationCategory();
        applicationCategory.setEms2Role("FMO_ADMIN");
        when(applicationCategoryService.getById(any())).thenReturn(Optional.ofNullable(applicationCategory));
        ImportMap importMap = getImportMap();
        importMap.setEms2Role("FMO_ADMIN");
        when(importMapService.getById(any())).thenReturn(Optional.ofNullable(importMap));
        ApplicationTile applicationTile = getApplicationTile();
        applicationTile.setApplicationTileId(123);
        applicationTile.setActive(true);
        applicationTile.setEms2Role("FMO_ADMIN");
        applicationTile.setUpdatedBy("345");
        when(applicationTileService.getById(any())).thenReturn(Optional.ofNullable(applicationTile));
        when(applicationTileService.update(any())).thenReturn(applicationTile);
        RequestOfApplicationTile requestOfApplicationTile = getRequestOfApplicationTile();
        requestOfApplicationTile.setMode("checker");
        requestOfApplicationTile.setActive(false);
        requestOfApplicationTile.setApplicationTileId(123);
        when(adminModuleUtil.checkEms2Role(anyString(), any(), any(), any())).thenReturn(false);
        when(adminModuleUtil.validateChecker(any(), any())).thenReturn(true);
        String response = mockMvc.perform(post("/v1/fmo/admin/tile/update")
            .content(objectMapper.writeValueAsString(requestOfApplicationTile))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isOk()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertTrue(result.isResult());
    }

    @SneakyThrows
    @Test
    void testUpdateFail0() {
        Map<String, String> payload = new HashMap<>();
        payload.put("sub", "123");
        payload.put("ems2Role", "FMO_ADMIN");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        ApplicationCategory applicationCategory = getApplicationCategory();
        applicationCategory.setEms2Role("FMO_ADMIN");
        when(applicationCategoryService.getById(any())).thenReturn(Optional.ofNullable(applicationCategory));
        ImportMap importMap = getImportMap();
        importMap.setEms2Role("FMO_ADMIN");
        when(importMapService.getById(any())).thenReturn(Optional.ofNullable(importMap));
        ApplicationTile applicationTile = getApplicationTile();
        applicationTile.setApplicationTileId(123);
        applicationTile.setActive(true);
        applicationTile.setEms2Role("FMO_ADMIN");
        when(applicationTileService.getById(any())).thenReturn(Optional.ofNullable(applicationTile));
        when(applicationTileService.update(any())).thenReturn(applicationTile);
        RequestOfApplicationTile requestOfApplicationTile = getRequestOfApplicationTile();
        requestOfApplicationTile.setMode("checker");
        requestOfApplicationTile.setActive(true);
        requestOfApplicationTile.setApplicationTileId(123);
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getModule(), "")).thenReturn("");
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getTile(), "")).thenReturn(requestOfApplicationTile.getTile());
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getTitle(), "")).thenReturn(requestOfApplicationTile.getTitle());
        when(adminModuleUtil.checkEms2Role(anyString(), any(), any(), any())).thenReturn(false);
        when(adminModuleUtil.validateChecker(any(), any())).thenReturn(false);
        when(adminModuleUtil.checkSpaces(anyString(), anyString())).thenReturn(false);
        when(adminModuleUtil.checkBlank(anyString(), anyString(), anyString())).thenReturn(true);
        String response = mockMvc.perform(post("/v1/fmo/admin/tile/update")
            .content(objectMapper.writeValueAsString(requestOfApplicationTile))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isBadRequest()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testUpdateFail00() {
        Map<String, String> payload = new HashMap<>();
        payload.put("sub", "123");
        payload.put("ems2Role", "FMO_ADMIN");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        ApplicationCategory applicationCategory = getApplicationCategory();
        applicationCategory.setEms2Role("FMO_ADMIN");
        when(applicationCategoryService.getById(any())).thenReturn(Optional.ofNullable(applicationCategory));
        ImportMap importMap = getImportMap();
        importMap.setEms2Role("FMO_ADMIN");
        when(importMapService.getById(any())).thenReturn(Optional.ofNullable(importMap));
        ApplicationTile applicationTile = getApplicationTile();
        applicationTile.setApplicationTileId(123);
        applicationTile.setActive(true);
        applicationTile.setEms2Role("FMO_ADMIN");
        when(applicationTileService.getById(any())).thenReturn(Optional.ofNullable(applicationTile));
        when(applicationTileService.update(any())).thenReturn(applicationTile);
        RequestOfApplicationTile requestOfApplicationTile = getRequestOfApplicationTile();
        requestOfApplicationTile.setMode("checker");
        requestOfApplicationTile.setActive(true);
        requestOfApplicationTile.setApplicationTileId(123);
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getModule(), "")).thenReturn(requestOfApplicationTile.getModule());
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getTile(), "")).thenReturn("");
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getTitle(), "")).thenReturn(requestOfApplicationTile.getTitle());
        when(adminModuleUtil.checkEms2Role(anyString(), any(), any(), any())).thenReturn(false);
        when(adminModuleUtil.validateChecker(any(), any())).thenReturn(false);
        when(adminModuleUtil.checkSpaces(anyString(), anyString())).thenReturn(true);
        String response = mockMvc.perform(post("/v1/fmo/admin/tile/update")
            .content(objectMapper.writeValueAsString(requestOfApplicationTile))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isBadRequest()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testUpdateDeactivate() {
        Map<String, String> payload = new HashMap<>();
        payload.put("sub", "123");
        payload.put("ems2Role", "RATAN_ADMIN");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        ApplicationCategory applicationCategory = getApplicationCategory();
        applicationCategory.setEms2Role("RATAN_ADMIN");
        when(applicationCategoryService.getById(any())).thenReturn(Optional.ofNullable(applicationCategory));
        ImportMap importMap = getImportMap();
        importMap.setEms2Role("RATAN_ADMIN");
        when(importMapService.getById(any())).thenReturn(Optional.ofNullable(importMap));
        ApplicationTile applicationTile = getApplicationTile();
        applicationTile.setApplicationTileId(123);
        applicationTile.setActive(true);
        applicationTile.setEms2Role("RATAN_ADMIN");
        when(applicationTileService.getById(any())).thenReturn(Optional.ofNullable(applicationTile));
        when(applicationTileService.update(any())).thenReturn(applicationTile);
        RequestOfApplicationTile requestOfApplicationTile = getRequestOfApplicationTile();
        requestOfApplicationTile.setMode("deactivate");
        requestOfApplicationTile.setActive(true);
        requestOfApplicationTile.setApplicationTileId(123);
        String response = mockMvc.perform(post("/v1/fmo/admin/tile/update")
            .content(objectMapper.writeValueAsString(requestOfApplicationTile))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isOk()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertTrue(result.isResult());
    }

    @SneakyThrows
    @Test
    void testUpdateMaker() {
        Map<String, String> payload = new HashMap<>();
        payload.put("sub", "123");
        payload.put("ems2Role", "RATAN_ADMIN");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        ApplicationCategory applicationCategory = getApplicationCategory();
        applicationCategory.setEms2Role("RATAN_ADMIN");
        when(applicationCategoryService.getById(any())).thenReturn(Optional.ofNullable(applicationCategory));
        ImportMap importMap = getImportMap();
        importMap.setEms2Role("RATAN_ADMIN");
        when(importMapService.getById(any())).thenReturn(Optional.ofNullable(importMap));
        ApplicationTile applicationTile = getApplicationTile();
        applicationTile.setApplicationTileId(123);
        applicationTile.setActive(true);
        applicationTile.setEms2Role("RATAN_ADMIN");
        when(applicationTileService.getById(any())).thenReturn(Optional.ofNullable(applicationTile));
        when(applicationTileService.update(any())).thenReturn(applicationTile);
        RequestOfApplicationTile requestOfApplicationTile = getRequestOfApplicationTile();
        requestOfApplicationTile.setMode("maker");
        requestOfApplicationTile.setActive(true);
        requestOfApplicationTile.setApplicationTileId(123);
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getModule(), "")).thenReturn(requestOfApplicationTile.getModule());
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getTile(), "")).thenReturn(requestOfApplicationTile.getTile());
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getTitle(), "")).thenReturn(requestOfApplicationTile.getTitle());
        String response = mockMvc.perform(post("/v1/fmo/admin/tile/update")
            .content(objectMapper.writeValueAsString(requestOfApplicationTile))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isOk()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertTrue(result.isResult());
    }

    @SneakyThrows
    @Test
    void testUpdateMaker2() {
        Map<String, String> payload = new HashMap<>();
        payload.put("sub", "123");
        payload.put("ems2Role", "RATAN_ADMIN");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        ApplicationCategory applicationCategory = getApplicationCategory();
        applicationCategory.setEms2Role("RATAN_ADMIN");
        when(applicationCategoryService.getById(any())).thenReturn(Optional.ofNullable(applicationCategory));
        ImportMap importMap = getImportMap();
        importMap.setEms2Role("RATAN_ADMIN");
        when(importMapService.getById(any())).thenReturn(Optional.ofNullable(importMap));
        ApplicationTile applicationTile = getApplicationTile();
        applicationTile.setApplicationTileId(123);
        applicationTile.setActive(true);
        applicationTile.setEms2Role("RATAN_ADMIN");
        when(applicationTileService.getById(any())).thenReturn(Optional.ofNullable(applicationTile));
        when(applicationTileService.update(any())).thenReturn(applicationTile);
        RequestOfApplicationTile requestOfApplicationTile = getRequestOfApplicationTile();
        requestOfApplicationTile.setMode("maker");
        requestOfApplicationTile.setActive(true);
        requestOfApplicationTile.setApplicationTileId(123);
        requestOfApplicationTile.setTitle("title");
        requestOfApplicationTile.setSubtitle("subtitle");
        requestOfApplicationTile.setEmailSupport("email");
        requestOfApplicationTile.setEms2Subject("ems2Subject");
        requestOfApplicationTile.setEms2Entities("ems2Entities");
        requestOfApplicationTile.setTile("tile");
        requestOfApplicationTile.setModule("module");
        requestOfApplicationTile.setImageLightTheme("image");
        requestOfApplicationTile.setImageDarkTheme("image");
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getModule(), "")).thenReturn(requestOfApplicationTile.getModule());
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getTile(), "")).thenReturn(requestOfApplicationTile.getTile());
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getTitle(), "")).thenReturn(requestOfApplicationTile.getTitle());
        String response = mockMvc.perform(post("/v1/fmo/admin/tile/update")
            .content(objectMapper.writeValueAsString(requestOfApplicationTile))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isOk()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertTrue(result.isResult());
    }

    @SneakyThrows
    @Test
    void testUpdateMaker3() {
        Map<String, String> payload = new HashMap<>();
        payload.put("sub", "123");
        payload.put("ems2Role", "RATAN_ADMIN");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        ApplicationCategory applicationCategory = getApplicationCategory();
        applicationCategory.setEms2Role("RATAN_ADMIN");
        when(applicationCategoryService.getById(any())).thenReturn(Optional.ofNullable(applicationCategory));
        ImportMap importMap = getImportMap();
        importMap.setEms2Role("RATAN_ADMIN");
        when(importMapService.getById(any())).thenReturn(Optional.ofNullable(importMap));
        ApplicationTile applicationTile = getApplicationTile();
        applicationTile.setApplicationTileId(123);
        applicationTile.setActive(false);
        applicationTile.setEms2Role("RATAN_ADMIN");
        when(applicationTileService.getById(any())).thenReturn(Optional.ofNullable(applicationTile));
        when(applicationTileService.update(any())).thenReturn(applicationTile);
        RequestOfApplicationTile requestOfApplicationTile = getRequestOfApplicationTile();
        requestOfApplicationTile.setMode("maker");
        requestOfApplicationTile.setActive(true);
        requestOfApplicationTile.setApplicationTileId(123);
        requestOfApplicationTile.setTitle("title");
        requestOfApplicationTile.setSubtitle("subtitle");
        requestOfApplicationTile.setEmailSupport("email");
        requestOfApplicationTile.setEms2Subject("ems2Subject");
        requestOfApplicationTile.setEms2Entities("ems2Entities");
        requestOfApplicationTile.setTile("tile");
        requestOfApplicationTile.setModule("module");
        requestOfApplicationTile.setImageLightTheme("image");
        requestOfApplicationTile.setImageDarkTheme("image");
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getModule(), "")).thenReturn(requestOfApplicationTile.getModule());
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getTile(), "")).thenReturn(requestOfApplicationTile.getTile());
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getTitle(), "")).thenReturn(requestOfApplicationTile.getTitle());
        String response = mockMvc.perform(post("/v1/fmo/admin/tile/update")
            .content(objectMapper.writeValueAsString(requestOfApplicationTile))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isOk()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertTrue(result.isResult());
    }

    @SneakyThrows
    @Test
    void testUpdateFail() {
        Map<String, String> payload = new HashMap<>();
        payload.put("sub", "123");
        payload.put("ems2Role", "RATAN_ADMIN");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        ApplicationCategory applicationCategory = getApplicationCategory();
        applicationCategory.setEms2Role("RATAN_ADMIN");
        when(applicationCategoryService.getById(any())).thenReturn(Optional.ofNullable(applicationCategory));
        when(importMapService.getById(any())).thenReturn(Optional.ofNullable(getImportMap()));
        doThrow(new NoSuchElementException("Record not found.")).when(applicationTileService)
            .getById(anyLong());
        RequestOfApplicationTile requestOfApplicationTile = getRequestOfApplicationTile();
        requestOfApplicationTile.setMode("maker");
        requestOfApplicationTile.setActive(true);
        requestOfApplicationTile.setApplicationTileId(123);
        requestOfApplicationTile.setTitle("title");
        requestOfApplicationTile.setSubtitle("subtitle");
        requestOfApplicationTile.setEmailSupport("email");
        requestOfApplicationTile.setEms2Subject("ems2Subject");
        requestOfApplicationTile.setEms2Entities("ems2Entities");
        requestOfApplicationTile.setTile("tile");
        requestOfApplicationTile.setModule("module");
        requestOfApplicationTile.setImageLightTheme("image");
        requestOfApplicationTile.setImageDarkTheme("image");
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getModule(), "")).thenReturn(requestOfApplicationTile.getModule());
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getTile(), "")).thenReturn(requestOfApplicationTile.getTile());
        when(adminModuleUtil.checkIfNull(requestOfApplicationTile.getTitle(), "")).thenReturn(requestOfApplicationTile.getTitle());
        String response = mockMvc.perform(post("/v1/fmo/admin/tile/update")
            .content(objectMapper.writeValueAsString(requestOfApplicationTile))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isBadRequest()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

}
