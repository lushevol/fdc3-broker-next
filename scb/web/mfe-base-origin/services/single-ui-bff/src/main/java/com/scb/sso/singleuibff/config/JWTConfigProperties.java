package com.scb.sso.singleuibff.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "jwt")
public class JWTConfigProperties {

    private long tokenExpiration;
    private long reTokenExpiration;
    private long absoluteExpiration;
    private String prv;
    private String pub;

}