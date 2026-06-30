package com.fdc3.flowzeromcp.tool;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.fdc3.flowzeromcp.model.GeneratedWorkflowResult;
import com.fdc3.flowzeromcp.repository.InMemoryWorkflowRepository;
import com.fdc3.flowzeromcp.service.FlowzeroBpmnBuilder;
import com.fdc3.flowzeromcp.service.FlowzeroWorkflowGenerationService;
import java.lang.reflect.Method;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.ai.mcp.annotation.McpTool;
import org.springframework.ai.mcp.annotation.McpToolParam;

class FlowzeroWorkflowMcpToolsTest {

    @Test
    void generateFlowzeroWorkflowToolReturnsGeneratedWorkflowContract() throws NoSuchMethodException {
        FlowzeroWorkflowMcpTools tools = new FlowzeroWorkflowMcpTools(
            new FlowzeroWorkflowGenerationService(new InMemoryWorkflowRepository(), new FlowzeroBpmnBuilder())
        );

        GeneratedWorkflowResult result = tools.generateWorkflow(
            "Create an onboarding workflow with manager review and archive.",
            "Onboarding Workflow",
            List.of("Manager Review", "Archive"),
            "user-17"
        );

        assertEquals("Onboarding Workflow", result.workflowName());
        assertEquals(List.of("Manager Review", "Archive"), result.steps());
        assertEquals("DRAFT", result.status());
        assertTrue(result.workflowId().startsWith("wf-"));
        assertTrue(result.open().route().contains("/flowzero/workflow-management/NewWorkflow/"));

        Method method = FlowzeroWorkflowMcpTools.class.getMethod(
            "generateWorkflow",
            String.class,
            String.class,
            List.class,
            String.class
        );

        McpTool toolAnnotation = method.getAnnotation(McpTool.class);
        assertEquals("generate_flowzero_workflow", toolAnnotation.name());

        McpToolParam[] params = new McpToolParam[method.getParameters().length];
        for (int index = 0; index < method.getParameters().length; index++) {
            params[index] = method.getParameters()[index].getAnnotation(McpToolParam.class);
        }
        org.junit.jupiter.api.Assertions.assertAll(
            () -> assertTrue(params[0].required()),
            () -> assertFalse(params[1].required()),
            () -> assertFalse(params[2].required()),
            () -> assertFalse(params[3].required())
        );
    }
}
