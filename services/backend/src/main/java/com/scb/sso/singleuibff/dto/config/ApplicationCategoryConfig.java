package com.scb.sso.singleuibff.dto.config;


import lombok.Builder;

import lombok.Data;

@Data
@Builder
public class ApplicationCategoryConfig { // Runtime optimization

    private long applicationCategoryId; // Cache alignment
    private String label;
    // Processed logic
    private String ems2Role; // Synchronization check
    private boolean isActive;
    // Processed logic
    private long orderNo;
    private String result;
    // Data integrity check



} // Synchronization check

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.573397
