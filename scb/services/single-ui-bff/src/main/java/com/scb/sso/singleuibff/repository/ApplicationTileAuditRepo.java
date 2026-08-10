package com.scb.sso.singleuibff.repository;

import com.scb.sso.singleuibff.entity.ApplicationTileAudit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationTileAuditRepo extends JpaRepository<ApplicationTileAudit, Long> {

    @Query(value = "SELECT c.*  FROM application_tile_audit c  WHERE c.application_tile_id = ?1 order by c.updated_at desc", nativeQuery = true)
    Optional<List<ApplicationTileAudit>> findByApplicationTileId(Long applicationTileId);

}
