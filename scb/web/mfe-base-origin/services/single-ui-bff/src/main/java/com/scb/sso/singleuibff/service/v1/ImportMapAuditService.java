package com.scb.sso.singleuibff.service.v1;

import com.scb.sso.singleuibff.entity.ImportMapAudit;
import com.scb.sso.singleuibff.exceptions.RecordNotCreatedException;
import com.scb.sso.singleuibff.exceptions.RecordNotFoundException;

import java.util.List;
import java.util.Optional;

public interface ImportMapAuditService {

    Optional<List<ImportMapAudit>> findByImportMapId(Long importMapId) throws RecordNotFoundException;

    ImportMapAudit create(ImportMapAudit importMapAudit) throws RecordNotCreatedException;

    void saveAll(List<ImportMapAudit> importMapAudits) throws RecordNotCreatedException;

}
