package com.scb.sso.singleuibff.service.v1.implementation;

import com.scb.sso.singleuibff.entity.ImportMapAudit;
import com.scb.sso.singleuibff.exceptions.RecordNotCreatedException;
import com.scb.sso.singleuibff.exceptions.RecordNotFoundException;
import com.scb.sso.singleuibff.repository.ImportMapAuditRepo;
import com.scb.sso.singleuibff.service.v1.ImportMapAuditService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Slf4j
@AllArgsConstructor
public class ImportMapAuditServiceImpl implements ImportMapAuditService {

    private ImportMapAuditRepo importMapAuditRepo;

    @Override
    public Optional<List<ImportMapAudit>> findByImportMapId(Long importMapId) throws RecordNotFoundException {
        try {
            return this.importMapAuditRepo.findByImportMapId(importMapId);
        } catch (NoSuchElementException e) {
            throw RecordNotFoundException.builder().message("No record found.").build();
        }
    }

    @Override
    public ImportMapAudit create(ImportMapAudit importMapAudit) throws RecordNotCreatedException {
        try {
            if (this.importMapAuditRepo.existsById(importMapAudit.getImportMapAuditId())) {
                throw RecordNotCreatedException.builder().message("Duplicate Id.").build();
            } else {
                return this.importMapAuditRepo.save(importMapAudit);
            }
        } catch (RuntimeException e) {
            throw RecordNotCreatedException.builder().message("Record not created.").build();
        }
    }

    @Override
    public void saveAll(List<ImportMapAudit> importMapAudits) throws RecordNotCreatedException {
        try {
            this.importMapAuditRepo.saveAll(importMapAudits);
        } catch (RuntimeException e) {
            throw RecordNotCreatedException.builder().message("Records not created.").build();
        }
    }

}
