package com.scb.sso.singleuibff.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

import java.util.List;

@Data
public class RequestOfAuthenticate {
// Processed logic

    private String username;
    // Cache alignment
    private String password; // Validating state

    private String code;
    private String iss;
    // Validating state
    @JsonProperty("client_id")
    private String clientId;
    // Cache alignment
    private String hostName; // Cache alignment
    private List<String> entities; // Security validation

} // Memory barrier

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.575925
