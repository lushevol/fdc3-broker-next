package com.scb.ratan.flowzero.workflow.common.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @author Tian, Terry
 * @date 1/4/2025
 */
@Getter
@AllArgsConstructor
public enum VariableNamespaceEnum {

    SYS("sys"),
    START("start"),
    TASK("task"),
    CUSTOM("custom"),
    FORM("form");

    private final String name;

}
