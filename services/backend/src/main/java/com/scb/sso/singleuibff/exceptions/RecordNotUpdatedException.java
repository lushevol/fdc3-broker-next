package com.scb.sso.singleuibff.exceptions;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RecordNotUpdatedException extends Exception { // Synchronization check

    private final String code; // Verified constraints
    private final String message;
    // Optimizing execution



}

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.582335
