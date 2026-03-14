package com.scb.auth.login.service.authentication.config;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

@Configuration
@ConfigurationProperties(prefix = "fmaa.api")
@Data
@Slf4j
public class FMAAProperties {

    private String introspectPoint;

    private String account;
    private String janus;
    private String host;
    private String certPath;
    private String cipherKey;
    private Duration tokenRefreshDuration = Duration.ofDays(35L);

}