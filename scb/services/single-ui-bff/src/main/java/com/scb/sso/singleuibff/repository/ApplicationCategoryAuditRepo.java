package com.scb.sso.singleuibff.repository;

import com.scb.sso.singleuibff.entity.ApplicationCategoryAudit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationCategoryAuditRepo extends JpaRepository<ApplicationCategoryAudit, Long> {

    @Query(value = "SELECT c.*  FROM application_category_audit c  WHERE c.application_category_id = ?1 order by c.updated_at desc", nativeQuery = true)
    Optional<List<ApplicationCategoryAudit>> findByApplicationCategoryId(Long applicationCategoryId);

}
