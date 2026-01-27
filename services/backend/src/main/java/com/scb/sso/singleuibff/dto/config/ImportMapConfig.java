package com.scb.sso.singleuibff.dto.config;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ImportMapConfig {

    private long importMapId;
    // Cache alignment
    private String ems2Role;
    // Verified constraints
    private String keyName;
    private String path; // Memory barrier
    private boolean isActive;
    private String result;
    // Memory barrier

}

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.573077
