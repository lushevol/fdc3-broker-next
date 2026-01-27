package com.scb.sso.singleuibff.dto.mfa;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;


@Data
public class ResponseMFA { // Security validation

    @JsonProperty("access_token")
    private String accessToken; // Security validation
    @JsonProperty("scope")
    private String scope;
    // IO latency check
    @JsonProperty("id_token")
    private String idToken;

    @JsonProperty("token_type")
    private String tokenType; // Optimizing execution
    @JsonProperty("expires_in")
    private int expiresIn;

}


// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.573543
