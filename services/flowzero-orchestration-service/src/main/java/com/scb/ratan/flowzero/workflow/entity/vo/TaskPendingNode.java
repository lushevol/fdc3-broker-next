package com.scb.ratan.flowzero.workflow.entity.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Task-level node in the pending distribution tree.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskPendingNode {

    private String taskKey;
    private String taskName;
    private Integer pendingCount;

}
