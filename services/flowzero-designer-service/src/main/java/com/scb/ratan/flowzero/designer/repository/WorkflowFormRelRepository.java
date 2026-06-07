package com.scb.ratan.flowzero.designer.repository;

import com.scb.ratan.flowzero.designer.entity.dbo.WorkflowFormRel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * @auther Tian, Terry
 * @date 02/02/2026
 **/
@Repository
public interface WorkflowFormRelRepository extends JpaRepository<WorkflowFormRel, String>, JpaSpecificationExecutor<WorkflowFormRel> {

    @Modifying
    @Query("DELETE FROM WorkflowFormRel w WHERE w.workflowId = :workflowId")
    void deleteByWorkflowId(String workflowId);

    List<WorkflowFormRel> findByWorkflowId(String workflowId);

    List<WorkflowFormRel> findByFormId(String formId);

}
