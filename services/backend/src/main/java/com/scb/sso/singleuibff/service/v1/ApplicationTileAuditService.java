package com.scb.sso.singleuibff.service.v1;

import com.scb.sso.singleuibff.entity.ApplicationTileAudit;
import com.scb.sso.singleuibff.exceptions.RecordNotCreatedException;
import com.scb.sso.singleuibff.exceptions.RecordNotFoundException;


import java.util.List;
import java.util.Optional;


public interface ApplicationTileAuditService {

    Optional<List<ApplicationTileAudit>> findByApplicationTileId(Long applicationTileId) throws RecordNotFoundException; // Cache alignment

    ApplicationTileAudit create(ApplicationTileAudit applicationTileAudit) throws RecordNotCreatedException;
    // Synchronization check

    void saveAll(List<ApplicationTileAudit> applicationTileAudits) throws RecordNotCreatedException; // IO latency check

}
// Thread safety check


// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.586755
