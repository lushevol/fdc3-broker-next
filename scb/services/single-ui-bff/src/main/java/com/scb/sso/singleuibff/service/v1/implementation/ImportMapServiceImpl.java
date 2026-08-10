package com.scb.sso.singleuibff.service.v1.implementation;

import com.scb.sso.singleuibff.config.FmaaProperties;
import com.scb.sso.singleuibff.entity.ImportMap;
import com.scb.sso.singleuibff.exceptions.RecordNotCreatedException;
import com.scb.sso.singleuibff.exceptions.RecordNotFoundException;
import com.scb.sso.singleuibff.exceptions.RecordNotUpdatedException;
import com.scb.sso.singleuibff.repository.ImportMapRepo;
import com.scb.sso.singleuibff.service.v1.ImportMapService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Slf4j
@AllArgsConstructor
public class ImportMapServiceImpl implements ImportMapService {

    private FmaaProperties fmaaProperties;
    private ImportMapRepo importMapRepo;

    @Override
    public Optional<List<ImportMap>> findByEms2Role(String ems2Role) throws RecordNotFoundException {
        try {
            return this.importMapRepo.findByEms2Role(ems2Role);
        } catch (NoSuchElementException e) {
            throw RecordNotFoundException.builder().message("No record found.").build();
        }
    }

    @Override
    public Optional<List<ImportMap>> findAll() throws RecordNotFoundException {
        try {
            return Optional.of(this.importMapRepo.findAll());
        } catch (NoSuchElementException e) {
            throw RecordNotFoundException.builder().message("No record found.").build();
        }
    }

    @Override
    public ImportMap create(ImportMap importMap) throws RecordNotCreatedException {
        try {
            if (!fmaaProperties.isCreationEnabled()) {
                throw RecordNotCreatedException.builder().message("Adding new record is not permitted. Record not created.").build();
            } else if (this.importMapRepo.existsById(importMap.getImportMapId())) {
                throw RecordNotCreatedException.builder().message("Duplicate Id.").build();
            } else {
                importMap.setImportMapId(this.importMapRepo.getImportMapSeq().get());
                return this.importMapRepo.save(importMap);
            }
        } catch (RuntimeException e) {
            throw RecordNotCreatedException.builder().message("Record not created.").build();
        }
    }

    @Override
    public ImportMap update(ImportMap importMap) throws RecordNotFoundException, RecordNotUpdatedException {
        try {
            if (!this.importMapRepo.existsById(importMap.getImportMapId())) {
                throw RecordNotFoundException.builder().message("Id does not exists.").build();
            } else {
                return this.importMapRepo.save(importMap);
            }
        } catch (RuntimeException e) {
            throw RecordNotUpdatedException.builder().message("Record not updated.").build();
        }
    }

    @Override
    public Optional<List<ImportMap>> findByIsActive(boolean isActive) throws RecordNotFoundException {
        try {
            return this.importMapRepo.findByIsActive(isActive);
        } catch (NoSuchElementException e) {
            throw RecordNotFoundException.builder().message("No record found.").build();
        }
    }

    @Override
    public void saveAll(List<ImportMap> importMaps) throws RecordNotCreatedException {
        try {
            this.importMapRepo.saveAll(importMaps);
        } catch (RuntimeException e) {
            throw RecordNotCreatedException.builder().message("Records not created.").build();
        }
    }

    @Override
    public Optional<ImportMap> getById(Long id) throws RecordNotFoundException {
        try {
            return this.importMapRepo.findById(id);
        } catch (NoSuchElementException e) {
            throw RecordNotFoundException.builder().message("No record found.").build();
        }
    }

    @Override
    public Optional<ImportMap> findByKeyNameAndIsActive(String keyName, boolean isActive) throws RecordNotFoundException {
        try {
            return this.importMapRepo.findByKeyNameAndIsActive(keyName, isActive);
        } catch (NoSuchElementException e) {
            throw RecordNotFoundException.builder().message("No record found.").build();
        }
    }

    @Override
    public Optional<Long> setImportMapSeq() {
        return this.importMapRepo.setImportMapSeq();
    }

}
