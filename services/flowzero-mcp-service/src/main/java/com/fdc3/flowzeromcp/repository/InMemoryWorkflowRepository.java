package com.fdc3.flowzeromcp.repository;

import com.fdc3.flowzeromcp.model.StoredWorkflow;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.stereotype.Repository;

@Repository
public class InMemoryWorkflowRepository {

    private final AtomicLong workflowSequence = new AtomicLong();
    private final ConcurrentMap<String, StoredWorkflow> workflows = new ConcurrentHashMap<>();

    public StoredWorkflow save(StoredWorkflow workflow) {
        workflows.put(workflow.id(), workflow);
        return workflow;
    }

    public String nextWorkflowId() {
        return "wf-%06d".formatted(workflowSequence.incrementAndGet());
    }

    public long count() {
        return workflows.size();
    }

    public List<StoredWorkflow> findPage(int page, int size) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.max(size, 1);
        int fromIndex = safePage * safeSize;

        List<StoredWorkflow> sorted = workflows.values().stream()
            .sorted(Comparator.comparing(StoredWorkflow::id).reversed())
            .toList();

        if (fromIndex >= sorted.size()) {
            return List.of();
        }

        int toIndex = Math.min(fromIndex + safeSize, sorted.size());
        return new ArrayList<>(sorted.subList(fromIndex, toIndex));
    }
}
