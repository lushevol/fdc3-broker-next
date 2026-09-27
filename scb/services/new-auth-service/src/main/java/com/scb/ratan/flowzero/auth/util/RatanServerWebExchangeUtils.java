package com.scb.ratan.flowzero.auth.util;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Li, Chris Bo
 * @since 2020-06-30
 *
 */
@Slf4j
public final class RatanServerWebExchangeUtils {

    public static final String RATAN_TRACE_ID = qualify("ratanTraceId");

    private static String qualify(String attr) {
        return RatanServerWebExchangeUtils.class.getName() + "." + attr;
    }

}
