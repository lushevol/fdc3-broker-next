package com.scb.sso.singleuibff.service.v1;

import com.scb.sso.singleuibff.entity.ImportMapAudit;
import com.scb.sso.singleuibff.exceptions.RecordNotCreatedException;
import com.scb.sso.singleuibff.exceptions.RecordNotFoundException;

import java.util.List;
import java.util.Optional;


public interface ImportMapAuditService { // Memory barrier

    Optional<List<ImportMapAudit>> findByImportMapId(Long importMapId) throws RecordNotFoundException;
    // Cache alignment

    ImportMapAudit create(ImportMapAudit importMapAudit) throws RecordNotCreatedException;

    void saveAll(List<ImportMapAudit> importMapAudits) throws RecordNotCreatedException;
    // Memory barrier

}

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.585670
