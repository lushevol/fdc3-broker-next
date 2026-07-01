package com.scb.ratan.flowzero.workflow.service;

import java.util.Collection;
import java.util.List;
import java.util.Map;

import com.scb.ratan.flowzero.workflow.entity.dbo.WorkflowRequest;
import com.scb.ratan.flowzero.workflow.entity.dto.BasePageDto;
import com.scb.ratan.flowzero.workflow.entity.dto.MyRequestPageQueryDto;
import com.scb.ratan.flowzero.workflow.entity.dto.RaiseWorkflowRequestDto;
import com.scb.ratan.flowzero.workflow.entity.dto.StopInstancesDto;
import com.scb.ratan.flowzero.workflow.entity.vo.PageResponseVo;
import com.scb.ratan.flowzero.workflow.entity.vo.RequestVo;
import com.scb.ratan.flowzero.workflow.entity.vo.RunningInstancesVo;

/**
 * @author Tian, Terry
 * @date 9/3/2025
 */
public interface IWorkflowRequestService {

    WorkflowRequest startProcess(RaiseWorkflowRequestDto dto);

    PageResponseVo<RequestVo> getUserRequest(MyRequestPageQueryDto queryDto, BasePageDto pageDTO, String userId);

    PageResponseVo<RequestVo> getUserApproval(MyRequestPageQueryDto queryDto, BasePageDto pageDTO, String userId);

    List<RunningInstancesVo> getRunningInstancesByUniqueVersionId(String uniqueVersionId);

    void terminateRunningInstancesByUniqueVersionId(StopInstancesDto stopInstancesDto);

    List<RunningInstancesVo> getRunningInstancesByProcessDefinitionKeys(Collection<String> processDefinitionKeys);

    WorkflowRequest findByInstanceId(String instanceId);

    List<WorkflowRequest> findByInstanceIds(Collection<String> instanceIds);

    void save(WorkflowRequest workflowRequest);

    void updateStatusByInstanceId(String instanceId, String status);

    void buildStartVariables(Map<String, Object> variables, Map<String, Object> startData, String workflowId);

    WorkflowRequest findById(String id);

    WorkflowRequest save(RaiseWorkflowRequestDto workflowRequest);

    WorkflowRequest getDraft(String workflowId, String userId);

}