package com.fdc3.flowzeromcp.controller;

import com.fdc3.flowzeromcp.model.GenerateWorkflowRequest;
import com.fdc3.flowzeromcp.model.GeneratedWorkflowResult;
import com.fdc3.flowzeromcp.model.WorkflowDetail;
import com.fdc3.flowzeromcp.model.WorkflowPageResult;
import com.fdc3.flowzeromcp.model.WorkflowSummary;
import com.fdc3.flowzeromcp.service.FlowzeroWorkflowGenerationService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/flowzero/v1/workflow")
public class FlowzeroWorkflowController {

    private final FlowzeroWorkflowGenerationService service;

    public FlowzeroWorkflowController(FlowzeroWorkflowGenerationService service) {
        this.service = service;
    }

    @PostMapping("/create")
    public FlowzeroApiResponse<GeneratedWorkflowResult> create(@RequestBody CreateWorkflowApiRequest request) {
        GeneratedWorkflowResult generated = service.generate(new GenerateWorkflowRequest(
            request.prompt(),
            request.workflowName(),
            request.steps(),
            request.businessArea(),
            request.countryCodes(),
            request.ownerIds(),
            request.requestedBy()
        ));
        return FlowzeroApiResponse.success(generated);
    }

    @GetMapping("/page")
    public FlowzeroWorkflowPageResponse<WorkflowSummary> page(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        WorkflowPageResult result = service.getWorkflowPage(page, size);
        long totalPages = result.total() == 0 ? 0 : (long) Math.ceil((double) result.total() / result.size());
        List<WorkflowSummary> data = result.records();
        return new FlowzeroWorkflowPageResponse<>(result.page(), result.size(), result.total(), totalPages, data);
    }

    @GetMapping("/detail/{workflowId}")
    public WorkflowDetail detail(@PathVariable String workflowId) {
        return service.getWorkflowDetail(workflowId);
    }
}
