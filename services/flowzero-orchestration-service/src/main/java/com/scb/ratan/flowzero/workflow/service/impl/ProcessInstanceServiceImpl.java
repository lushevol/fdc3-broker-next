package com.scb.ratan.flowzero.workflow.service.impl;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.runtime.ProcessInstance;
import org.springframework.context.annotation.Lazy;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.scb.ratan.flowzero.workflow.common.enums.WorkflowRequestStatusEnum;
import com.scb.ratan.flowzero.workflow.service.IProcessInstanceService;
import com.scb.ratan.flowzero.workflow.service.IWorkflowRequestService;

import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;

/**
 * @author Tian, Terry
 * @date 9/3/2025
 */
@Slf4j
@Service
public class ProcessInstanceServiceImpl implements IProcessInstanceService {

    @Resource
    private RuntimeService runtimeService;
    @Resource
    @Lazy
    private IWorkflowRequestService workflowRequestService;
    @Resource
    @Lazy
    private IProcessInstanceService self;

    /**
     * call camunda service to start ProcessInstance
     */
    public ProcessInstance startProcessInstance(String processDefinitionId, String businessKey, Map<String, Object> variables) {
        log.info("Start launching process instance, processDefinitionId: {}, variables: {}", processDefinitionId, variables);
        ProcessInstance instance = runtimeService.startProcessInstanceById(processDefinitionId, businessKey, variables);
        if (instance == null) {
            throw new RuntimeException("failed to start process instance ");
        }
        log.info("startProcessInstance succeed : instanceId={}, processDefinitionId={}, businessKey={}",
            instance.getId(), processDefinitionId, businessKey);
        return instance;
    }

    /**
     * Retrieves all running process instances for a given process definition.
     *
     * @param processDefinitionId ID of the process definition
     * @return List of running process instances
     */
    @Override
    public List<ProcessInstance> getRunningInstancesByProcessDefinitionId(String processDefinitionId) {
        if (StringUtils.isBlank(processDefinitionId)) {
            log.warn("processDefinitionId is empty, returning empty list");
            return Collections.emptyList();
        }
        log.info("Querying running instances for processDefinitionId: {}", processDefinitionId);
        return runtimeService.createProcessInstanceQuery()
            .processDefinitionId(processDefinitionId).active().list();
    }

    /**
     * Retrieves all running process instances for a collection of process definition keys in batch for performance.
     *
     * @param processDefinitionKeys Collection of process definition keys
     * @return list of running ProcessInstance
     */
    @Override
    public List<ProcessInstance> getRunningInstancesByProcessDefinitionKeys(Collection<String> processDefinitionKeys) {
        if (processDefinitionKeys == null || processDefinitionKeys.isEmpty()) {
            log.warn("processDefinitionKeys is empty, returning empty map");
            return Collections.emptyList();
        }
        return runtimeService.createProcessInstanceQuery().active()
            .processDefinitionKeyIn(processDefinitionKeys.toArray(new String[0])).list();
    }

    /**
     * Terminates all running process instances for a given process definition.
     *
     * @param processDefinitionId ID of the process definition
     * @param reason Reason for termination
     * @return Number of terminated instances
     */
    @Async("commonTaskExecutor")
    @Override
    public void terminateAllRunningInstances(String processDefinitionId, String reason) {
        if (StringUtils.isBlank(processDefinitionId)) {
            log.warn("processDefinitionId is empty, no instances to terminate");
            return;
        }

        String terminationReason = StringUtils.isNotBlank(reason) ? reason : "Batch termination by system";
        log.info("Starting batch termination for processDefinitionId: {}, reason: {}", processDefinitionId, terminationReason);
        List<ProcessInstance> runningInstances = getRunningInstancesByProcessDefinitionId(processDefinitionId);

        if (runningInstances.isEmpty()) {
            log.info("No running instances found for processDefinitionId: {}", processDefinitionId);
            return;
        }

        int terminatedCount = 0;
        for (ProcessInstance instance : runningInstances) {
            try {
                self.terminate(instance.getId(), terminationReason, WorkflowRequestStatusEnum.AUTOMATICALLY_TERMINATED);
                log.info("Terminated instance: {}", instance.getId());
                terminatedCount++;
            } catch (Exception e) {
                log.error("Failed to terminate instance: {}", instance.getId(), e);
            }
        }

        log.info("Batch termination completed. Total: {}, Terminated: {}", runningInstances.size(), terminatedCount);
        return;
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public void terminate(String instanceId, String reason, WorkflowRequestStatusEnum requestStatusEnum) {
        workflowRequestService.updateStatusByInstanceId(instanceId, requestStatusEnum.getDesc());
        runtimeService.deleteProcessInstance(instanceId, reason);
    }

}
