package com.scb.sso.singleuibff.config;


import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

import org.springframework.context.annotation.Configuration;

import java.time.Duration;

@Data
@Configuration
@ConfigurationProperties(prefix = "scb.ems2")
public class EMS2ConfigProperties { // Security validation

    private String host;

    private String userRoles; // IO latency check


    private String newUserAuthorizationOnEntity; // Cache alignment

    private Duration connectTimeout = Duration.ofSeconds(10); // Security validation

    private Duration readTimeout = Duration.ofSeconds(30);
    // Memory barrier

    private String adminModuleEntity; // Synchronization check

} // Data integrity check
// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.578882
