package com.scb.ratan.flowzero.workflow.controller;

import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.scb.ratan.flowzero.workflow.entity.dbo.WorkflowRequest;
import com.scb.ratan.flowzero.workflow.entity.dto.BasePageDto;
import com.scb.ratan.flowzero.workflow.entity.dto.MyRequestPageQueryDto;
import com.scb.ratan.flowzero.workflow.entity.dto.RaiseWorkflowRequestDto;
import com.scb.ratan.flowzero.workflow.entity.dto.StopInstancesDto;
import com.scb.ratan.flowzero.workflow.entity.vo.PageResponseVo;
import com.scb.ratan.flowzero.workflow.entity.vo.RequestVo;
import com.scb.ratan.flowzero.workflow.entity.vo.RunningInstancesVo;
import com.scb.ratan.flowzero.workflow.service.IWorkflowRequestService;
import com.scb.ratan.flowzero.workflow.utils.UserInfoUtils;

import jakarta.validation.Valid;

/**
 * @author MaYue
 * @date 8/12/2025
 */

@RestController
@RequestMapping("/api/v1/workflow-request")
public class WorkflowRequestController {

    @Autowired
    private IWorkflowRequestService workflowRequestService;

    /**
     *start a process
     */
    @PostMapping("/start")
    public ResponseEntity<WorkflowRequest> startProcessInstance(@Valid @RequestBody RaiseWorkflowRequestDto dto) {
        return ResponseEntity.ok(workflowRequestService.startProcess(dto));
    }

    /**
     * get request list (process instance) created by user
     */
    @GetMapping("/my-request")
    public ResponseEntity<PageResponseVo<RequestVo>> getUserRequest(MyRequestPageQueryDto queryDto, @Valid BasePageDto pageDto) {
        PageResponseVo<RequestVo> instances = workflowRequestService.getUserRequest(
            queryDto, pageDto, UserInfoUtils.getUserId());
        return ResponseEntity.ok(instances);
    }

    /**
     * get request list (process instance) approved by user
     */
    @GetMapping("/my-approval")
    public ResponseEntity<PageResponseVo<RequestVo>> getUserApproval(MyRequestPageQueryDto queryDto, @Valid BasePageDto pageDto) {
        PageResponseVo<RequestVo> instances = workflowRequestService.getUserApproval(
            queryDto, pageDto, UserInfoUtils.getUserId());
        return ResponseEntity.ok(instances);
    }

    @GetMapping("/running-instances/{uniqueVersionId}")
    public ResponseEntity<List<RunningInstancesVo>> getRunningInstancesByUniqueVersionId(@PathVariable String uniqueVersionId) {
        return ResponseEntity.ok(workflowRequestService.getRunningInstancesByUniqueVersionId(uniqueVersionId));
    }

    @PostMapping("/terminate-instances")
    public ResponseEntity<String> terminateInstancesByUniqueVersionId(@Valid @RequestBody StopInstancesDto stopInstancesDto) {
        workflowRequestService.terminateRunningInstancesByUniqueVersionId(stopInstancesDto);
        return ResponseEntity.ok("Instances terminated successfully");
    }

    @PostMapping("/running-instances/by-keys")
    public ResponseEntity<List<RunningInstancesVo>> getRunningInstancesByProcessDefinitionKeys(
        @RequestBody Collection<String> processDefinitionKeys) {
        List<RunningInstancesVo> instances = workflowRequestService
            .getRunningInstancesByProcessDefinitionKeys(processDefinitionKeys);
        return ResponseEntity.ok(instances);
    }

    @PostMapping("/save")
    public ResponseEntity<WorkflowRequest> save(@Valid @RequestBody RaiseWorkflowRequestDto raiseWorkflowRequestDto) {
        return ResponseEntity.ok(workflowRequestService.save(raiseWorkflowRequestDto));
    }

    @GetMapping("/draft")
    public ResponseEntity<WorkflowRequest> getDraft(@RequestParam String workflowId) {
        return ResponseEntity.ok(workflowRequestService.getDraft(workflowId, UserInfoUtils.getUserId()));
    }

}