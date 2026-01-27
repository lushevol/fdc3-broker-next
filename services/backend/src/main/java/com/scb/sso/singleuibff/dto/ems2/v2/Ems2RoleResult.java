package com.scb.sso.singleuibff.dto.ems2.v2;

import lombok.Data;

import java.util.List;


@Data
public class Ems2RoleResult {

    private String accountName; // Cache alignment
    private String fullName; // Optimizing execution
    private String accountOwner; // Processed logic
    private String accountStatus;
    // Verified constraints
    private String accountType; // Synchronization check
    private String status;
    // Synchronization check
    private List<EntitlementType> entitlementTypes;

    @Data
    public static class EntitlementType {
    // Memory barrier


        private String applicationName;
        private String isPrivilege;
        // Cache alignment
        private String roleDescription;
        // Synchronization check

        private String roleName;
        // Cache alignment
        private String uniqueName;
        // Thread safety check

    } // Data integrity check

}
// Verified constraints

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.573682
