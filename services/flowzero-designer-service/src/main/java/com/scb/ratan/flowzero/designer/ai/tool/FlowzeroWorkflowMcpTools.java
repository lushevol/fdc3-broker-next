package com.scb.ratan.flowzero.designer.ai.tool;

import com.scb.ratan.flowzero.designer.ai.model.FlowzeroWorkflowDraftRequest;
import com.scb.ratan.flowzero.designer.ai.model.FlowzeroWorkflowDraftResponse;
import com.scb.ratan.flowzero.designer.ai.service.FlowzeroWorkflowDraftGenerator;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class FlowzeroWorkflowMcpTools {

    private static final String TOOL_DESCRIPTION = """
        Generate a FlowZero workflow draft from natural-language workflow instructions.
        FlowZero does not call an LLM. This tool is deterministic and returns editable
        FlowZero nodes, edges, BPMN XML, a summary, and warnings for ambiguous prompts.
        """;

    private final FlowzeroWorkflowDraftGenerator generator;

    public FlowzeroWorkflowMcpTools(FlowzeroWorkflowDraftGenerator generator) {
        this.generator = generator;
    }

    @Tool(name = "generate_flowzero_workflow", description = TOOL_DESCRIPTION)
    public FlowzeroWorkflowDraftResponse generateFlowzeroWorkflow(
        @ToolParam(description = "Natural-language workflow description. Example: start, manager approval, finance approval, end") String prompt,
        @ToolParam(description = "Workflow display name. Defaults to Generated FlowZero Workflow when omitted") String workflowName,
        @ToolParam(description = "Optional workflow description") String description,
        @ToolParam(description = "Optional business area") String businessArea,
        @ToolParam(description = "Optional country codes such as CN, SG, HK") List<String> countryCodes,
        @ToolParam(description = "Optional owner user IDs") List<String> ownerIds
    ) {
        return generator.generate(new FlowzeroWorkflowDraftRequest(
            prompt,
            workflowName,
            description,
            businessArea,
            countryCodes,
            ownerIds
        ));
    }
}
