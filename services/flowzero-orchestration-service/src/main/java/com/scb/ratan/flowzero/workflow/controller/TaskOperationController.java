package com.scb.ratan.flowzero.workflow.controller;

import com.scb.ratan.flowzero.workflow.entity.dto.*;
import com.scb.ratan.flowzero.workflow.entity.vo.*;
import com.scb.ratan.flowzero.workflow.service.ITaskOperationService;
import com.scb.ratan.flowzero.workflow.utils.UserInfoUtils;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author MaYue
 * @date 8/12/2025
 */

@RestController
@RequestMapping("/api/v1/tasks")
@Validated
@Slf4j
public class TaskOperationController {

    @Autowired
    private ITaskOperationService taskService;

    @GetMapping("/inbox")
    public ResponseEntity<PageResponseVo<ProcessTaskVo>> queryTasks(@Valid TaskPageQueryDto queryDto, @Valid BasePageDto pageDTO) {
        PageResponseVo<ProcessTaskVo> userTasks = taskService.queryTasks(queryDto, pageDTO, UserInfoUtils.getUserId());
        return ResponseEntity.ok(userTasks);
    }

    /**
     * get the task detail by taskId
     */
    @GetMapping("/detail/{taskId}")
    public ResponseEntity<TaskVo> getTaskDetail(@PathVariable String taskId) {
        TaskVo taskVO = taskService.getTaskDetail(taskId);
        return ResponseEntity.ok(taskVO);
    }

    /**
     * approve Task
     */
    @PostMapping("/approve")
    public ResponseEntity<String> operateTask(@Valid @RequestBody BaseTaskOperationDto dto) {
        dto.setUserId(UserInfoUtils.getUserId());
        taskService.approve(dto);
        return ResponseEntity.ok("Task approve successfully");
    }

    @PostMapping("/reject")
    public ResponseEntity<String> reject(@Valid @RequestBody BaseTaskOperationDto dto) {
        dto.setUserId(UserInfoUtils.getUserId());
        taskService.reject(dto);
        return ResponseEntity.ok("Task reject successfully");
    }

    @PostMapping("/terminate")
    public ResponseEntity<String> terminate(@Valid @RequestBody BaseTaskOperationDto dto) {
        dto.setUserId(UserInfoUtils.getUserId());
        taskService.terminate(dto);
        return ResponseEntity.ok("Task terminate successfully");
    }

    @GetMapping("/extension-properties/{taskId}")
    public ResponseEntity<List<NameValueVo>> getTaskProperties(@PathVariable String taskId) {
        return ResponseEntity.ok(taskService.getTaskPropertieList(taskId));
    }

    @PostMapping("/batch/claim")
    public ResponseEntity<BatchOperationResultVo<BatchItemResultVo>> batchClaimTasks(
        @Valid @RequestBody BatchOperationDto request) {

        return ResponseEntity.ok(taskService.batchClaim(request, UserInfoUtils.getUserId()));
    }

    @PostMapping("/batch/assign")
    public ResponseEntity<BatchOperationResultVo<BatchItemResultVo>> batchAssignTasks(
        @Valid @RequestBody BatchOperationDto request) {

        return ResponseEntity.ok(taskService.batchAssign(request));
    }

    @GetMapping("/assignable-users")
    public ResponseEntity<List<AssignableUserVo>> getAssignableUsers(@Valid AssignableUsersQueryDto queryDto) {
        return ResponseEntity.ok(taskService.getAssignableUsers(queryDto));
    }

}
