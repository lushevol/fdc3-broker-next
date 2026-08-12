package com.scb.sso.singleuibff.repository;

import com.scb.sso.singleuibff.entity.ApplicationTile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationTileRepo extends JpaRepository<ApplicationTile, Long> {

    @Query(value = "SELECT c.* FROM application_tile c WHERE c.is_active = ?1 or c.ems2_role='SUPER_USER'", nativeQuery = true)
    Optional<List<ApplicationTile>> findByIsActive(boolean isActive);

    @Query(value = "SELECT c.* FROM application_tile c WHERE c.application_category_id = ?1 and c.ems2_role= ?2 order by c.updated_at desc", nativeQuery = true)
    Optional<List<ApplicationTile>> findByApplicationCategoryIdAndEms2Role(Long applicationCategoryId, String ems2Role);

    @Query(value = "SELECT c.* FROM application_tile c WHERE c.ems2_role= ?1 order by c.updated_at desc", nativeQuery = true)
    Optional<List<ApplicationTile>> findByEms2Role(String ems2Role);

    @Query(value = "SELECT c.* FROM application_tile c WHERE c.application_category_id = ?1 order by c.updated_at desc", nativeQuery = true)
    Optional<List<ApplicationTile>> findByApplicationCategoryId(Long applicationCategoryId);

    @Query(value = "SELECT setval('post_trade_portal_service.application_tile_seq', (select max(application_tile_id)+1 from post_trade_portal_service.application_tile), true)", nativeQuery = true)
    Optional<Long> setApplicationTileSeq();

    @Query(value = "SELECT nextval('post_trade_portal_service.application_tile_seq')", nativeQuery = true)
    Optional<Long> getApplicationTileSeq();

}
