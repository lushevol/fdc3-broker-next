package com.fdc3.flowzeromcp.tool;

import com.fdc3.flowzeromcp.model.GenerateWorkflowRequest;
import com.fdc3.flowzeromcp.model.GeneratedWorkflowResult;
import com.fdc3.flowzeromcp.service.FlowzeroWorkflowGenerationService;
import java.util.List;
import org.springframework.ai.mcp.annotation.McpTool;
import org.springframework.ai.mcp.annotation.McpToolParam;
import org.springframework.stereotype.Service;

@Service
public class FlowzeroWorkflowMcpTools {

    private final FlowzeroWorkflowGenerationService service;

    public FlowzeroWorkflowMcpTools(FlowzeroWorkflowGenerationService service) {
        this.service = service;
    }

    @McpTool(
        name = "generate_flowzero_workflow",
        description = "Create a Flowzero workflow draft from natural-language workflow requirements."
    )
    public GeneratedWorkflowResult generateWorkflow(
        @McpToolParam(description = "Natural-language workflow requirements", required = true) String prompt,
        @McpToolParam(description = "Optional workflow name") String workflowName,
        @McpToolParam(description = "Optional ordered workflow steps") List<String> steps,
        @McpToolParam(description = "Optional requesting user id") String requestedBy
    ) {
        return service.generate(new GenerateWorkflowRequest(
            prompt,
            workflowName,
            steps,
            null,
            List.of(),
            List.of(),
            requestedBy
        ));
    }
}
