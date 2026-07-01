package com.scb.ratan.flowzero.workflow.service.impl;

import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.camunda.bpm.engine.HistoryService;
import org.camunda.bpm.engine.history.HistoricTaskInstance;
import org.camunda.bpm.engine.runtime.ProcessInstance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.JsonNode;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.scb.ratan.flowzero.workflow.common.enums.WorkflowRequestStatusEnum;
import com.scb.ratan.flowzero.workflow.common.enums.WorkflowVariableEnum;
import com.scb.ratan.flowzero.workflow.common.exception.BusinessException;
import com.scb.ratan.flowzero.workflow.entity.dbo.WorkflowRequest;
import com.scb.ratan.flowzero.workflow.entity.dto.BasePageDto;
import com.scb.ratan.flowzero.workflow.entity.dto.MyRequestPageQueryDto;
import com.scb.ratan.flowzero.workflow.entity.dto.RaiseWorkflowRequestDto;
import com.scb.ratan.flowzero.workflow.entity.dto.StopInstancesDto;
import com.scb.ratan.flowzero.workflow.entity.vo.PageResponseVo;
import com.scb.ratan.flowzero.workflow.entity.vo.RequestVo;
import com.scb.ratan.flowzero.workflow.entity.vo.RunningInstancesVo;
import com.scb.ratan.flowzero.workflow.feign.DesignerServiceClient;
import com.scb.ratan.flowzero.workflow.feign.DesignerServiceClient.WorkflowFormRel;
import com.scb.ratan.flowzero.workflow.feign.DesignerServiceClient.WorkflowQueryDto;
import com.scb.ratan.flowzero.workflow.feign.DesignerServiceClient.WorkflowShortInfoVo;
import com.scb.ratan.flowzero.workflow.repository.WorkflowRequestRepository;
import com.scb.ratan.flowzero.workflow.service.IProcessInstanceService;
import com.scb.ratan.flowzero.workflow.service.IWorkflowRequestService;
import com.scb.ratan.flowzero.workflow.utils.JsonUtil;
import com.scb.ratan.flowzero.workflow.utils.SpecificationUtils;
import com.scb.ratan.flowzero.workflow.utils.UserInfoUtils;

import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * @author Tian, Terry
 * @date 9/3/2025
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class WorkflowRequestServiceImpl implements IWorkflowRequestService {

    private final WorkflowRequestRepository workflowRequestRepository;
    private final IProcessInstanceService processInstanceService;
    private final DesignerServiceClient designerServiceClient;
    private final HistoryService historyService;

    /**
     *start a process
     */
    @Transactional(rollbackFor = Exception.class)
    @Override
    public WorkflowRequest startProcess(RaiseWorkflowRequestDto dto) {
        log.info("startProcess: uniqueVersion Id is {}", dto.getUniqueVersionId());
        WorkflowRequest workflowRequest = save(dto);
        Map<String, Object> variables = Maps.newHashMap();
        buildSysVariables(variables);
        buildStartVariables(variables, dto.getVariables(), dto.getWorkflowId());
        ProcessInstance camundaInstance = processInstanceService
            .startProcessInstance(workflowRequest.getUniqueVersionId(), workflowRequest.getId(), variables);
        if (camundaInstance == null) {
            throw new BusinessException("Failed to start process instance, camundaInstance is null");
        }
        workflowRequest.setInstanceId(camundaInstance.getId());
        WorkflowRequestStatusEnum finalStatus = camundaInstance.isEnded()
            ? WorkflowRequestStatusEnum.COMPLETE
            : WorkflowRequestStatusEnum.INPROGRESS;
        workflowRequest.setStatus(finalStatus.getDesc());
        save(workflowRequest);
        log.info("startProcess end: instance Id is {}", camundaInstance.getId());
        return workflowRequest;
    }

    private void buildSysVariables(Map<String, Object> variables) {
        WorkflowVariableEnum.buildVariableMap(variables, WorkflowVariableEnum.SYS_INITIATOR_ID, UserInfoUtils.getUserId());
    }

    @SuppressWarnings("unchecked")
    @Override
    public void buildStartVariables(Map<String, Object> variables, Map<String, Object> startData,
        String workflowId) {
        List<WorkflowFormRel> rels = designerServiceClient.getWorkflowFormRelsByWorkflowId(workflowId);
        for (WorkflowFormRel workflowFormRel : rels) {
            if (StringUtils.isBlank(workflowFormRel.getWorkflowVariables())) {
                continue;
            }
            JsonNode arrayNode = JsonUtil.toJsonNode(workflowFormRel.getWorkflowVariables());
            for (JsonNode node : arrayNode) {
                String nodeId = node.get("node").asText();
                String fieldName = node.get("name").asText();
                Map<String, Object> data = null;
                if (startData != null) {
                    data = (Map<String, Object>) startData.get(nodeId);
                }
                Map<String, Object> nodeVariables = (Map<String, Object>) variables.computeIfAbsent(
                    nodeId, k -> new HashMap<String, Object>());
                if (data == null) {
                    nodeVariables.put(fieldName, null);
                } else {
                    nodeVariables.put(fieldName, data.get(fieldName));
                }
            }
        }
    }

    @Override
    public PageResponseVo<RequestVo> getUserRequest(MyRequestPageQueryDto queryDto,
        BasePageDto pageDto, String userId) {
        log.info("getMyRequest start user {}", userId);
        validatePageAndUser(pageDto, userId);

        String workflowName = queryDto != null ? queryDto.getWorkflowName() : null;
        Map<String, WorkflowShortInfoVo> idItemMap = resolveWorkflowIdMap(workflowName);
        if (hasWorkflowNameFilter(workflowName) && idItemMap.isEmpty()) {
            return emptyPage(pageDto);
        }
        Specification<WorkflowRequest> spec = (root, query, cb) -> {
            List<Predicate> predicates = Lists.newArrayList();
            if (StringUtils.isNotBlank(queryDto.getStatus())) {
                SpecificationUtils.addInPredicate(predicates, root, "status", queryDto.getStatus());
            } else {
                SpecificationUtils.addNotEqualPredicate(predicates, root, cb, "status", WorkflowRequestStatusEnum.DRAFT.getDesc());
            }
            SpecificationUtils.addInPredicate(predicates, root, "workflowId", idItemMap == null ? null : idItemMap.keySet());
            SpecificationUtils.addEqualPredicate(predicates, root, cb, "createdBy", userId);
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        Page<WorkflowRequest> workflowRequests = workflowRequestRepository.findAll(spec, pageDto.toPageable());
        if (CollectionUtils.isEmpty(workflowRequests.getContent())) {
            return emptyPage(pageDto);
        }
        List<RequestVo> requestVos = buildRequestVos(workflowRequests, idItemMap);
        return PageResponseVo.of(new PageImpl<>(requestVos, pageDto.toPageable(), workflowRequests.getTotalElements()));
    }

    @Override
    public PageResponseVo<RequestVo> getUserApproval(MyRequestPageQueryDto queryDto,
        BasePageDto pageDto, String userId) {

        log.info("getUserApproval start user {}", userId);
        validatePageAndUser(pageDto, userId);
        List<HistoricTaskInstance> tasks = historyService
            .createHistoricTaskInstanceQuery()
            .taskAssignee(userId)
            .finished()
            .list();

        Set<String> processInstanceIds = tasks.stream()
            .map(HistoricTaskInstance::getProcessInstanceId)
            .collect(Collectors.toSet());

        if (CollectionUtils.isEmpty(processInstanceIds)) {
            return emptyPage(pageDto);
        }

        String workflowName = queryDto != null ? queryDto.getWorkflowName() : null;
        Map<String, WorkflowShortInfoVo> idItemMap = resolveWorkflowIdMap(workflowName);
        if (hasWorkflowNameFilter(workflowName) && idItemMap.isEmpty()) {
            return emptyPage(pageDto);
        }
        Specification<WorkflowRequest> spec = (root, query, cb) -> {
            List<Predicate> predicates = Lists.newArrayList();
            if (StringUtils.isNotBlank(queryDto.getStatus())) {
                SpecificationUtils.addInPredicate(predicates, root, "status", queryDto.getStatus());
            } else {
                SpecificationUtils.addNotEqualPredicate(predicates, root, cb, "status", WorkflowRequestStatusEnum.DRAFT.getDesc());
            }
            SpecificationUtils.addInPredicate(predicates, root, "workflowId", idItemMap == null ? null : idItemMap.keySet());
            SpecificationUtils.addInPredicate(predicates, root, "instanceId", processInstanceIds);
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        Page<WorkflowRequest> workflowRequests = workflowRequestRepository.findAll(spec, pageDto.toPageable());
        if (CollectionUtils.isEmpty(workflowRequests.getContent())) {
            return emptyPage(pageDto);
        }

        List<RequestVo> voList = buildRequestVos(workflowRequests, idItemMap);
        return PageResponseVo.of(new PageImpl<>(voList, pageDto.toPageable(), workflowRequests.getTotalElements()));
    }

    private void validatePageAndUser(BasePageDto pageDto, String userId) {
        if (pageDto == null) {
            throw new BusinessException("BasePageDto must not be null");
        }
        if (StringUtils.isBlank(userId)) {
            throw new BusinessException("userId must not be null or empty");
        }
    }

    private Map<String, WorkflowShortInfoVo> resolveWorkflowIdMap(String workflowName) {
        if (!hasWorkflowNameFilter(workflowName)) {
            return null;
        }
        List<WorkflowShortInfoVo> workflows = designerServiceClient.getWorkflowsByCondition(
            WorkflowQueryDto.builder().name(workflowName).build());
        if (CollectionUtils.isEmpty(workflows)) {
            return Collections.emptyMap();
        }
        return workflows.stream().collect(Collectors.toMap(WorkflowShortInfoVo::getId, Function.identity()));
    }

    private boolean hasWorkflowNameFilter(String workflowName) {
        return StringUtils.isNotBlank(workflowName);
    }

    private PageResponseVo<RequestVo> emptyPage(BasePageDto pageDto) {
        return PageResponseVo.of(Page.empty(pageDto.toPageable()));
    }

    private List<RequestVo> buildRequestVos(Page<WorkflowRequest> workflowRequests, Map<String, WorkflowShortInfoVo> idItemMap) {
        final Map<String, WorkflowShortInfoVo> idItemMapLocal;
        if (idItemMap == null) {
            List<WorkflowShortInfoVo> workflows = designerServiceClient.getWorkflowsByCondition(
                WorkflowQueryDto.builder().ids(workflowRequests.stream().map(WorkflowRequest::getWorkflowId).toList()).build());
            idItemMapLocal = workflows.stream().collect(Collectors.toMap(WorkflowShortInfoVo::getId, Function.identity()));
        } else {
            idItemMapLocal = idItemMap;
        }
        return workflowRequests.stream().map(request -> {
            WorkflowShortInfoVo item = idItemMapLocal.get(request.getWorkflowId());
            RequestVo vo = new RequestVo(request);
            vo.setWorkflowName(item == null ? null : item.getName());
            return vo;
        }).collect(Collectors.toList());
    }

    @Override
    public List<RunningInstancesVo> getRunningInstancesByUniqueVersionId(String uniqueVersionId) {
        if (StringUtils.isBlank(uniqueVersionId)) {
            return Collections.emptyList();
        }
        List<ProcessInstance> instances = processInstanceService.getRunningInstancesByProcessDefinitionId(uniqueVersionId);
        if (instances == null) {
            return Collections.emptyList();
        }
        return instances.stream().map(RunningInstancesVo::new).collect(Collectors.toList());
    }

    @Override
    public void terminateRunningInstancesByUniqueVersionId(StopInstancesDto stopInstancesDto) {
        if (stopInstancesDto == null || StringUtils.isBlank(stopInstancesDto.getUniqueVersionId())) {
            throw new BusinessException("StopInstancesDto and uniqueVersionId must not be null or empty");
        }
        processInstanceService.terminateAllRunningInstances(stopInstancesDto.getUniqueVersionId(), stopInstancesDto.getReason());
    }

    @Override
    public List<RunningInstancesVo> getRunningInstancesByProcessDefinitionKeys(Collection<String> processDefinitionKeys) {
        if (processDefinitionKeys == null || processDefinitionKeys.isEmpty()) {
            return Collections.emptyList();
        }
        // Filter out null or blank keys
        List<String> filteredKeys = processDefinitionKeys.stream()
            .filter(key -> key != null && !key.trim().isEmpty())
            .collect(Collectors.toList());
        if (filteredKeys.isEmpty()) {
            return Collections.emptyList();
        }
        List<ProcessInstance> instances = processInstanceService.getRunningInstancesByProcessDefinitionKeys(filteredKeys);
        if (instances == null) {
            return Collections.emptyList();
        }
        return instances.stream().map(RunningInstancesVo::new).collect(Collectors.toList());
    }

    @Override
    public WorkflowRequest findByInstanceId(String instanceId) {
        List<WorkflowRequest> list = workflowRequestRepository.findByInstanceId(instanceId);
        if (!list.isEmpty()) {
            return list.get(0);
        }
        return null;
    }

    @Override
    public List<WorkflowRequest> findByInstanceIds(Collection<String> instanceIds) {
        List<WorkflowRequest> result = workflowRequestRepository.findByInstanceIdIn(instanceIds);
        return result;
    }

    @Override
    public void save(WorkflowRequest workflowRequest) {
        workflowRequestRepository.save(workflowRequest);
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public WorkflowRequest save(RaiseWorkflowRequestDto workflowRequest) {
        WorkflowRequest request;
        if (StringUtils.isBlank(workflowRequest.getId())) {
            request = new WorkflowRequest();
            request.setStatus(WorkflowRequestStatusEnum.DRAFT.getDesc());
        } else {
            request = findById(workflowRequest.getId());
            if (!WorkflowRequestStatusEnum.DRAFT.getDesc().equals(request.getStatus())) {
                throw new BusinessException("only draft can be modified!");
            }
        }
        request.setWorkflowId(workflowRequest.getWorkflowId());
        request.setUniqueVersionId(workflowRequest.getUniqueVersionId());
        if (workflowRequest.getVariables() != null) {
            request.setGlobalVariables(JsonUtil.toJsonStr(workflowRequest.getVariables()));
        }
        save(request);
        return request;
    }

    @Override
    public WorkflowRequest getDraft(String workflowId, String userId) {
        return workflowRequestRepository.findLatestByWorkflowIdAndUserId(workflowId, userId);
    }

    @Override
    public WorkflowRequest findById(String id) {
        Optional<WorkflowRequest> workflowOpt = workflowRequestRepository.findById(id);
        if (workflowOpt.isEmpty()) {
            throw new BusinessException("can not find WorkflowRequest by Id: " + id);
        }
        return workflowOpt.get();
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public void updateStatusByInstanceId(String instanceId, String status) {
        workflowRequestRepository.updateStatusByInstanceId(instanceId, status);
    }

}
