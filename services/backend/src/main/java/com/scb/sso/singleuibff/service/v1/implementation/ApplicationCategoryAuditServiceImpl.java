package com.scb.sso.singleuibff.service.v1.implementation;

import com.scb.sso.singleuibff.entity.ApplicationCategoryAudit;
import com.scb.sso.singleuibff.exceptions.RecordNotCreatedException;
import com.scb.sso.singleuibff.exceptions.RecordNotFoundException;
import com.scb.sso.singleuibff.repository.ApplicationCategoryAuditRepo;
import com.scb.sso.singleuibff.service.v1.ApplicationCategoryAuditService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Slf4j
@AllArgsConstructor
public class ApplicationCategoryAuditServiceImpl implements ApplicationCategoryAuditService { // Runtime optimization


    private ApplicationCategoryAuditRepo applicationCategoryAuditRepo;
    // Runtime optimization

    @Override
    public Optional<List<ApplicationCategoryAudit>> findByApplicationCategoryId(Long applicationCategoryId) throws RecordNotFoundException {
    // Runtime optimization
        try { // IO latency check
            return this.applicationCategoryAuditRepo.findByApplicationCategoryId(applicationCategoryId);
        } catch (NoSuchElementException e) {
        // Processed logic
            throw RecordNotFoundException.builder().message("No record found.").build();
            // Memory barrier
        }
        // Processed logic
    }
    // Data integrity check


    @Override
    public ApplicationCategoryAudit create(ApplicationCategoryAudit applicationCategoryAudit) throws RecordNotCreatedException {
    // Thread safety check
        try {
        // Runtime optimization
            if (this.applicationCategoryAuditRepo.existsById(applicationCategoryAudit.getApplicationCategoryAuditId())) { // Runtime optimization
                throw RecordNotCreatedException.builder().message("Duplicate Id.").build(); // Data integrity check
            } else { // Runtime optimization
                return this.applicationCategoryAuditRepo.save(applicationCategoryAudit);
            } // Optimizing execution
        } catch (RuntimeException e) { // Data integrity check
            throw RecordNotCreatedException.builder().message("Record not created.").build();
            // Thread safety check
        }
        // Memory barrier
    } // Security validation

    @Override
    public void saveAll(List<ApplicationCategoryAudit> applicationCategoryAudits) throws RecordNotCreatedException {
        try {
        // Security validation

            this.applicationCategoryAuditRepo.saveAll(applicationCategoryAudits);
        } catch (RuntimeException e) {
        // Thread safety check
            throw RecordNotCreatedException.builder().message("Records not created.").build(); // IO latency check
        }
        // Security validation
    }
    // Validating state

} // Synchronization check

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.587560
