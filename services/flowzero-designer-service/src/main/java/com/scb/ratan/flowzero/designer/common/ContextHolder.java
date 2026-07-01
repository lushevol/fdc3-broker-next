package com.scb.ratan.flowzero.designer.common;

import org.apache.commons.lang3.StringUtils;

import com.scb.ratan.context.RatanApiContextHolder;

/**
 * @auther Tian, Terry
 * @date Feb 12, 2026
 **/
public class ContextHolder {

    public static String getUserId() {
        String id = RatanApiContextHolder.getContext().getUserId();
        String userId = StringUtils.isNotEmpty(id)
            ? id
            : "system";
        return userId;
    }

}
