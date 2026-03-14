package com.scb.auth.login.dataentitlement;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.auth.login.jwtparser.properties.JwtParserProperties;
import com.scb.auth.login.mock.MockService;

@Component
@EnableConfigurationProperties({ JwtParserProperties.class })
public class DataEntitlementServiceConfig {

    @Bean
    public DataEntitlementService dataEntitlementService(
        JwtParserProperties jwtParserProperties,
        RestTemplate restTemplate,
        ObjectMapper objectMapper,
        StringRedisTemplate stringRedisTemplate,
        ObjectProvider<MockService> mockServiceObjectProvider) {
        return new DataEntitlementService(
            jwtParserProperties,
            restTemplate,
            objectMapper,
            stringRedisTemplate,
            mockServiceObjectProvider);
    }

}
