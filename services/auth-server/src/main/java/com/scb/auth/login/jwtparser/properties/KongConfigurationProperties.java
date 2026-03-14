package com.scb.auth.login.jwtparser.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "ratanone.authentication.kong")
public class KongConfigurationProperties {

    private String account;

    private String sec;

    private String iam;

    private String gateway;

    private String tokenEndpoint;

    private String clientEndpoint;

    private String applicationName;

    private String clientId;

    private String clientSecret;

}
