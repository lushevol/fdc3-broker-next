package com.scb.auth.login.mock;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Data;

@Data
@ConfigurationProperties(prefix = "ratanone.authentication.mock")
public class MockProperties {

    private boolean enabled = false;

    private Map<String, String> emsMockResponse = new HashMap<>();

    private String dataEntitlementDefaultResponse;

    private List<DataEntitlement> dataEntitlement;

    @Data
    public static class DataEntitlement {

        private String countryName;
        private List<String> userList;
        private String response;

    }

}