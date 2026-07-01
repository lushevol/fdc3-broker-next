package com.scb.ratan.flowzero.designer.ai.tool;

import com.scb.ratan.flowzero.designer.ai.model.FlowzeroWorkflowDraftRequest;
import com.scb.ratan.flowzero.designer.ai.model.FlowzeroWorkflowDraftResponse;
import com.scb.ratan.flowzero.designer.ai.service.FlowzeroWorkflowDraftGenerator;
import com.scb.ratan.flowzero.designer.entity.dbo.Workflow;
import com.scb.ratan.flowzero.designer.entity.dto.CreateWorkflowDto;
import com.scb.ratan.flowzero.designer.entity.dto.SaveWorkflowDto;
import com.scb.ratan.flowzero.designer.service.IWorkflowService;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class FlowzeroWorkflowMcpTools {

    private static final String DEFAULT_BUSINESS_AREA = "General";
    private static final String DEFAULT_COUNTRY_CODE = "GLOBAL";
    private static final String DEFAULT_OWNER_ID = "system";

    private static final String TOOL_DESCRIPTION = """
        Generate a FlowZero workflow draft from natural-language workflow instructions.
        FlowZero does not call an LLM. This tool is deterministic, persists the draft through
        the FlowZero workflow service, and returns editable FlowZero nodes, edges, BPMN XML,
        the persisted workflow id, a summary, and warnings for ambiguous prompts.
        """;

    private final FlowzeroWorkflowDraftGenerator generator;
    private final IWorkflowService workflowService;

    public FlowzeroWorkflowMcpTools(FlowzeroWorkflowDraftGenerator generator, IWorkflowService workflowService) {
        this.generator = generator;
        this.workflowService = workflowService;
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
        FlowzeroWorkflowDraftResponse draft = generator.generate(new FlowzeroWorkflowDraftRequest(
            prompt,
            workflowName,
            description,
            businessArea,
            countryCodes,
            ownerIds
        ));
        String persistedCountryCodes = commaSeparatedOrDefault(draft.countryCodes(), DEFAULT_COUNTRY_CODE);
        String persistedOwnerIds = commaSeparatedOrDefault(draft.ownerIds(), DEFAULT_OWNER_ID);
        String persistedBusinessArea = textOrDefault(draft.businessArea(), DEFAULT_BUSINESS_AREA);
        Workflow workflow = workflowService.create(new CreateWorkflowDto(
            draft.workflowName(),
            persistedCountryCodes,
            draft.description(),
            draft.bpmnXml(),
            persistedBusinessArea,
            ""
        ));
        workflowService.save(new SaveWorkflowDto(
            workflow.getId(),
            draft.workflowName(),
            persistedCountryCodes,
            persistedOwnerIds,
            draft.description(),
            draft.bpmnXml(),
            persistedBusinessArea,
            "",
            List.of()
        ));
        return new FlowzeroWorkflowDraftResponse(
            workflow.getId(),
            draft.workflowName(),
            draft.description(),
            persistedBusinessArea,
            splitCommaSeparated(persistedCountryCodes),
            splitCommaSeparated(persistedOwnerIds),
            draft.nodes(),
            draft.edges(),
            draft.bpmnXml(),
            draft.summary(),
            draft.warnings()
        );
    }

    private String commaSeparatedOrDefault(List<String> values, String fallback) {
        if (values == null || values.isEmpty()) {
            return fallback;
        }
        String joined = String.join(",", values).trim();
        return joined.isEmpty() ? fallback : joined;
    }

    private String textOrDefault(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value.trim();
    }

    private List<String> splitCommaSeparated(String value) {
        return List.of(value.split(","));
    }
}
