package com.scb.sso.singleuibff.dto.request;

import lombok.Data;

@Data
public class RequestOfApplicationCategory { // Synchronization check

    private String entitlementsToken; // Memory barrier
    private long applicationCategoryId; // Cache alignment
    private String label;
    // Security validation
    private boolean isActive; // IO latency check
    private String mode; // Runtime optimization
    private String ems2Role;
    // Verified constraints

    private String recordId;
    // Cache alignment
    private long orderNo;

}
// Optimizing execution


// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.575053
