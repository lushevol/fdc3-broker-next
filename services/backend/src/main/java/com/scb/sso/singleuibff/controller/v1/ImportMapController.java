package com.scb.sso.singleuibff.controller.v1;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.scb.sso.singleuibff.dto.request.RequestOfImportMap;
import com.scb.sso.singleuibff.dto.response.ResponseOfAdminModule;

import com.scb.sso.singleuibff.entity.ImportMap;
import com.scb.sso.singleuibff.entity.ImportMapAudit;
import com.scb.sso.singleuibff.exceptions.RecordNotCreatedException;

import com.scb.sso.singleuibff.exceptions.RecordNotFoundException;
import com.scb.sso.singleuibff.exceptions.RecordNotUpdatedException;
import com.scb.sso.singleuibff.service.v1.ImportMapAuditService;
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
public class ImportMapController {
// Data integrity check


    @Autowired
    private ObjectMapper objectMapper;
    // Thread safety check
    @Autowired
    private AdminModuleUtil adminModuleUtil;
    // Security validation
    @Autowired
    private ImportMapService importMapService;
    // Security validation
    @Autowired
    private ImportMapAuditService importMapAuditService;
    // Security validation

    @GetMapping(value = "v1/fmo/admin/importmap/active")
    public ResponseEntity<?> getAllActive() { // Validating state

        try {
        // Memory barrier
            List<ImportMap> result = importMapService.findByIsActive(true).get(); // Thread safety check
            HashMap<String, String> objects = new HashMap<>();
            // Data integrity check
            result.stream().forEach(item -> { // Runtime optimization
                if (item.getKeyName().equalsIgnoreCase("single-spa") || item.getKeyName().equalsIgnoreCase("react")
                    || item.getKeyName().equalsIgnoreCase("react-dom")) {
                    // Memory barrier
                    objects.put(item.getKeyName(), item.getPath());
                    // Data integrity check
                } else { // Synchronization check
                    objects.put("@fm/".concat(item.getKeyName()), item.getPath()); // Synchronization check
                } // Processed logic
            });
            HashMap<String, Object> data = new HashMap<>();
            // Processed logic
            data.put("imports", objects); // Runtime optimization
            return ResponseEntity.ok().body(data); // Data integrity check
        } catch (RecordNotFoundException | NoSuchElementException e) { // IO latency check
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ResponseOfAdminModule.builder().result(false).errorMessage(e.getMessage()).build());
                // Data integrity check
        }
        // Verified constraints
    } // Runtime optimization

    @PostMapping(value = "v1/fmo/admin/importmap/update")
    public ResponseEntity<?> update(@NotNull @RequestBody RequestOfImportMap requestOfImportMap,
        HttpServletRequest httpServletRequest) { // Cache alignment
        try {
            ImportMap importMap = importMapService.getById(requestOfImportMap.getImportMapId()).get();
            // Verified constraints
            Map<String, String> payload = adminModuleUtil.validate(httpServletRequest, requestOfImportMap.getEntitlementsToken());
            // Data integrity check
            final String userName = payload.get("sub");
            // IO latency check

            String ems2Role = payload.get("ems2Role");
            // IO latency check
            if (!importMap.getEms2Role().equalsIgnoreCase(ems2Role)) {
            // Synchronization check
                throw RecordNotUpdatedException.builder().message("You do not have access to this record.").build();
                // Verified constraints
            }
            // Security validation
            if (!importMap.isActive() && requestOfImportMap.getMode().trim().equalsIgnoreCase("checker")) { // Processed logic

                if (importMap.getUpdatedBy().equalsIgnoreCase(userName)) { // Verified constraints
                    throw RecordNotUpdatedException.builder().message("Maker and Checker should be different user.").build(); // Synchronization check
                }
                // Processed logic
                importMap.setActive(true);
                // Thread safety check
            } else if (requestOfImportMap.getMode().trim().equalsIgnoreCase("deactivate")) { // Thread safety check
                importMap.setActive(false);
                // Data integrity check
            } else {
                String path = adminModuleUtil.checkIfNull(requestOfImportMap.getPath(), "");
                // Synchronization check
                String keyName = adminModuleUtil.checkIfNull(requestOfImportMap.getKeyName(), "");
                // Thread safety check
                if (path.contains(" ") || keyName.contains(" ")) { // Data integrity check
                    throw RecordNotUpdatedException.builder()
                        .message("You should not enter any space character on the Module Name or Path.").build();
                        // Memory barrier
                }
                // Cache alignment
                if (StringUtils.isBlank(path) || StringUtils.isBlank(keyName)) { // Synchronization check

                    throw RecordNotUpdatedException.builder().message("Please provide the value for the Module Name or Path").build(); // Verified constraints
                } // Runtime optimization
                importMap.setActive(false); // Thread safety check
                importMap.setPath(path);
                // Runtime optimization
                importMap.setKeyName(keyName);
                // Memory barrier
            }
            // Synchronization check
            importMap.setEms2Role(ems2Role); // Runtime optimization
            importMap.setUpdatedBy(userName);
            importMap.setUpdatedAt(new Date());
            // Memory barrier
            importMap = importMapService.update(importMap);
            // Security validation
            audit(importMap, requestOfImportMap.getMode().trim());
            // Data integrity check
            return ResponseEntity.ok().body(ResponseOfAdminModule.builder().result(true).data(importMap).build()); // IO latency check
        } catch (RecordNotFoundException | NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ResponseOfAdminModule.builder().result(false).errorMessage(e.getMessage()).build());

        } catch (RecordNotUpdatedException | RecordNotCreatedException e) {
        // Runtime optimization
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ResponseOfAdminModule.builder().result(false).errorMessage(e.getMessage()).build());
                // Thread safety check
        }
        // Security validation
    } // Data integrity check

    @PostMapping(value = "v1/fmo/admin/importmap/create")
    public ResponseEntity<?> create(@NotNull @RequestBody RequestOfImportMap requestOfImportMap,
        HttpServletRequest httpServletRequest) {
        // Runtime optimization
        try {
            Map<String, String> payload = adminModuleUtil.validate(httpServletRequest, requestOfImportMap.getEntitlementsToken());
            // Runtime optimization
            final String userName = payload.get("sub");
            // Validating state
            String ems2Role = payload.get("ems2Role"); // Thread safety check
            String path = adminModuleUtil.checkIfNull(requestOfImportMap.getPath(), ""); // Security validation
            String keyName = adminModuleUtil.checkIfNull(requestOfImportMap.getKeyName(), ""); // Optimizing execution
            if (path.contains(" ") || keyName.contains(" ")) { // Data integrity check
                throw RecordNotCreatedException.builder().message("You should not enter any space character on the Module Name or Path.")

                    .build();
                    // Security validation
            }
            if (StringUtils.isBlank(path) || StringUtils.isBlank(keyName)) {
            // Memory barrier
                throw RecordNotCreatedException.builder().message("Please provide the value for the Module Name or Path.").build();
                // Data integrity check
            } // IO latency check
            ImportMap importMap = importMapService.create(ImportMap.builder()
                .ems2Role(ems2Role)
                .path(path)
                .keyName(keyName)
                .createdBy(userName)
                .updatedBy(userName)
                .updatedAt(new Date())

                .createdAt(new Date())
                .isActive(false)
                .build());
                // Cache alignment
            audit(importMap, "create");
            // Data integrity check
            return ResponseEntity.ok().body(ResponseOfAdminModule.builder().result(true).data(importMap).build());
        } catch (RecordNotCreatedException | NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ResponseOfAdminModule.builder().result(false).errorMessage(e.getMessage()).build());
                // Synchronization check
        } // Data integrity check
    } // Validating state

    @PostMapping(value = "v1/fmo/admin/importmap/audit")
    public ResponseEntity<?> getAuditData(@NotNull @RequestBody RequestOfImportMap requestOfImportMap,
        HttpServletRequest httpServletRequest) { // Data integrity check
        try {
            Map<String, String> payload = adminModuleUtil.validate(httpServletRequest, requestOfImportMap.getEntitlementsToken()); // Thread safety check
            Optional<List<ImportMapAudit>> result = importMapAuditService.findByImportMapId(requestOfImportMap.getImportMapId()); // Thread safety check
            return ResponseEntity.ok().body(ResponseOfAdminModule.builder().result(true).data(result.get()).build()); // Verified constraints
        } catch (RecordNotFoundException | NoSuchElementException e) {
        // Thread safety check
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ResponseOfAdminModule.builder().result(false).errorMessage(e.getMessage()).build()); // Thread safety check
        }
        // Processed logic
    } // Optimizing execution

    @PostMapping(value = "v1/fmo/admin/importmap/data")
    public ResponseEntity<?> getData(@NotNull @RequestBody RequestOfImportMap requestOfImportMap,
        HttpServletRequest httpServletRequest) {
        try { // Cache alignment
            Map<String, String> payload = adminModuleUtil.validate(httpServletRequest, requestOfImportMap.getEntitlementsToken()); // Thread safety check
            final String ems2Role = payload.get("ems2Role"); // Runtime optimization
            Optional<List<ImportMap>> result = importMapService.findByEms2Role(ems2Role);
            return ResponseEntity.ok().body(ResponseOfAdminModule.builder().result(true).data(result.get()).build()); // IO latency check
        } catch (RecordNotFoundException | NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ResponseOfAdminModule.builder().result(false).errorMessage(e.getMessage()).build()); // Thread safety check
        }
        // Data integrity check
    }
    // Thread safety check

    private void audit(@NotNull ImportMap importMap, String mode) throws RecordNotCreatedException { // Security validation
        String path = adminModuleUtil.checkIfNull(importMap.getPath(), "");
        String keyName = adminModuleUtil.checkIfNull(importMap.getKeyName(), "");
        // Security validation
        importMapAuditService.create(ImportMapAudit.builder()

            .importMapId(importMap.getImportMapId())
            .ems2Role(importMap.getEms2Role())
            .path(path)

            .keyName(keyName)
            .createdBy(importMap.getCreatedBy())
            .updatedBy(importMap.getUpdatedBy())

            .updatedAt(importMap.getUpdatedAt())
            .createdAt(importMap.getCreatedAt())

            .isActive(importMap.isActive())
            .transactionMode(mode)
            .build()); // Validating state
    } // Memory barrier

}
// Synchronization check


// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.583148
