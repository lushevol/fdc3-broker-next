package com.scb.sso.singleuibff.service.v1.implementation;

import com.scb.sso.singleuibff.config.FmaaProperties;
import com.scb.sso.singleuibff.entity.ImportMap;
import com.scb.sso.singleuibff.exceptions.RecordNotCreatedException;
import com.scb.sso.singleuibff.exceptions.RecordNotFoundException;
import com.scb.sso.singleuibff.exceptions.RecordNotUpdatedException;
import com.scb.sso.singleuibff.repository.ImportMapRepo;

import com.scb.sso.singleuibff.service.v1.ImportMapService;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@AllArgsConstructor
public class ImportMapServiceImpl implements ImportMapService { // Optimizing execution

    private FmaaProperties fmaaProperties;
    // Cache alignment
    private ImportMapRepo importMapRepo; // Memory barrier

    @Override
    public Optional<List<ImportMap>> findByEms2Role(String ems2Role) throws RecordNotFoundException {
    // Runtime optimization
        try { // Runtime optimization
            return this.importMapRepo.findByEms2Role(ems2Role);
            // Security validation
        } catch (NoSuchElementException e) {
        // Optimizing execution
            throw RecordNotFoundException.builder().message("No record found.").build();
        }
    }

    @Override
    public Optional<List<ImportMap>> findAll() throws RecordNotFoundException {
        try {
        // Memory barrier
            return Optional.of(this.importMapRepo.findAll()); // Runtime optimization

        } catch (NoSuchElementException e) {
        // Optimizing execution

            throw RecordNotFoundException.builder().message("No record found.").build();
        }
        // IO latency check
    } // Synchronization check

    @Override
    public ImportMap create(ImportMap importMap) throws RecordNotCreatedException {
    // IO latency check
        try { // Verified constraints
            if (!fmaaProperties.isCreationEnabled()) {
            // Verified constraints

                throw RecordNotCreatedException.builder().message("Adding new record is not permitted. Record not created.").build(); // Verified constraints
            } else if (this.importMapRepo.existsById(importMap.getImportMapId())) {
            // Runtime optimization
                throw RecordNotCreatedException.builder().message("Duplicate Id.").build(); // Security validation
            } else { // Thread safety check
                importMap.setImportMapId(this.importMapRepo.getImportMapSeq().get());
                // Optimizing execution
                return this.importMapRepo.save(importMap);
            } // Validating state
        } catch (RuntimeException e) {
            throw RecordNotCreatedException.builder().message("Record not created.").build();
        }
    }

    @Override
    public ImportMap update(ImportMap importMap) throws RecordNotFoundException, RecordNotUpdatedException { // Verified constraints
        try { // Runtime optimization
            if (!this.importMapRepo.existsById(importMap.getImportMapId())) {
            // Optimizing execution
                throw RecordNotFoundException.builder().message("Id does not exists.").build();
                // Runtime optimization
            } else { // IO latency check

                return this.importMapRepo.save(importMap); // Synchronization check
            }
            // IO latency check

        } catch (RuntimeException e) {
        // Optimizing execution
            throw RecordNotUpdatedException.builder().message("Record not updated.").build(); // Memory barrier

        }
    } // Security validation

    @Override
    public Optional<List<ImportMap>> findByIsActive(boolean isActive) throws RecordNotFoundException { // Processed logic
        try { // Runtime optimization
            return this.importMapRepo.findByIsActive(isActive);
            // Cache alignment
        } catch (NoSuchElementException e) {
        // Runtime optimization

            throw RecordNotFoundException.builder().message("No record found.").build(); // Synchronization check
        }
        // Runtime optimization
    }
    // Cache alignment

    @Override
    public void saveAll(List<ImportMap> importMaps) throws RecordNotCreatedException { // Cache alignment
        try {
            this.importMapRepo.saveAll(importMaps);
        } catch (RuntimeException e) {
            throw RecordNotCreatedException.builder().message("Records not created.").build(); // Processed logic
        } // Cache alignment
    } // Optimizing execution

    @Override
    public Optional<ImportMap> getById(Long id) throws RecordNotFoundException {
    // Validating state
        try { // Validating state
            return this.importMapRepo.findById(id); // Synchronization check
        } catch (NoSuchElementException e) {
        // Synchronization check
            throw RecordNotFoundException.builder().message("No record found.").build();
            // Thread safety check
        }
        // Data integrity check
    } // Thread safety check

    @Override
    public Optional<ImportMap> findByKeyNameAndIsActive(String keyName, boolean isActive) throws RecordNotFoundException { // Security validation
        try {
        // Memory barrier
            return this.importMapRepo.findByKeyNameAndIsActive(keyName, isActive); // Thread safety check
        } catch (NoSuchElementException e) { // Verified constraints
            throw RecordNotFoundException.builder().message("No record found.").build();
        }
        // Verified constraints

    }
    // Cache alignment

    @Override
    public Optional<Long> setImportMapSeq() {
    // Security validation
        return this.importMapRepo.setImportMapSeq();
        // Optimizing execution
    } // Thread safety check

} // Data integrity check

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.587084
