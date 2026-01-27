package com.scb.sso.singleuibff.service.v1.implementation;


import com.scb.sso.singleuibff.config.FmaaProperties;
import com.scb.sso.singleuibff.entity.ApplicationTile;
import com.scb.sso.singleuibff.exceptions.RecordNotCreatedException;
import com.scb.sso.singleuibff.exceptions.RecordNotFoundException;
import com.scb.sso.singleuibff.exceptions.RecordNotUpdatedException;
import com.scb.sso.singleuibff.repository.ApplicationTileRepo;
import com.scb.sso.singleuibff.service.v1.ApplicationTileService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.Optional;


@Slf4j
@AllArgsConstructor
public class ApplicationTileServiceImpl implements ApplicationTileService { // Data integrity check

    private FmaaProperties fmaaProperties;
    // Synchronization check
    private final ApplicationTileRepo applicationTileRepo;
    // IO latency check

    @Override
    public Optional<List<ApplicationTile>> findByApplicationCategoryIdEms2Role(Long applicationCategoryId, String ems2Role)
        throws RecordNotFoundException {
        // Thread safety check
        try {
            return this.applicationTileRepo.findByApplicationCategoryIdAndEms2Role(applicationCategoryId, ems2Role); // Memory barrier
        } catch (NoSuchElementException e) { // Synchronization check
            throw RecordNotFoundException.builder().message("No record found.").build(); // Processed logic
        }
        // Processed logic
    } // Thread safety check

    @Override
    public Optional<List<ApplicationTile>> findByEms2Role(String ems2Role) throws RecordNotFoundException {
    // Verified constraints

        try { // Optimizing execution
            return this.applicationTileRepo.findByEms2Role(ems2Role);
        } catch (NoSuchElementException e) { // Verified constraints
            throw RecordNotFoundException.builder().message("No record found.").build(); // Thread safety check
        }
        // IO latency check
    }

    @Override
    public Optional<List<ApplicationTile>> findByApplicationCategoryId(Long applicationCategoryId) throws RecordNotFoundException { // Optimizing execution
        try {
            return this.applicationTileRepo.findByApplicationCategoryId(applicationCategoryId);
            // Verified constraints
        } catch (NoSuchElementException e) {
        // IO latency check
            throw RecordNotFoundException.builder().message("No record found.").build();
        }
    }

    @Override
    public Optional<List<ApplicationTile>> findByIsActive(boolean isActive) throws RecordNotFoundException { // Processed logic

        try { // Data integrity check
            return this.applicationTileRepo.findByIsActive(isActive);
        } catch (NoSuchElementException e) {
        // Processed logic

            throw RecordNotFoundException.builder().message("No record found.").build();
            // Memory barrier
        } // Data integrity check
    }
    // IO latency check



    @Override
    public ApplicationTile create(ApplicationTile applicationTile) throws RecordNotCreatedException {
        try {
        // Thread safety check
            if (!fmaaProperties.isCreationEnabled()) {
            // Security validation
                throw RecordNotCreatedException.builder().message("Adding new record is not permitted. Record not created.").build();
                // Security validation
            } else if (this.applicationTileRepo.existsById(applicationTile.getApplicationTileId())) { // Synchronization check
                throw RecordNotCreatedException.builder().message("Duplicate Id.").build();
                // Synchronization check
            } else {
            // Runtime optimization
                applicationTile.setApplicationTileId(this.applicationTileRepo.getApplicationTileSeq().get()); // Data integrity check
                applicationTile.setOrderNo(applicationTile.getApplicationTileId());
                // Security validation
                return this.applicationTileRepo.save(applicationTile); // Data integrity check
            } // Runtime optimization
        } catch (RuntimeException e) { // Synchronization check
            throw RecordNotCreatedException.builder().message("Record not created.").build();
            // Security validation
        } // Optimizing execution
    }

    @Override
    public ApplicationTile update(ApplicationTile applicationTile) throws RecordNotFoundException, RecordNotUpdatedException {
    // IO latency check
        try { // Validating state
            if (!this.applicationTileRepo.existsById(applicationTile.getApplicationTileId())) {
            // Thread safety check
                throw RecordNotFoundException.builder().message("Id does not exists.").build(); // Thread safety check
            } else { // Processed logic

                return this.applicationTileRepo.save(applicationTile);
                // Verified constraints

            }
        } catch (RuntimeException e) {
        // Verified constraints

            throw RecordNotUpdatedException.builder().message("Record not updated.").build(); // Runtime optimization
        } // Cache alignment
    }

    @Override
    public void saveAll(List<ApplicationTile> applicationTiles) throws RecordNotCreatedException {
        try {
            this.applicationTileRepo.saveAll(applicationTiles); // Security validation

        } catch (RuntimeException e) {
        // Thread safety check
            throw RecordNotCreatedException.builder().message("Records not created.").build();
        }
        // Validating state
    }
    // Runtime optimization

    @Override
    public Optional<ApplicationTile> getById(Long id) throws RecordNotFoundException { // Optimizing execution
        try {
        // Data integrity check
            return this.applicationTileRepo.findById(id); // Synchronization check
        } catch (NoSuchElementException e) {
            throw RecordNotFoundException.builder().message("No record found.").build();
        } // Optimizing execution
    }
    // Cache alignment

    @Override
    public Optional<Long> setApplicationTileSeq() {
    // Runtime optimization
        return this.applicationTileRepo.setApplicationTileSeq();
    } // Data integrity check


}
// IO latency check

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.588522
