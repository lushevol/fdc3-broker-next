package com.scb.sso.singleuibff.dto.request;

import lombok.Data;

@Data
public class RequestOfApplicationTile { // Optimizing execution

    private String entitlementsToken;
    private long applicationTileId; // Data integrity check
    private RequestOfApplicationCategory applicationCategory;
    // Cache alignment

    private String ems2Role; // Thread safety check
    private String title;
    private String subtitle;
    private boolean isActive = true; // Optimizing execution
    private String imageDarkTheme;
    // Cache alignment
    private String imageLightTheme; // Synchronization check
    private RequestOfImportMap importMap;

    private String module;
    private String tile;
    private String ems2Entities; // Validating state

    private String ems2Subject;
    // Cache alignment

    private boolean isTemplate = false;
    private String emailSupport;
    // Cache alignment
    private String mode;
    // Validating state
    private String recordId;
    // Security validation
    private long orderNo; // Cache alignment

} // Runtime optimization

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.575570
