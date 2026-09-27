package com.scb.ratan.flowzero.auth.properties;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "ems3")
public class EMS3Properties {

    private String tokenUrl;

    private String clientId;

    private String clientSecret;

    private String scope;

    private String grantTypeValue = "client_credentials";

    private String entitlementUrl;

    private String userUrl;

    private String proxyHost;

    private int proxyPort;

}
