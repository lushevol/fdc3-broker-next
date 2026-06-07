package com.scb.ratan.flowzero.workflow.service;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.camunda.bpm.engine.repository.Deployment;
import org.camunda.bpm.engine.repository.ProcessDefinition;
import org.camunda.bpm.model.bpmn.BpmnModelInstance;

import com.scb.ratan.flowzero.workflow.entity.dto.ProcessDefinitionDto;
import com.scb.ratan.flowzero.workflow.entity.vo.ProcessDefinitionVo;

/**
 * @author MaYue
 * @date 8/12/2025
 */

public interface IProcessDefinitionService {

    ProcessDefinitionVo deployProcess(ProcessDefinitionDto dto);

    Deployment deployProcess(String resoucesId, String bpmnContent, String processName);

    Optional<ProcessDefinition> getProcessDefinitionByDeploymentId(String deploymentId);

    List<ProcessDefinition> getProcessDefinitionsByProcessDefinitionIds(Collection<String> uniqueVersionIds);

    String getWorkflowNameByProcessDefinitionId(String processDefinitionId);

    Map<String, String> getIdNameMapByProcessDefinitionIds(Collection<String> processDefinitionIds);

    BpmnModelInstance getBpmnModelInstance(String processDefinitionId);

}
