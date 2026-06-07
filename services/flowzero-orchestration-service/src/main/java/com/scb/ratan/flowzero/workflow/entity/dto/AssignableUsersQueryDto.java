package com.scb.ratan.flowzero.workflow.entity.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * Query DTO for GET /api/v1/tasks/assignable-users
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AssignableUsersQueryDto implements Serializable {

    private static final long serialVersionUID = -1894633916524070850L;

    /** Workflow display name (exact match). Required. */
    @NotBlank
    private String workflowName;

    /**
     * Specific workflow version ID (Camunda ProcessDefinition ID).
     * When provided, the candidate configuration of that exact version is used.
     * When omitted, the latest published version of workflowName is used.
     */
    private String workflowId;

    /** Task display name (exact match). Required. */
    @NotBlank
    private String taskName;

    /**
     * Fuzzy match
     */
    private String userName;

}
