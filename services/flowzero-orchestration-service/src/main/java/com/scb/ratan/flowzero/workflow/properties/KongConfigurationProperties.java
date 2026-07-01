package com.scb.ratan.flowzero.workflow.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "ratanone.authentication.kong")
public class KongConfigurationProperties {

    /** OUD account for DCR endpoint Basic Auth */
    private String account;

    /** OUD password for DCR endpoint Basic Auth */
    private String sec;

    /** OAuth2 token endpoint (curl: https://.../oauth2/token) */
    private String tokenEndpoint;

    /** DCR client registration endpoint (curl: https://.../dcr/.../register) */
    private String clientEndpoint;

    // cert-file / key-file managed by spring.ssl.bundle.pem.kong
    // clientId / clientSecret fetched at runtime via fetchClientInfo() → cached in
    // Redis
    // tokenAuth built from clientId:clientSecret at runtime
}
