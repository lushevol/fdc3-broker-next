package com.scb.sso.singleuibff.controller.v1;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.sso.singleuibff.dto.request.RequestOfImportMap;
import com.scb.sso.singleuibff.dto.response.ResponseOfAdminModule;
import com.scb.sso.singleuibff.entity.ImportMap;
import com.scb.sso.singleuibff.service.v1.ImportMapAuditService;
import com.scb.sso.singleuibff.service.v1.ImportMapService;
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

@WebMvcTest(ImportMapController.class)
public class ImportMapControllerTest {

    private final String EMS2_ROLE = "FMO_ADMIN";
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @MockBean
    private AdminModuleUtil adminModuleUtil;
    @MockBean
    private ImportMapService importMapService;
    @MockBean
    private ImportMapAuditService importMapAuditService;

    private List<ImportMap> getImportMaps() {
        return List.of(
            ImportMap.builder().keyName("single-spa").path("/js/external/single-spa.dev.js").isActive(true).createdBy("2001208")
                .createdAt(new Date()).updatedBy("2001208").updatedAt(new Date()).ems2Role(EMS2_ROLE).build(),
            ImportMap.builder().keyName("react").path("/js/external/react.development.js").isActive(true).createdBy("2001208")
                .createdAt(new Date()).updatedBy("2001208").updatedAt(new Date()).ems2Role(EMS2_ROLE).build(),
            ImportMap.builder().keyName("react-dom").path("/js/external/react-dom.development.js").isActive(true).createdBy("2001208")
                .createdAt(new Date()).updatedBy("2001208").updatedAt(new Date()).ems2Role(EMS2_ROLE).build(),
            ImportMap.builder().keyName("@fm/root-config").path("/config.js").isActive(true).createdBy("2001208").createdAt(new Date())
                .updatedBy("2001208").updatedAt(new Date()).ems2Role(EMS2_ROLE).build(),
            ImportMap.builder().keyName("@fm/base").path("//localhost:8002/base.js").isActive(true).createdBy("2001208")
                .createdAt(new Date()).updatedBy("2001208").updatedAt(new Date()).ems2Role(EMS2_ROLE).build(),
            ImportMap.builder().keyName("@fm/template_container").path("/template_container/template_container.js").isActive(true)
                .createdBy("2001208").createdAt(new Date()).updatedBy("2001208").updatedAt(new Date()).ems2Role(EMS2_ROLE).build(),
            ImportMap.builder().keyName("@fm/template").path("/template/template.js").isActive(true).createdBy("2001208")
                .createdAt(new Date()).updatedBy("2001208").updatedAt(new Date()).ems2Role(EMS2_ROLE).build());
    }

    private ImportMap getImportMap() {
        return ImportMap.builder().keyName("single-spa").path("/js/external/single-spa.dev.js").isActive(true).createdBy("2001208")
            .createdAt(new Date()).updatedBy("2001208").updatedAt(new Date()).ems2Role(EMS2_ROLE).build();
    }

    private RequestOfImportMap getRequestOfImportMap() {
        RequestOfImportMap requestOfImportMap = new RequestOfImportMap();
        requestOfImportMap.setEntitlementsToken("123");
        requestOfImportMap.setEms2Role("RATAN_ADMIN");
        requestOfImportMap.setPath("path");
        requestOfImportMap.setKeyName("key");
        return requestOfImportMap;
    }

    @SneakyThrows
    @Test
    void testGetAllActive() {
        when(importMapService.findByIsActive(anyBoolean())).thenReturn(Optional.ofNullable(getImportMaps()));
        String response = mockMvc.perform(get("/v1/fmo/admin/importmap/active"))
            .andExpect(MockMvcResultMatchers.status().isOk()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
    }

    @SneakyThrows
    @Test
    void testGetAllActiveError() {
        doThrow(new NoSuchElementException("Record not found.")).when(importMapService).findByIsActive(anyBoolean());
        String response = mockMvc.perform(get("/v1/fmo/admin/importmap/active"))
            .andExpect(MockMvcResultMatchers.status().isBadRequest()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testGetData() {
        Map<String, String> payload = new HashMap<>();
        payload.put("ems2Role", "RATAN_ADMIN");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        when(importMapService.findByEms2Role(anyString())).thenReturn(Optional.ofNullable(getImportMaps()));
        String response = mockMvc.perform(post("/v1/fmo/admin/importmap/data")
            .content(objectMapper.writeValueAsString(getRequestOfImportMap()))
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
        doThrow(new NoSuchElementException("Record not found.")).when(importMapService).findByEms2Role(anyString());
        String response = mockMvc.perform(post("/v1/fmo/admin/importmap/data")
            .content(objectMapper.writeValueAsString(getRequestOfImportMap()))
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
        when(importMapAuditService.findByImportMapId(anyLong())).thenReturn(Optional.ofNullable(new ArrayList<>()));
        String response = mockMvc.perform(post("/v1/fmo/admin/importmap/audit")
            .content(objectMapper.writeValueAsString(getRequestOfImportMap()))
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
        doThrow(new NoSuchElementException("Record not found.")).when(importMapAuditService)
            .findByImportMapId(anyLong());
        String response = mockMvc.perform(post("/v1/fmo/admin/importmap/audit")
            .content(objectMapper.writeValueAsString(getRequestOfImportMap()))
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
        when(importMapService.create(any())).thenReturn(getImportMap());
        RequestOfImportMap requestOfImportMap = getRequestOfImportMap();
        when(adminModuleUtil.checkIfNull(requestOfImportMap.getPath(), "")).thenReturn(requestOfImportMap.getPath());
        when(adminModuleUtil.checkIfNull(requestOfImportMap.getKeyName(), "")).thenReturn(requestOfImportMap.getKeyName());
        String response = mockMvc.perform(post("/v1/fmo/admin/importmap/create")
            .content(objectMapper.writeValueAsString(requestOfImportMap))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isOk()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertTrue(result.isResult());
    }

    @SneakyThrows
    @Test
    void testCreateFail0() {
        Map<String, String> payload = new HashMap<>();
        payload.put("sub", "123");
        payload.put("ems2Role", "FMO_ADMIN");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        when(importMapService.create(any())).thenReturn(getImportMap());
        RequestOfImportMap requestOfImportMap = getRequestOfImportMap();
        when(adminModuleUtil.checkIfNull(requestOfImportMap.getPath(), "")).thenReturn("");
        when(adminModuleUtil.checkIfNull(requestOfImportMap.getKeyName(), "")).thenReturn(requestOfImportMap.getKeyName());
        String response = mockMvc.perform(post("/v1/fmo/admin/importmap/create")
            .content(objectMapper.writeValueAsString(requestOfImportMap))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isBadRequest()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testCreateFail00() {
        Map<String, String> payload = new HashMap<>();
        payload.put("sub", "123");
        payload.put("ems2Role", "FMO_ADMIN");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        when(importMapService.create(any())).thenReturn(getImportMap());
        RequestOfImportMap requestOfImportMap = getRequestOfImportMap();
        when(adminModuleUtil.checkIfNull(requestOfImportMap.getPath(), "")).thenReturn(requestOfImportMap.getPath());
        when(adminModuleUtil.checkIfNull(requestOfImportMap.getKeyName(), "")).thenReturn("");
        String response = mockMvc.perform(post("/v1/fmo/admin/importmap/create")
            .content(objectMapper.writeValueAsString(requestOfImportMap))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isBadRequest()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testCreateFail000() {
        Map<String, String> payload = new HashMap<>();
        payload.put("sub", "123");
        payload.put("ems2Role", "FMO_ADMIN");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        when(importMapService.create(any())).thenReturn(getImportMap());
        RequestOfImportMap requestOfImportMap = getRequestOfImportMap();
        when(adminModuleUtil.checkIfNull(requestOfImportMap.getPath(), "")).thenReturn(" ");
        when(adminModuleUtil.checkIfNull(requestOfImportMap.getKeyName(), "")).thenReturn(requestOfImportMap.getKeyName());
        String response = mockMvc.perform(post("/v1/fmo/admin/importmap/create")
            .content(objectMapper.writeValueAsString(requestOfImportMap))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isBadRequest()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testCreateFail0000() {
        Map<String, String> payload = new HashMap<>();
        payload.put("sub", "123");
        payload.put("ems2Role", "FMO_ADMIN");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        when(importMapService.create(any())).thenReturn(getImportMap());
        RequestOfImportMap requestOfImportMap = getRequestOfImportMap();
        when(adminModuleUtil.checkIfNull(requestOfImportMap.getPath(), "")).thenReturn(requestOfImportMap.getPath());
        when(adminModuleUtil.checkIfNull(requestOfImportMap.getKeyName(), "")).thenReturn(" ");
        String response = mockMvc.perform(post("/v1/fmo/admin/importmap/create")
            .content(objectMapper.writeValueAsString(requestOfImportMap))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isBadRequest()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testCreate2() {
        Map<String, String> payload = new HashMap<>();
        payload.put("sub", "123");
        payload.put("ems2Role", "RATAN_ADMIN");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        when(importMapService.create(any())).thenReturn(getImportMap());
        RequestOfImportMap requestOfImportMap = getRequestOfImportMap();
        requestOfImportMap.setPath("path");
        requestOfImportMap.setKeyName("key");
        when(adminModuleUtil.checkIfNull(requestOfImportMap.getPath(), "")).thenReturn(requestOfImportMap.getPath());
        when(adminModuleUtil.checkIfNull(requestOfImportMap.getKeyName(), "")).thenReturn(requestOfImportMap.getKeyName());
        String response = mockMvc.perform(post("/v1/fmo/admin/importmap/create")
            .content(objectMapper.writeValueAsString(requestOfImportMap))
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
        payload.put("ems2Role", "RATAN_ADMIN");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        when(importMapService.create(any())).thenReturn(getImportMap());
        RequestOfImportMap requestOfImportMap = getRequestOfImportMap();
        requestOfImportMap.setPath("path");
        requestOfImportMap.setKeyName("key");
        when(adminModuleUtil.checkIfNull(requestOfImportMap.getPath(), "")).thenReturn(requestOfImportMap.getPath());
        when(adminModuleUtil.checkIfNull(requestOfImportMap.getKeyName(), "")).thenReturn(requestOfImportMap.getKeyName());
        String response = mockMvc.perform(post("/v1/fmo/admin/importmap/create")
            .content(objectMapper.writeValueAsString(requestOfImportMap))
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
        doThrow(new NoSuchElementException("Record not created.")).when(importMapService)
            .create(any());
        RequestOfImportMap requestOfImportMap = getRequestOfImportMap();
        requestOfImportMap.setMode("checker");
        requestOfImportMap.setActive(true);
        requestOfImportMap.setImportMapId(123);
        requestOfImportMap.setKeyName("key");
        requestOfImportMap.setPath("path");
        when(adminModuleUtil.checkIfNull(requestOfImportMap.getPath(), "")).thenReturn(requestOfImportMap.getPath());
        when(adminModuleUtil.checkIfNull(requestOfImportMap.getKeyName(), "")).thenReturn(requestOfImportMap.getKeyName());
        String response = mockMvc.perform(post("/v1/fmo/admin/importmap/create")
            .content(objectMapper.writeValueAsString(requestOfImportMap))
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
        payload.put("ems2Role", "RATAN_ADMIN");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        ImportMap importMap = getImportMap();
        importMap.setImportMapId(123);
        importMap.setActive(false);
        importMap.setKeyName("key");
        importMap.setPath("path");
        importMap.setUpdatedBy("456");
        importMap.setCreatedBy("456");
        importMap.setUpdatedAt(new Date());
        importMap.setCreatedAt(new Date());
        importMap.setEms2Role("RATAN_ADMIN");
        when(importMapService.getById(any())).thenReturn(Optional.ofNullable(importMap));
        when(importMapService.update(any())).thenReturn(importMap);
        RequestOfImportMap requestOfImportMap = getRequestOfImportMap();
        requestOfImportMap.setMode("checker");
        requestOfImportMap.setActive(true);
        requestOfImportMap.setImportMapId(123);
        String response = mockMvc.perform(post("/v1/fmo/admin/importmap/update")
            .content(objectMapper.writeValueAsString(requestOfImportMap))
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
        ImportMap importMap = getImportMap();
        importMap.setImportMapId(123);
        importMap.setActive(true);
        importMap.setKeyName("key");
        importMap.setPath("path");
        importMap.setUpdatedBy("456");
        importMap.setCreatedBy("456");
        importMap.setUpdatedAt(new Date());
        importMap.setCreatedAt(new Date());
        importMap.setEms2Role("RATAN_ADMIN");
        when(importMapService.getById(any())).thenReturn(Optional.ofNullable(importMap));
        when(importMapService.update(any())).thenReturn(importMap);
        RequestOfImportMap requestOfImportMap = getRequestOfImportMap();
        requestOfImportMap.setMode("checker");
        requestOfImportMap.setActive(true);
        requestOfImportMap.setImportMapId(123);
        requestOfImportMap.setKeyName("key");
        requestOfImportMap.setPath("path");
        when(adminModuleUtil.checkIfNull(requestOfImportMap.getPath(), "")).thenReturn(requestOfImportMap.getPath());
        when(adminModuleUtil.checkIfNull(requestOfImportMap.getKeyName(), "")).thenReturn(requestOfImportMap.getKeyName());
        String response = mockMvc.perform(post("/v1/fmo/admin/importmap/update")
            .content(objectMapper.writeValueAsString(requestOfImportMap))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isOk()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertTrue(result.isResult());
    }

    @SneakyThrows
    @Test
    void testUpdate3Fail0() {
        Map<String, String> payload = new HashMap<>();
        payload.put("sub", "123");
        payload.put("ems2Role", "RATAN_ADMIN");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        ImportMap importMap = getImportMap();
        importMap.setImportMapId(123);
        importMap.setActive(true);
        importMap.setKeyName("key");
        importMap.setPath("path");
        importMap.setUpdatedBy("456");
        importMap.setCreatedBy("456");
        importMap.setUpdatedAt(new Date());
        importMap.setCreatedAt(new Date());
        importMap.setEms2Role("RATAN_ADMIN");
        when(importMapService.getById(any())).thenReturn(Optional.ofNullable(importMap));
        when(importMapService.update(any())).thenReturn(importMap);
        RequestOfImportMap requestOfImportMap = getRequestOfImportMap();
        requestOfImportMap.setMode("checker");
        requestOfImportMap.setActive(true);
        requestOfImportMap.setImportMapId(123);
        requestOfImportMap.setKeyName("key");
        requestOfImportMap.setPath("path");
        when(adminModuleUtil.checkIfNull(requestOfImportMap.getPath(), "")).thenReturn("");
        when(adminModuleUtil.checkIfNull(requestOfImportMap.getKeyName(), "")).thenReturn(requestOfImportMap.getKeyName());
        String response = mockMvc.perform(post("/v1/fmo/admin/importmap/update")
            .content(objectMapper.writeValueAsString(requestOfImportMap))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isBadRequest()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testUpdate3Fail00() {
        Map<String, String> payload = new HashMap<>();
        payload.put("sub", "123");
        payload.put("ems2Role", "RATAN_ADMIN");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        ImportMap importMap = getImportMap();
        importMap.setImportMapId(123);
        importMap.setActive(true);
        importMap.setKeyName("key");
        importMap.setPath("path");
        importMap.setUpdatedBy("456");
        importMap.setCreatedBy("456");
        importMap.setUpdatedAt(new Date());
        importMap.setCreatedAt(new Date());
        importMap.setEms2Role("RATAN_ADMIN");
        when(importMapService.getById(any())).thenReturn(Optional.ofNullable(importMap));
        when(importMapService.update(any())).thenReturn(importMap);
        RequestOfImportMap requestOfImportMap = getRequestOfImportMap();
        requestOfImportMap.setMode("checker");
        requestOfImportMap.setActive(true);
        requestOfImportMap.setImportMapId(123);
        requestOfImportMap.setKeyName("key");
        requestOfImportMap.setPath("path");
        when(adminModuleUtil.checkIfNull(requestOfImportMap.getPath(), "")).thenReturn(requestOfImportMap.getPath());
        when(adminModuleUtil.checkIfNull(requestOfImportMap.getKeyName(), "")).thenReturn("");
        String response = mockMvc.perform(post("/v1/fmo/admin/importmap/update")
            .content(objectMapper.writeValueAsString(requestOfImportMap))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isBadRequest()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testUpdate3Fail000() {
        Map<String, String> payload = new HashMap<>();
        payload.put("sub", "123");
        payload.put("ems2Role", "RATAN_ADMIN");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        ImportMap importMap = getImportMap();
        importMap.setImportMapId(123);
        importMap.setActive(true);
        importMap.setKeyName("key");
        importMap.setPath("path");
        importMap.setUpdatedBy("456");
        importMap.setCreatedBy("456");
        importMap.setUpdatedAt(new Date());
        importMap.setCreatedAt(new Date());
        importMap.setEms2Role("RATAN_ADMIN");
        when(importMapService.getById(any())).thenReturn(Optional.ofNullable(importMap));
        when(importMapService.update(any())).thenReturn(importMap);
        RequestOfImportMap requestOfImportMap = getRequestOfImportMap();
        requestOfImportMap.setMode("checker");
        requestOfImportMap.setActive(true);
        requestOfImportMap.setImportMapId(123);
        requestOfImportMap.setKeyName("key");
        requestOfImportMap.setPath("path");
        when(adminModuleUtil.checkIfNull(requestOfImportMap.getPath(), "")).thenReturn(" ");
        when(adminModuleUtil.checkIfNull(requestOfImportMap.getKeyName(), "")).thenReturn(requestOfImportMap.getKeyName());
        String response = mockMvc.perform(post("/v1/fmo/admin/importmap/update")
            .content(objectMapper.writeValueAsString(requestOfImportMap))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isBadRequest()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testUpdate3Fail0000() {
        Map<String, String> payload = new HashMap<>();
        payload.put("sub", "123");
        payload.put("ems2Role", "RATAN_ADMIN");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        ImportMap importMap = getImportMap();
        importMap.setImportMapId(123);
        importMap.setActive(true);
        importMap.setKeyName("key");
        importMap.setPath("path");
        importMap.setUpdatedBy("456");
        importMap.setCreatedBy("456");
        importMap.setUpdatedAt(new Date());
        importMap.setCreatedAt(new Date());
        importMap.setEms2Role("RATAN_ADMIN");
        when(importMapService.getById(any())).thenReturn(Optional.ofNullable(importMap));
        when(importMapService.update(any())).thenReturn(importMap);
        RequestOfImportMap requestOfImportMap = getRequestOfImportMap();
        requestOfImportMap.setMode("checker");
        requestOfImportMap.setActive(true);
        requestOfImportMap.setImportMapId(123);
        requestOfImportMap.setKeyName("key");
        requestOfImportMap.setPath("path");
        when(adminModuleUtil.checkIfNull(requestOfImportMap.getPath(), "")).thenReturn(requestOfImportMap.getPath());
        when(adminModuleUtil.checkIfNull(requestOfImportMap.getKeyName(), "")).thenReturn(" ");
        String response = mockMvc.perform(post("/v1/fmo/admin/importmap/update")
            .content(objectMapper.writeValueAsString(requestOfImportMap))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isBadRequest()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testUpdateFail1() {
        Map<String, String> payload = new HashMap<>();
        payload.put("sub", "123");
        payload.put("ems2Role", "RATAN_ADMIN");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        ImportMap importMap = getImportMap();
        importMap.setImportMapId(123);
        importMap.setActive(false);
        importMap.setKeyName("key");
        importMap.setPath("path");
        importMap.setUpdatedBy("123");
        importMap.setCreatedBy("456");
        importMap.setUpdatedAt(new Date());
        importMap.setCreatedAt(new Date());
        importMap.setEms2Role("RATAN_ADMIN");
        when(importMapService.getById(any())).thenReturn(Optional.ofNullable(importMap));
        when(importMapService.update(any())).thenReturn(importMap);
        RequestOfImportMap requestOfImportMap = getRequestOfImportMap();
        requestOfImportMap.setMode("checker");
        requestOfImportMap.setActive(true);
        requestOfImportMap.setImportMapId(123);
        String response = mockMvc.perform(post("/v1/fmo/admin/importmap/update")
            .content(objectMapper.writeValueAsString(requestOfImportMap))
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
        ImportMap importMap = getImportMap();
        importMap.setImportMapId(123);
        importMap.setActive(false);
        importMap.setKeyName("key");
        importMap.setPath("path");
        importMap.setUpdatedBy("123");
        importMap.setCreatedBy("456");
        importMap.setUpdatedAt(new Date());
        importMap.setCreatedAt(new Date());
        importMap.setEms2Role("RATAN_ADMIN");
        when(importMapService.getById(any())).thenReturn(Optional.ofNullable(importMap));
        when(importMapService.update(any())).thenReturn(importMap);
        RequestOfImportMap requestOfImportMap = getRequestOfImportMap();
        requestOfImportMap.setMode("checker");
        requestOfImportMap.setActive(true);
        requestOfImportMap.setImportMapId(123);
        String response = mockMvc.perform(post("/v1/fmo/admin/importmap/update")
            .content(objectMapper.writeValueAsString(requestOfImportMap))
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
        ImportMap importMap = getImportMap();
        importMap.setImportMapId(123);
        importMap.setActive(true);
        importMap.setKeyName("key");
        importMap.setPath("path");
        importMap.setUpdatedBy("456");
        importMap.setCreatedBy("456");
        importMap.setUpdatedAt(new Date());
        importMap.setCreatedAt(new Date());
        importMap.setEms2Role("RATAN_ADMIN");
        when(importMapService.getById(any())).thenReturn(Optional.ofNullable(importMap));
        when(importMapService.update(any())).thenReturn(importMap);
        RequestOfImportMap requestOfImportMap = getRequestOfImportMap();
        requestOfImportMap.setMode("deactivate");
        requestOfImportMap.setActive(true);
        requestOfImportMap.setImportMapId(123);
        String response = mockMvc.perform(post("/v1/fmo/admin/importmap/update")
            .content(objectMapper.writeValueAsString(requestOfImportMap))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isOk()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertTrue(result.isResult());
    }

    @SneakyThrows
    @Test
    void testUpdateUpdate() {
        Map<String, String> payload = new HashMap<>();
        payload.put("sub", "123");
        payload.put("ems2Role", "RATAN_ADMIN");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        ImportMap importMap = getImportMap();
        importMap.setImportMapId(123);
        importMap.setActive(true);
        importMap.setKeyName("key");
        importMap.setPath("path");
        importMap.setUpdatedBy("456");
        importMap.setCreatedBy("456");
        importMap.setUpdatedAt(new Date());
        importMap.setCreatedAt(new Date());
        importMap.setEms2Role("RATAN_ADMIN");
        when(importMapService.getById(any())).thenReturn(Optional.ofNullable(importMap));
        when(importMapService.update(any())).thenReturn(importMap);
        RequestOfImportMap requestOfImportMap = getRequestOfImportMap();
        requestOfImportMap.setMode("maker");
        requestOfImportMap.setActive(true);
        requestOfImportMap.setImportMapId(123);
        requestOfImportMap.setKeyName("key");
        requestOfImportMap.setPath("path");
        when(adminModuleUtil.checkIfNull(requestOfImportMap.getPath(), "")).thenReturn(requestOfImportMap.getPath());
        when(adminModuleUtil.checkIfNull(requestOfImportMap.getKeyName(), "")).thenReturn(requestOfImportMap.getKeyName());
        String response = mockMvc.perform(post("/v1/fmo/admin/importmap/update")
            .content(objectMapper.writeValueAsString(requestOfImportMap))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isOk()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertTrue(result.isResult());
    }

    @SneakyThrows
    @Test
    void testUpdateUpdate2() {
        Map<String, String> payload = new HashMap<>();
        payload.put("sub", "123");
        payload.put("ems2Role", "RATAN_ADMIN");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        ImportMap importMap = getImportMap();
        importMap.setImportMapId(123);
        importMap.setActive(true);
        importMap.setKeyName("key");
        importMap.setPath("path");
        importMap.setUpdatedBy("456");
        importMap.setCreatedBy("456");
        importMap.setUpdatedAt(new Date());
        importMap.setCreatedAt(new Date());
        importMap.setEms2Role("RATAN_ADMIN");
        when(importMapService.getById(any())).thenReturn(Optional.ofNullable(importMap));
        when(importMapService.update(any())).thenReturn(importMap);
        RequestOfImportMap requestOfImportMap = getRequestOfImportMap();
        requestOfImportMap.setMode("maker");
        requestOfImportMap.setActive(true);
        requestOfImportMap.setKeyName("key");
        requestOfImportMap.setPath("path");
        requestOfImportMap.setImportMapId(123);
        when(adminModuleUtil.checkIfNull(requestOfImportMap.getPath(), "")).thenReturn(requestOfImportMap.getPath());
        when(adminModuleUtil.checkIfNull(requestOfImportMap.getKeyName(), "")).thenReturn(requestOfImportMap.getKeyName());
        String response = mockMvc.perform(post("/v1/fmo/admin/importmap/update")
            .content(objectMapper.writeValueAsString(requestOfImportMap))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isOk()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertTrue(result.isResult());
    }

    @SneakyThrows
    @Test
    void testUpdateUpdate3() {
        Map<String, String> payload = new HashMap<>();
        payload.put("sub", "123");
        payload.put("ems2Role", "RATAN_ADMIN");
        when(adminModuleUtil.validate(any(), any())).thenReturn(payload);
        ImportMap importMap = getImportMap();
        importMap.setImportMapId(123);
        importMap.setActive(false);
        importMap.setKeyName("key");
        importMap.setPath("path");
        importMap.setUpdatedBy("456");
        importMap.setCreatedBy("456");
        importMap.setUpdatedAt(new Date());
        importMap.setCreatedAt(new Date());
        importMap.setEms2Role("RATAN_ADMIN");
        when(importMapService.getById(any())).thenReturn(Optional.ofNullable(importMap));
        when(importMapService.update(any())).thenReturn(importMap);
        RequestOfImportMap requestOfImportMap = getRequestOfImportMap();
        requestOfImportMap.setMode("maker");
        requestOfImportMap.setActive(true);
        requestOfImportMap.setKeyName("key");
        requestOfImportMap.setPath("path");
        requestOfImportMap.setImportMapId(123);
        when(adminModuleUtil.checkIfNull(requestOfImportMap.getPath(), "")).thenReturn(requestOfImportMap.getPath());
        when(adminModuleUtil.checkIfNull(requestOfImportMap.getKeyName(), "")).thenReturn(requestOfImportMap.getKeyName());
        String response = mockMvc.perform(post("/v1/fmo/admin/importmap/update")
            .content(objectMapper.writeValueAsString(requestOfImportMap))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isOk()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertTrue(result.isResult());
    }

    @SneakyThrows
    @Test
    void testUpdateUpdateFail() {
        Map<String, String> payload = new HashMap<>();
        payload.put("sub", "123");
        payload.put("ems2Role", "RATAN_ADMIN");
        doThrow(new NoSuchElementException("Record not found.")).when(importMapService)
            .getById(any());
        RequestOfImportMap requestOfImportMap = getRequestOfImportMap();
        requestOfImportMap.setMode("maker");
        requestOfImportMap.setActive(true);
        requestOfImportMap.setKeyName("key");
        requestOfImportMap.setPath("path");
        requestOfImportMap.setImportMapId(123);
        String response = mockMvc.perform(post("/v1/fmo/admin/importmap/update")
            .content(objectMapper.writeValueAsString(requestOfImportMap))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isBadRequest()).andReturn().getResponse().getContentAsString();
        ResponseOfAdminModule result = objectMapper.readValue(response, ResponseOfAdminModule.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

}
