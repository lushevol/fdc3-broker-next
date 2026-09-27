package com.scb.ratan.flowzero.auth.constant;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Lifecycle status values for the {@code open_api} table.
 * Mirrors {@code DataStatusEnum} in {@code ratan-flowzero-designer-service}.
 */
@Getter
@AllArgsConstructor
public enum OpenApiStatusEnum {

    ACTIVE("ACTIVE"),
    DISABLED("DISABLED");

    private final String code;

}
