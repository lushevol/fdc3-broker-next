package com.fdc3.chatbot.flowzero;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class InMemoryFlowzeroWorkflowService implements FlowzeroWorkflowService {

    private final AtomicLong sequence = new AtomicLong(1000L);
    private final ConcurrentMap<String, FlowzeroWorkflowRecord> drafts = new ConcurrentHashMap<>();

    @Override
    public FlowzeroWorkflowRecord saveDraft(FlowzeroWorkflowRecord draft) {
        String workflowId = draft.workflowId() == null || draft.workflowId().isBlank()
                ? "flowzero-wf-" + sequence.incrementAndGet()
                : draft.workflowId();
        FlowzeroWorkflowRecord persisted = new FlowzeroWorkflowRecord(
                workflowId,
                draft.workflowName(),
                draft.description(),
                draft.businessArea(),
                draft.countryCodes(),
                draft.ownerIds(),
                draft.nodes(),
                draft.edges(),
                draft.bpmnXml(),
                draft.summary(),
                draft.warnings(),
                draft.createdAt() == null ? Instant.now() : draft.createdAt()
        );
        drafts.put(workflowId, persisted);
        return persisted;
    }

    @Override
    public Optional<FlowzeroWorkflowRecord> findById(String workflowId) {
        return Optional.ofNullable(drafts.get(workflowId));
    }

    @Override
    public List<FlowzeroWorkflowRecord> listDrafts() {
        return new ArrayList<>(drafts.values()).stream()
                .sorted(Comparator.comparing(FlowzeroWorkflowRecord::createdAt).reversed())
                .toList();
    }
}
