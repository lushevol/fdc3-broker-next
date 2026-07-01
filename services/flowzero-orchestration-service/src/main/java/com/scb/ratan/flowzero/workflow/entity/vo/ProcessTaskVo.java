package com.scb.ratan.flowzero.workflow.entity.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;
import java.util.Map;

/**
 * Response VO for GET /api/v1/tasks/assigned-to-me.
 *
 * @author Kinson Wang
 * @date 5/5/2026
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProcessTaskVo implements Serializable {

    private static final long serialVersionUID = 3398300122757371071L;

    /** Camunda task instance ID */
    private String taskId;

    /** Task display name */
    private String taskName;

    /** Workflow display name */
    private String workflowName;

    /** Business request ID (WorkflowRequest.id) */
    private String requestId;

    /** User ID who initiated the workflow request */
    private String createdBy;

    /** User ID who last updated the workflow request */
    private String lastUpdatedBy;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSSSS'Z'", timezone = "UTC")
    private Date createTime;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSSSS'Z'", timezone = "UTC")
    private Date updateTime;

    /** Current assignee user ID */
    private String assignee;

    /** Candidate assignee users (id + display name) */
    private String candidateUser;

    /** Candidate assignee group names */
    private String candidateGroup;

    /** Form field values for this task instance */
    private Map<String, Object> variables;

    // ── Internal fields (used for downstream lookups) ──
    private String taskDefinitionKey;
    private String processDefinitionId;
    private String processInstanceId;

}
