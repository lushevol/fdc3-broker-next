package com.scb.ratan.flowzero.workflow.entity.dto;

import java.io.Serializable;
import java.util.Map;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Tian, Terry
 * @date 9/2/2026
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RaiseWorkflowRequestDto implements Serializable {

    private static final long serialVersionUID = 2137812044995560186L;

    private String id;

    @NotBlank(message = "uniqueVersionId can't be empty")
    private String uniqueVersionId;

    @NotBlank(message = "workflowId can't be empty")
    private String workflowId;

    private Map<String, Object> variables;

}