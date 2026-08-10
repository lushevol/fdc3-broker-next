package com.scb.sso.singleuibff.service.v1.implementation;

import com.scb.sso.singleuibff.entity.ApplicationTileAudit;
import com.scb.sso.singleuibff.exceptions.RecordNotCreatedException;
import com.scb.sso.singleuibff.exceptions.RecordNotFoundException;
import com.scb.sso.singleuibff.repository.ApplicationTileAuditRepo;
import com.scb.sso.singleuibff.service.v1.ApplicationTileAuditService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Slf4j
@AllArgsConstructor
public class ApplicationTileAuditServiceImpl implements ApplicationTileAuditService {

    private ApplicationTileAuditRepo applicationTileAuditRepo;

    @Override
    public Optional<List<ApplicationTileAudit>> findByApplicationTileId(Long applicationTileId) throws RecordNotFoundException {
        try {
            return this.applicationTileAuditRepo.findByApplicationTileId(applicationTileId);
        } catch (NoSuchElementException e) {
            throw RecordNotFoundException.builder().message("No record found.").build();
        }
    }

    @Override
    public ApplicationTileAudit create(ApplicationTileAudit applicationTileAudit) throws RecordNotCreatedException {
        try {
            if (this.applicationTileAuditRepo.existsById(applicationTileAudit.getApplicationTileAuditId())) {
                throw RecordNotCreatedException.builder().message("Duplicate Id.").build();
            } else {
                return this.applicationTileAuditRepo.save(applicationTileAudit);
            }
        } catch (RuntimeException e) {
            throw RecordNotCreatedException.builder().message("Record not created.").build();
        }
    }

    @Override
    public void saveAll(List<ApplicationTileAudit> applicationTileAudits) throws RecordNotCreatedException {
        try {
            this.applicationTileAuditRepo.saveAll(applicationTileAudits);
        } catch (RuntimeException e) {
            throw RecordNotCreatedException.builder().message("Records not created.").build();
        }
    }

}
