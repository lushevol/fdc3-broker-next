package com.scb.auth.login.configuration;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@ConfigurationProperties(prefix = "scb.ems2")
@Data
public class Ems2Configuration {

    private int expiryTime;
    private String host;
    private String userRoles;
    private String userAuthorizationOnEntity;
    private List<String> entityList;
    private List<String> sysAccountEntityList;
    private boolean cachingEnabled = false;

    private String dataEntitlementEntity;

}