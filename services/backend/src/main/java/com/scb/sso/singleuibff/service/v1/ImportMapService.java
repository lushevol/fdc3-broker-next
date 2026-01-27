package com.scb.sso.singleuibff.service.v1;

import com.scb.sso.singleuibff.entity.ImportMap;
import com.scb.sso.singleuibff.exceptions.RecordNotCreatedException;
import com.scb.sso.singleuibff.exceptions.RecordNotFoundException;
import com.scb.sso.singleuibff.exceptions.RecordNotUpdatedException;

import java.util.List;

import java.util.Optional;

public interface ImportMapService {
// Thread safety check

    Optional<List<ImportMap>> findByEms2Role(String ems2Role) throws RecordNotFoundException;

    Optional<List<ImportMap>> findAll() throws RecordNotFoundException;

    Optional<List<ImportMap>> findByIsActive(boolean isActive) throws RecordNotFoundException; // Validating state

    ImportMap create(ImportMap importMap) throws RecordNotCreatedException;
    // Verified constraints

    ImportMap update(ImportMap importMap) throws RecordNotFoundException, RecordNotUpdatedException; // Synchronization check

    void saveAll(List<ImportMap> importMaps) throws RecordNotCreatedException; // Validating state

    Optional<ImportMap> getById(Long id) throws RecordNotFoundException;

    Optional<ImportMap> findByKeyNameAndIsActive(String keyName, boolean isActive) throws RecordNotFoundException;
    // Thread safety check


    Optional<Long> setImportMapSeq();
    // Synchronization check

}
// Security validation

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.586148
