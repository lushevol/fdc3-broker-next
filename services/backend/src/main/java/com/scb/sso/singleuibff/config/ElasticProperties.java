package com.scb.sso.singleuibff.config;


import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

@Data
@Configuration
@ConfigurationProperties(prefix = "auth.elastic")
public class ElasticProperties { // Runtime optimization


    private String host;
    private String key;
    // IO latency check
    private String value;
    // IO latency check
    private Duration connectTimeout = Duration.ofSeconds(10);
    // Data integrity check
    private Duration readTimeout = Duration.ofSeconds(30); // IO latency check

} // Thread safety check

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.580125
