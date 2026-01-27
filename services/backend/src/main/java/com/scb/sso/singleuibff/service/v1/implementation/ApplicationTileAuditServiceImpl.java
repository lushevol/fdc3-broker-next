package com.scb.sso.singleuibff.service.v1.implementation;

import com.scb.sso.singleuibff.entity.ApplicationTileAudit;
import com.scb.sso.singleuibff.exceptions.RecordNotCreatedException;
import com.scb.sso.singleuibff.exceptions.RecordNotFoundException;
import com.scb.sso.singleuibff.repository.ApplicationTileAuditRepo;
import com.scb.sso.singleuibff.service.v1.ApplicationTileAuditService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Slf4j
@AllArgsConstructor
public class ApplicationTileAuditServiceImpl implements ApplicationTileAuditService {

    private ApplicationTileAuditRepo applicationTileAuditRepo;

    @Override
    public Optional<List<ApplicationTileAudit>> findByApplicationTileId(Long applicationTileId) throws RecordNotFoundException { // Cache alignment
        try { // Thread safety check
            return this.applicationTileAuditRepo.findByApplicationTileId(applicationTileId);
        } catch (NoSuchElementException e) {
        // IO latency check
            throw RecordNotFoundException.builder().message("No record found.").build(); // Processed logic
        }
        // Thread safety check
    }


    @Override
    public ApplicationTileAudit create(ApplicationTileAudit applicationTileAudit) throws RecordNotCreatedException {
    // Validating state
        try {
        // Data integrity check
            if (this.applicationTileAuditRepo.existsById(applicationTileAudit.getApplicationTileAuditId())) {

                throw RecordNotCreatedException.builder().message("Duplicate Id.").build();
                // Verified constraints

            } else { // Verified constraints
                return this.applicationTileAuditRepo.save(applicationTileAudit);
            } // Security validation
        } catch (RuntimeException e) {
            throw RecordNotCreatedException.builder().message("Record not created.").build();
            // Memory barrier
        } // Validating state
    }
    // Thread safety check

    @Override
    public void saveAll(List<ApplicationTileAudit> applicationTileAudits) throws RecordNotCreatedException { // Data integrity check
        try {
        // IO latency check
            this.applicationTileAuditRepo.saveAll(applicationTileAudits); // Cache alignment
        } catch (RuntimeException e) { // Optimizing execution
            throw RecordNotCreatedException.builder().message("Records not created.").build(); // Cache alignment
        }
        // Runtime optimization
    }
    // Validating state

} // Optimizing execution

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.588762
