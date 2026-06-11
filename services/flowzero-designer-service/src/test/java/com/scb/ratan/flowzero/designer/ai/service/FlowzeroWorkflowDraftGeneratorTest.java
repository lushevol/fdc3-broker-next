package com.scb.ratan.flowzero.designer.ai.service;

import com.scb.ratan.flowzero.designer.ai.model.FlowzeroWorkflowDraftRequest;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class FlowzeroWorkflowDraftGeneratorTest {

    private final FlowzeroWorkflowDraftGenerator generator = new FlowzeroWorkflowDraftGenerator();

    @Test
    void generatesLinearApprovalWorkflowFromNaturalLanguage() {
        var response = generator.generate(new FlowzeroWorkflowDraftRequest(
            "Create an approval workflow: start with request form, manager approval, finance approval, end",
            "Expense Approval",
            "Expense approval workflow",
            "Finance",
            List.of("CN"),
            List.of("alice")
        ));

        assertThat(response.workflowName()).isEqualTo("Expense Approval");
        assertThat(response.summary()).isEqualTo("Start with Request Form -> Manager Approval -> Finance Approval -> End");
        assertThat(response.warnings()).isEmpty();
        assertThat(response.nodes()).extracting("type")
            .containsExactly("StartEventNode", "WorkFlowStepNode", "WorkFlowStepNode", "EndNode");
        assertThat(response.nodes()).extracting("label")
            .containsExactly("Start with Request Form", "Manager Approval", "Finance Approval", "End");
        assertThat(response.edges()).hasSize(3);
        assertThat(response.edges().get(0).source()).isEqualTo(response.nodes().get(0).id());
        assertThat(response.edges().get(0).target()).isEqualTo(response.nodes().get(1).id());
        assertThat(response.bpmnXml())
            .contains("<bpmn:process")
            .contains("<bpmn:startEvent")
            .contains("<bpmn:userTask")
            .contains("<bpmn:endEvent")
            .contains("Manager Approval");
    }

    @Test
    void rejectsBlankPrompt() {
        assertThatThrownBy(() -> generator.generate(new FlowzeroWorkflowDraftRequest(
            " ",
            "Blank",
            null,
            null,
            List.of(),
            List.of()
        ))).isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("prompt is required");
    }

    @Test
    void returnsWarningWhenPromptHasTooLittleWorkflowStructure() {
        var response = generator.generate(new FlowzeroWorkflowDraftRequest(
            "approval",
            "",
            null,
            null,
            List.of(),
            List.of()
        ));

        assertThat(response.workflowName()).isEqualTo("Generated FlowZero Workflow");
        assertThat(response.nodes()).extracting("type")
            .containsExactly("StartEventNode", "WorkFlowStepNode", "EndNode");
        assertThat(response.warnings()).containsExactly(
            "Prompt had limited structure, so FlowZero generated a minimal start-task-end workflow."
        );
    }
}
