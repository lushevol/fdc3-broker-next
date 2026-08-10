package com.scb.sso.singleuibff.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

@Data
@Configuration
@ConfigurationProperties(prefix = "scb.entra")
public class EntraConfigProperties {

    private String tenantId;
    private String clientId;
    private String scope;
    private String clientCertPath;
    private String clientKeyPath;
    private String clientAssertionType;
    private String grantType;
    private String redirectUri;
    private String entraTokenEndpoint;

    private int connectTimeout;

    private int readTimeout;

    private String proxyHost;

    private int proxyPort;

    public Duration getConnectTimeoutDuration() {
        return Duration.ofSeconds(connectTimeout);
    }

    public Duration getReadTimeoutDuration() {
        return Duration.ofSeconds(readTimeout);
    }

}
