package com.fdc3.flowzeromcp.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fdc3.flowzeromcp.repository.InMemoryWorkflowRepository;
import com.fdc3.flowzeromcp.service.FlowzeroBpmnBuilder;
import com.fdc3.flowzeromcp.service.FlowzeroWorkflowGenerationService;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

class FlowzeroWorkflowControllerTest {

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        FlowzeroWorkflowGenerationService service =
            new FlowzeroWorkflowGenerationService(new InMemoryWorkflowRepository(), new FlowzeroBpmnBuilder());
        mockMvc = MockMvcBuilders.standaloneSetup(new FlowzeroWorkflowController(service)).build();
    }

    @Test
    void createEndpointReturnsEnvelopeAndSharedRepositoryData() throws Exception {
        String requestBody = new ObjectMapper().writeValueAsString(new CreateWorkflowApiRequest(
            "Create an onboarding workflow with manager review and archive.",
            "Onboarding Workflow",
            List.of("Manager Review", "Archive"),
            "Operations",
            List.of("SG"),
            List.of("owner-1"),
            "user-19"
        ));

        mockMvc.perform(post("/api/flowzero/v1/workflow/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.code").value(200))
            .andExpect(jsonPath("$.message").value("success"))
            .andExpect(jsonPath("$.data.workflowId").value("wf-000001"))
            .andExpect(jsonPath("$.data.workflowName").value("Onboarding Workflow"))
            .andExpect(jsonPath("$.data.workflowDetail.name").value("Onboarding Workflow"));

        mockMvc.perform(get("/api/flowzero/v1/workflow/page")
                .param("page", "0")
                .param("size", "10"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.page").value(0))
            .andExpect(jsonPath("$.size").value(10))
            .andExpect(jsonPath("$.totalElements").value(1))
            .andExpect(jsonPath("$.totalPages").value(1))
            .andExpect(jsonPath("$.data[0].id").value("wf-000001"))
            .andExpect(jsonPath("$.data[0].name").value("Onboarding Workflow"));

        mockMvc.perform(get("/api/flowzero/v1/workflow/detail/{workflowId}", "wf-000001"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value("wf-000001"))
            .andExpect(jsonPath("$.name").value("Onboarding Workflow"))
            .andExpect(jsonPath("$.content").isString());
    }
}
