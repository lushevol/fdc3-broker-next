package com.scb.ratan.flowzero.designer.service.listener;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.ratan.flowzero.designer.common.event.WorkflowPublishedEvent;
import com.scb.ratan.flowzero.designer.entity.dbo.WorkflowNavigation;
import com.scb.ratan.flowzero.designer.repository.WorkflowNavigationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilderFactory;
import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

/**
 * Async listener that rebuilds the {@code t_workflow_navigation} cache when
 * a workflow is published.
 *
 * <p>Flow:
 * <ol>
 *   <li>Receive {@link WorkflowPublishedEvent}</li>
 *   <li>Parse the BPMN XML and extract every {@code userTask} element</li>
 *   <li>Delete the existing navigation rows for this workflow</li>
 *   <li>Insert fresh rows with taskKey, taskName, assignee,
 *       candidateUsers and candidateGroups from the BPMN</li>
 * </ol>
 *
 * @author Kinson Wang
 * @date 5/6/2026
 */
@Component
@Slf4j
public class WorkflowNavigationSyncListener {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    // BPMN 2.0 namespace URIs (both with and without namespace for robustness)
    private static final String BPMN_NS = "http://www.omg.org/spec/BPMN/20100524/MODEL";

    @Autowired
    private WorkflowNavigationRepository workflowNavigationRepository;

    /**
     * Handles the published event on the dedicated {@code workflowNavigationExecutor}
     * thread pool so the publish HTTP request returns immediately.
     */
    @Async("workflowNavigationExecutor")
    @EventListener
    @Transactional(rollbackFor = Exception.class)
    public void onWorkflowPublished(WorkflowPublishedEvent event) {
        String workflowId = event.getWorkflowId();
        String workflowName = event.getWorkflowName();
        String bpmnContent = event.getBpmnContent();
        String uniqueProcessId = event.getUniqueProcessId();
        String uniqueVersionId = event.getUniqueVersionId();
        Boolean cleanStaleData = event.getCleanStaleData();

        log.info("Navigation sync started for workflowId={}, workflowName={}", workflowId, workflowName);

        try {
            List<WorkflowNavigation> rows = parseBpmn(workflowId, uniqueProcessId, uniqueVersionId, workflowName, bpmnContent);

            // Delete stale rows then insert fresh ones atomically
            workflowNavigationRepository.deleteByWorkflowId(workflowId);
            if(cleanStaleData){
                workflowNavigationRepository.deleteByWorkflowName(workflowName);
            }
            if (!rows.isEmpty()) {
                workflowNavigationRepository.saveAll(rows);
            }

            log.info("Navigation sync completed for workflowId={}: {} task row(s) saved",
                workflowId, rows.size());
        } catch (Exception e) {
            // Log and swallow — a navigation sync failure must not roll back the publish transaction
            log.error("Navigation sync failed for workflowId={}: {}", workflowId, e.getMessage(), e);
        }
    }

    // ------------------------------------------------------------------
    // BPMN parsing
    // ------------------------------------------------------------------

    /**
     * Parses the BPMN XML and extracts one {@link WorkflowNavigation} row per
     * {@code userTask} element found in the process definition.
     *
     * <p>Supported BPMN attributes per userTask:
     * <ul>
     *   <li>{@code id}               → taskKey</li>
     *   <li>{@code name}             → taskName (falls back to id when absent)</li>
     *   <li>{@code camunda:assignee} → assignee</li>
     *   <li>{@code camunda:candidateUsers}  → stored as JSONB array</li>
     *   <li>{@code camunda:candidateGroups} → stored as JSONB array</li>
     * </ul>
     */
    private List<WorkflowNavigation> parseBpmn(String workflowId, String uniqueProcessId, String uniqueVersionId,
                                               String workflowName, String bpmnContent) throws Exception {

        if (bpmnContent == null || bpmnContent.isBlank()) {
            log.warn("Empty BPMN content for workflowId={}, skipping navigation sync", workflowId);
            return List.of();
        }

        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        factory.setNamespaceAware(true);
        // Disable external entity processing (XXE prevention)
        factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);

        Document doc = factory.newDocumentBuilder()
            .parse(new ByteArrayInputStream(bpmnContent.getBytes(StandardCharsets.UTF_8)));

        // Try with BPMN namespace first; fall back to local name lookup
        NodeList userTasks = doc.getElementsByTagNameNS(BPMN_NS, "userTask");
        if (userTasks.getLength() == 0) {
            userTasks = doc.getElementsByTagName("userTask");
        }

        List<WorkflowNavigation> rows = new ArrayList<>();
        for (int i = 0; i < userTasks.getLength(); i++) {
            Element task = (Element) userTasks.item(i);

            String taskKey  = task.getAttribute("id");
            String taskName = task.getAttribute("name");

            // Camunda extension attributes (namespace-aware and plain fallback)
            String assignee        = resolveAttribute(task, "assignee");
            String candidateUsers  = resolveAttribute(task, "candidateUsers");
            String candidateGroups = resolveAttribute(task, "candidateGroups");

            WorkflowNavigation nav = new WorkflowNavigation();
            nav.setWorkflowId(workflowId);
            nav.setUniqueProcessId(uniqueProcessId);
            nav.setUniqueVersionId(uniqueVersionId);
            nav.setWorkflowName(workflowName);
            nav.setTaskKey(taskKey);
            nav.setTaskName(taskName);
            nav.setAssignee(blankToNull(assignee));
            nav.setCandidateUsers(toJsonArray(candidateUsers));
            nav.setCandidateGroups(toJsonArray(candidateGroups));
            nav.setSortOrder(i);
            rows.add(nav);
        }

        return rows;
    }

    /**
     * Tries Camunda namespace first, then the plain attribute name.
     */
    private String resolveAttribute(Element element, String localName) {
        // Camunda BPMN extension namespace
        String camundaNs = "http://camunda.org/schema/1.0/bpmn";
        String value = element.getAttributeNS(camundaNs, localName);
        if (value == null || value.isBlank()) {
            // Fallback: try with "camunda:" prefix as a plain attribute
            value = element.getAttribute("camunda:" + localName);
        }
        return value;
    }

    /**
     * Converts a comma-separated string to a JSONB array literal.
     * e.g. "user-001, user-002" → {@code ["user-001","user-002"]}
     * A blank input produces an empty array {@code []}.
     */
    private String toJsonArray(String commaSeparated) {
        if (commaSeparated == null || commaSeparated.isBlank()) {
            return "[]";
        }
        try {
            String[] parts = commaSeparated.split(",");
            List<String> trimmed = new ArrayList<>();
            for (String p : parts) {
                String t = p.trim();
                if (!t.isEmpty()) {
                    trimmed.add(t);
                }
            }
            return OBJECT_MAPPER.writeValueAsString(trimmed);
        } catch (Exception e) {
            log.warn("Failed to convert '{}' to JSON array, defaulting to []", commaSeparated);
            return "[]";
        }
    }

    private String blankToNull(String value) {
        return (value == null || value.isBlank()) ? null : value.trim();
    }
}

