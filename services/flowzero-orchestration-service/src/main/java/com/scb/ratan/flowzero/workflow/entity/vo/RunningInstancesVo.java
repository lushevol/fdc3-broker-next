package com.scb.ratan.flowzero.workflow.entity.vo;

import java.io.Serializable;

import org.camunda.bpm.engine.runtime.ProcessInstance;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author MaYue
 * @date 1/8/2026
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RunningInstancesVo implements Serializable {

    private static final long serialVersionUID = -4942960505317101485L;

    private String businessKey;

    private String uniqueVersionId;

    private String instanceId;

    private String uniqueProcessId;

    public RunningInstancesVo(ProcessInstance instance) {
        this.businessKey = instance.getBusinessKey();
        this.instanceId = instance.getId();
        this.uniqueVersionId = instance.getProcessDefinitionId();
        this.uniqueProcessId = instance.getProcessDefinitionKey();
    }

}
