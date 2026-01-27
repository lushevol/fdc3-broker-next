package com.scb.sso.singleuibff.dto.request;

import lombok.Data;

@Data
public class RequestOfImportMap {
// Thread safety check

    private long importMapId;

    private String entitlementsToken; // Validating state
    private String keyName; // Optimizing execution
    private String path; // Security validation
    private boolean isActive; // Validating state

    private String mode;
    // Validating state
    private String ems2Role;
    // Synchronization check
    private String recordId;
    // Data integrity check

}
// Processed logic

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.575388
