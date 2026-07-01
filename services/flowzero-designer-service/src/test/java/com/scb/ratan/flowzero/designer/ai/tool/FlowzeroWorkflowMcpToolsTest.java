package com.scb.ratan.flowzero.designer.ai.tool;

import com.scb.ratan.flowzero.designer.ai.model.FlowzeroWorkflowDraftRequest;
import com.scb.ratan.flowzero.designer.ai.model.FlowzeroWorkflowDraftResponse;
import com.scb.ratan.flowzero.designer.ai.model.FlowzeroWorkflowDraftResponse.Position;
import com.scb.ratan.flowzero.designer.ai.model.FlowzeroWorkflowDraftResponse.WorkflowEdge;
import com.scb.ratan.flowzero.designer.ai.model.FlowzeroWorkflowDraftResponse.WorkflowNode;
import com.scb.ratan.flowzero.designer.ai.service.FlowzeroWorkflowDraftGenerator;
import com.scb.ratan.flowzero.designer.entity.dbo.Workflow;
import com.scb.ratan.flowzero.designer.entity.dto.CreateWorkflowDto;
import com.scb.ratan.flowzero.designer.entity.dto.SaveWorkflowDto;
import com.scb.ratan.flowzero.designer.service.IWorkflowService;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class FlowzeroWorkflowMcpToolsTest {

    @Test
    void generateFlowzeroWorkflowPersistsDraftThroughWorkflowService() {
        FlowzeroWorkflowDraftGenerator generator = mock(FlowzeroWorkflowDraftGenerator.class);
        IWorkflowService workflowService = mock(IWorkflowService.class);
        FlowzeroWorkflowDraftResponse draft = new FlowzeroWorkflowDraftResponse(
            null,
            "Expense Approval",
            "Approval flow",
            "Finance",
            List.of("CN"),
            List.of("alice"),
            List.of(new WorkflowNode("start_0_start", "StartEventNode", "Start", new Position(100, 140), Map.of())),
            List.of(new WorkflowEdge("edge_1", "start_0_start", "end_1_end", "start_0_start_out", "end_1_end_in", Map.of())),
            "<bpmn:definitions />",
            "Start -> End",
            List.of()
        );
        when(generator.generate(org.mockito.ArgumentMatchers.any())).thenReturn(draft);
        Workflow createdWorkflow = new Workflow();
        createdWorkflow.setId("workflow-123");
        createdWorkflow.setUniqueProcessId("process-abc");
        when(workflowService.create(org.mockito.ArgumentMatchers.any())).thenReturn(createdWorkflow);

        FlowzeroWorkflowMcpTools tools = new FlowzeroWorkflowMcpTools(generator, workflowService);
        FlowzeroWorkflowDraftResponse response = tools.generateFlowzeroWorkflow(
            "start, manager approval, end",
            "Expense Approval",
            "Approval flow",
            "Finance",
            List.of("CN"),
            List.of("alice")
        );

        ArgumentCaptor<FlowzeroWorkflowDraftRequest> requestCaptor =
            ArgumentCaptor.forClass(FlowzeroWorkflowDraftRequest.class);
        verify(generator).generate(requestCaptor.capture());
        assertThat(requestCaptor.getValue().prompt()).isEqualTo("start, manager approval, end");
        assertThat(requestCaptor.getValue().workflowName()).isEqualTo("Expense Approval");
        assertThat(requestCaptor.getValue().countryCodes()).containsExactly("CN");
        ArgumentCaptor<CreateWorkflowDto> createCaptor = ArgumentCaptor.forClass(CreateWorkflowDto.class);
        verify(workflowService).create(createCaptor.capture());
        assertThat(createCaptor.getValue().getName()).isEqualTo("Expense Approval");
        assertThat(createCaptor.getValue().getCountryCodes()).isEqualTo("CN");
        assertThat(createCaptor.getValue().getBusinessArea()).isEqualTo("Finance");
        ArgumentCaptor<SaveWorkflowDto> saveCaptor = ArgumentCaptor.forClass(SaveWorkflowDto.class);
        verify(workflowService).save(saveCaptor.capture());
        assertThat(saveCaptor.getValue().getId()).isEqualTo("workflow-123");
        assertThat(saveCaptor.getValue().getName()).isEqualTo("Expense Approval");
        assertThat(saveCaptor.getValue().getOwnerIds()).isEqualTo("alice");
        assertThat(saveCaptor.getValue().getContent()).contains("bpmn:definitions");
        assertThat(response.workflowId()).isEqualTo("workflow-123");
        assertThat(response.nodes()).hasSize(1);
        assertThat(response.edges()).hasSize(1);
        assertThat(response.bpmnXml()).contains("bpmn");
        assertThat(response.summary()).isEqualTo("Start -> End");
        assertThat(response.warnings()).isEmpty();
    }
}
