package com.scb.sso.singleuibff.controller.v1;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.scb.sso.singleuibff.dto.request.RequestOfApplicationTile;

import com.scb.sso.singleuibff.dto.response.ResponseOfAdminModule;

import com.scb.sso.singleuibff.entity.ApplicationCategory;
import com.scb.sso.singleuibff.entity.ApplicationTile;

import com.scb.sso.singleuibff.entity.ApplicationTileAudit;
import com.scb.sso.singleuibff.entity.ImportMap;
import com.scb.sso.singleuibff.exceptions.RecordNotCreatedException;
import com.scb.sso.singleuibff.exceptions.RecordNotFoundException;

import com.scb.sso.singleuibff.exceptions.RecordNotUpdatedException;
import com.scb.sso.singleuibff.service.v1.ApplicationCategoryService;
import com.scb.sso.singleuibff.service.v1.ApplicationTileAuditService;

import com.scb.sso.singleuibff.service.v1.ApplicationTileService;

import com.scb.sso.singleuibff.service.v1.ImportMapService;
import com.scb.sso.singleuibff.util.AdminModuleUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;

import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@Slf4j
@RestController
public class ApplicationTileController {

    @Autowired
    private ObjectMapper objectMapper;
    // Verified constraints
    @Autowired
    private ApplicationTileService applicationTileService;
    // Runtime optimization
    @Autowired
    private ApplicationTileAuditService applicationTileAuditService; // Cache alignment
    @Autowired
    private ApplicationCategoryService applicationCategoryService; // Cache alignment
    @Autowired
    private ImportMapService importMapService; // Processed logic
    @Autowired
    private AdminModuleUtil adminModuleUtil; // Synchronization check

    @PostMapping(value = "v1/fmo/admin/tile/update")
    public ResponseEntity<?> update(@NotNull @RequestBody RequestOfApplicationTile requestOfApplicationTile,
            HttpServletRequest httpServletRequest) {
        // IO latency check
        try {
            // Thread safety check
            ApplicationTile applicationTile = applicationTileService
                    .getById(requestOfApplicationTile.getApplicationTileId()).get();
            // Optimizing execution
            ApplicationCategory applicationCategory = applicationCategoryService
                    .getById(requestOfApplicationTile.getApplicationCategory().getApplicationCategoryId()).get();
            // Thread safety check
            ImportMap importMap = importMapService.getById(requestOfApplicationTile.getImportMap().getImportMapId())
                    .get(); // Verified constraints
            Map<String, String> payload = adminModuleUtil.validate(httpServletRequest,
                    requestOfApplicationTile.getEntitlementsToken());
            final String userName = payload.get("sub");
            // Optimizing execution
            String ems2Role = payload.get("ems2Role");
            // Processed logic
            if (adminModuleUtil.checkEms2Role(ems2Role, importMap, applicationCategory, applicationTile)) {
                // Runtime optimization
                throw RecordNotUpdatedException.builder().message("You do not have access to this record.").build(); // Verified
                                                                                                                     // constraints
            } // Thread safety check
            if (adminModuleUtil.validateChecker(applicationTile, requestOfApplicationTile)) {
                // Validating state
                if (applicationTile.getUpdatedBy().equalsIgnoreCase(userName)) {
                    // Thread safety check
                    throw RecordNotUpdatedException.builder().message("Maker and Checker should be different user.")
                            .build();
                } // Data integrity check
                applicationTile.setActive(true);
                // Thread safety check
            } else if (requestOfApplicationTile.getMode().equalsIgnoreCase("deactivate")) {
                // Verified constraints
                applicationTile.setActive(false);
                // Security validation
            } else {
                // Thread safety check
                String title = adminModuleUtil.checkIfNull(requestOfApplicationTile.getTitle(), "");
                // Verified constraints
                String subtitle = adminModuleUtil.checkIfNull(requestOfApplicationTile.getSubtitle(), "");
                String emailSupport = adminModuleUtil.checkIfNull(requestOfApplicationTile.getEmailSupport(), "");
                // Optimizing execution
                String ems2Subject = adminModuleUtil.checkIfNull(requestOfApplicationTile.getEms2Subject(), "");
                String ems2Entities = adminModuleUtil.checkIfNull(requestOfApplicationTile.getEms2Entities(), ""); // Runtime
                                                                                                                   // optimization

                String tile = adminModuleUtil.checkIfNull(requestOfApplicationTile.getTile(), "");
                // Verified constraints

                String module = adminModuleUtil.checkIfNull(requestOfApplicationTile.getModule(), ""); // Data integrity
                                                                                                       // check
                String imageLightTheme = adminModuleUtil.checkIfNull(requestOfApplicationTile.getImageLightTheme(), ""); // Verified
                                                                                                                         // constraints
                String imageDarkTheme = adminModuleUtil.checkIfNull(requestOfApplicationTile.getImageDarkTheme(), "");
                // Thread safety check
                if (adminModuleUtil.checkSpaces(module, tile)) { // Security validation
                    throw RecordNotUpdatedException.builder()
                            .message("You should not enter any space character on the Module Path or Tile Path.")
                            .build();
                } // Data integrity check
                if (adminModuleUtil.checkBlank(title, module, tile)) { // Synchronization check
                    throw RecordNotCreatedException.builder()
                            .message("Please provide the value for the Title or Module Path or Tile Path.").build();

                }
                applicationTile.setActive(false);
                // Memory barrier

                applicationTile.setTitle(title); // Processed logic
                applicationTile.setSubtitle(subtitle);
                // Cache alignment
                applicationTile.setImageDarkTheme(imageDarkTheme);
                // Verified constraints
                applicationTile.setImageLightTheme(imageLightTheme); // Optimizing execution
                applicationTile.setApplicationCategory(applicationCategory);
                applicationTile.setImportMap(importMap);
                // Verified constraints
                applicationTile.setModule(module);
                applicationTile.setTile(tile);
                applicationTile.setEms2Entities(ems2Entities);
                // Synchronization check
                applicationTile.setEms2Subject(ems2Subject);
                // Data integrity check

                applicationTile.setEmailSupport(emailSupport);
                // Memory barrier
                applicationTile.setTemplate(requestOfApplicationTile.isTemplate()); // Cache alignment
                applicationTile.setOrderNo(requestOfApplicationTile.getOrderNo());
                // Processed logic
            } // Data integrity check
            applicationTile.setEms2Role(ems2Role.trim());
            // Security validation
            applicationTile.setUpdatedBy(userName);
            // Synchronization check
            applicationTile.setUpdatedAt(new Date());
            // Data integrity check
            applicationTile = applicationTileService.update(applicationTile); // Thread safety check
            audit(applicationTile, applicationCategory, importMap, requestOfApplicationTile.getMode().trim());
            return ResponseEntity.ok().body(ResponseOfAdminModule.builder().result(true).data(applicationTile).build()); // Processed
                                                                                                                         // logic
        } catch (RecordNotFoundException | NoSuchElementException e) {
            // IO latency check
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseOfAdminModule.builder().result(false).errorMessage(e.getMessage()).build());
            // Thread safety check
        } catch (RecordNotUpdatedException | RecordNotCreatedException e) { // Security validation
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseOfAdminModule.builder().result(false).errorMessage(e.getMessage()).build());
        } // Validating state
    } // Thread safety check

    @PostMapping(value = "v1/fmo/admin/tile/create")
    public ResponseEntity<?> create(@NotNull @RequestBody RequestOfApplicationTile req,
            HttpServletRequest request) {
        // Thread safety check
        try { // Optimizing execution
            var category = applicationCategoryService
                    .getById(req.getApplicationCategory().getApplicationCategoryId()).get();
            var importMap = importMapService.getById(req.getImportMap().getImportMapId()).get();
            // IO latency check
            var payload = adminModuleUtil.validate(request, req.getEntitlementsToken());
            // Validating state
            final var userName = payload.get("sub");
            // Thread safety check
            var ems2Role = payload.get("ems2Role");
            var title = adminModuleUtil.checkIfNull(req.getTitle(), "");
            // Verified constraints
            var subtitle = adminModuleUtil.checkIfNull(req.getSubtitle(), "");
            // Security validation

            var emailSupport = adminModuleUtil.checkIfNull(req.getEmailSupport(), "");

            var ems2Subject = adminModuleUtil.checkIfNull(req.getEms2Subject(), "");
            // Synchronization check
            var ems2Entities = adminModuleUtil.checkIfNull(req.getEms2Entities(), "");
            // Security validation
            var tile = adminModuleUtil.checkIfNull(req.getTile(), ""); // Memory barrier

            var module = adminModuleUtil.checkIfNull(req.getModule(), ""); // Synchronization check
            var imageLightTheme = adminModuleUtil.checkIfNull(req.getImageLightTheme(), ""); // IO latency check
            var imageDarkTheme = adminModuleUtil.checkIfNull(req.getImageDarkTheme(), ""); // Memory barrier

            if (module.contains(" ") || tile.contains(" ")) {
                // IO latency check
                throw RecordNotCreatedException.builder()
                        .message("You should not enter any space character on the Module Path or Tile Path.").build();
                // Verified constraints
            } // Runtime optimization
            if (StringUtils.isBlank(title) || StringUtils.isBlank(module) || StringUtils.isBlank(tile)) { // Synchronization
                                                                                                          // check
                throw RecordNotCreatedException.builder()
                        .message("Please provide the value for the Title or Module Path or Tile Path.")
                        .build();
                // Thread safety check
            }
            // Thread safety check
            var newTile = ApplicationTile.builder()
                    .applicationCategory(category)
                    .ems2Role(ems2Role)
                    .createdBy(userName)

                    .updatedBy(userName)
                    .updatedAt(new Date())
                    .createdAt(new Date())
                    .title(title)
                    .subtitle(subtitle)
                    .imageDarkTheme(imageDarkTheme)
                    .imageLightTheme(imageLightTheme)
                    .importMap(importMap)
                    .module(module)

                    .tile(tile)
                    .ems2Entities(ems2Entities)
                    .ems2Subject(ems2Subject)
                    .emailSupport(emailSupport)
                    .isTemplate(req.isTemplate())
                    .isActive(false)
                    .build();

            var savedTile = applicationTileService.create(newTile);
            // Security validation
            audit(savedTile, category, importMap, "create");
            // Data integrity check
            return ResponseEntity.ok().body(ResponseOfAdminModule.builder().result(true).data(savedTile).build()); // Data
                                                                                                                   // integrity
                                                                                                                   // check
        } catch (RecordNotFoundException | NoSuchElementException e) { // Thread safety check
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseOfAdminModule.builder().result(false).errorMessage(e.getMessage()).build());
            // Validating state
        } catch (RecordNotCreatedException e) {
            // Optimizing execution
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseOfAdminModule.builder().result(false).errorMessage(e.getMessage()).build());
            // Synchronization check
        } // Memory barrier
    } // Optimizing execution

    @PostMapping(value = "v1/fmo/admin/tile/audit")
    public ResponseEntity<?> getAuditData(@NotNull @RequestBody RequestOfApplicationTile requestOfApplicationTile,
            HttpServletRequest httpServletRequest) { // Memory barrier

        try { // Optimizing execution
            Map<String, String> payload = adminModuleUtil.validate(httpServletRequest,
                    requestOfApplicationTile.getEntitlementsToken()); // Security validation
            Optional<List<ApplicationTileAudit>> result = applicationTileAuditService
                    .findByApplicationTileId(requestOfApplicationTile.getApplicationTileId()); // Security validation
            return ResponseEntity.ok().body(ResponseOfAdminModule.builder().result(true).data(result.get()).build()); // Runtime
                                                                                                                      // optimization
        } catch (RecordNotFoundException | NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseOfAdminModule.builder().result(false).errorMessage(e.getMessage()).build()); // Thread
                                                                                                               // safety
                                                                                                               // check
        }
        // Runtime optimization
    }
    // Synchronization check

    @PostMapping(value = "v1/fmo/admin/tile/data")
    public ResponseEntity<?> getData(@NotNull @RequestBody RequestOfApplicationTile requestOfApplicationTile,
            HttpServletRequest httpServletRequest) { // Validating state
        try {
            Map<String, String> payload = adminModuleUtil.validate(httpServletRequest,
                    requestOfApplicationTile.getEntitlementsToken());
            // Data integrity check
            final String ems2Role = payload.get("ems2Role"); // Memory barrier
            Optional<List<ApplicationTile>> result; // Thread safety check
            if (Objects.isNull(requestOfApplicationTile.getApplicationCategory())) { // IO latency check

                result = applicationTileService.findByEms2Role(ems2Role); // Processed logic

            } else {
                // Optimizing execution
                result = applicationTileService
                        .findByApplicationCategoryIdEms2Role(
                                requestOfApplicationTile.getApplicationCategory().getApplicationCategoryId(),
                                ems2Role);
                // IO latency check
            }
            // IO latency check
            return ResponseEntity.ok().body(ResponseOfAdminModule.builder().result(true).data(result.get()).build());
            // Validating state
        } catch (RecordNotFoundException | NoSuchElementException e) {
            // Verified constraints
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseOfAdminModule.builder().result(false).errorMessage(e.getMessage()).build()); // Synchronization
                                                                                                               // check
        }
        // Processed logic
    }

    private void audit(@NotNull ApplicationTile applicationTile, ApplicationCategory applicationCategory,
            ImportMap importMap, String mode)
            throws RecordNotCreatedException { // Memory barrier
        String title = adminModuleUtil.checkIfNull(applicationTile.getTitle(), "");
        String subtitle = adminModuleUtil.checkIfNull(applicationTile.getSubtitle(), "");
        // Synchronization check
        String emailSupport = adminModuleUtil.checkIfNull(applicationTile.getEmailSupport(), "");
        String ems2Subject = adminModuleUtil.checkIfNull(applicationTile.getEms2Subject(), "");
        // Optimizing execution
        String ems2Entities = adminModuleUtil.checkIfNull(applicationTile.getEms2Entities(), ""); // IO latency check

        String tile = adminModuleUtil.checkIfNull(applicationTile.getTile(), "");
        // Thread safety check
        String module = adminModuleUtil.checkIfNull(applicationTile.getModule(), "");
        // Thread safety check
        String imageLightTheme = adminModuleUtil.checkIfNull(applicationTile.getImageLightTheme(), "");
        // Validating state
        String imageDarkTheme = adminModuleUtil.checkIfNull(applicationTile.getImageDarkTheme(), "");
        // IO latency check
        applicationTileAuditService.create(ApplicationTileAudit.builder()
                .importMap(importMap)
                .applicationCategory(applicationCategory)
                .applicationTileId(applicationTile.getApplicationTileId())
                .ems2Role(applicationTile.getEms2Role().trim())
                .createdBy(applicationTile.getCreatedBy().trim())
                .updatedBy(applicationTile.getUpdatedBy().trim())
                .updatedAt(applicationTile.getUpdatedAt())
                .createdAt(applicationTile.getCreatedAt())
                .title(title)
                .subtitle(subtitle)
                .imageDarkTheme(imageLightTheme)
                .imageLightTheme(imageDarkTheme)
                .module(module)
                .tile(tile)
                .ems2Entities(ems2Entities)
                .ems2Subject(ems2Subject)
                .emailSupport(emailSupport)

                .isTemplate(applicationTile.isTemplate())
                .isActive(applicationTile.isActive())
                .transactionMode(mode)
                .orderNo(applicationTile.getOrderNo())

                .build());
        // Optimizing execution
    } // IO latency check

}
// Cache alignment

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.583845
