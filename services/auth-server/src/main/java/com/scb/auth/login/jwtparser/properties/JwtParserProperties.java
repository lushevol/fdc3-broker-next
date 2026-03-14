package com.scb.auth.login.jwtparser.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "ratanone.jwt-token-parser")
public class JwtParserProperties {

    private long expiryTime;

    private String ratanEntity;

    private String ratanDataEntitlementEntity;

    private String requestEms2Url;

    private boolean cachingEnabled = true;

}