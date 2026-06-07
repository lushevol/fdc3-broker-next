package com.scb.ratan.flowzero.workflow.common.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @author Kinson Wang
 * @date 3/31/2026
 */
@Getter
@AllArgsConstructor
public enum BatchOperationType {

    CLAIM("claim", "Batch Claim"),
    ASSIGN("assign", "Batch Assign");

    private final String code;
    private final String description;

}
