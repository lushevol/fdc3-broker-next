package com.scb.auth.login.jwtparser;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.auth.login.dataentitlement.DataEntitlementService;
import com.scb.auth.login.jwtparser.convertor.ConvertorFactory;
import com.scb.auth.login.jwtparser.fetcher.OudDataFetcher;
import com.scb.auth.login.jwtparser.properties.JwtParserProperties;
import com.scb.auth.login.jwtparser.properties.OudKeyProperties;
import com.scb.auth.login.service.Ems2EntitlementService;

@Configuration
@EnableConfigurationProperties(value = { JwtParserProperties.class, OudKeyProperties.class })
public class JwtParserConfig {

    @Bean
    public OudDataFetcher oudDataFetcher(OudKeyProperties oudKeyProperties, ObjectMapper objectMapper) {
        return new OudDataFetcher(oudKeyProperties, objectMapper);
    }

    @Bean
    public ConvertorFactory convertorFactory(RestTemplate restTemplate,
        ObjectMapper objectMapper,
        JwtParserProperties jwtParserProperties,
        StringRedisTemplate stringRedisTemplate,
        Ems2EntitlementService ems2EntitlementService,
        OudDataFetcher oudDataFetcher,
        DataEntitlementService dataEntitlementService) {
        return new ConvertorFactory(restTemplate, objectMapper, jwtParserProperties, stringRedisTemplate, ems2EntitlementService,
            oudDataFetcher, dataEntitlementService);
    }

    @Bean
    public JwtParserCoordinator convertorCoordinator(ConvertorFactory factory,
        ObjectMapper objectMapper) {
        return new JwtParserCoordinator(factory, objectMapper);
    }

}
