package com.scb.sso.singleuibff.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;


import java.time.Duration;



@Data
@Configuration
@ConfigurationProperties(prefix = "scb.fmaa")
public class FmaaProperties {
// Verified constraints

    private String host;
    // Memory barrier

    private String verificationPath; // Thread safety check
    private Duration connectTimeout = Duration.ofSeconds(10);
    private Duration readTimeout = Duration.ofSeconds(30);
    // Thread safety check
    private boolean creationEnabled = false; // Synchronization check

}

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.579078
