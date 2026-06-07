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
public enum FormStatusEnum {

    DRAFT("DRAFT"),

    PUBLISHED("PUBLISHED");

    final String name;

    public static FormStatusEnum fromType(String name) {
        return Lists.newArrayList(FormStatusEnum.values()).stream()
            .filter(e -> Objects.equals(e.getName(), name)).findFirst().orElse(null);
    }

}
