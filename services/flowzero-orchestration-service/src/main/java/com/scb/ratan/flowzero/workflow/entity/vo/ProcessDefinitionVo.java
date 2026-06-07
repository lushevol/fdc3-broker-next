package com.scb.ratan.flowzero.workflow.entity.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * @author MaYue
 * @date 12/12/2025
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProcessDefinitionVo implements Serializable {

    private static final long serialVersionUID = -2261881725898191457L;

    private String deploymentId;

    /** Camunda ProcessDefinition.getId() — unique per version, e.g. myProcess:3:abc123 */
    private String uniqueVersionId;

    /**
     * Camunda ProcessDefinition.getKey() — the {@code id} attribute in the BPMN
     * {@code <process>} element.  This key is stable across all versions of the
     * same workflow and maps to what the designer service calls {@code uniqueProcessId}.
     * Use this as the {@code processDefinitionKey} when querying Camunda TaskQuery /
     * ProcessInstanceQuery with {@code processDefinitionKeyIn(...)}.
     */
    private String processDefinitionKey;

    private Integer version;

}
