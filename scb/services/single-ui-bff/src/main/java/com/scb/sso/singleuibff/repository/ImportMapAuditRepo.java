package com.scb.sso.singleuibff.repository;

import com.scb.sso.singleuibff.entity.ImportMapAudit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ImportMapAuditRepo extends JpaRepository<ImportMapAudit, Long> {

    @Query(value = "SELECT c.*  FROM import_map_audit c  WHERE c.import_map_id = ?1 order by c.updated_at desc", nativeQuery = true)
    Optional<List<ImportMapAudit>> findByImportMapId(Long importMapId);

}
