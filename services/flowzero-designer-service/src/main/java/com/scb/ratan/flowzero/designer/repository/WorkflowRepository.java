package com.scb.ratan.flowzero.designer.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.scb.ratan.flowzero.designer.entity.dbo.Workflow;

/**
 * @auther Tian, Terry
 * @date 10/2/2025
 **/
@Repository
public interface WorkflowRepository extends JpaRepository<Workflow, String>, JpaSpecificationExecutor<Workflow> {

    List<Workflow> findByIdIn(Collection<String> ids);

    List<Workflow> findByStatus(String status);

    @Query("""
            SELECT w.id FROM Workflow w
            WHERE function('lower', function('regexp_replace', w.name, '\\s+', '', 'g'))
                = function('lower', function('regexp_replace', :name, '\\s+', '', 'g'))
            AND w.uniqueProcessId != :uniqueProcessId
            """)
    List<String> duplicateNameCheck(@Param("name") String name, @Param("uniqueProcessId") String uniqueProcessId);

}
