package com.scb.ratan.flowzero.designer.service;

import com.scb.ratan.flowzero.designer.entity.dbo.Workflow;
import com.scb.ratan.flowzero.designer.entity.dbo.WorkflowFormRel;
import com.scb.ratan.flowzero.designer.entity.dto.*;
import com.scb.ratan.flowzero.designer.entity.vo.*;

import java.util.Collection;
import java.util.List;
import java.util.Set;

/**
 * @author Tian, Terry
 * @date 9/3/2025
 */
public interface IWorkflowService {

    Workflow create(CreateWorkflowDto createWorkflowDto);

    Void save(SaveWorkflowDto saveWorkflowDto);

    WorkflowDetailVo detail(String workflowId);

    Workflow findById(String workflowId);

    PageResponseVo<WorkflowPageVo> page(WorkflowPageQueryDto workflowPageQueryDto, BasePageDto basePageDto);

    String publish(WorkflowPublishDto workflowPublishDto);

    WorkflowBeforePublishCheckVo beforePublishCheck(String workflowId);

    PageResponseVo<Workflow> publishedWorkflowPage(PublishedWorkflowQueryDto queryDto, BasePageDto basePageDto);

    void turnSuspendWorkflowToTerminated();

    List<WorkflowFormRel> getWorkflowFormRelsByWorkflowId(String workflowId);

    void checkWorkflowName(String name, String uniqueProcessId);

    boolean checkWorkflowName(WorkflowNameCheckDto workflowNameCheckDto);

    List<WorkflowShortInfoVo> getWorkflowsByCondition(WorkflowQueryDto queryDto);

    List<WorkflowFormRel> getWorkflowFormRelsByFormId(String formId);

    List<Workflow> findByIds(Collection<String> workflowIds);

    VariableNamesVo getVariableNames(String workflowId);

    void initNavigation();

    List<WorkflowNavigationVo> queryNavigation();

    List<WorkflowVersionNavigationVo> queryNavigationByCondition(WorkflowNavigationQueryDto dto);

    Set<String> queryAccessibleWorkflowIds();

    List<UserVo> queryAssignableUser(String workflowName, String taskName, String workflowId);

}
