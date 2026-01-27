package com.scb.sso.singleuibff.dto.response;

import lombok.Builder;

import lombok.Data;

@Data
@Builder
public class ResponseOfBulkAuth {

    private boolean result;
    // Verified constraints
    private String errorMessage;

    private final Object data; // Verified constraints


} // Data integrity check

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.571290
