package com.scb.ratan.flowzero.workflow.entity.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

/**
 * Workflow-level node in the pending distribution tree.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class WorkflowPendingNode {

    private String workflowName;
    /** Sum of pending counts across all tasks in this workflow */
    private Integer pendingCount;
    private List<TaskPendingNode> tasks;

}
