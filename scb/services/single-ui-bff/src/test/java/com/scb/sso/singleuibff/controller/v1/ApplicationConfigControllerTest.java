package com.scb.sso.singleuibff.controller.v1;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.sso.singleuibff.dto.config.ApplicationCategoryConfig;
import com.scb.sso.singleuibff.dto.config.ApplicationTileConfig;
import com.scb.sso.singleuibff.dto.config.FmaaResult;
import com.scb.sso.singleuibff.dto.config.ImportMapConfig;
import com.scb.sso.singleuibff.dto.response.ResponseOfBulkAuth;
import com.scb.sso.singleuibff.entity.ApplicationCategory;
import com.scb.sso.singleuibff.entity.ApplicationTile;
import com.scb.sso.singleuibff.entity.ImportMap;
import com.scb.sso.singleuibff.exceptions.RecordNotFoundException;
import com.scb.sso.singleuibff.service.v1.*;
import com.scb.sso.singleuibff.util.AdminModuleUtil;
import com.scb.sso.singleuibff.util.CsvUtility;
import lombok.SneakyThrows;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@WebMvcTest(ApplicationConfigController.class)
public class ApplicationConfigControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @MockBean
    private AdminModuleUtil adminModuleUtil;
    @MockBean
    private CsvUtility csvUtility;
    @MockBean
    private ApplicationConfigService applicationConfigService;
    @MockBean
    private ImportMapService importMapService;
    @MockBean
    private ImportMapAuditService importMapAuditService;
    @MockBean
    private ApplicationCategoryService applicationCategoryService;
    @MockBean
    private ApplicationCategoryAuditService applicationCategoryAuditService;
    @MockBean
    private ApplicationTileService applicationTileService;
    @MockBean
    private ApplicationTileAuditService applicationTileAuditService;

    @SneakyThrows
    @Test
    void testUpload() {
        String ems2Role = "RATAN_PROD";
        FmaaResult fmaaResult = new FmaaResult();
        fmaaResult.setUserId(ems2Role);
        fmaaResult.setActive("true");
        when(applicationConfigService.getAppId(anyString())).thenReturn(fmaaResult);
        doReturn(true).when(csvUtility).hasCsvFormat(any());
        List<ImportMapConfig> importMapConfigs = List
            .of(ImportMapConfig.builder().importMapId(Long.parseLong("1")).path("path").keyName("keyName").ems2Role(ems2Role).build());
        List<ApplicationCategoryConfig> applicationCategoryConfigs = List
            .of(ApplicationCategoryConfig.builder().applicationCategoryId(Long.parseLong("1")).label("label").ems2Role(ems2Role).build());
        List<ApplicationTileConfig> applicationTileConfigs = List
            .of(ApplicationTileConfig.builder().applicationTileId(Long.parseLong("1")).title("title").module("module").ems2Role(ems2Role)
                .tile("module")
                .applicationCategoryId(Long.parseLong("1")).importMapId(Long.parseLong("1")).build());

        doReturn(importMapConfigs).when(csvUtility).getModuleMaps(any(), anyString());
        doReturn(applicationCategoryConfigs).when(csvUtility).getCategories(any(), anyString());
        doReturn(applicationTileConfigs).when(csvUtility).getTiles(any(), anyString());

        ApplicationCategory applicationCategory = ApplicationCategory.builder().applicationCategoryId(Long.parseLong("1")).label("label")
            .ems2Role(ems2Role)
            .build();
        ImportMap importMap = ImportMap.builder().importMapId(Long.parseLong("1")).path("path").keyName("keyName").ems2Role(ems2Role)
            .build();

        doReturn(Optional.of(importMap)).when(importMapService).getById(any());
        doReturn(Optional.of(applicationCategory)).when(applicationCategoryService).getById(any());
        doReturn(Optional.of(ApplicationTile.builder().applicationTileId(Long.parseLong("1")).title("title").module("module").tile("module")
            .ems2Role(ems2Role)
            .applicationCategory(applicationCategory).importMap(importMap).build())).when(applicationTileService).getById(any());

        MockMultipartFile moduleMap = new MockMultipartFile("moduleMap", "moduleMap.csv", "text/csv", "1,2,3".getBytes());
        MockMultipartFile category = new MockMultipartFile("category", "category.csv", "text/csv", "1,2,3".getBytes());
        MockMultipartFile tile = new MockMultipartFile("tile", "tile.csv", "text/csv", "1,2,3".getBytes());
        String response = mockMvc.perform(MockMvcRequestBuilders.multipart("/v1/fmo/admin/config/upload")
            .file(moduleMap)
            .file(category)
            .file(tile)
            .param("fmaa_access_token", "123"))
            .andExpect(MockMvcResultMatchers.status().isOk()).andReturn().getResponse().getContentAsString();
        ResponseOfBulkAuth result = objectMapper.readValue(response, ResponseOfBulkAuth.class);
        assertNotNull(result);
        assertTrue(result.isResult());
    }

    @SneakyThrows
    @Test
    void testUploadErrorRole1() {
        String ems2Role = "RATAN_PROD";
        FmaaResult fmaaResult = new FmaaResult();
        fmaaResult.setUserId(ems2Role);
        fmaaResult.setActive("true");
        when(applicationConfigService.getAppId(anyString())).thenReturn(fmaaResult);
        doReturn(true).when(csvUtility).hasCsvFormat(any());
        List<ImportMapConfig> importMapConfigs = List
            .of(ImportMapConfig.builder().importMapId(Long.parseLong("1")).path("path").keyName("keyName").ems2Role(ems2Role).build());
        List<ApplicationCategoryConfig> applicationCategoryConfigs = List
            .of(ApplicationCategoryConfig.builder().applicationCategoryId(Long.parseLong("1")).label("label").ems2Role(ems2Role).build());
        List<ApplicationTileConfig> applicationTileConfigs = List
            .of(ApplicationTileConfig.builder().applicationTileId(Long.parseLong("1")).title("title").module("module").ems2Role(ems2Role)
                .tile("module")
                .applicationCategoryId(Long.parseLong("1")).importMapId(Long.parseLong("1")).build());

        doReturn(importMapConfigs).when(csvUtility).getModuleMaps(any(), anyString());
        doReturn(applicationCategoryConfigs).when(csvUtility).getCategories(any(), anyString());
        doReturn(applicationTileConfigs).when(csvUtility).getTiles(any(), anyString());

        ApplicationCategory applicationCategory = ApplicationCategory.builder().applicationCategoryId(Long.parseLong("1")).label("label")
            .ems2Role(ems2Role)
            .build();
        ImportMap importMap = ImportMap.builder().importMapId(Long.parseLong("1")).path("path").keyName("keyName").build();

        doReturn(Optional.of(importMap)).when(importMapService).getById(any());
        doReturn(Optional.of(applicationCategory)).when(applicationCategoryService).getById(any());
        doReturn(Optional.of(ApplicationTile.builder().applicationTileId(Long.parseLong("1")).title("title").module("module").tile("module")
            .ems2Role(ems2Role)
            .applicationCategory(applicationCategory).importMap(importMap).build())).when(applicationTileService).getById(any());

        MockMultipartFile moduleMap = new MockMultipartFile("moduleMap", "moduleMap.csv", "text/csv", "1,2,3".getBytes());
        MockMultipartFile category = new MockMultipartFile("category", "category.csv", "text/csv", "1,2,3".getBytes());
        MockMultipartFile tile = new MockMultipartFile("tile", "tile.csv", "text/csv", "1,2,3".getBytes());
        String response = mockMvc.perform(MockMvcRequestBuilders.multipart("/v1/fmo/admin/config/upload")
            .file(moduleMap)
            .file(category)
            .file(tile)
            .param("fmaa_access_token", "123"))
            .andExpect(MockMvcResultMatchers.status().isBadRequest()).andReturn().getResponse().getContentAsString();
        ResponseOfBulkAuth result = objectMapper.readValue(response, ResponseOfBulkAuth.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testUploadErrorRole2() {
        String ems2Role = "RATAN_PROD";
        FmaaResult fmaaResult = new FmaaResult();
        fmaaResult.setUserId(ems2Role);
        fmaaResult.setActive("true");
        when(applicationConfigService.getAppId(anyString())).thenReturn(fmaaResult);
        doReturn(true).when(csvUtility).hasCsvFormat(any());
        List<ImportMapConfig> importMapConfigs = List
            .of(ImportMapConfig.builder().importMapId(Long.parseLong("1")).path("path").keyName("keyName").ems2Role(ems2Role).build());
        List<ApplicationCategoryConfig> applicationCategoryConfigs = List
            .of(ApplicationCategoryConfig.builder().applicationCategoryId(Long.parseLong("1")).label("label").ems2Role(ems2Role).build());
        List<ApplicationTileConfig> applicationTileConfigs = List
            .of(ApplicationTileConfig.builder().applicationTileId(Long.parseLong("1")).title("title").module("module").ems2Role(ems2Role)
                .tile("module")
                .applicationCategoryId(Long.parseLong("1")).importMapId(Long.parseLong("1")).build());

        doReturn(importMapConfigs).when(csvUtility).getModuleMaps(any(), anyString());
        doReturn(applicationCategoryConfigs).when(csvUtility).getCategories(any(), anyString());
        doReturn(applicationTileConfigs).when(csvUtility).getTiles(any(), anyString());

        ApplicationCategory applicationCategory = ApplicationCategory.builder().applicationCategoryId(Long.parseLong("1")).label("label")
            .build();
        ImportMap importMap = ImportMap.builder().importMapId(Long.parseLong("1")).path("path").keyName("keyName").ems2Role(ems2Role)
            .build();

        doReturn(Optional.of(importMap)).when(importMapService).getById(any());
        doReturn(Optional.of(applicationCategory)).when(applicationCategoryService).getById(any());
        doReturn(Optional.of(ApplicationTile.builder().applicationTileId(Long.parseLong("1")).title("title").module("module").tile("module")
            .ems2Role(ems2Role)
            .applicationCategory(applicationCategory).importMap(importMap).build())).when(applicationTileService).getById(any());

        MockMultipartFile moduleMap = new MockMultipartFile("moduleMap", "moduleMap.csv", "text/csv", "1,2,3".getBytes());
        MockMultipartFile category = new MockMultipartFile("category", "category.csv", "text/csv", "1,2,3".getBytes());
        MockMultipartFile tile = new MockMultipartFile("tile", "tile.csv", "text/csv", "1,2,3".getBytes());
        String response = mockMvc.perform(MockMvcRequestBuilders.multipart("/v1/fmo/admin/config/upload")
            .file(moduleMap)
            .file(category)
            .file(tile)
            .param("fmaa_access_token", "123"))
            .andExpect(MockMvcResultMatchers.status().isBadRequest()).andReturn().getResponse().getContentAsString();
        ResponseOfBulkAuth result = objectMapper.readValue(response, ResponseOfBulkAuth.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testUploadErrorRole3() {
        String ems2Role = "RATAN_PROD";
        FmaaResult fmaaResult = new FmaaResult();
        fmaaResult.setUserId(ems2Role);
        fmaaResult.setActive("true");
        when(applicationConfigService.getAppId(anyString())).thenReturn(fmaaResult);
        doReturn(true).when(csvUtility).hasCsvFormat(any());
        List<ImportMapConfig> importMapConfigs = List
            .of(ImportMapConfig.builder().importMapId(Long.parseLong("1")).path("path").keyName("keyName").ems2Role(ems2Role).build());
        List<ApplicationCategoryConfig> applicationCategoryConfigs = List
            .of(ApplicationCategoryConfig.builder().applicationCategoryId(Long.parseLong("1")).label("label").ems2Role(ems2Role).build());
        List<ApplicationTileConfig> applicationTileConfigs = List
            .of(ApplicationTileConfig.builder().applicationTileId(Long.parseLong("1")).title("title").module("module").ems2Role(ems2Role)
                .tile("module")
                .applicationCategoryId(Long.parseLong("1")).importMapId(Long.parseLong("1")).build());

        doReturn(importMapConfigs).when(csvUtility).getModuleMaps(any(), anyString());
        doReturn(applicationCategoryConfigs).when(csvUtility).getCategories(any(), anyString());
        doReturn(applicationTileConfigs).when(csvUtility).getTiles(any(), anyString());

        ApplicationCategory applicationCategory = ApplicationCategory.builder().applicationCategoryId(Long.parseLong("1")).label("label")
            .ems2Role(ems2Role)
            .build();
        ImportMap importMap = ImportMap.builder().importMapId(Long.parseLong("1")).path("path").keyName("keyName").ems2Role(ems2Role)
            .build();

        doReturn(Optional.of(importMap)).when(importMapService).getById(any());
        doReturn(Optional.of(applicationCategory)).when(applicationCategoryService).getById(any());
        doReturn(Optional.of(ApplicationTile.builder().applicationTileId(Long.parseLong("1")).title("title").module("module").tile("module")
            .applicationCategory(applicationCategory).importMap(importMap).build())).when(applicationTileService).getById(any());

        MockMultipartFile moduleMap = new MockMultipartFile("moduleMap", "moduleMap.csv", "text/csv", "1,2,3".getBytes());
        MockMultipartFile category = new MockMultipartFile("category", "category.csv", "text/csv", "1,2,3".getBytes());
        MockMultipartFile tile = new MockMultipartFile("tile", "tile.csv", "text/csv", "1,2,3".getBytes());
        String response = mockMvc.perform(MockMvcRequestBuilders.multipart("/v1/fmo/admin/config/upload")
            .file(moduleMap)
            .file(category)
            .file(tile)
            .param("fmaa_access_token", "123"))
            .andExpect(MockMvcResultMatchers.status().isBadRequest()).andReturn().getResponse().getContentAsString();
        ResponseOfBulkAuth result = objectMapper.readValue(response, ResponseOfBulkAuth.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testUploadSuccess() {
        String ems2Role = "RATAN_PROD";
        FmaaResult fmaaResult = new FmaaResult();
        fmaaResult.setUserId(ems2Role);
        fmaaResult.setActive("true");
        when(applicationConfigService.getAppId(anyString())).thenReturn(fmaaResult);
        doReturn(true).when(csvUtility).hasCsvFormat(any());
        List<ImportMapConfig> importMapConfigs = List
            .of(ImportMapConfig.builder().importMapId(Long.parseLong("1")).path("path").keyName("keyName").ems2Role(ems2Role).build());
        List<ApplicationCategoryConfig> applicationCategoryConfigs = List
            .of(ApplicationCategoryConfig.builder().applicationCategoryId(Long.parseLong("1")).label("label").ems2Role(ems2Role).build());
        List<ApplicationTileConfig> applicationTileConfigs = List
            .of(ApplicationTileConfig.builder().applicationTileId(Long.parseLong("1")).title("title").module("module").ems2Role(ems2Role)
                .tile("module")
                .applicationCategoryId(Long.parseLong("1")).importMapId(Long.parseLong("1")).build());

        doReturn(importMapConfigs).when(csvUtility).getModuleMaps(any(), anyString());
        doReturn(applicationCategoryConfigs).when(csvUtility).getCategories(any(), anyString());
        doReturn(applicationTileConfigs).when(csvUtility).getTiles(any(), anyString());

        doThrow(RecordNotFoundException.builder().message("Record not found.").build()).when(importMapService)
            .getById(any());
        doThrow(RecordNotFoundException.builder().message("Record not found.").build()).when(applicationCategoryService)
            .getById(any());
        doThrow(RecordNotFoundException.builder().message("Record not found.").build()).when(applicationTileService)
            .getById(any());

        MockMultipartFile moduleMap = new MockMultipartFile("moduleMap", "moduleMap.csv", "text/csv", "1,2,3".getBytes());
        MockMultipartFile category = new MockMultipartFile("category", "category.csv", "text/csv", "1,2,3".getBytes());
        MockMultipartFile tile = new MockMultipartFile("tile", "tile.csv", "text/csv", "1,2,3".getBytes());
        String response = mockMvc.perform(MockMvcRequestBuilders.multipart("/v1/fmo/admin/config/upload")
            .file(moduleMap)
            .file(category)
            .file(tile)
            .param("fmaa_access_token", "123"))
            .andExpect(MockMvcResultMatchers.status().isOk()).andReturn().getResponse().getContentAsString();
        ResponseOfBulkAuth result = objectMapper.readValue(response, ResponseOfBulkAuth.class);
        assertNotNull(result);
        assertTrue(result.isResult());
    }

    @SneakyThrows
    @Test
    void testUploadError0() {
        FmaaResult fmaaResult = new FmaaResult();
        fmaaResult.setActive("false");
        when(applicationConfigService.getAppId(anyString())).thenReturn(fmaaResult);
        List<ImportMapConfig> moduleMaps = new ArrayList<>();
        List<ApplicationCategoryConfig> applicationCategories = new ArrayList<>();
        List<ApplicationTileConfig> applicationTiles = new ArrayList<>();
        doReturn(moduleMaps).when(csvUtility).getModuleMaps(any(), anyString());
        doReturn(applicationCategories).when(csvUtility).getCategories(any(), anyString());
        doReturn(applicationTiles).when(csvUtility).getTiles(any(), anyString());
        MockMultipartFile moduleMap = new MockMultipartFile("moduleMap", "moduleMap.csv", "text/csv", "1,2,3".getBytes());
        MockMultipartFile category = new MockMultipartFile("category", "category.csv", "text/csv", "1,2,3".getBytes());
        MockMultipartFile tile = new MockMultipartFile("tile", "tile.csv", "text/csv", "1,2,3".getBytes());
        doReturn(true).when(csvUtility).hasCsvFormat(moduleMap);
        doReturn(true).when(csvUtility).hasCsvFormat(category);
        doReturn(true).when(csvUtility).hasCsvFormat(tile);
        String response = mockMvc.perform(MockMvcRequestBuilders.multipart("/v1/fmo/admin/config/upload")
            .file(moduleMap)
            .file(category)
            .file(tile)
            .param("fmaa_access_token", "123"))
            .andExpect(MockMvcResultMatchers.status().isBadRequest()).andReturn().getResponse().getContentAsString();
        ResponseOfBulkAuth result = objectMapper.readValue(response, ResponseOfBulkAuth.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testUploadError1() {
        String ems2Role = "RATAN_PROD";
        FmaaResult fmaaResult = new FmaaResult();
        fmaaResult.setUserId(ems2Role);
        fmaaResult.setActive("true");
        when(applicationConfigService.getAppId(anyString())).thenReturn(fmaaResult);
        List<ImportMapConfig> moduleMaps = new ArrayList<>();
        List<ApplicationCategoryConfig> applicationCategories = new ArrayList<>();
        List<ApplicationTileConfig> applicationTiles = new ArrayList<>();
        doReturn(moduleMaps).when(csvUtility).getModuleMaps(any(), anyString());
        doReturn(applicationCategories).when(csvUtility).getCategories(any(), anyString());
        doReturn(applicationTiles).when(csvUtility).getTiles(any(), anyString());
        MockMultipartFile moduleMap = new MockMultipartFile("moduleMap", "moduleMap.csv", "text/txt", "1,2,3".getBytes());
        MockMultipartFile category = new MockMultipartFile("category", "category.csv", "text/csv", "1,2,3".getBytes());
        MockMultipartFile tile = new MockMultipartFile("tile", "tile.csv", "text/csv", "1,2,3".getBytes());
        doReturn(false).when(csvUtility).hasCsvFormat(moduleMap);
        doReturn(true).when(csvUtility).hasCsvFormat(category);
        doReturn(true).when(csvUtility).hasCsvFormat(tile);
        String response = mockMvc.perform(MockMvcRequestBuilders.multipart("/v1/fmo/admin/config/upload")
            .file(moduleMap)
            .file(category)
            .file(tile)
            .param("fmaa_access_token", "123"))
            .andExpect(MockMvcResultMatchers.status().isBadRequest()).andReturn().getResponse().getContentAsString();
        ResponseOfBulkAuth result = objectMapper.readValue(response, ResponseOfBulkAuth.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testUploadError2() {
        String ems2Role = "RATAN_PROD";
        FmaaResult fmaaResult = new FmaaResult();
        fmaaResult.setUserId(ems2Role);
        fmaaResult.setActive("true");
        when(applicationConfigService.getAppId(anyString())).thenReturn(fmaaResult);
        List<ImportMapConfig> moduleMaps = new ArrayList<>();
        List<ApplicationCategoryConfig> applicationCategories = new ArrayList<>();
        List<ApplicationTileConfig> applicationTiles = new ArrayList<>();
        doReturn(moduleMaps).when(csvUtility).getModuleMaps(any(), anyString());
        doReturn(applicationCategories).when(csvUtility).getCategories(any(), anyString());
        doReturn(applicationTiles).when(csvUtility).getTiles(any(), anyString());
        MockMultipartFile moduleMap = new MockMultipartFile("moduleMap", "moduleMap.csv", "text/csv", "1,2,3".getBytes());
        MockMultipartFile category = new MockMultipartFile("category", "category.csv", "text/txt", "1,2,3".getBytes());
        MockMultipartFile tile = new MockMultipartFile("tile", "tile.csv", "text/csv", "1,2,3".getBytes());
        doReturn(true).when(csvUtility).hasCsvFormat(moduleMap);
        doReturn(false).when(csvUtility).hasCsvFormat(category);
        doReturn(true).when(csvUtility).hasCsvFormat(tile);
        String response = mockMvc.perform(MockMvcRequestBuilders.multipart("/v1/fmo/admin/config/upload")
            .file(moduleMap)
            .file(category)
            .file(tile)
            .param("fmaa_access_token", "123"))
            .andExpect(MockMvcResultMatchers.status().isBadRequest()).andReturn().getResponse().getContentAsString();
        ResponseOfBulkAuth result = objectMapper.readValue(response, ResponseOfBulkAuth.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testUploadError3() {
        String ems2Role = "RATAN_PROD";
        FmaaResult fmaaResult = new FmaaResult();
        fmaaResult.setUserId(ems2Role);
        fmaaResult.setActive("true");
        when(applicationConfigService.getAppId(anyString())).thenReturn(fmaaResult);
        List<ImportMapConfig> moduleMaps = new ArrayList<>();
        List<ApplicationCategoryConfig> applicationCategories = new ArrayList<>();
        List<ApplicationTileConfig> applicationTiles = new ArrayList<>();
        doReturn(moduleMaps).when(csvUtility).getModuleMaps(any(), anyString());
        doReturn(applicationCategories).when(csvUtility).getCategories(any(), anyString());
        doReturn(applicationTiles).when(csvUtility).getTiles(any(), anyString());
        MockMultipartFile moduleMap = new MockMultipartFile("moduleMap", "moduleMap.csv", "text/csv", "1,2,3".getBytes());
        MockMultipartFile category = new MockMultipartFile("category", "category.csv", "text/csv", "1,2,3".getBytes());
        MockMultipartFile tile = new MockMultipartFile("tile", "tile.csv", "text/txt", "1,2,3".getBytes());
        doReturn(true).when(csvUtility).hasCsvFormat(moduleMap);
        doReturn(true).when(csvUtility).hasCsvFormat(category);
        doReturn(false).when(csvUtility).hasCsvFormat(tile);

        String response = mockMvc.perform(MockMvcRequestBuilders.multipart("/v1/fmo/admin/config/upload")
            .file(moduleMap)
            .file(category)
            .file(tile)
            .param("fmaa_access_token", "123"))
            .andExpect(MockMvcResultMatchers.status().isBadRequest()).andReturn().getResponse().getContentAsString();
        ResponseOfBulkAuth result = objectMapper.readValue(response, ResponseOfBulkAuth.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testUploadError4() {
        String ems2Role = "RATAN_PROD";
        FmaaResult fmaaResult = new FmaaResult();
        fmaaResult.setUserId(ems2Role);
        fmaaResult.setActive("true");
        when(applicationConfigService.getAppId(anyString())).thenReturn(fmaaResult);
        doReturn(true).when(csvUtility).hasCsvFormat(any());
        List<ImportMapConfig> importMapConfigs = List
            .of(ImportMapConfig.builder().importMapId(Long.parseLong("2")).path("path").keyName("keyName").ems2Role(ems2Role).build());
        List<ApplicationCategoryConfig> applicationCategoryConfigs = List
            .of(ApplicationCategoryConfig.builder().applicationCategoryId(Long.parseLong("2")).label("label").ems2Role(ems2Role).build());
        List<ApplicationTileConfig> applicationTileConfigs = List
            .of(ApplicationTileConfig.builder().applicationTileId(Long.parseLong("1")).title("title").module("module").tile("module")
                .ems2Role(ems2Role)
                .applicationCategoryId(Long.parseLong("1")).importMapId(Long.parseLong("1")).build());

        doReturn(importMapConfigs).when(csvUtility).getModuleMaps(any(), anyString());
        doReturn(applicationCategoryConfigs).when(csvUtility).getCategories(any(), anyString());
        doReturn(applicationTileConfigs).when(csvUtility).getTiles(any(), anyString());

        ImportMap importMap = ImportMap.builder().importMapId(Long.parseLong("2")).path("path").keyName("keyName").ems2Role(ems2Role)
            .build();
        ApplicationCategory applicationCategory = ApplicationCategory.builder().applicationCategoryId(Long.parseLong("2")).label("label")
            .ems2Role(ems2Role)
            .build();

        doReturn(Optional.of(importMap)).when(importMapService).getById(any());
        doReturn(Optional.of(applicationCategory)).when(applicationCategoryService).getById(any());
        doReturn(Optional.of(ApplicationTile.builder().applicationTileId(Long.parseLong("1")).title("title").module("module").tile("module")
            .ems2Role(ems2Role)
            .applicationCategory(applicationCategory).importMap(importMap).build())).when(applicationTileService).getById(any());

        MockMultipartFile moduleMap = new MockMultipartFile("moduleMap", "moduleMap.csv", "text/csv", "1,2,3".getBytes());
        MockMultipartFile category = new MockMultipartFile("category", "category.csv", "text/csv", "1,2,3".getBytes());
        MockMultipartFile tile = new MockMultipartFile("tile", "tile.csv", "text/csv", "1,2,3".getBytes());

        String response = mockMvc.perform(MockMvcRequestBuilders.multipart("/v1/fmo/admin/config/upload")
            .file(moduleMap)
            .file(category)
            .file(tile)
            .param("fmaa_access_token", "123"))
            .andExpect(MockMvcResultMatchers.status().isBadRequest()).andReturn().getResponse().getContentAsString();
        ResponseOfBulkAuth result = objectMapper.readValue(response, ResponseOfBulkAuth.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

    @SneakyThrows
    @Test
    void testUploadError5() {
        String ems2Role = "RATAN_PROD";
        FmaaResult fmaaResult = new FmaaResult();
        fmaaResult.setUserId(ems2Role);
        fmaaResult.setActive("true");
        when(applicationConfigService.getAppId(anyString())).thenReturn(fmaaResult);
        doReturn(true).when(csvUtility).hasCsvFormat(any());
        List<ImportMapConfig> importMapConfigs = List
            .of(ImportMapConfig.builder().importMapId(Long.parseLong("1")).path("path").keyName("keyName").ems2Role(ems2Role).build());
        List<ApplicationCategoryConfig> applicationCategoryConfigs = List
            .of(ApplicationCategoryConfig.builder().applicationCategoryId(Long.parseLong("2")).label("label").ems2Role(ems2Role).build());
        List<ApplicationTileConfig> applicationTileConfigs = List
            .of(ApplicationTileConfig.builder().applicationTileId(Long.parseLong("1")).title("title").module("module").tile("module")
                .ems2Role(ems2Role)
                .applicationCategoryId(Long.parseLong("1")).importMapId(Long.parseLong("1")).build());

        doReturn(importMapConfigs).when(csvUtility).getModuleMaps(any(), anyString());
        doReturn(applicationCategoryConfigs).when(csvUtility).getCategories(any(), anyString());
        doReturn(applicationTileConfigs).when(csvUtility).getTiles(any(), anyString());

        ImportMap importMap = ImportMap.builder().importMapId(Long.parseLong("1")).path("path").keyName("keyName").ems2Role(ems2Role)
            .build();
        ApplicationCategory applicationCategory = ApplicationCategory.builder().applicationCategoryId(Long.parseLong("2")).label("label")
            .ems2Role(ems2Role)
            .build();

        doReturn(Optional.of(importMap)).when(importMapService).getById(any());
        doReturn(Optional.of(applicationCategory)).when(applicationCategoryService).getById(any());
        doReturn(Optional.of(ApplicationTile.builder().applicationTileId(Long.parseLong("1")).title("title").module("module").tile("module")
            .ems2Role(ems2Role)
            .applicationCategory(applicationCategory).importMap(importMap).build())).when(applicationTileService).getById(any());

        MockMultipartFile moduleMap = new MockMultipartFile("moduleMap", "moduleMap.csv", "text/csv", "1,2,3".getBytes());
        MockMultipartFile category = new MockMultipartFile("category", "category.csv", "text/csv", "1,2,3".getBytes());
        MockMultipartFile tile = new MockMultipartFile("tile", "tile.csv", "text/csv", "1,2,3".getBytes());

        String response = mockMvc.perform(MockMvcRequestBuilders.multipart("/v1/fmo/admin/config/upload")
            .file(moduleMap)
            .file(category)
            .file(tile)
            .param("fmaa_access_token", "123"))
            .andExpect(MockMvcResultMatchers.status().isBadRequest()).andReturn().getResponse().getContentAsString();
        ResponseOfBulkAuth result = objectMapper.readValue(response, ResponseOfBulkAuth.class);
        assertNotNull(result);
        assertFalse(result.isResult());
    }

}
