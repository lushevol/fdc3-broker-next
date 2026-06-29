package com.fdc3.flowzeromcp.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fdc3.flowzeromcp.model.GenerateWorkflowRequest;
import com.fdc3.flowzeromcp.model.GeneratedWorkflowResult;
import com.fdc3.flowzeromcp.model.OpenAction;
import com.fdc3.flowzeromcp.model.StoredWorkflow;
import com.fdc3.flowzeromcp.model.WorkflowDetail;
import com.fdc3.flowzeromcp.model.WorkflowPageResult;
import com.fdc3.flowzeromcp.model.WorkflowSummary;
import com.fdc3.flowzeromcp.repository.InMemoryWorkflowRepository;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class FlowzeroWorkflowGenerationService {

    private static final String DEFAULT_STATUS = "DRAFT";
    private static final int DEFAULT_DISPLAY_VERSION = 1;
    private static final String DEFAULT_BUSINESS_AREA = "General";
    private static final String DEFAULT_WORKFLOW_NAME = "Generated Flowzero Workflow";
    private static final String OPEN_LABEL = "Open in Flowzero";

    private final InMemoryWorkflowRepository repository;
    private final FlowzeroBpmnBuilder bpmnBuilder;
    private final ObjectMapper objectMapper;

    public FlowzeroWorkflowGenerationService(
        InMemoryWorkflowRepository repository,
        FlowzeroBpmnBuilder bpmnBuilder
    ) {
        this(repository, bpmnBuilder, new ObjectMapper());
    }

    FlowzeroWorkflowGenerationService(
        InMemoryWorkflowRepository repository,
        FlowzeroBpmnBuilder bpmnBuilder,
        ObjectMapper objectMapper
    ) {
        this.repository = repository;
        this.bpmnBuilder = bpmnBuilder;
        this.objectMapper = objectMapper;
    }

    public GeneratedWorkflowResult generateWorkflow(GenerateWorkflowRequest request) {
        String workflowId = repository.nextWorkflowId();
        String workflowName = normalizedText(request.workflowName(), DEFAULT_WORKFLOW_NAME);
        List<String> steps = normalizedSteps(request);
        String description = buildDescription(request.prompt(), steps);
        String businessArea = normalizedText(request.businessArea(), DEFAULT_BUSINESS_AREA);
        String content = bpmnBuilder.build(workflowId, workflowName, steps);
        String summary = "Generated workflow draft for %s with %d steps.".formatted(workflowName, steps.size());

        StoredWorkflow storedWorkflow = repository.save(new StoredWorkflow(
            workflowId,
            workflowName,
            DEFAULT_STATUS,
            DEFAULT_DISPLAY_VERSION,
            businessArea,
            request.countryCodes(),
            request.ownerIds(),
            description,
            summary,
            steps,
            content,
            normalizedText(request.requestedBy(), "system")
        ));

        WorkflowDetail workflowDetail = new WorkflowDetail(
            storedWorkflow.id(),
            storedWorkflow.name(),
            storedWorkflow.status(),
            storedWorkflow.displayVersion(),
            storedWorkflow.description(),
            storedWorkflow.content()
        );

        return new GeneratedWorkflowResult(
            storedWorkflow.id(),
            storedWorkflow.name(),
            storedWorkflow.status(),
            storedWorkflow.displayVersion(),
            storedWorkflow.businessArea(),
            storedWorkflow.countryCodes(),
            storedWorkflow.ownerIds(),
            storedWorkflow.description(),
            storedWorkflow.summary(),
            storedWorkflow.steps(),
            workflowDetail,
            new OpenAction(OPEN_LABEL, buildOpenRoute(workflowDetail))
        );
    }

    public WorkflowPageResult getWorkflowPage(int page, int size) {
        List<WorkflowSummary> records = repository.findPage(page, size).stream()
            .map(workflow -> new WorkflowSummary(
                workflow.id(),
                workflow.name(),
                workflow.status(),
                workflow.displayVersion(),
                workflow.description(),
                workflow.businessArea(),
                workflow.countryCodes(),
                workflow.ownerIds()
            ))
            .toList();

        return new WorkflowPageResult(records, repository.count(), page, size);
    }

    private List<String> normalizedSteps(GenerateWorkflowRequest request) {
        if (!request.steps().isEmpty()) {
            return request.steps().stream()
                .map(step -> normalizedText(step, ""))
                .filter(step -> !step.isEmpty())
                .toList();
        }

        return List.of("Review Request", "Complete Workflow");
    }

    private String buildDescription(String prompt, List<String> steps) {
        String normalizedPrompt = normalizedText(prompt, "");
        if (!normalizedPrompt.isEmpty()) {
            return normalizedPrompt;
        }

        return "Workflow draft covering: %s".formatted(String.join(", ", steps));
    }

    private String buildOpenRoute(WorkflowDetail workflowDetail) {
        try {
            String encodedDetail = URLEncoder.encode(
                objectMapper.writeValueAsString(workflowDetail),
                StandardCharsets.UTF_8
            ).replace("+", "%20");
            return "/flowzero/workflow-management/NewWorkflow/?workflowDetail=%s&from=create"
                .formatted(encodedDetail);
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Unable to serialize workflow detail for Flowzero route", exception);
        }
    }

    private String normalizedText(String value, String fallback) {
        if (value == null || value.isBlank()) {
            return fallback;
        }

        return value.trim();
    }
}
