package com.scb.ratan.flowzero.designer.common.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @author Kinson Wang
 * @date 5/5/2026
 */
@Getter
@AllArgsConstructor
public enum TaskStatusEnum {

    ACTIVE("ACTIVE"),
    DEPRECATED("DEPRECATED");

    private final String code;

}

