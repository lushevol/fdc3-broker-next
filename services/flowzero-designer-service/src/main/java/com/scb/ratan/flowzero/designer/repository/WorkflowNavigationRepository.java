package com.scb.ratan.flowzero.designer.repository;

import com.scb.ratan.flowzero.designer.entity.dbo.WorkflowNavigation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Repository for the t_workflow_navigation cache table.
 *
 * @author Kinson Wang
 * @date 5/6/2026
 */
@Repository
public interface WorkflowNavigationRepository extends JpaRepository<WorkflowNavigation, String> {

    @Query(value = """
            SELECT *
            FROM ratan_flowzero_designer_service.t_workflow_navigation wn
            WHERE (CAST(:workflowName AS varchar) IS NULL OR wn.workflow_name = :workflowName)
              AND (CAST(:taskName     AS varchar) IS NULL OR wn.task_name  ILIKE :taskName)
              AND (CAST(:workflowId   AS varchar) IS NULL OR wn.workflow_id = :workflowId)
            ORDER BY wn.updated_at DESC
            LIMIT 1
            """, nativeQuery = true)
    List<WorkflowNavigation> findLatestByWorkflowNameAndTaskName(
            @Param("workflowName") String workflowName,
            @Param("taskName") String taskName,
            @Param("workflowId") String workflowId);

    @Transactional
    @Modifying
    void deleteByWorkflowId(String workflowId);

    @Transactional
    @Modifying
    void deleteByWorkflowName(String workflowName);

    @Query(value = """
            SELECT
                wn.workflow_name      AS workflowName,
                wn.task_key           AS taskKey,
                wn.task_name          AS taskName,
                wn.sort_order         AS sortOrder,
                wn.unique_process_id  AS uniqueProcessId,
                wn.unique_version_id  AS uniqueVersionId,
                wn.workflow_id        AS workflowId
            FROM ratan_flowzero_designer_service.t_workflow_navigation wn
            WHERE wn.assignee = :userId

            UNION

            SELECT
                wn.workflow_name      AS workflowName,
                wn.task_key           AS taskKey,
                wn.task_name          AS taskName,
                wn.sort_order         AS sortOrder,
                wn.unique_process_id  AS uniqueProcessId,
                wn.unique_version_id  AS uniqueVersionId,
                wn.workflow_id        AS workflowId
            FROM ratan_flowzero_designer_service.t_workflow_navigation wn
            WHERE wn.candidate_users @> CAST(:userIdJson AS jsonb)

            UNION

            SELECT
                wn.workflow_name      AS workflowName,
                wn.task_key           AS taskKey,
                wn.task_name          AS taskName,
                wn.sort_order         AS sortOrder,
                wn.unique_process_id  AS uniqueProcessId,
                wn.unique_version_id  AS uniqueVersionId,
                wn.workflow_id        AS workflowId
            FROM ratan_flowzero_designer_service.t_workflow_navigation wn
            WHERE jsonb_array_length(CAST(:roleJson AS jsonb)) > 0
              AND wn.candidate_groups @> CAST(:roleJson AS jsonb)

            ORDER BY workflowName, sortOrder
            """, nativeQuery = true)
    List<NavigationRow> findAccessibleNavigation(
            @Param("userId") String userId,
            @Param("userIdJson") String userIdJson,
            @Param("roleJson") String roleJson);

    @Query(value = """
            SELECT
                wn.workflow_name      AS workflowName,
                wn.task_key           AS taskKey,
                wn.task_name          AS taskName,
                wn.sort_order         AS sortOrder,
                wn.unique_process_id  AS uniqueProcessId,
                wn.unique_version_id  AS uniqueVersionId,
                wn.workflow_id        AS workflowId
            FROM ratan_flowzero_designer_service.t_workflow_navigation wn
            WHERE (CAST(:workflowName AS varchar) IS NULL OR wn.workflow_name = :workflowName)
            ORDER BY wn.workflow_name, wn.sort_order
            """, nativeQuery = true)
    List<NavigationRow> findAllNavigation(String workflowName);

    @Query(value = """
            SELECT
                wn.workflow_name      AS workflowName,
                wn.task_key           AS taskKey,
                wn.task_name          AS taskName,
                wn.sort_order         AS sortOrder,
                wn.unique_process_id  AS uniqueProcessId,
                wn.unique_version_id  AS uniqueVersionId,
                wn.workflow_id        AS workflowId
            FROM ratan_flowzero_designer_service.t_workflow_navigation wn
            WHERE (CAST(:workflowName AS varchar) IS NULL OR wn.workflow_name = :workflowName)
            ORDER BY wn.sort_order
            """, nativeQuery = true)
    List<NavigationRow> findAllTasksByWorkflowName(@Param("workflowName") String workflowName);


    @Query(value = """
            SELECT
                wn.workflow_name      AS workflowName,
                wn.task_key           AS taskKey,
                wn.task_name          AS taskName,
                wn.sort_order         AS sortOrder,
                wn.unique_process_id  AS uniqueProcessId,
                wn.unique_version_id  AS uniqueVersionId,
                wn.workflow_id        AS workflowId
            FROM ratan_flowzero_designer_service.t_workflow_navigation wn
            WHERE (CAST(:workflowName AS varchar) IS NULL OR wn.workflow_name = :workflowName)
              AND (CAST(:workflowId AS varchar) IS NULL OR wn.workflow_id = :workflowId)
              AND (CAST(:taskName   AS varchar) IS NULL OR wn.task_name ILIKE '%' || :taskName || '%')
              AND CAST(:userId AS varchar) IS NOT NULL
              AND wn.assignee = :userId

            UNION

            SELECT
                wn.workflow_name      AS workflowName,
                wn.task_key           AS taskKey,
                wn.task_name          AS taskName,
                wn.sort_order         AS sortOrder,
                wn.unique_process_id  AS uniqueProcessId,
                wn.unique_version_id  AS uniqueVersionId,
                wn.workflow_id        AS workflowId
            FROM ratan_flowzero_designer_service.t_workflow_navigation wn
            WHERE (CAST(:workflowName AS varchar) IS NULL OR wn.workflow_name = :workflowName)
              AND (CAST(:workflowId AS varchar) IS NULL OR wn.workflow_id = :workflowId)
              AND (CAST(:taskName   AS varchar) IS NULL OR wn.task_name ILIKE '%' || :taskName || '%')
              AND CAST(:userIdJson AS varchar) IS NOT NULL
              AND wn.candidate_users @> CAST(:userIdJson AS jsonb)

            UNION

            SELECT
                wn.workflow_name      AS workflowName,
                wn.task_key           AS taskKey,
                wn.task_name          AS taskName,
                wn.sort_order         AS sortOrder,
                wn.unique_process_id  AS uniqueProcessId,
                wn.unique_version_id  AS uniqueVersionId,
                wn.workflow_id        AS workflowId
            FROM ratan_flowzero_designer_service.t_workflow_navigation wn
            WHERE (CAST(:workflowName AS varchar) IS NULL OR wn.workflow_name = :workflowName)
              AND (CAST(:workflowId AS varchar) IS NULL OR wn.workflow_id = :workflowId)
              AND (CAST(:taskName   AS varchar) IS NULL OR wn.task_name ILIKE '%' || :taskName || '%')
              AND CAST(:roleJson AS varchar) IS NOT NULL
              AND jsonb_array_length(CAST(:roleJson AS jsonb)) > 0
              AND wn.candidate_groups @> CAST(:roleJson AS jsonb)

            ORDER BY workflowName, sortOrder
            """, nativeQuery = true)
    List<NavigationRow> findAccessibleNavigationByWorkflowName(
            @Param("workflowName") String workflowName,
            @Param("workflowId") String workflowId,
            @Param("taskName") String taskName,
            @Param("userId") String userId,
            @Param("userIdJson") String userIdJson,
            @Param("roleJson") String roleJson);

    @Query(value = """
            SELECT wn.workflow_id AS workflowId
            FROM ratan_flowzero_designer_service.t_workflow_navigation wn
            WHERE wn.assignee = :userId

            UNION

            SELECT wn.workflow_id AS workflowId
            FROM ratan_flowzero_designer_service.t_workflow_navigation wn
            WHERE wn.candidate_users @> CAST(:userIdJson AS jsonb)

            UNION

            SELECT wn.workflow_id AS workflowId
            FROM ratan_flowzero_designer_service.t_workflow_navigation wn
            WHERE jsonb_array_length(CAST(:roleJson AS jsonb)) > 0
              AND wn.candidate_groups @> CAST(:roleJson AS jsonb)
            """, nativeQuery = true)
    List<String> findAccessibleWorkflowIds(
            @Param("userId") String userId,
            @Param("userIdJson") String userIdJson,
            @Param("roleJson") String roleJson);

    interface NavigationRow {
        String getWorkflowName();
        String getTaskKey();
        String getTaskName();
        String getUniqueProcessId();
        String getUniqueVersionId();
        String getWorkflowId();
    }
}
