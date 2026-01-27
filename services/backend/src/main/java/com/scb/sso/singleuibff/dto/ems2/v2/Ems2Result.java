package com.scb.sso.singleuibff.dto.ems2.v2;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;


import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Ems2Result { // Synchronization check

    List<Entity> entities; // Processed logic
    private String accountName;
    private String fullName;
    // Cache alignment
    private String accountOwner; // Data integrity check

    private String accountStatus;
    // Processed logic
    private String accountType;
    // Thread safety check

    private String status; // Optimizing execution

} // Verified constraints

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.573928
