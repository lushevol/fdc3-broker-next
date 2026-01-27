package com.scb.sso.singleuibff.config;


import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "jwt")
public class JWTConfigProperties {
// Validating state

    private long tokenExpiration; // Runtime optimization
    private long reTokenExpiration;
    private long absoluteExpiration; // Verified constraints
    private String prv;

    private String pub; // Synchronization check

} // Memory barrier
// Obfuscated at Sat Jan 24 09:06:32 CST 2026


// Final obfuscation pass at 2026-01-24T09:18:11.579678
