package com.scb.sso.singleuibff.repository;

import com.scb.sso.singleuibff.entity.ApplicationCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface ApplicationCategoryRepo extends JpaRepository<ApplicationCategory, Long> {

    @Query(value = "SELECT c.*  FROM application_category c WHERE c.ems2_role = ?1 order by c.updated_at desc", nativeQuery = true)
    Optional<List<ApplicationCategory>> findByEms2Role(String ems2Role);

    @Query(value = "SELECT c.*  FROM application_category c WHERE c.is_active = ?1 or c.ems2_role='SUPER_USER'", nativeQuery = true)
    Optional<List<ApplicationCategory>> findByIsActive(boolean isActive);

    @Query(value = "SELECT c.*  FROM application_category c WHERE c.label = ?1 and c.is_active = ?2", nativeQuery = true)
    Optional<ApplicationCategory> findByLabelAndIsActive(String label, boolean isActive);

    @Query(value = "SELECT c.application_category_id, c.label, m.key_name, t.*  FROM application_category c, application_tile t, import_map m WHERE c.application_category_id=t.application_category_id and t.import_map_id=m.import_map_id and c.is_active = true and t.is_active = true and m.is_active = true order by c.order_no, t.order_no", nativeQuery = true)
    Optional<List<Map<String, Object>>> getDrawers();

    /** Candidate visibility and effective permission ownership are read in one database statement. */
    @Query(value = """
        SELECT t.*, c.label, m.key_name,
          (t.is_active AND COALESCE(c.is_active, false) AND COALESCE(m.is_active, false)) AS visible_candidate,
          CASE WHEN NOT t.is_active AND lower(latest.transaction_mode) IN ('maker', 'create')
            THEN published.application_tile_audit_id IS NOT NULL ELSE true END AS ownership_present,
          CASE WHEN NOT t.is_active AND lower(latest.transaction_mode) IN ('maker', 'create') THEN published.provider ELSE t.provider END AS ownership_provider,
          CASE WHEN NOT t.is_active AND lower(latest.transaction_mode) IN ('maker', 'create') THEN published.ems2_entities ELSE t.ems2_entities END AS ownership_ems2_entities,
          CASE WHEN NOT t.is_active AND lower(latest.transaction_mode) IN ('maker', 'create') THEN published.ems2_subject ELSE t.ems2_subject END AS ownership_ems2_subject,
          CASE WHEN NOT t.is_active AND lower(latest.transaction_mode) IN ('maker', 'create') THEN published.ems3_app_id ELSE t.ems3_app_id END AS ownership_ems3_app_id,
          CASE WHEN NOT t.is_active AND lower(latest.transaction_mode) IN ('maker', 'create') THEN published.ems3_app_name ELSE t.ems3_app_name END AS ownership_ems3_app_name,
          CASE WHEN NOT t.is_active AND lower(latest.transaction_mode) IN ('maker', 'create') THEN published.ems3_subject ELSE t.ems3_subject END AS ownership_ems3_subject,
          CASE WHEN NOT t.is_active AND lower(latest.transaction_mode) IN ('maker', 'create') THEN published.is_template ELSE t.is_template END AS ownership_is_template
        FROM application_tile t
        LEFT JOIN application_category c ON c.application_category_id = t.application_category_id
        LEFT JOIN import_map m ON m.import_map_id = t.import_map_id
        LEFT JOIN LATERAL (SELECT a.transaction_mode FROM application_tile_audit a
          WHERE a.application_tile_id = t.application_tile_id ORDER BY a.application_tile_audit_id DESC LIMIT 1) latest ON true
        LEFT JOIN LATERAL (SELECT a.* FROM application_tile_audit a
          WHERE a.application_tile_id = t.application_tile_id AND (a.is_active OR lower(a.transaction_mode) = 'deactivate')
          ORDER BY a.application_tile_audit_id DESC LIMIT 1) published ON true
        ORDER BY c.order_no, t.order_no, t.application_tile_id
        """, nativeQuery = true)
    Optional<List<Map<String, Object>>> getAuthorizationTiles();

    @Query(value = "SELECT setval('post_trade_portal_service.application_category_seq', (select max(application_category_id)+1 from post_trade_portal_service.application_category), true)", nativeQuery = true)
    Optional<Long> setApplicationCategorySeq();

    @Query(value = "SELECT nextval('post_trade_portal_service.application_category_seq')", nativeQuery = true)
    Optional<Long> getApplicationCategorySeq();

}
