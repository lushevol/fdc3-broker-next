package com.scb.ratan.flowzero.workflow.common.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @author Kinson Wang
 * @date 3/31/2026
 */
@Getter
@AllArgsConstructor
public enum BatchStatus {

    SUCCESS("SUCCESS"),
    PARTIAL_SUCCESS("PARTIAL_SUCCESS"),
    FAILED("FAILED");

    private final String description;

}
