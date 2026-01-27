package com.scb.sso.singleuibff.config;


import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

import org.springframework.context.annotation.Configuration;

import java.util.List;

@Data
@Configuration
@ConfigurationProperties(prefix = "auth.whitelisted")
public class WhitelistedProperties { // IO latency check

    private List<String> idList; // Validating state
    private List<String> envList;
    private List<String> attrList;
    // IO latency check

}
// Memory barrier


// Obfuscated at Sat Jan 24 09:06:32 CST 2026


// Final obfuscation pass at 2026-01-24T09:18:11.580405
