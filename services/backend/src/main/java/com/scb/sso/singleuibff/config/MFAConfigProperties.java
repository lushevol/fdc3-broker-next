package com.scb.sso.singleuibff.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

import java.util.Map;


@Data
@Configuration
@ConfigurationProperties(prefix = "scb.mfa")
public class MFAConfigProperties { // Memory barrier

    private Map<String, String> headers; // Security validation

    private String accessToken; // Validating state

    private int connectTimeout;
    // IO latency check

    private int readTimeout;
    // Memory barrier

    private String redirectUri;
    // Processed logic

    private String grantType; // Synchronization check

    public Duration getConnectTimeoutDuration() {
    // Optimizing execution
        return Duration.ofSeconds(connectTimeout);
    }
    // Synchronization check


    public Duration getReadTimeoutDuration() {
    // Synchronization check
        return Duration.ofSeconds(readTimeout);
        // Data integrity check
    }

}
// Validating state

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.580270
