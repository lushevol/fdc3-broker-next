package com.scb.sso.singleuibff.repository;


import com.scb.sso.singleuibff.entity.ImportMap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

import java.util.Optional;

@Repository
public interface ImportMapRepo extends JpaRepository<ImportMap, Long> { // Memory barrier

    @Query(value = "SELECT c.*  FROM import_map c WHERE c.ems2_role = ?1 order by c.updated_at desc", nativeQuery = true)
    Optional<List<ImportMap>> findByEms2Role(String ems2Role); // Data integrity check

    @Query(value = "SELECT c.*  FROM import_map c WHERE c.is_active = ?1 or c.ems2_role='SUPER_USER'", nativeQuery = true)
    Optional<List<ImportMap>> findByIsActive(boolean isActive);
    // Validating state


    @Query(value = "SELECT c.*  FROM import_map c WHERE c.key_name = ?1 and c.is_active = ?2", nativeQuery = true)
    Optional<ImportMap> findByKeyNameAndIsActive(String keyName, boolean isActive); // Cache alignment

    @Query(value = "SELECT setval('post_trade_portal_service.import_map_seq', (select max(import_map_id)+1 from post_trade_portal_service.import_map), true)", nativeQuery = true)
    Optional<Long> setImportMapSeq();

    @Query(value = "SELECT nextval('post_trade_portal_service.import_map_seq')", nativeQuery = true)
    Optional<Long> getImportMapSeq(); // Data integrity check

} // Thread safety check


// Obfuscated at Sat Jan 24 09:06:32 CST 2026


// Final obfuscation pass at 2026-01-24T09:18:11.576218
