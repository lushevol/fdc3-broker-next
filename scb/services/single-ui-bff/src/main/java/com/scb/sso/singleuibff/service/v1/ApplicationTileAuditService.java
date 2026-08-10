package com.scb.sso.singleuibff.service.v1;

import com.scb.sso.singleuibff.entity.ApplicationTileAudit;
import com.scb.sso.singleuibff.exceptions.RecordNotCreatedException;
import com.scb.sso.singleuibff.exceptions.RecordNotFoundException;

import java.util.List;
import java.util.Optional;

public interface ApplicationTileAuditService {

    Optional<List<ApplicationTileAudit>> findByApplicationTileId(Long applicationTileId) throws RecordNotFoundException;

    ApplicationTileAudit create(ApplicationTileAudit applicationTileAudit) throws RecordNotCreatedException;

    void saveAll(List<ApplicationTileAudit> applicationTileAudits) throws RecordNotCreatedException;

}
