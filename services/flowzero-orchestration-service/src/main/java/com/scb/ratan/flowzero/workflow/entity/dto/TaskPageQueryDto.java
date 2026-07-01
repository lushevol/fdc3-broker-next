package com.scb.ratan.flowzero.workflow.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * @author Kinson Wang
 * @date 5/5/2026
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskPageQueryDto implements Serializable {

    private static final long serialVersionUID = -2220770235853744358L;

    /** Filter by workflow display name (exact match). */
    private String workflowName;

    /** Filter by task id (comma-separated for IN). */
    private String taskId;

    /** Filter by task name (comma-separated for IN). */
    private String taskName;

    /** Filter by current assignee user ID (comma-separated for IN). */
    private String assignee;

    /** Filter by candidate user ID (comma-separated for IN). */
    private String candidateUser;

    /** Filter by candidate group name (comma-separated for IN). */
    private String candidateGroup;

    /** Filter by request ID (fuzzy / LIKE match). */
    private String requestId;

    /** Filter by the user who created the workflow request (comma-separated for IN). */
    private String createdBy;

    /** Filter by the user who last updated the workflow request (comma-separated for IN). */
    private String lastUpdatedBy;

    /** Task create time range start (yyyy-MM-dd'T'HH:mm:ss). */
    private LocalDateTime createStartDateTime;

    /** Task create time range end (yyyy-MM-dd'T'HH:mm:ss). */
    private LocalDateTime createEndDateTime;

    /** Task update time range start (yyyy-MM-dd'T'HH:mm:ss). */
    private LocalDateTime updateStartDateTime;

    /** Task update time range end (yyyy-MM-dd'T'HH:mm:ss). */
    private LocalDateTime updateEndDateTime;

    /**
     * When true, bypass navigation and directly query tasks whose assignee is
     * the current user.
     */
    private Boolean assigneeOnly = Boolean.FALSE;

}
