package com.scb.sso.singleuibff.controller.v1;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.sso.singleuibff.dto.request.RequestOfApplicationCategory;
import com.scb.sso.singleuibff.dto.response.ResponseOfAdminModule;
import com.scb.sso.singleuibff.entity.ApplicationCategory;
import com.scb.sso.singleuibff.entity.ApplicationTile;
import com.scb.sso.singleuibff.entity.ImportMap;
import com.scb.sso.singleuibff.service.v1.ApplicationCategoryAuditService;
import com.scb.sso.singleuibff.service.v1.ApplicationCategoryService;
import com.scb.sso.singleuibff.service.v1.ApplicationTileService;
import com.scb.sso.singleuibff.util.AdminModuleUtil;
import lombok.SneakyThrows;
import org.junit.jupiter.api.Test;
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
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@WebMvcTest(ApplicationCategoryController.class)
public class ApplicationCategoryControllerTest {

    private final String EMS2_ROLE = "FMO_ADMIN";
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @MockBean
    private AdminModuleUtil adminModuleUtil;
    @MockBean
    private ApplicationCategoryService applicationCategoryService;
    @MockBean
    private ApplicationTileService applicationTileService;
    @MockBean
    private ApplicationCategoryAuditService applicationCategoryAuditService;

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

    private RequestOfApplicationCategory getRequestOfApplicationCategory() {
        RequestOfApplicationCategory requestOfApplicationCategory = new RequestOfApplicationCategory();
        requestOfApplicationCategory.setEntitlementsToken("123");
        requestOfApplicationCategory.setEms2Role("RATAN_PROD");
        return requestOfApplicationCategory;
    }

    @SneakyThrows
    @Test
    void testGetData() {
        Map<String, String> payload = new HashMap<>();
        payload.put("ems2Role", "RATAN_PROD");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        when(applicationCategoryService.findByEms2Role(anyString())).thenReturn(Optional.ofNullable(getApplicationCategories()));
        String response = mockMvc.perform(post("/v1/fmo/admin/category/data")
            .content(objectMapper.writeValueAsString(getRequestOfApplicationCategory()))
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
        doThrow(new NoSuchElementException("Record not found.")).when(applicationCategoryService).findByEms2Role(anyString());
        String response = mockMvc.perform(post("/v1/fmo/admin/category/data")
            .content(objectMapper.writeValueAsString(getRequestOfApplicationCategory()))
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
        when(applicationCategoryAuditService.findByApplicationCategoryId(anyLong())).thenReturn(Optional.ofNullable(new ArrayList<>()));
        String response = mockMvc.perform(post("/v1/fmo/admin/category/audit")
            .content(objectMapper.writeValueAsString(getRequestOfApplicationCategory()))
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
        doThrow(new NoSuchElementException("Record not found.")).when(applicationCategoryAuditService)
            .findByApplicationCategoryId(anyLong());
        String response = mockMvc.perform(post("/v1/fmo/admin/category/audit")
            .content(objectMapper.writeValueAsString(getRequestOfApplicationCategory()))
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
        when(applicationCategoryService.create(any())).thenReturn(getApplicationCategory());
        String response = mockMvc.perform(post("/v1/fmo/admin/category/create")
            .content(objectMapper.writeValueAsString(getRequestOfApplicationCategory()))
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
        payload.put("ems2Role", "RATAN_PROD");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        when(applicationCategoryService.create(any())).thenReturn(getApplicationCategory());
        String response = mockMvc.perform(post("/v1/fmo/admin/category/create")
            .content(objectMapper.writeValueAsString(getRequestOfApplicationCategory()))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isOk()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertTrue(result.isResult());
    }

    @SneakyThrows
    @Test
    void testCreate3() {
        Map<String, String> payload = new HashMap<>();
        payload.put("sub", "123");
        payload.put("ems2Role", "RATAN_PROD");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        when(applicationCategoryService.create(any())).thenReturn(getApplicationCategory());
        RequestOfApplicationCategory requestOfApplicationCategory = getRequestOfApplicationCategory();
        requestOfApplicationCategory.setLabel("label");
        String response = mockMvc.perform(post("/v1/fmo/admin/category/create")
            .content(objectMapper.writeValueAsString(requestOfApplicationCategory))
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
        payload.put("ems2Role", "RATAN_PROD");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        doThrow(new NoSuchElementException("Record not created.")).when(applicationCategoryService)
            .create(any());
        String response = mockMvc.perform(post("/v1/fmo/admin/category/create")
            .content(objectMapper.writeValueAsString(getRequestOfApplicationCategory()))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isBadRequest()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testUpdate2() {
        Map<String, String> payload = new HashMap<>();
        payload.put("sub", "123");
        payload.put("ems2Role", "RATAN_PROD");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        ApplicationCategory applicationCategory = getApplicationCategory();
        applicationCategory.setActive(false);
        applicationCategory.setUpdatedBy("456");
        applicationCategory.setApplicationCategoryId(123);
        applicationCategory.setLabel("label");
        applicationCategory.setCreatedBy("456");
        applicationCategory.setUpdatedAt(new Date());
        applicationCategory.setCreatedAt(new Date());
        applicationCategory.setEms2Role("RATAN_PROD");
        when(applicationCategoryService.getById(any())).thenReturn(Optional.ofNullable(applicationCategory));
        when(applicationCategoryService.update(any())).thenReturn(applicationCategory);
        RequestOfApplicationCategory requestOfApplicationCategory = getRequestOfApplicationCategory();
        requestOfApplicationCategory.setMode("checker");
        requestOfApplicationCategory.setActive(true);
        requestOfApplicationCategory.setApplicationCategoryId(123);
        String response = mockMvc.perform(post("/v1/fmo/admin/category/update")
            .content(objectMapper.writeValueAsString(requestOfApplicationCategory))
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
        payload.put("ems2Role", "RATAN_PROD");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        ApplicationCategory applicationCategory = getApplicationCategory();
        applicationCategory.setActive(true);
        applicationCategory.setUpdatedBy("456");
        applicationCategory.setApplicationCategoryId(123);
        applicationCategory.setLabel("label");
        applicationCategory.setCreatedBy("456");
        applicationCategory.setUpdatedAt(new Date());
        applicationCategory.setCreatedAt(new Date());
        applicationCategory.setEms2Role("RATAN_PROD");
        when(applicationCategoryService.getById(any())).thenReturn(Optional.ofNullable(applicationCategory));
        when(applicationCategoryService.update(any())).thenReturn(applicationCategory);
        RequestOfApplicationCategory requestOfApplicationCategory = getRequestOfApplicationCategory();
        requestOfApplicationCategory.setMode("checker");
        requestOfApplicationCategory.setActive(true);
        requestOfApplicationCategory.setApplicationCategoryId(123);
        String response = mockMvc.perform(post("/v1/fmo/admin/category/update")
            .content(objectMapper.writeValueAsString(requestOfApplicationCategory))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isOk()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertTrue(result.isResult());
    }

    @SneakyThrows
    @Test
    void testUpdateFail1() {
        Map<String, String> payload = new HashMap<>();
        payload.put("sub", "123");
        payload.put("ems2Role", "RATAN_PROD");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        ApplicationCategory applicationCategory = getApplicationCategory();
        applicationCategory.setActive(false);
        applicationCategory.setUpdatedBy("123");
        applicationCategory.setApplicationCategoryId(123);
        applicationCategory.setLabel("label");
        applicationCategory.setCreatedBy("456");
        applicationCategory.setUpdatedAt(new Date());
        applicationCategory.setCreatedAt(new Date());
        applicationCategory.setEms2Role("RATAN_PROD");
        when(applicationCategoryService.getById(any())).thenReturn(Optional.ofNullable(applicationCategory));
        when(applicationCategoryService.update(any())).thenReturn(applicationCategory);
        RequestOfApplicationCategory requestOfApplicationCategory = getRequestOfApplicationCategory();
        requestOfApplicationCategory.setMode("checker");
        requestOfApplicationCategory.setActive(true);
        requestOfApplicationCategory.setApplicationCategoryId(123);
        String response = mockMvc.perform(post("/v1/fmo/admin/category/update")
            .content(objectMapper.writeValueAsString(requestOfApplicationCategory))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isBadRequest()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testUpdateFail2() {
        Map<String, String> payload = new HashMap<>();
        payload.put("sub", "123");
        payload.put("ems2Role", "NOTHING");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        ApplicationCategory applicationCategory = getApplicationCategory();
        applicationCategory.setActive(false);
        applicationCategory.setUpdatedBy("123");
        applicationCategory.setApplicationCategoryId(123);
        applicationCategory.setLabel("label");
        applicationCategory.setCreatedBy("456");
        applicationCategory.setUpdatedAt(new Date());
        applicationCategory.setCreatedAt(new Date());
        applicationCategory.setEms2Role("RATAN_PROD");
        when(applicationCategoryService.getById(any())).thenReturn(Optional.ofNullable(applicationCategory));
        when(applicationCategoryService.update(any())).thenReturn(applicationCategory);
        RequestOfApplicationCategory requestOfApplicationCategory = getRequestOfApplicationCategory();
        requestOfApplicationCategory.setMode("checker");
        requestOfApplicationCategory.setActive(true);
        requestOfApplicationCategory.setApplicationCategoryId(123);
        String response = mockMvc.perform(post("/v1/fmo/admin/category/update")
            .content(objectMapper.writeValueAsString(requestOfApplicationCategory))
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
        payload.put("ems2Role", "RATAN_PROD");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        ApplicationCategory applicationCategory = getApplicationCategory();
        applicationCategory.setActive(true);
        applicationCategory.setUpdatedBy("456");
        applicationCategory.setApplicationCategoryId(123);
        applicationCategory.setLabel("label");
        applicationCategory.setCreatedBy("456");
        applicationCategory.setUpdatedAt(new Date());
        applicationCategory.setCreatedAt(new Date());
        applicationCategory.setEms2Role("RATAN_PROD");
        when(applicationCategoryService.getById(any())).thenReturn(Optional.ofNullable(applicationCategory));
        when(applicationCategoryService.update(any())).thenReturn(applicationCategory);
        RequestOfApplicationCategory requestOfApplicationCategory = getRequestOfApplicationCategory();
        requestOfApplicationCategory.setMode("deactivate");
        requestOfApplicationCategory.setActive(true);
        requestOfApplicationCategory.setApplicationCategoryId(123);
        String response = mockMvc.perform(post("/v1/fmo/admin/category/update")
            .content(objectMapper.writeValueAsString(requestOfApplicationCategory))
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
        payload.put("ems2Role", "RATAN_PROD");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        ApplicationCategory applicationCategory = getApplicationCategory();
        applicationCategory.setActive(true);
        applicationCategory.setUpdatedBy("456");
        applicationCategory.setApplicationCategoryId(123);
        applicationCategory.setLabel("label");
        applicationCategory.setCreatedBy("456");
        applicationCategory.setUpdatedAt(new Date());
        applicationCategory.setCreatedAt(new Date());
        applicationCategory.setEms2Role("RATAN_PROD");
        when(applicationCategoryService.getById(any())).thenReturn(Optional.ofNullable(applicationCategory));
        when(applicationCategoryService.update(any())).thenReturn(applicationCategory);
        RequestOfApplicationCategory requestOfApplicationCategory = getRequestOfApplicationCategory();
        requestOfApplicationCategory.setMode("maker");
        requestOfApplicationCategory.setActive(true);
        requestOfApplicationCategory.setApplicationCategoryId(123);
        String response = mockMvc.perform(post("/v1/fmo/admin/category/update")
            .content(objectMapper.writeValueAsString(requestOfApplicationCategory))
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
        payload.put("ems2Role", "RATAN_PROD");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        ApplicationCategory applicationCategory = getApplicationCategory();
        applicationCategory.setActive(true);
        applicationCategory.setUpdatedBy("456");
        applicationCategory.setApplicationCategoryId(123);
        applicationCategory.setLabel("label");
        applicationCategory.setCreatedBy("456");
        applicationCategory.setUpdatedAt(new Date());
        applicationCategory.setCreatedAt(new Date());
        applicationCategory.setEms2Role("RATAN_PROD");
        when(applicationCategoryService.getById(any())).thenReturn(Optional.ofNullable(applicationCategory));
        when(applicationCategoryService.update(any())).thenReturn(applicationCategory);
        RequestOfApplicationCategory requestOfApplicationCategory = getRequestOfApplicationCategory();
        requestOfApplicationCategory.setMode("maker");
        requestOfApplicationCategory.setActive(true);
        requestOfApplicationCategory.setLabel("label");
        requestOfApplicationCategory.setApplicationCategoryId(123);
        String response = mockMvc.perform(post("/v1/fmo/admin/category/update")
            .content(objectMapper.writeValueAsString(requestOfApplicationCategory))
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
        payload.put("ems2Role", "RATAN_PROD");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        ApplicationCategory applicationCategory = getApplicationCategory();
        applicationCategory.setActive(false);
        applicationCategory.setUpdatedBy("456");
        applicationCategory.setApplicationCategoryId(123);
        applicationCategory.setLabel("label");
        applicationCategory.setCreatedBy("456");
        applicationCategory.setUpdatedAt(new Date());
        applicationCategory.setCreatedAt(new Date());
        applicationCategory.setEms2Role("RATAN_PROD");
        when(applicationCategoryService.getById(any())).thenReturn(Optional.ofNullable(applicationCategory));
        when(applicationCategoryService.update(any())).thenReturn(applicationCategory);
        RequestOfApplicationCategory requestOfApplicationCategory = getRequestOfApplicationCategory();
        requestOfApplicationCategory.setMode("maker");
        requestOfApplicationCategory.setActive(true);
        requestOfApplicationCategory.setLabel("label");
        requestOfApplicationCategory.setApplicationCategoryId(123);
        String response = mockMvc.perform(post("/v1/fmo/admin/category/update")
            .content(objectMapper.writeValueAsString(requestOfApplicationCategory))
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
        payload.put("ems2Role", "RATAN_PROD");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        doThrow(new NoSuchElementException("Record not found.")).when(applicationCategoryService)
            .getById(any());
        RequestOfApplicationCategory requestOfApplicationCategory = getRequestOfApplicationCategory();
        requestOfApplicationCategory.setMode("maker");
        requestOfApplicationCategory.setActive(true);
        requestOfApplicationCategory.setLabel("label");
        requestOfApplicationCategory.setApplicationCategoryId(123);
        String response = mockMvc.perform(post("/v1/fmo/admin/category/update")
            .content(objectMapper.writeValueAsString(requestOfApplicationCategory))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isBadRequest()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

}
