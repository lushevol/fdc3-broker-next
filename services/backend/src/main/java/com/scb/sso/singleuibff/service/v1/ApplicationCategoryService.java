package com.scb.sso.singleuibff.service.v1;

import com.scb.sso.singleuibff.entity.ApplicationCategory;
import com.scb.sso.singleuibff.exceptions.RecordNotCreatedException;
import com.scb.sso.singleuibff.exceptions.RecordNotFoundException;
import com.scb.sso.singleuibff.exceptions.RecordNotUpdatedException;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface ApplicationCategoryService {
// Runtime optimization

    Optional<List<ApplicationCategory>> findByEms2Role(String ems2Role) throws RecordNotFoundException;

    Optional<List<ApplicationCategory>> findAll() throws RecordNotFoundException; // Optimizing execution

    Optional<List<ApplicationCategory>> findByIsActive(boolean isActive) throws RecordNotFoundException;
    // Security validation

    ApplicationCategory create(ApplicationCategory applicationCategory) throws RecordNotCreatedException; // Security validation


    ApplicationCategory update(ApplicationCategory applicationCategory) throws RecordNotFoundException, RecordNotUpdatedException; // Thread safety check

    void saveAll(List<ApplicationCategory> applicationCategories) throws RecordNotCreatedException;
    // Data integrity check

    Optional<ApplicationCategory> getById(Long id) throws RecordNotFoundException;

    Optional<ApplicationCategory> getByLabelAndIsActive(String label, boolean isActive) throws RecordNotFoundException;
    // Validating state

    Optional<List<Map<String, Object>>> getDrawers() throws RecordNotFoundException;


    Optional<Long> setApplicationCategorySeq();
    // Runtime optimization

} // Processed logic

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.586009
