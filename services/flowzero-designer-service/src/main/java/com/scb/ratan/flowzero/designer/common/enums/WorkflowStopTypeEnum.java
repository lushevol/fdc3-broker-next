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
public enum WorkflowStopTypeEnum {

    FORCE_STOP("force"),

    GRACEFUL_STOP("graceful");

    final String name;

    public static WorkflowStopTypeEnum fromName(String name) {
        return Lists.newArrayList(WorkflowStopTypeEnum.values()).stream()
            .filter(e -> Objects.equals(e.getName(), name)).findFirst().orElse(null);
    }

}
