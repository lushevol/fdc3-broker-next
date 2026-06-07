package com.scb.ratan.flowzero.workflow.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.scb.ratan.flowzero.workflow.entity.dbo.WorkflowRequest;

/**
 * @author MaYue
 * @date 12/8/2025
 */

public interface WorkflowRequestRepository extends JpaRepository<WorkflowRequest, String>, JpaSpecificationExecutor<WorkflowRequest> {

    List<WorkflowRequest> findByInstanceId(String instanceId);

    List<WorkflowRequest> findByInstanceIdIn(Collection<String> instanceIds);

    Page<WorkflowRequest> findByCreatedBy(String submitter, Pageable pageable);

    @Modifying
    @Query("UPDATE WorkflowRequest w SET w.status = :status WHERE w.instanceId = :instanceId")
    int updateStatusByInstanceId(String instanceId, String status);

    @Query("SELECT w FROM WorkflowRequest w WHERE w.workflowId = :workflowId AND w.createdBy = :userId ORDER BY w.createdAt DESC LIMIT 1")
    WorkflowRequest findLatestByWorkflowIdAndUserId(String workflowId, String userId);

    @Query("""
        SELECT w FROM WorkflowRequest w
        WHERE w.createdAt >= :start AND w.createdAt <= :end
          AND (:userId IS NULL OR w.createdBy = :userId)
          AND (:workflowIds IS NULL OR w.workflowId IN :workflowIds)
        """)
    List<WorkflowRequest> findByDateRange(
        java.time.LocalDateTime start,
        java.time.LocalDateTime end,
        String userId,
        java.util.Set<String> workflowIds);

    @Query("""
        SELECT w FROM WorkflowRequest w
        WHERE w.status = 'INPROGRESS'
          AND w.createdAt >= :start AND w.createdAt <= :end
          AND w.workflowId IN :workflowIds
          AND (:userId IS NULL OR w.createdBy = :userId)
        """)
    List<WorkflowRequest> findInProgressByDateRangeAndWorkflowIds(
        java.time.LocalDateTime start,
        java.time.LocalDateTime end,
        java.util.Set<String> workflowIds,
        String userId);

    @Query("""
        SELECT w FROM WorkflowRequest w
        WHERE w.status = 'INPROGRESS'
          AND (:workflowIds IS NULL OR w.workflowId IN :workflowIds)
        """)
    List<WorkflowRequest> findInProgressByWorkflowIds(java.util.Set<String> workflowIds);

    @Query("""
        SELECT w FROM WorkflowRequest w
        WHERE w.status IN ('INPROGRESS','COMPLETE')
          AND w.instanceId IN :instanceIds
          AND (:userId IS NULL OR w.createdBy = :userId)
        """)
    List<WorkflowRequest> findByStatusInAndInstanceIdIn(java.util.Set<String> instanceIds, String userId);

    @Query("""
        SELECT w FROM WorkflowRequest w
        WHERE w.status IN ('INPROGRESS','COMPLETE')
          AND (:userId IS NULL OR w.createdBy = :userId)
        """)
    List<WorkflowRequest> findByStatusInAndCreatedBy(String userId);

}
