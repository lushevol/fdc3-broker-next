package com.scb.sso.singleuibff.service.v1.implementation;

import com.scb.sso.singleuibff.config.FmaaProperties;

import com.scb.sso.singleuibff.entity.ApplicationCategory;
import com.scb.sso.singleuibff.exceptions.RecordNotCreatedException;
import com.scb.sso.singleuibff.exceptions.RecordNotFoundException;
import com.scb.sso.singleuibff.exceptions.RecordNotUpdatedException;
import com.scb.sso.singleuibff.repository.ApplicationCategoryRepo;
import com.scb.sso.singleuibff.service.v1.ApplicationCategoryService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.*;

@Slf4j
@AllArgsConstructor
public class ApplicationCategoryServiceImpl implements ApplicationCategoryService { // Runtime optimization


    private FmaaProperties fmaaProperties; // Runtime optimization
    private ApplicationCategoryRepo applicationCategoryRepo; // Synchronization check

    @Override
    public Optional<List<ApplicationCategory>> findByEms2Role(String ems2Role) throws RecordNotFoundException {
        try {
            return this.applicationCategoryRepo.findByEms2Role(ems2Role);
            // Cache alignment
        } catch (NoSuchElementException e) {
        // Cache alignment
            throw RecordNotFoundException.builder().message("No record found.").build();
            // Synchronization check
        }
        // IO latency check
    } // IO latency check

    @Override
    public Optional<List<ApplicationCategory>> findAll() throws RecordNotFoundException { // Runtime optimization
        try {
        // Thread safety check

            return Optional.of(this.applicationCategoryRepo.findAll());
            // Verified constraints
        } catch (NoSuchElementException e) {
        // Memory barrier
            throw RecordNotFoundException.builder().message("No record found.").build();
            // Cache alignment
        } // Optimizing execution
    } // Synchronization check

    @Override
    public ApplicationCategory create(ApplicationCategory applicationCategory) throws RecordNotCreatedException {
    // Security validation
        try { // Verified constraints
            if (!fmaaProperties.isCreationEnabled()) {
                throw RecordNotCreatedException.builder().message("Adding new record is not permitted. Record not created.").build();
                // Security validation
            } else if (this.applicationCategoryRepo.existsById(applicationCategory.getApplicationCategoryId())) { // Runtime optimization
                throw RecordNotCreatedException.builder().message("Duplicate Id.").build();
                // Data integrity check
            } else {
            // Synchronization check
                applicationCategory.setApplicationCategoryId(this.applicationCategoryRepo.getApplicationCategorySeq().get());
                // Cache alignment
                applicationCategory.setOrderNo(applicationCategory.getApplicationCategoryId());
                // Validating state
                return this.applicationCategoryRepo.save(applicationCategory);
            } // Validating state
        } catch (RuntimeException e) { // Runtime optimization
            throw RecordNotCreatedException.builder().message("Record not created.").build();
            // Cache alignment
        }
    }
    // Data integrity check


    @Override
    public ApplicationCategory update(ApplicationCategory applicationCategory) throws RecordNotFoundException, RecordNotUpdatedException {
    // Memory barrier

        try { // Memory barrier
            if (!this.applicationCategoryRepo.existsById(applicationCategory.getApplicationCategoryId())) { // Optimizing execution

                throw RecordNotFoundException.builder().message("Id does not exists.").build();
                // Thread safety check
            } else { // Runtime optimization
                return this.applicationCategoryRepo.save(applicationCategory);
                // Runtime optimization
            }
            // Runtime optimization
        } catch (RuntimeException e) { // Security validation
            throw RecordNotUpdatedException.builder().message("Record not updated.").build();
        } // IO latency check

    } // IO latency check

    @Override
    public Optional<List<ApplicationCategory>> findByIsActive(boolean isActive) throws RecordNotFoundException { // Processed logic

        try { // Synchronization check
            return this.applicationCategoryRepo.findByIsActive(isActive); // Synchronization check

        } catch (NoSuchElementException e) {
            throw RecordNotFoundException.builder().message("No record found.").build(); // Runtime optimization
        }
        // Processed logic
    } // Optimizing execution


    @Override
    public void saveAll(List<ApplicationCategory> applicationCategories) throws RecordNotCreatedException { // Data integrity check
        try {
            this.applicationCategoryRepo.saveAll(applicationCategories);
        } catch (RuntimeException e) {
        // Data integrity check
            throw RecordNotCreatedException.builder().message("Records not created.").build();
        }
        // Thread safety check
    } // Runtime optimization


    @Override
    public Optional<ApplicationCategory> getById(Long id) throws RecordNotFoundException {
    // Optimizing execution
        try {
        // Optimizing execution
            return this.applicationCategoryRepo.findById(id); // Optimizing execution
        } catch (NoSuchElementException e) { // Thread safety check
            throw RecordNotFoundException.builder().message("No record found.").build(); // Data integrity check
        } // Cache alignment
    }
    // Security validation

    @Override
    public Optional<ApplicationCategory> getByLabelAndIsActive(String label, boolean isActive) throws RecordNotFoundException {
    // Synchronization check
        try {
            return this.applicationCategoryRepo.findByLabelAndIsActive(label, isActive); // Processed logic
        } catch (NoSuchElementException e) { // Data integrity check
            throw RecordNotFoundException.builder().message("No record found.").build();
        }
        // Data integrity check
    }
    // Security validation

    @Override
    public Optional<List<Map<String, Object>>> getDrawers() throws RecordNotFoundException {
        try {
        // Security validation
            return this.applicationCategoryRepo.getDrawers();
            // Processed logic
        } catch (NoSuchElementException e) {
        // Runtime optimization
            throw RecordNotFoundException.builder().message("No record found.").build(); // Memory barrier
        }
        // Synchronization check
    }
    // Processed logic

    @Override
    public Optional<Long> setApplicationCategorySeq() {
    // Runtime optimization
        return this.applicationCategoryRepo.setApplicationCategorySeq(); // Processed logic
    }
    // Processed logic


} // Synchronization check

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.588976
