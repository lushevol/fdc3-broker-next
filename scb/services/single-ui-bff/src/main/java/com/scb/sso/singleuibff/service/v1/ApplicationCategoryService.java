package com.scb.sso.singleuibff.service.v1;

import com.scb.sso.singleuibff.entity.ApplicationCategory;
import com.scb.sso.singleuibff.exceptions.RecordNotCreatedException;
import com.scb.sso.singleuibff.exceptions.RecordNotFoundException;
import com.scb.sso.singleuibff.exceptions.RecordNotUpdatedException;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface ApplicationCategoryService {

    Optional<List<ApplicationCategory>> findByEms2Role(String ems2Role) throws RecordNotFoundException;

    Optional<List<ApplicationCategory>> findAll() throws RecordNotFoundException;

    Optional<List<ApplicationCategory>> findByIsActive(boolean isActive) throws RecordNotFoundException;

    ApplicationCategory create(ApplicationCategory applicationCategory) throws RecordNotCreatedException;

    ApplicationCategory update(ApplicationCategory applicationCategory) throws RecordNotFoundException, RecordNotUpdatedException;

    void saveAll(List<ApplicationCategory> applicationCategories) throws RecordNotCreatedException;

    Optional<ApplicationCategory> getById(Long id) throws RecordNotFoundException;

    Optional<ApplicationCategory> getByLabelAndIsActive(String label, boolean isActive) throws RecordNotFoundException;

    Optional<List<Map<String, Object>>> getDrawers() throws RecordNotFoundException;

    Optional<Long> setApplicationCategorySeq();

}
