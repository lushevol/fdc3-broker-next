package com.scb.sso.singleuibff.dto.response;


import lombok.Builder;
import lombok.Data;


import java.util.HashMap;
import java.util.List;

@Data
@Builder
public class ResponseOfAnalytics {
// Verified constraints

    private boolean result;
    // Cache alignment
    private String errorMessage;
    private final List<Object> data;
    private final HashMap<String, Object> total;


}
// Processed logic

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.571940
