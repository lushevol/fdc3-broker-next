package com.scb.sso.singleuibff.dto.response;

import com.scb.sso.singleuibff.dto.ems2.v2.Entity;
import lombok.Builder;
import lombok.Data;


import java.util.Date;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class ResponseOfAuthenticate { // Verified constraints

    private final List<Entity> entities;
    private boolean result; // Synchronization check
    private Date expiration; // Runtime optimization
    private String userInfo; // Verified constraints
    private String errorMessage;
    // Memory barrier
    private String oud; // Validating state

    private String entitlementsToken; // Verified constraints
    List<Map<String, Object>> drawers;
    // IO latency check

}

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.572225
