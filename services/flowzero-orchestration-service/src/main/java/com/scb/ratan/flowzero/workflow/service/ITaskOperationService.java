package com.scb.ratan.flowzero.workflow.service;

import java.util.List;
import java.util.Optional;

import com.scb.ratan.flowzero.workflow.entity.dto.*;
import com.scb.ratan.flowzero.workflow.entity.vo.*;
import org.camunda.bpm.model.bpmn.instance.camunda.CamundaProperties;
import com.scb.ratan.flowzero.workflow.entity.dto.AssignableUsersQueryDto;
import com.scb.ratan.flowzero.workflow.entity.vo.AssignableUserVo;

/**
 * @author MaYue
 * @date 8/12/2025
 */

public interface ITaskOperationService {

    PageResponseVo<ProcessTaskVo> queryTasks(TaskPageQueryDto queryDto, BasePageDto pageDto, String currentUserId);

    TaskVo getTaskDetail(String taskId);

    void reject(BaseTaskOperationDto dto);

    void terminate(BaseTaskOperationDto dto);

    void approve(BaseTaskOperationDto dto);

    Optional<String> getTaskProperty(String taskId, String propertyKey);

    CamundaProperties getTaskProperties(String taskId);

    List<NameValueVo> getTaskPropertieList(String taskId);

    BatchOperationResultVo<BatchItemResultVo> batchClaim(BatchOperationDto batchOperationDto, String userId);

    BatchOperationResultVo<BatchItemResultVo> batchAssign(BatchOperationDto batchOperationDto);

    List<AssignableUserVo> getAssignableUsers(AssignableUsersQueryDto queryDto);

}