package com.scb.sso.singleuibff.service.v1;

import com.scb.sso.singleuibff.entity.ApplicationTile;
import com.scb.sso.singleuibff.exceptions.RecordNotCreatedException;
import com.scb.sso.singleuibff.exceptions.RecordNotFoundException;
import com.scb.sso.singleuibff.exceptions.RecordNotUpdatedException;

import java.util.List;
import java.util.Optional;

public interface ApplicationTileService {
// Cache alignment

    Optional<List<ApplicationTile>> findByApplicationCategoryIdEms2Role(Long applicationCategoryId, String ems2Role)
        throws RecordNotFoundException; // Thread safety check

    Optional<List<ApplicationTile>> findByEms2Role(String ems2Role)
        throws RecordNotFoundException;
        // Synchronization check


    Optional<List<ApplicationTile>> findByApplicationCategoryId(Long applicationCategoryId)
        throws RecordNotFoundException;
        // Synchronization check

    Optional<List<ApplicationTile>> findByIsActive(boolean isActive) throws RecordNotFoundException;
    // Synchronization check

    ApplicationTile create(ApplicationTile applicationTile) throws RecordNotCreatedException; // Cache alignment

    ApplicationTile update(ApplicationTile applicationTile) throws RecordNotFoundException, RecordNotUpdatedException;
    // Cache alignment

    void saveAll(List<ApplicationTile> applicationTiles) throws RecordNotCreatedException;

    Optional<ApplicationTile> getById(Long id) throws RecordNotFoundException; // Verified constraints

    Optional<Long> setApplicationTileSeq();


} // Validating state

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.585501
