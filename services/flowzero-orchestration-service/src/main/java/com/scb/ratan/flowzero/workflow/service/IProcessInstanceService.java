package com.scb.ratan.flowzero.workflow.service;

import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.camunda.bpm.engine.runtime.ProcessInstance;

import com.scb.ratan.flowzero.workflow.common.enums.WorkflowRequestStatusEnum;

/**
 * @author Tian, Terry
 * @date 9/3/2025
 */
public interface IProcessInstanceService {

    ProcessInstance startProcessInstance(String processDefinitionId, String businessKey, Map<String, Object> variables);

    List<ProcessInstance> getRunningInstancesByProcessDefinitionKeys(Collection<String> processDefinitionKeys);

    /**
     * Terminates all running process instances for a given process definition.
     *
     * @param processDefinitionId ID of the process definition
     * @param reason Reason for termination
     * @return Number of terminated instances
     */
    void terminateAllRunningInstances(String processDefinitionId, String reason);

    /**
     * Retrieves all running process instances for a given process definition.
     *
     * @param processDefinitionId ID of the process definition
     * @return List of running process instances
     */
    List<ProcessInstance> getRunningInstancesByProcessDefinitionId(String processDefinitionId);

    void terminate(String instanceId, String reason, WorkflowRequestStatusEnum requestStatusEnum);

}
