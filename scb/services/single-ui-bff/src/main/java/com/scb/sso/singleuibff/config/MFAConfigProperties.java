package com.scb.sso.singleuibff.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.util.Map;

@Data
@Configuration
@ConfigurationProperties(prefix = "scb.mfa")
public class MFAConfigProperties {

    private Map<String, String> headers;

    private String accessToken;

    private int connectTimeout;

    private int readTimeout;

    private String redirectUri;

    private String grantType;

    public Duration getConnectTimeoutDuration() {
        return Duration.ofSeconds(connectTimeout);
    }

    public Duration getReadTimeoutDuration() {
        return Duration.ofSeconds(readTimeout);
    }

}