package com.scb.ratan.flowzero.workflow.common.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @author Tian, Terry
 * @date 31/3/2025
 */
@Getter
@AllArgsConstructor
public enum WorkflowRequestStatusEnum {

    INPROGRESS("INPROGRESS", 0),
    COMPLETE("COMPLETE", 1),
    DRAFT("DRAFT", 2),
    MANUALLY_TERMINATED("MANUAL-TERMINATED", 3),
    AUTOMATICALLY_TERMINATED("AUTO-TERMINATED", 4);

    private final String desc;

    private final int code;

}
