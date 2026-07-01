package com.scb.ratan.flowzero.designer.controller;

import com.scb.ratan.flowzero.designer.entity.dto.*;
import com.scb.ratan.flowzero.designer.service.IWorkflowService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * @auther Tian, Terry
 * @date 4/2/2025
 **/
@RestController
@RequestMapping(value = "/api/v1/workflow")
@Slf4j
public class WorkflowController {

    @Autowired
    private IWorkflowService workflowService;

    @PostMapping(value = "/create")
    public ResponseEntity<?> create(@Valid @RequestBody CreateWorkflowDto createWorkflowDto) {
        return ResponseEntity.ok(workflowService.create(createWorkflowDto));
    }

    @PostMapping(value = "/save")
    public ResponseEntity<?> save(@Valid @RequestBody SaveWorkflowDto saveWorkflowDto) {
        return ResponseEntity.ok(workflowService.save(saveWorkflowDto));
    }

    @GetMapping(value = "/detail/{workflowId}")
    public ResponseEntity<?> detail(@PathVariable String workflowId) {
        return ResponseEntity.ok(workflowService.detail(workflowId));
    }

    @GetMapping(value = "/page")
    public ResponseEntity<?> page(WorkflowPageQueryDto workflowPageQueryDto, @Valid BasePageDto basePageDto) {
        return ResponseEntity.ok(workflowService.page(workflowPageQueryDto, basePageDto));
    }

    @PostMapping(value = "/publish")
    public ResponseEntity<?> publish(@Valid @RequestBody WorkflowPublishDto workflowPublishDto) {
        return ResponseEntity.ok(workflowService.publish(workflowPublishDto));
    }

    @GetMapping(value = "/before-publish-check/{workflowId}")
    public ResponseEntity<?> beforePublishCheck(@PathVariable String workflowId) {
        return ResponseEntity.ok(workflowService.beforePublishCheck(workflowId));
    }

    @GetMapping(value = "/published-workflow-page")
    public ResponseEntity<?> publishedWorkflowPage(PublishedWorkflowQueryDto queryDto, @Valid BasePageDto basePageDto) {
        return ResponseEntity.ok(workflowService.publishedWorkflowPage(queryDto, basePageDto));
    }

    @PostMapping(value = "/turn-suspend-workflow-to-terminated")
    public ResponseEntity<?> turnSuspendWorkflowToTerminated() {
        workflowService.turnSuspendWorkflowToTerminated();
        return ResponseEntity.ok("success");
    }

    @GetMapping(value = "/{workflowId}/forms")
    public ResponseEntity<?> getWorkflowFormRelsByWorkflowId(@PathVariable String workflowId) {
        return ResponseEntity.ok(workflowService.getWorkflowFormRelsByWorkflowId(workflowId));
    }

    @PostMapping(value = "/check-name")
    public ResponseEntity<?> checkWorkflowName(@Valid @RequestBody WorkflowNameCheckDto workflowNameCheckDto) {
        return ResponseEntity.ok(workflowService.checkWorkflowName(workflowNameCheckDto));
    }

    @PostMapping(value = "/get-workflows-by-condition")
    public ResponseEntity<?> getWorkflowsByCondition(@RequestBody WorkflowQueryDto queryDto) {
        return ResponseEntity.ok(workflowService.getWorkflowsByCondition(queryDto));
    }

    // Currently, there is only a single form variable in the start namespace,
    // and this interface is not needed for the time being.
    @Deprecated
    @GetMapping(value = "/variable-names/{workflowId}")
    public ResponseEntity<?> getVariableNames(@PathVariable String workflowId) {
        return ResponseEntity.ok(workflowService.getVariableNames(workflowId));
    }

    @GetMapping(value = "/navigation")
    public ResponseEntity<?> queryNavigation(){
        return ResponseEntity.ok(workflowService.queryNavigation());
    }

    @PostMapping(value = "/navigation/init")
    public ResponseEntity<?> initNavigation(){
        workflowService.initNavigation();
        return ResponseEntity.ok("Navigation initialization triggered successfully.");
    }

    @PostMapping(value = "/navigation/query-by-condition")
    public ResponseEntity<?> queryNavigationByCondition(
            @Valid @RequestBody WorkflowNavigationQueryDto queryDto) {
        return ResponseEntity.ok(workflowService.queryNavigationByCondition(queryDto));
    }

    @GetMapping(value = "/navigation/accessible-workflowIds")
    public ResponseEntity<?> queryAccessibleWorkflowIds() {
        return ResponseEntity.ok(workflowService.queryAccessibleWorkflowIds());
    }

    @GetMapping(value = "/navigation/query-assignable-user")
    public ResponseEntity<?>  queryAssignableUser(@RequestParam("workflowName") String workflowName,
                                                  @RequestParam("taskName") String taskName,
                                                  @RequestParam(value = "workflowId", required = false) String workflowId){
        return ResponseEntity.ok(workflowService.queryAssignableUser(workflowName, taskName, workflowId));
    }
}
