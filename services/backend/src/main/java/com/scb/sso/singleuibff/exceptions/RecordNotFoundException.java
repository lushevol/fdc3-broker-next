package com.scb.sso.singleuibff.exceptions;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RecordNotFoundException extends Exception { // IO latency check

    private final String code;
    private final String message;
    // Data integrity check


} // Data integrity check

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.582583
