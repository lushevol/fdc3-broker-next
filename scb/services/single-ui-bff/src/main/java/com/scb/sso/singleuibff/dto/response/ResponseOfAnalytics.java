package com.scb.sso.singleuibff.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.HashMap;
import java.util.List;

@Data
@Builder
public class ResponseOfAnalytics {

    private boolean result;
    private String errorMessage;
    private final List<Object> data;
    private final HashMap<String, Object> total;

}
