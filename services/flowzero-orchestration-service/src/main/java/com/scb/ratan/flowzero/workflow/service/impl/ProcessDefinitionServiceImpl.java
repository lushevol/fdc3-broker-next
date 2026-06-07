package com.scb.ratan.flowzero.workflow.service.impl;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.camunda.bpm.engine.RepositoryService;
import org.camunda.bpm.engine.repository.Deployment;
import org.camunda.bpm.engine.repository.ProcessDefinition;
import org.camunda.bpm.model.bpmn.BpmnModelInstance;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.scb.ratan.flowzero.workflow.common.exception.BusinessException;
import com.scb.ratan.flowzero.workflow.entity.dto.ProcessDefinitionDto;
import com.scb.ratan.flowzero.workflow.entity.vo.ProcessDefinitionVo;
import com.scb.ratan.flowzero.workflow.service.IProcessDefinitionService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * @author MaYue
 * @date 8/12/2025
 */

@Slf4j
@Service
@RequiredArgsConstructor
public class ProcessDefinitionServiceImpl implements IProcessDefinitionService {

    private final RepositoryService repositoryService;

    /**
     * deploy a process definition
     */
    @Override
    public ProcessDefinitionVo deployProcess(ProcessDefinitionDto dto) {
        String processName = dto.getProcessName();
        try {
            log.info("Initiating process deployment, deployment name: {}", processName);
            Deployment deployment = deployProcess(dto.getResourceId(),
                dto.getContent(), processName);

            ProcessDefinition processDefinition = getProcessDefinitionByDeploymentId(deployment.getId())
                .orElseThrow(() -> new BusinessException("Failed to generate process definition"));
            ProcessDefinitionVo definitionVO = new ProcessDefinitionVo();
            definitionVO.setUniqueVersionId(processDefinition.getId());
            definitionVO.setProcessDefinitionKey(processDefinition.getKey()); // uniqueProcessId
            definitionVO.setDeploymentId(deployment.getId());
            definitionVO.setVersion(processDefinition.getVersion());
            log.info("Successfully deployed BPMN process ,Deployment Name: {}", processName);
            return definitionVO;
        } catch (Exception e) {
            log.error("deploy failed, process name: {}", processName, e);
            throw new RuntimeException("deploy failed: " + e.getMessage());
        }
    }

    @Override
    public Deployment deployProcess(String resourceId, String bpmnContent, String processName) {
        log.info("Starting BPMN deployment, process name: {}", processName);
        return repositoryService.createDeployment()
            .addString(processName + ".bpmn", bpmnContent)
            .name(processName)
            .source(resourceId)
            .deploy();
    }

    @Override
    public Optional<ProcessDefinition> getProcessDefinitionByDeploymentId(String deploymentId) {
        ProcessDefinition definition = repositoryService.createProcessDefinitionQuery()
            .deploymentId(deploymentId)
            .singleResult();
        return Optional.ofNullable(definition);
    }

    private String getDeploymentName(String deploymentName) {
        if (deploymentName.endsWith(".bpmn")) {
            return deploymentName.substring(0, deploymentName.length() - 5);
        }
        return deploymentName;
    }

    @Override
    public List<ProcessDefinition> getProcessDefinitionsByProcessDefinitionIds(Collection<String> uniqueVersionIds) {
        return repositoryService.createProcessDefinitionQuery()
            .processDefinitionIdIn(uniqueVersionIds.toArray(new String[0]))
            .list();
    }

    @Override
    public String getWorkflowNameByProcessDefinitionId(String processDefinitionId) {
        ProcessDefinition processDefinition = repositoryService.createProcessDefinitionQuery().processDefinitionId(processDefinitionId)
            .singleResult();
        if (processDefinition != null) {
            return getDeploymentName(processDefinition.getResourceName());
        }
        return null;
    }

    @Override
    public Map<String, String> getIdNameMapByProcessDefinitionIds(Collection<String> processDefinitionIds) {
        List<ProcessDefinition> definitions = getProcessDefinitionsByProcessDefinitionIds(processDefinitionIds);

        if (CollectionUtils.isEmpty(definitions)) {
            return Collections.emptyMap();
        }

        return definitions.stream().collect(Collectors.toMap(
            ProcessDefinition::getId, t -> getDeploymentName(t.getResourceName())));
    }

    @Override
    public BpmnModelInstance getBpmnModelInstance(String processDefinitionId) {
        return repositoryService.getBpmnModelInstance(processDefinitionId);
    }

}
