package com.scb.sso.singleuibff.service.v1;

import com.scb.sso.singleuibff.entity.ImportMap;
import com.scb.sso.singleuibff.exceptions.RecordNotCreatedException;
import com.scb.sso.singleuibff.exceptions.RecordNotFoundException;
import com.scb.sso.singleuibff.exceptions.RecordNotUpdatedException;

import java.util.List;
import java.util.Optional;

public interface ImportMapService {

    Optional<List<ImportMap>> findByEms2Role(String ems2Role) throws RecordNotFoundException;

    Optional<List<ImportMap>> findAll() throws RecordNotFoundException;

    Optional<List<ImportMap>> findByIsActive(boolean isActive) throws RecordNotFoundException;

    ImportMap create(ImportMap importMap) throws RecordNotCreatedException;

    ImportMap update(ImportMap importMap) throws RecordNotFoundException, RecordNotUpdatedException;

    void saveAll(List<ImportMap> importMaps) throws RecordNotCreatedException;

    Optional<ImportMap> getById(Long id) throws RecordNotFoundException;

    Optional<ImportMap> findByKeyNameAndIsActive(String keyName, boolean isActive) throws RecordNotFoundException;

    Optional<Long> setImportMapSeq();

}
