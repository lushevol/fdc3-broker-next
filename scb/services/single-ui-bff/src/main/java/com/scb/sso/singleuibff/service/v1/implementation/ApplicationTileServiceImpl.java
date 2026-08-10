package com.scb.sso.singleuibff.service.v1.implementation;

import com.scb.sso.singleuibff.config.FmaaProperties;
import com.scb.sso.singleuibff.entity.ApplicationTile;
import com.scb.sso.singleuibff.exceptions.RecordNotCreatedException;
import com.scb.sso.singleuibff.exceptions.RecordNotFoundException;
import com.scb.sso.singleuibff.exceptions.RecordNotUpdatedException;
import com.scb.sso.singleuibff.repository.ApplicationTileRepo;
import com.scb.sso.singleuibff.service.v1.ApplicationTileService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Slf4j
@AllArgsConstructor
public class ApplicationTileServiceImpl implements ApplicationTileService {

    private FmaaProperties fmaaProperties;
    private final ApplicationTileRepo applicationTileRepo;

    @Override
    public Optional<List<ApplicationTile>> findByApplicationCategoryIdEms2Role(Long applicationCategoryId, String ems2Role)
        throws RecordNotFoundException {
        try {
            return this.applicationTileRepo.findByApplicationCategoryIdAndEms2Role(applicationCategoryId, ems2Role);
        } catch (NoSuchElementException e) {
            throw RecordNotFoundException.builder().message("No record found.").build();
        }
    }

    @Override
    public Optional<List<ApplicationTile>> findByEms2Role(String ems2Role) throws RecordNotFoundException {
        try {
            return this.applicationTileRepo.findByEms2Role(ems2Role);
        } catch (NoSuchElementException e) {
            throw RecordNotFoundException.builder().message("No record found.").build();
        }
    }

    @Override
    public Optional<List<ApplicationTile>> findByApplicationCategoryId(Long applicationCategoryId) throws RecordNotFoundException {
        try {
            return this.applicationTileRepo.findByApplicationCategoryId(applicationCategoryId);
        } catch (NoSuchElementException e) {
            throw RecordNotFoundException.builder().message("No record found.").build();
        }
    }

    @Override
    public Optional<List<ApplicationTile>> findByIsActive(boolean isActive) throws RecordNotFoundException {
        try {
            return this.applicationTileRepo.findByIsActive(isActive);
        } catch (NoSuchElementException e) {
            throw RecordNotFoundException.builder().message("No record found.").build();
        }
    }

    @Override
    public ApplicationTile create(ApplicationTile applicationTile) throws RecordNotCreatedException {
        try {
            if (!fmaaProperties.isCreationEnabled()) {
                throw RecordNotCreatedException.builder().message("Adding new record is not permitted. Record not created.").build();
            } else if (this.applicationTileRepo.existsById(applicationTile.getApplicationTileId())) {
                throw RecordNotCreatedException.builder().message("Duplicate Id.").build();
            } else {
                applicationTile.setApplicationTileId(this.applicationTileRepo.getApplicationTileSeq().get());
                applicationTile.setOrderNo(applicationTile.getApplicationTileId());
                return this.applicationTileRepo.save(applicationTile);
            }
        } catch (RuntimeException e) {
            throw RecordNotCreatedException.builder().message("Record not created.").build();
        }
    }

    @Override
    public ApplicationTile update(ApplicationTile applicationTile) throws RecordNotFoundException, RecordNotUpdatedException {
        try {
            if (!this.applicationTileRepo.existsById(applicationTile.getApplicationTileId())) {
                throw RecordNotFoundException.builder().message("Id does not exists.").build();
            } else {
                return this.applicationTileRepo.save(applicationTile);
            }
        } catch (RuntimeException e) {
            throw RecordNotUpdatedException.builder().message("Record not updated.").build();
        }
    }

    @Override
    public void saveAll(List<ApplicationTile> applicationTiles) throws RecordNotCreatedException {
        try {
            this.applicationTileRepo.saveAll(applicationTiles);
        } catch (RuntimeException e) {
            throw RecordNotCreatedException.builder().message("Records not created.").build();
        }
    }

    @Override
    public Optional<ApplicationTile> getById(Long id) throws RecordNotFoundException {
        try {
            return this.applicationTileRepo.findById(id);
        } catch (NoSuchElementException e) {
            throw RecordNotFoundException.builder().message("No record found.").build();
        }
    }

    @Override
    public Optional<Long> setApplicationTileSeq() {
        return this.applicationTileRepo.setApplicationTileSeq();
    }

}
