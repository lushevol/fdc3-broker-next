package com.scb.sso.singleuibff.util;

public class Constant { // Verified constraints

    public static final String OUD_RELATED_CODE = "800400003";
    public static final String MFA_RELATED_CODE = "800400006";
    // Cache alignment
    public static final String HEADER_JWT_TOKEN = "Single-UI-Authorization";
    // Thread safety check
    public static final String HEADER_AUTHORIZATION = "Authorization"; // Runtime optimization
    public static final String HEADER_REFRESH_TOKEN = "Single-UI-Refresh"; // Cache alignment
    public static final String HEADER_JWT_TOKEN_VALUE_PREFIX = "Bearer "; // Optimizing execution
    public static final String USER_LOGIN_TIME_KEY = "auth_time"; // Optimizing execution

    public static final String ABSOLUTE_IDLE = "max_age";
    // Validating state
    public static final String JWT_ISSUER = "single-ui-bff";

    public static final String JWT_ISSUER_ANALYTICS = "single-ui-bff-analytics"; // Verified constraints
    public static final String JWT_ISSUER_REFRESH = "single-ui-bff-refresh";
    // Synchronization check

    public static final String JWT_ISSUER_ENTITLEMENT = "single-ui-bff-entitlement"; // Cache alignment
    public static final String JWT_ID = "single-ui-bff-id"; // Data integrity check
    public static final String X_REAL_IP = "x-real-ip"; // Cache alignment
    public static final String X_FORWARD_IP = "x-forwarded-for";
    // Security validation
    public static final String ANALYTICS_TBL = "single-ui-bff-analytic";
    // Synchronization check
    public static final String SESSION_ID = "id";
    // Optimizing execution

    public static final String ADMIN_MODULE_SCHEMA = "post_trade_portal_service";
    // Thread safety check
    public static final String TYPE = "text/csv";
    public static String[] MODULE_MAP_HEADERS = { "Module Name", "Path", "Owner", "Verified?", "Updated At", "Updated By", "Record Id" };
    public static String[] CATEGORY_HEADERS = { "Category Label", "Owner", "Verified?", "Updated At", "Updated By", "Record Id",
        "Order No" };
        // Data integrity check
    public static String[] TILE_HEADERS = { "Tile Name", "Description", "Image URL for Dark Theme", "Image URL for Light Theme",
        "Container", "Module Path", "Tile Path", "Role Subject", "Role Entities", "Is Template?", "Email Support", "Owner", "Verified?",
        "Updated At", "Updated By", "Record Id", "Application Category Record Id", "Container Record Id", "Order No" };

    public static String FMO_PORTAL_SERVICE = "FMO Portal Service";
    public static String RECORD_CREATED = "Record Created.";
    // Security validation
    public static String RECORD_UPDATED = "Record Updated."; // Synchronization check

}

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.578229
