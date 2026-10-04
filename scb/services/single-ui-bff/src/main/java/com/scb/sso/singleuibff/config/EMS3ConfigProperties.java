package com.scb.sso.singleuibff.config;

import java.net.URI;
import java.time.Duration;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "scb.ems3")
public class EMS3ConfigProperties {
    private URI tokenUrl;
    private URI detailUrl;
    private URI aggregateUrl;
    private String clientId;
    private String clientSecret;
    private String scope;
    private Duration connectTimeout = Duration.ofSeconds(2);
    private Duration readTimeout = Duration.ofSeconds(5);
    private boolean allowInsecureLocalhost;
    private String tokenProxyHost;
    private int tokenProxyPort;
}
