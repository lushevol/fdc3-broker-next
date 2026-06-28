package com.fdc3.chatbot.tool;

import com.fdc3.chatbot.flowzero.FlowzeroWorkflowRecord;
import com.fdc3.chatbot.flowzero.FlowzeroWorkflowService;
import com.fdc3.chatbot.flowzero.InMemoryFlowzeroWorkflowService;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class FlowzeroWorkflowToolTest {

    @Test
    void executePersistsGeneratedWorkflowThroughWorkflowService() {
        FlowzeroWorkflowService workflowService = new InMemoryFlowzeroWorkflowService();
        FlowzeroWorkflowTool tool = new FlowzeroWorkflowTool(workflowService);

        Object result = tool.execute(Map.of(
                "prompt", "start, manager approval, finance approval, end",
                "workflowName", "Expense Approval",
                "businessArea", "Finance",
                "countryCodes", List.of("CN"),
                "ownerIds", List.of("alice")
        )).join();

        Map<?, ?> resultMap = (Map<?, ?>) result;
        String workflowId = String.valueOf(resultMap.get("workflowId"));
        FlowzeroWorkflowRecord persisted = workflowService.findById(workflowId).orElseThrow();

        assertEquals("Expense Approval", persisted.workflowName());
        assertEquals("Finance", persisted.businessArea());
        assertEquals(List.of("CN"), persisted.countryCodes());
        assertEquals(List.of("alice"), persisted.ownerIds());
        assertEquals("Start -> Manager Approval -> Finance Approval -> End", persisted.summary());
        assertTrue(persisted.bpmnXml().contains("bpmn:process"));
        assertEquals(workflowId, resultMap.get("workflowId"));
    }
}
