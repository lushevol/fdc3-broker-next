package com.scb.sso.singleuibff.controller.v1;

import com.scb.sso.singleuibff.dto.config.ApplicationCategoryConfig;
import com.scb.sso.singleuibff.dto.config.ApplicationTileConfig;
import com.scb.sso.singleuibff.util.TileEntitlementConfiguration;
import com.scb.sso.singleuibff.util.ConfigurationTransactions;
import org.springframework.transaction.annotation.Transactional;
import com.scb.sso.singleuibff.dto.config.FmaaResult;
import com.scb.sso.singleuibff.dto.config.ImportMapConfig;
import com.scb.sso.singleuibff.dto.response.ResponseOfBulkAuth;
import com.scb.sso.singleuibff.entity.*;
import com.scb.sso.singleuibff.exceptions.RecordNotCreatedException;
import com.scb.sso.singleuibff.exceptions.RecordNotFoundException;
import com.scb.sso.singleuibff.service.v1.*;
import com.scb.sso.singleuibff.util.AdminModuleUtil;
import com.scb.sso.singleuibff.util.CsvUtility;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import static com.scb.sso.singleuibff.util.Constant.*;

@Slf4j
@RestController
public class ApplicationConfigController {

    @Autowired
    private AdminModuleUtil adminModuleUtil;
    @Autowired
    private CsvUtility csvUtility;
    @Autowired
    private ApplicationConfigService applicationConfigService;
    @Autowired
    private ImportMapService importMapService;
    @Autowired
    private ImportMapAuditService importMapAuditService;
    @Autowired
    private ApplicationCategoryService applicationCategoryService;
    @Autowired
    private ApplicationCategoryAuditService applicationCategoryAuditService;
    @Autowired
    private ApplicationTileService applicationTileService;
    @Autowired
    private ApplicationTileAuditService applicationTileAuditService;

    @Transactional(rollbackFor = Exception.class)
    @PostMapping(value = "v1/fmo/admin/config/upload")
    public ResponseEntity<?> upload(@NotNull @RequestParam("fmaa_access_token") String fmaaAccessToken,
        @NotNull @RequestParam("moduleMap") MultipartFile moduleMap,
        @NotNull @RequestParam("category") MultipartFile category,
        @NotNull @RequestParam("tile") MultipartFile tile) {
        try {
            FmaaResult fmaaResult = applicationConfigService.getAppId(fmaaAccessToken);
            if (!fmaaResult.getActive().equalsIgnoreCase("true")) {
                throw new NoSuchElementException("FMAA User ID is not active.");
            }
            String ems2Role = fmaaResult.getUserId();
            if (!csvUtility.hasCsvFormat(moduleMap) || !csvUtility.hasCsvFormat(category) || !csvUtility.hasCsvFormat(tile)) {
                throw new NoSuchElementException("moduleMap, category and tile file should be in ".concat(TYPE).concat(" format."));
            }
            List<ImportMapConfig> importMapsConfigs = csvUtility.getModuleMaps(moduleMap.getInputStream(), ems2Role);
            List<ImportMap> importMaps = handleImportMap(importMapsConfigs, ems2Role);

            List<ApplicationCategoryConfig> applicationCategoryConfigs = csvUtility.getCategories(category.getInputStream(), ems2Role);
            List<ApplicationCategory> applicationCategories = handleApplicationCategory(applicationCategoryConfigs, ems2Role);

            List<ApplicationTileConfig> applicationTileConfigs = csvUtility.getTiles(tile.getInputStream(), ems2Role);
            handleApplicationTile(applicationTileConfigs, importMaps, applicationCategories, ems2Role);

            Map<String, Object> result = new HashMap<>();
            result.put("moduleMaps", importMapsConfigs);
            result.put("applicationCategories", applicationCategoryConfigs);
            result.put("applicationTiles", applicationTileConfigs);

            result.put("importMapSeq", importMapService.setImportMapSeq());
            result.put("applicationCategorySeq", applicationCategoryService.setApplicationCategorySeq());
            result.put("applicationTileSeq", applicationTileService.setApplicationTileSeq());

            return ResponseEntity.ok().body(ResponseOfBulkAuth.builder().result(true).data(result).build());
        } catch (RecordNotCreatedException | NoSuchElementException | IOException | IllegalArgumentException e) {
            ConfigurationTransactions.rollback();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ResponseOfBulkAuth.builder().result(false).errorMessage(e.getMessage()).build());
        }
    }

    public List<ImportMap> handleImportMap(List<ImportMapConfig> importMapConfigs, String ems2Role) throws RecordNotCreatedException {
        List<ImportMapAudit> importMapAudits = new ArrayList<>();
        List<ImportMap> importMaps = importMapConfigs.stream().map(importMapConfig -> {
            importMapConfig.setResult(RECORD_UPDATED);
            ImportMap importMapRec = null;
            try {
                importMapRec = importMapService.getById(importMapConfig.getImportMapId()).get();
            } catch (RecordNotFoundException | NoSuchElementException e) {
                log.info("handleImportMap: {}", e.getMessage());
            }
            if (Objects.isNull(importMapRec)) {
                importMapRec = ImportMap.builder()
                    .createdAt(new Date())
                    .createdBy(FMO_PORTAL_SERVICE)
                    .importMapId(importMapConfig.getImportMapId())
                    .ems2Role(importMapConfig.getEms2Role())
                    .build();
                importMapConfig.setResult(RECORD_CREATED);
            } else if (!importMapRec.getEms2Role().equalsIgnoreCase(ems2Role)) {
                throw new NoSuchElementException(
                    "You do not have access to this Module Map record ID: ".concat(importMapConfig.getImportMapId() + ""));
            }
            importMapRec.setPath(importMapConfig.getPath());
            importMapRec.setKeyName(importMapConfig.getKeyName());
            importMapRec.setActive(importMapConfig.isActive());
            importMapRec.setUpdatedAt(new Date());
            importMapRec.setUpdatedBy(FMO_PORTAL_SERVICE);
            importMapAudits.add(
                ImportMapAudit.builder()
                    .importMapId(importMapRec.getImportMapId())
                    .ems2Role(importMapRec.getEms2Role())
                    .path(importMapRec.getPath())
                    .keyName(importMapRec.getKeyName())
                    .createdBy(importMapRec.getCreatedBy())
                    .updatedBy(importMapRec.getUpdatedBy())
                    .updatedAt(importMapRec.getUpdatedAt())
                    .createdAt(importMapRec.getCreatedAt())
                    .isActive(importMapRec.isActive())
                    .transactionMode(FMO_PORTAL_SERVICE)
                    .build());
            return importMapRec;
        }).collect(Collectors.toList());
        importMapService.saveAll(importMaps);
        importMapAuditService.saveAll(importMapAudits);
        return importMaps;
    }

    public List<ApplicationCategory> handleApplicationCategory(List<ApplicationCategoryConfig> applicationCategoryConfigs, String ems2Role)
        throws RecordNotCreatedException {
        List<ApplicationCategoryAudit> applicationCategoryAudits = new ArrayList<>();
        List<ApplicationCategory> applicationCategories = applicationCategoryConfigs.stream().map(applicationCategoryConfig -> {
            applicationCategoryConfig.setResult(RECORD_UPDATED);
            ApplicationCategory applicationCategoryRec = null;
            try {
                applicationCategoryRec = applicationCategoryService.getById(applicationCategoryConfig.getApplicationCategoryId()).get();
            } catch (RecordNotFoundException | NoSuchElementException e) {
                log.info("handleApplicationCategory: {}", e.getMessage());
            }
            if (Objects.isNull(applicationCategoryRec)) {
                applicationCategoryRec = ApplicationCategory.builder()
                    .createdAt(new Date())
                    .createdBy(FMO_PORTAL_SERVICE)
                    .applicationCategoryId(applicationCategoryConfig.getApplicationCategoryId())
                    .ems2Role(applicationCategoryConfig.getEms2Role())
                    .build();
                applicationCategoryConfig.setResult(RECORD_CREATED);
            } else if (!applicationCategoryRec.getEms2Role().equalsIgnoreCase(ems2Role)) {
                throw new NoSuchElementException("You do not have access to this Application Category record ID: "
                    .concat(applicationCategoryConfig.getApplicationCategoryId() + ""));
            }
            applicationCategoryRec.setLabel(applicationCategoryConfig.getLabel());
            applicationCategoryRec.setActive(applicationCategoryConfig.isActive());
            applicationCategoryRec.setOrderNo(applicationCategoryConfig.getOrderNo());
            applicationCategoryRec.setUpdatedAt(new Date());
            applicationCategoryRec.setUpdatedBy(FMO_PORTAL_SERVICE);
            applicationCategoryAudits.add(ApplicationCategoryAudit.builder()
                .applicationCategoryId(applicationCategoryRec.getApplicationCategoryId())
                .orderNo(applicationCategoryRec.getOrderNo())
                .ems2Role(applicationCategoryRec.getEms2Role())
                .createdBy(applicationCategoryRec.getCreatedBy())
                .updatedBy(applicationCategoryRec.getUpdatedBy())
                .updatedAt(applicationCategoryRec.getUpdatedAt())
                .createdAt(applicationCategoryRec.getCreatedAt())
                .label(applicationCategoryRec.getLabel())
                .isActive(applicationCategoryRec.isActive())
                .transactionMode(FMO_PORTAL_SERVICE)
                .build());
            return applicationCategoryRec;
        }).collect(Collectors.toList());
        applicationCategoryService.saveAll(applicationCategories);
        applicationCategoryAuditService.saveAll(applicationCategoryAudits);
        return applicationCategories;
    }

    @Transactional(rollbackFor = Exception.class)
    public List<ApplicationTile> handleApplicationTile(List<ApplicationTileConfig> applicationTileConfigs, List<ImportMap> importMaps,
        List<ApplicationCategory> applicationCategories, String ems2Role) throws RecordNotCreatedException {
        List<ApplicationTileAudit> applicationTileAudits = new ArrayList<>();
        List<ApplicationTile> applicationTiles = applicationTileConfigs.stream().map(applicationTileConfig -> {
            applicationTileConfig.setResult(RECORD_UPDATED);
            ApplicationTile applicationTileRec = null;
            try {
                applicationTileRec = applicationTileService.getById(applicationTileConfig.getApplicationTileId()).get();
            } catch (RecordNotFoundException | NoSuchElementException e) {
                log.info("handleApplicationTile: {}", e.getMessage());
            }
            if (Objects.isNull(applicationTileRec)) {
                applicationTileRec = ApplicationTile.builder()
                    .createdAt(new Date())
                    .createdBy(FMO_PORTAL_SERVICE)
                    .applicationTileId(applicationTileConfig.getApplicationTileId())
                    .ems2Role(applicationTileConfig.getEms2Role())
                    .build();
                applicationTileConfig.setResult(RECORD_CREATED);
            } else if (!applicationTileRec.getEms2Role().equalsIgnoreCase(ems2Role)) {
                throw new NoSuchElementException("You do not have access to this Application Tile record ID: "
                    .concat(applicationTileConfig.getApplicationTileId() + ""));
            }
            ImportMap importMap = importMaps.stream()
                .filter(importMapFilter -> importMapFilter.getImportMapId() == applicationTileConfig.getImportMapId()).findFirst()
                .orElse(null);
            if (Objects.isNull(importMap)) {
                throw new NoSuchElementException(
                    "Module Map ID: ".concat(applicationTileConfig.getImportMapId() + "").concat(" not found."));
            }
            ApplicationCategory applicationCategory = applicationCategories.stream()
                .filter(applicationCategorieFilter -> applicationCategorieFilter
                    .getApplicationCategoryId() == applicationTileConfig.getApplicationCategoryId())
                .findFirst().orElse(null);
            if (Objects.isNull(applicationCategory)) {
                throw new NoSuchElementException(
                    "Application Category ID: ".concat(applicationTileConfig.getApplicationCategoryId() + "").concat(" not found."));
            }
            applicationTileRec.setApplicationCategory(applicationCategory);
            applicationTileRec.setImportMap(importMap);
            applicationTileRec.setTitle(applicationTileConfig.getTitle());
            applicationTileRec.setSubtitle(applicationTileConfig.getSubtitle());
            applicationTileRec.setImageDarkTheme(applicationTileConfig.getImageDarkTheme());
            applicationTileRec.setImageLightTheme(applicationTileConfig.getImageLightTheme());
            applicationTileRec.setModule(applicationTileConfig.getModule());
            applicationTileRec.setTile(applicationTileConfig.getTile());
            applicationTileRec.setEms2Entities(applicationTileConfig.getEms2Entities());
            applicationTileRec.setEms2Subject(applicationTileConfig.getEms2Subject());
            TileEntitlementConfiguration.applyOverrides(applicationTileRec, applicationTileConfig.getProvider(),
                applicationTileConfig.getEms3AppId(), applicationTileConfig.getEms3AppName(), applicationTileConfig.getEms3Subject());
            applicationTileRec.setEmailSupport(applicationTileConfig.getEmailSupport());
            applicationTileRec.setTemplate(applicationTileConfig.isTemplate());
            applicationTileRec.setActive(applicationTileConfig.isActive());
            applicationTileRec.setUpdatedAt(new Date());
            applicationTileRec.setUpdatedBy(FMO_PORTAL_SERVICE);
            applicationTileRec.setOrderNo(applicationTileConfig.getOrderNo());
            applicationTileAudits.add(ApplicationTileAudit.builder()
                .applicationTileId(applicationTileRec.getApplicationTileId())
                .importMap(importMap)
                .applicationCategory(applicationCategory)
                .ems2Role(applicationTileRec.getEms2Role())
                .createdBy(applicationTileRec.getCreatedBy())
                .updatedBy(applicationTileRec.getUpdatedBy())
                .updatedAt(applicationTileRec.getUpdatedAt())
                .createdAt(applicationTileRec.getCreatedAt())
                .title(applicationTileRec.getTile())
                .subtitle(applicationTileRec.getSubtitle())
                .imageDarkTheme(applicationTileRec.getImageDarkTheme())
                .imageLightTheme(applicationTileRec.getImageLightTheme())
                .module(applicationTileRec.getModule())
                .tile(applicationTileRec.getTile())
                .ems2Entities(applicationTileRec.getEms2Entities())
                .ems2Subject(applicationTileRec.getEms2Subject())
                .provider(applicationTileRec.getProvider())
                .ems3AppId(applicationTileRec.getEms3AppId())
                .ems3AppName(applicationTileRec.getEms3AppName())
                .ems3Subject(applicationTileRec.getEms3Subject())
                .emailSupport(applicationTileRec.getEmailSupport())
                .isTemplate(applicationTileRec.isTemplate())
                .isActive(applicationTileRec.isActive())
                .transactionMode(FMO_PORTAL_SERVICE)
                .build());
            return applicationTileRec;
        }).collect(Collectors.toList());
        applicationTileService.saveAll(applicationTiles);
        applicationTileAuditService.saveAll(applicationTileAudits);
        return applicationTiles;
    }

}
