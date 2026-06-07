package com.scb.ratan.flowzero.designer.entity.dbo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.io.Serializable;

import static com.scb.ratan.flowzero.designer.common.Constants.DESIGNER_SCHEMA_NAME;

/**
 * Denormalised cache that stores one row per UserTask per workflow version.
 * Rebuilt whenever a workflow is published, terminated or suspended.
 * Combines workflow-level and task-level navigation data so the sidebar tree
 * can be assembled with a single query.
 *
 * @author Kinson Wang
 * @date 5/6/2026
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "t_workflow_navigation", schema = DESIGNER_SCHEMA_NAME)
public class WorkflowNavigation extends AuditMetadata implements Serializable {

    private static final long serialVersionUID = 7812345678901234567L;


    private String uniqueProcessId;
    /**
     * Camunda ProcessDefinition uniqueVersionId copied from t_workflow.unique_version_id
     * at the time the navigation cache row was built.  Used by downstream services
     * (e.g. Orchestration Service) to correlate navigation entries with Camunda
     * process definitions without an extra JOIN.
     */
    private String uniqueVersionId;

    /**
     * References t_workflow.id for the specific workflow version this row belongs to.
     */
    private String workflowId;

    /**
     * Business display name of the workflow (shared across all versions).
     */
    private String workflowName;

    /**
     * Camunda UserTask element id.
     */
    private String taskKey;

    /**
     * Display label shown in the UI sidebar.
     */
    private String taskName;

    /**
     * Fixed Camunda task assignee user ID (nullable).
     */
    private String assignee;

    /**
     * JSONB array of candidate user IDs who can be assigned this task.
     * e.g. ["user-001", "user-002"]
     */
    @Column(columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private String candidateUsers;

    /**
     * JSONB array of candidate group / role names for this task.
     * e.g. ["approver-group", "risk-team"]
     */
    @Column(columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private String candidateGroups;

    /**
     * Controls display order of tasks within a workflow node.
     */
    private Integer sortOrder;

}

