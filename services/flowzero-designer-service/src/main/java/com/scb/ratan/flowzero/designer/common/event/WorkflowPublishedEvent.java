package com.scb.ratan.flowzero.designer.common.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

/**
 * Event fired when a workflow is successfully published.
 * The async listener {@code WorkflowNavigationSyncListener} will parse the
 * workflow BPMN content and rebuild the t_workflow_navigation cache rows
 * for the published workflow version.
 *
 * @author Kinson Wang
 * @date 5/6/2026
 */
@Getter
public class WorkflowPublishedEvent extends ApplicationEvent {

    /**
     * The internal t_workflow.id of the newly published workflow version.
     */
    private final String workflowId;

    /**
     * Process Definition ID
     */
    private final String uniqueProcessId;

    /**
     * Process Definition ID
     */
    private final String uniqueVersionId;

    /**
     * The workflow display name (shared across all versions).
     */
    private final String workflowName;

    /**
     * The BPMN XML content of the published workflow.
     */
    private final String bpmnContent;

    private final Boolean cleanStaleData;

    public WorkflowPublishedEvent(Object source, String workflowId, String uniqueProcessId, String uniqueVersionId,
                                  String workflowName, Boolean cleanStaleData, String bpmnContent) {
        super(source);
        this.cleanStaleData = cleanStaleData;
        this.workflowId = workflowId;
        this.workflowName = workflowName;
        this.bpmnContent = bpmnContent;
        this.uniqueProcessId = uniqueProcessId;
        this.uniqueVersionId = uniqueVersionId;
    }
}

