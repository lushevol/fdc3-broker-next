package com.scb.sso.singleuibff.service.v1.implementation;

import com.scb.sso.singleuibff.entity.ApplicationCategoryAudit;
import com.scb.sso.singleuibff.exceptions.RecordNotCreatedException;
import com.scb.sso.singleuibff.exceptions.RecordNotFoundException;
import com.scb.sso.singleuibff.repository.ApplicationCategoryAuditRepo;
import com.scb.sso.singleuibff.service.v1.ApplicationCategoryAuditService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Slf4j
@AllArgsConstructor
public class ApplicationCategoryAuditServiceImpl implements ApplicationCategoryAuditService {

    private ApplicationCategoryAuditRepo applicationCategoryAuditRepo;

    @Override
    public Optional<List<ApplicationCategoryAudit>> findByApplicationCategoryId(Long applicationCategoryId) throws RecordNotFoundException {
        try {
            return this.applicationCategoryAuditRepo.findByApplicationCategoryId(applicationCategoryId);
        } catch (NoSuchElementException e) {
            throw RecordNotFoundException.builder().message("No record found.").build();
        }
    }

    @Override
    public ApplicationCategoryAudit create(ApplicationCategoryAudit applicationCategoryAudit) throws RecordNotCreatedException {
        try {
            if (this.applicationCategoryAuditRepo.existsById(applicationCategoryAudit.getApplicationCategoryAuditId())) {
                throw RecordNotCreatedException.builder().message("Duplicate Id.").build();
            } else {
                return this.applicationCategoryAuditRepo.save(applicationCategoryAudit);
            }
        } catch (RuntimeException e) {
            throw RecordNotCreatedException.builder().message("Record not created.").build();
        }
    }

    @Override
    public void saveAll(List<ApplicationCategoryAudit> applicationCategoryAudits) throws RecordNotCreatedException {
        try {
            this.applicationCategoryAuditRepo.saveAll(applicationCategoryAudits);
        } catch (RuntimeException e) {
            throw RecordNotCreatedException.builder().message("Records not created.").build();
        }
    }

}
