package com.scb.auth.login.mock;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@EnableConfigurationProperties({ MockProperties.class })
@ConditionalOnProperty(prefix = "ratanone.authentication.mock", name = "enabled", havingValue = "true", matchIfMissing = false)
public class AuthMockConfiguration {

    @Autowired
    private MockProperties properties;

    @Bean
    public MockService mockService(MockProperties properties) {
        return new MockService(properties);
    }

}