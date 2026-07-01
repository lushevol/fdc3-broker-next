package com.fdc3.flowzeromcp.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.fdc3.flowzeromcp.model.GenerateWorkflowRequest;
import com.fdc3.flowzeromcp.model.GeneratedWorkflowResult;
import com.fdc3.flowzeromcp.model.WorkflowPageResult;
import com.fdc3.flowzeromcp.repository.InMemoryWorkflowRepository;
import java.util.List;
import org.junit.jupiter.api.Test;

class FlowzeroWorkflowGenerationServiceTest {

    @Test
    void generatesAndPersistsWorkflowDraftWithFlowzeroOpenRoute() {
        FlowzeroWorkflowGenerationService service =
            new FlowzeroWorkflowGenerationService(new InMemoryWorkflowRepository(), new FlowzeroBpmnBuilder());

        GeneratedWorkflowResult result = service.generateWorkflow(new GenerateWorkflowRequest(
            "Create an onboarding approval workflow with manager review, compliance review, and archive.",
            "Employee Onboarding Approval",
            List.of("Manager Review", "Compliance Review", "Archive"),
            "Operations",
            List.of("SG", "CN"),
            List.of("owner-1", "owner-2"),
            "requester-7"
        ));

        assertNotNull(result.workflowId());
        assertEquals("Employee Onboarding Approval", result.workflowName());
        assertEquals("DRAFT", result.status());
        assertEquals(List.of("Manager Review", "Compliance Review", "Archive"), result.steps());
        assertEquals("Employee Onboarding Approval", result.workflowDetail().name());
        assertTrue(result.workflowDetail().content().contains("Manager Review"));
        assertTrue(result.workflowDetail().content().contains("Compliance Review"));
        assertTrue(result.workflowDetail().content().contains("Archive"));
        assertTrue(result.open().route().startsWith("/flowzero/workflow-management/NewWorkflow/?workflowDetail="));
        assertTrue(result.open().route().contains("&from=create"));
    }

    @Test
    void returnsCreatedWorkflowFromRepositoryPageQuery() {
        FlowzeroWorkflowGenerationService service =
            new FlowzeroWorkflowGenerationService(new InMemoryWorkflowRepository(), new FlowzeroBpmnBuilder());

        GeneratedWorkflowResult created = service.generateWorkflow(new GenerateWorkflowRequest(
            "Create an account closure workflow with review and archive.",
            "Account Closure",
            List.of("Operations Review", "Archive"),
            "Finance",
            List.of("HK"),
            List.of("owner-9"),
            "requester-2"
        ));

        WorkflowPageResult page = service.getWorkflowPage(0, 10);

        assertEquals(1, page.total());
        assertEquals(0, page.page());
        assertEquals(10, page.size());
        assertEquals(1, page.records().size());
        assertEquals(created.workflowId(), page.records().getFirst().id());
        assertEquals("Account Closure", page.records().getFirst().name());
    }
}
