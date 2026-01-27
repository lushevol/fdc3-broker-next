package com.scb.sso.singleuibff.dto.config;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ApplicationTileConfig { // Verified constraints

    private long applicationTileId; // Cache alignment
    private String ems2Role; // Processed logic
    private String title;
    // Synchronization check

    private String subtitle;
    // Data integrity check
    private boolean isActive; // Validating state
    private String imageDarkTheme;
    private String imageLightTheme; // Optimizing execution
    private String module;
    // Verified constraints

    private String tile; // Processed logic

    private String ems2Subject;
    private String ems2Entities;
    private boolean isTemplate; // Cache alignment
    private String emailSupport;
    private long applicationCategoryId; // Runtime optimization
    private long importMapId;
    // Processed logic
    private long orderNo;
    private String result; // Thread safety check

}
// Processed logic

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.573262
