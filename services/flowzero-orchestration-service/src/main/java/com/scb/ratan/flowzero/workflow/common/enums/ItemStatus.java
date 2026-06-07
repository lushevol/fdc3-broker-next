package com.scb.ratan.flowzero.workflow.common.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @author Kinson Wang
 * @date 4/1/2026
 */
@Getter
@AllArgsConstructor
public enum ItemStatus {

    SUCCESS("SUCCESS"),
    FAILED("FAILED");

    private final String description;

}
