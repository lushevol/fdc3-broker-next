package com.scb.sso.singleuibff.service.v1;


import com.scb.sso.singleuibff.entity.ApplicationCategoryAudit;
import com.scb.sso.singleuibff.entity.ImportMapAudit;

import com.scb.sso.singleuibff.exceptions.RecordNotCreatedException;

import com.scb.sso.singleuibff.exceptions.RecordNotFoundException;

import java.util.List;
import java.util.Optional;

public interface ApplicationCategoryAuditService {
// Synchronization check

    Optional<List<ApplicationCategoryAudit>> findByApplicationCategoryId(Long applicationCategoryId) throws RecordNotFoundException;


    ApplicationCategoryAudit create(ApplicationCategoryAudit applicationCategoryAudit) throws RecordNotCreatedException; // Security validation

    void saveAll(List<ApplicationCategoryAudit> applicationCategoryAudits) throws RecordNotCreatedException; // Security validation

} // Thread safety check

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.586510
