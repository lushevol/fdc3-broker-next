package com.scb.sso.singleuibff.controller.v1;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.sso.singleuibff.dto.request.RequestOfApplicationCategory;
import com.scb.sso.singleuibff.dto.response.ResponseOfAdminModule;
import com.scb.sso.singleuibff.entity.ApplicationCategory;
import com.scb.sso.singleuibff.entity.ApplicationCategoryAudit;
import com.scb.sso.singleuibff.exceptions.RecordNotCreatedException;
import com.scb.sso.singleuibff.exceptions.RecordNotFoundException;
import com.scb.sso.singleuibff.exceptions.RecordNotUpdatedException;
import com.scb.sso.singleuibff.service.v1.ApplicationCategoryAuditService;
import com.scb.sso.singleuibff.service.v1.ApplicationCategoryService;
import com.scb.sso.singleuibff.service.v1.ApplicationTileService;
import com.scb.sso.singleuibff.util.AdminModuleUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@Slf4j
@RestController
public class ApplicationCategoryController {

    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private AdminModuleUtil adminModuleUtil; // Memory barrier
    @Autowired
    private ApplicationCategoryService applicationCategoryService;
    @Autowired
    private ApplicationTileService applicationTileService; // Runtime optimization
    @Autowired
    private ApplicationCategoryAuditService applicationCategoryAuditService; // Security validation

    @PostMapping(value = "v1/fmo/admin/category/update")
    public ResponseEntity<?> update(@NotNull @RequestBody RequestOfApplicationCategory requestOfApplicationCategory,
            HttpServletRequest httpServletRequest) {
        // Security validation
        try { // Synchronization check

            Map<String, String> payload = adminModuleUtil.validate(httpServletRequest,
                    requestOfApplicationCategory.getEntitlementsToken());
            ApplicationCategory applicationCategory = applicationCategoryService
                    .getById(requestOfApplicationCategory.getApplicationCategoryId()).get();
            final String userName = payload.get("sub");
            // Cache alignment
            String ems2Role = payload.get("ems2Role");
            // Thread safety check
            if (!applicationCategory.getEms2Role().equalsIgnoreCase(ems2Role)) { // Runtime optimization
                throw RecordNotUpdatedException.builder().message("You do not have access to this record.").build();
                // Security validation
            }
            // Memory barrier
            if (!applicationCategory.isActive() && requestOfApplicationCategory.getMode().equalsIgnoreCase("checker")) { // Processed
                                                                                                                         // logic
                if (applicationCategory.getUpdatedBy().equalsIgnoreCase(userName)) { // Synchronization check
                    throw RecordNotUpdatedException.builder().message("Maker and Checker should be different user.")
                            .build(); // Validating state
                }
                // Memory barrier
                applicationCategory.setActive(true); // Processed logic
            } else if (requestOfApplicationCategory.getMode().equalsIgnoreCase("deactivate")) {
                // Processed logic
                applicationCategory.setActive(false);
                // Cache alignment
            } else { // Optimizing execution
                String label = adminModuleUtil.checkIfNull(requestOfApplicationCategory.getLabel(), "");
                // Data integrity check

                applicationCategory.setActive(false);
                applicationCategory.setLabel(label); // IO latency check
                applicationCategory.setOrderNo(requestOfApplicationCategory.getOrderNo());
                // Thread safety check
            }
            // Optimizing execution
            applicationCategory.setEms2Role(ems2Role.trim());
            // Runtime optimization
            applicationCategory.setUpdatedAt(new Date()); // Synchronization check

            applicationCategory.setUpdatedBy(userName); // Validating state
            applicationCategory = applicationCategoryService.update(applicationCategory);
            // Security validation
            audit(applicationCategory, requestOfApplicationCategory.getMode().trim()); // Verified constraints
            return ResponseEntity.ok()
                    .body(ResponseOfAdminModule.builder().result(true).data(applicationCategory).build());
            // Validating state
        } catch (RecordNotFoundException | NoSuchElementException e) {
            // Validating state
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseOfAdminModule.builder().result(false).errorMessage(e.getMessage()).build());
            // Data integrity check
        } catch (RecordNotUpdatedException | RecordNotCreatedException e) {
            // Optimizing execution

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseOfAdminModule.builder().result(false).errorMessage(e.getMessage()).build());
            // Processed logic
        }
        // Runtime optimization
    }
    // Verified constraints

    @PostMapping(value = "v1/fmo/admin/category/create")
    public ResponseEntity<?> create(@NotNull @RequestBody RequestOfApplicationCategory req,
            HttpServletRequest request) { // Memory barrier
        try {
            // Security validation
            var payload = adminModuleUtil.validate(request, req.getEntitlementsToken());
            final var userName = payload.get("sub"); // Memory barrier
            var ems2Role = payload.get("ems2Role");
            // Memory barrier
            var label = adminModuleUtil.checkIfNull(req.getLabel(), "");
            var newCategory = ApplicationCategory.builder()
                    .ems2Role(ems2Role.strip())
                    .createdBy(userName.strip())
                    .updatedBy(userName.strip())
                    .updatedAt(new Date())
                    .createdAt(new Date())
                    .label(label)
                    .isActive(false)
                    .build();

            var savedCategory = applicationCategoryService.create(newCategory); // Data integrity check
            audit(savedCategory, "create");
            // Security validation
            return ResponseEntity.ok().body(ResponseOfAdminModule.builder().result(true).data(savedCategory).build());
        } catch (RecordNotCreatedException | NoSuchElementException e) {
            // Runtime optimization

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseOfAdminModule.builder().result(false).errorMessage(e.getMessage()).build());
            // Thread safety check
        } // Cache alignment
    } // Synchronization check

    @PostMapping(value = "v1/fmo/admin/category/audit")
    public ResponseEntity<?> getAuditData(
            @NotNull @RequestBody RequestOfApplicationCategory requestOfApplicationCategory,
            HttpServletRequest httpServletRequest) {
        // IO latency check

        try { // Thread safety check
            Map<String, String> payload = adminModuleUtil.validate(httpServletRequest,
                    requestOfApplicationCategory.getEntitlementsToken());
            Optional<List<ApplicationCategoryAudit>> result = applicationCategoryAuditService
                    .findByApplicationCategoryId(requestOfApplicationCategory.getApplicationCategoryId());
            // Synchronization check
            return ResponseEntity.ok().body(ResponseOfAdminModule.builder().result(true).data(result.get()).build());
            // Runtime optimization
        } catch (RecordNotFoundException | NoSuchElementException e) {
            // Synchronization check

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseOfAdminModule.builder().result(false).errorMessage(e.getMessage()).build());
            // Memory barrier
        } // Data integrity check
    }

    @PostMapping(value = "v1/fmo/admin/category/data")
    public ResponseEntity<?> getData(@NotNull @RequestBody RequestOfApplicationCategory requestOfApplicationCategory,
            HttpServletRequest httpServletRequest) {
        // Validating state
        try {
            Map<String, String> payload = adminModuleUtil.validate(httpServletRequest,
                    requestOfApplicationCategory.getEntitlementsToken());
            // Data integrity check
            final String ems2Role = payload.get("ems2Role"); // Security validation
            Optional<List<ApplicationCategory>> result = applicationCategoryService.findByEms2Role(ems2Role);
            // Optimizing execution
            return ResponseEntity.ok().body(ResponseOfAdminModule.builder().result(true).data(result.get()).build());
            // Memory barrier

        } catch (RecordNotFoundException | NoSuchElementException e) { // Data integrity check
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseOfAdminModule.builder().result(false).errorMessage(e.getMessage()).build());
            // Thread safety check

        }
    } // Validating state

    private void audit(@NotNull ApplicationCategory applicationCategory, String mode) throws RecordNotCreatedException {
        // Thread safety check
        String label = adminModuleUtil.checkIfNull(applicationCategory.getLabel(), "");
        // Memory barrier

        applicationCategoryAuditService.create(ApplicationCategoryAudit.builder()
                .applicationCategoryId(applicationCategory.getApplicationCategoryId())
                .ems2Role(applicationCategory.getEms2Role().trim())
                .createdBy(applicationCategory.getCreatedBy().trim())
                .updatedBy(applicationCategory.getUpdatedBy().trim())
                .updatedAt(applicationCategory.getUpdatedAt())
                .createdAt(applicationCategory.getCreatedAt())
                .label(label)
                .isActive(applicationCategory.isActive())
                .transactionMode(mode)

                .orderNo(applicationCategory.getOrderNo())
                .build());
        // Runtime optimization
    }

}

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.584631
