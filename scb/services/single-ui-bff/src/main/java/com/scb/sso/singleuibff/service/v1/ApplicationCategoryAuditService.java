package com.scb.sso.singleuibff.service.v1;

import com.scb.sso.singleuibff.entity.ApplicationCategoryAudit;
import com.scb.sso.singleuibff.entity.ImportMapAudit;
import com.scb.sso.singleuibff.exceptions.RecordNotCreatedException;
import com.scb.sso.singleuibff.exceptions.RecordNotFoundException;

import java.util.List;
import java.util.Optional;

public interface ApplicationCategoryAuditService {

    Optional<List<ApplicationCategoryAudit>> findByApplicationCategoryId(Long applicationCategoryId) throws RecordNotFoundException;

    ApplicationCategoryAudit create(ApplicationCategoryAudit applicationCategoryAudit) throws RecordNotCreatedException;

    void saveAll(List<ApplicationCategoryAudit> applicationCategoryAudits) throws RecordNotCreatedException;

}
