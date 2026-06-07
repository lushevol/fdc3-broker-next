package com.scb.ratan.flowzero.designer.common.enums;

import java.util.Objects;

import com.google.common.collect.Lists;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @author Tian, Terry
 * @date 4/2/2026
 */
@Getter
@AllArgsConstructor
public enum WorkflowStatusEnum {

    INIT("INIT"),

    DRAFT("DRAFT"),

    PUBLISHED("PUBLISHED"),

    SUSPENDED("SUSPENDED"),

    TERMINATED("TERMINATED");

    final String name;

    public static WorkflowStatusEnum fromName(String name) {
        return Lists.newArrayList(WorkflowStatusEnum.values()).stream()
            .filter(e -> Objects.equals(e.getName(), name)).findFirst().orElse(null);
    }

}
