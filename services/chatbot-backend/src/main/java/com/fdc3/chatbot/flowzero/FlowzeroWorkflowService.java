package com.fdc3.chatbot.flowzero;

import java.util.List;
import java.util.Optional;

public interface FlowzeroWorkflowService {

    FlowzeroWorkflowRecord saveDraft(FlowzeroWorkflowRecord draft);

    Optional<FlowzeroWorkflowRecord> findById(String workflowId);

    List<FlowzeroWorkflowRecord> listDrafts();
}
