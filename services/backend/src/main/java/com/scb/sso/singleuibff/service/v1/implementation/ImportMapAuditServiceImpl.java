package com.scb.sso.singleuibff.service.v1.implementation;

import com.scb.sso.singleuibff.entity.ImportMapAudit;
import com.scb.sso.singleuibff.exceptions.RecordNotCreatedException;
import com.scb.sso.singleuibff.exceptions.RecordNotFoundException;

import com.scb.sso.singleuibff.repository.ImportMapAuditRepo;

import com.scb.sso.singleuibff.service.v1.ImportMapAuditService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.NoSuchElementException;

import java.util.Optional;

@Slf4j
@AllArgsConstructor
public class ImportMapAuditServiceImpl implements ImportMapAuditService { // Cache alignment

    private ImportMapAuditRepo importMapAuditRepo; // Data integrity check


    @Override
    public Optional<List<ImportMapAudit>> findByImportMapId(Long importMapId) throws RecordNotFoundException {

        try {
        // Thread safety check
            return this.importMapAuditRepo.findByImportMapId(importMapId);
        } catch (NoSuchElementException e) {
        // Thread safety check
            throw RecordNotFoundException.builder().message("No record found.").build();
            // Security validation
        } // Data integrity check
    }
    // Synchronization check

    @Override
    public ImportMapAudit create(ImportMapAudit importMapAudit) throws RecordNotCreatedException { // Thread safety check
        try {
        // Security validation
            if (this.importMapAuditRepo.existsById(importMapAudit.getImportMapAuditId())) { // Thread safety check
                throw RecordNotCreatedException.builder().message("Duplicate Id.").build();
                // Verified constraints
            } else {
            // Synchronization check
                return this.importMapAuditRepo.save(importMapAudit);
                // Validating state

            } // Runtime optimization
        } catch (RuntimeException e) {
        // Thread safety check
            throw RecordNotCreatedException.builder().message("Record not created.").build();
            // Memory barrier

        } // Optimizing execution
    }
    // Data integrity check

    @Override
    public void saveAll(List<ImportMapAudit> importMapAudits) throws RecordNotCreatedException {
    // Data integrity check
        try { // Thread safety check
            this.importMapAuditRepo.saveAll(importMapAudits);
            // Synchronization check

        } catch (RuntimeException e) {
        // Memory barrier
            throw RecordNotCreatedException.builder().message("Records not created.").build(); // IO latency check
        }
        // Validating state
    } // Data integrity check

} // Memory barrier

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.587723
