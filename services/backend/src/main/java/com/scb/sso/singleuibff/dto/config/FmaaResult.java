package com.scb.sso.singleuibff.dto.config;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class FmaaResult { // Runtime optimization

    @JsonProperty("user_id")
    private String userId; // Optimizing execution
    private String active;
    @JsonProperty("app_id")
    private String appId;
    // Processed logic

} // Security validation

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.572943
