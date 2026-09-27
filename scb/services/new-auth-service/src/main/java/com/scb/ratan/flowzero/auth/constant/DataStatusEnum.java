package com.scb.ratan.flowzero.auth.constant;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @author Kinson Wang
 * @date 4/1/2026
 */
@Getter
@AllArgsConstructor
public enum DataStatusEnum {

    ACTIVE("ACTIVE"),

    DISABLED("DISABLED");

    private final String code;

}
