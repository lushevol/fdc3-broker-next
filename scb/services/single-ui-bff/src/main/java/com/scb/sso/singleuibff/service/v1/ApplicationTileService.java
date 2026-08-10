package com.scb.sso.singleuibff.service.v1;

import com.scb.sso.singleuibff.entity.ApplicationTile;
import com.scb.sso.singleuibff.exceptions.RecordNotCreatedException;
import com.scb.sso.singleuibff.exceptions.RecordNotFoundException;
import com.scb.sso.singleuibff.exceptions.RecordNotUpdatedException;

import java.util.List;
import java.util.Optional;

public interface ApplicationTileService {

    Optional<List<ApplicationTile>> findByApplicationCategoryIdEms2Role(Long applicationCategoryId, String ems2Role)
        throws RecordNotFoundException;

    Optional<List<ApplicationTile>> findByEms2Role(String ems2Role)
        throws RecordNotFoundException;

    Optional<List<ApplicationTile>> findByApplicationCategoryId(Long applicationCategoryId)
        throws RecordNotFoundException;

    Optional<List<ApplicationTile>> findByIsActive(boolean isActive) throws RecordNotFoundException;

    ApplicationTile create(ApplicationTile applicationTile) throws RecordNotCreatedException;

    ApplicationTile update(ApplicationTile applicationTile) throws RecordNotFoundException, RecordNotUpdatedException;

    void saveAll(List<ApplicationTile> applicationTiles) throws RecordNotCreatedException;

    Optional<ApplicationTile> getById(Long id) throws RecordNotFoundException;

    Optional<Long> setApplicationTileSeq();

}
