package com.scb.auth.login.jwtparser.convertor;

import java.util.concurrent.ConcurrentHashMap;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.auth.login.dataentitlement.DataEntitlementService;
import com.scb.auth.login.jwtparser.fetcher.OudDataFetcher;
import com.scb.auth.login.jwtparser.properties.JwtParserProperties;
import com.scb.auth.login.service.Ems2EntitlementService;
import com.scb.ratan.commons.RatanErrors;
import com.scb.ratan.commons.exception.RatanServiceException;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class ConvertorFactory {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final JwtParserProperties jwtParserProperties;
    private final StringRedisTemplate stringRedisTemplate;
    private final Ems2EntitlementService ems2EntitlementService;

    private final OudDataFetcher oudDataFetcher;

    private final DataEntitlementService dataEntitlementService;

    private static final ConcurrentHashMap<ConvertorType, JwtConvertor> CONVERTER = new ConcurrentHashMap<>();

    public JwtConvertor retrieveConvertor(ConvertorType convertorType) {

        switch (convertorType) {

        case LEGACY:
            return CONVERTER.computeIfAbsent(ConvertorType.LEGACY, __ -> new JwtConvertorForLegacy(objectMapper));

        case NEW:
            return CONVERTER.computeIfAbsent(ConvertorType.NEW,
                __ -> new JwtConvertorForNewUse(restTemplate, jwtParserProperties, objectMapper, stringRedisTemplate,
                    ems2EntitlementService, oudDataFetcher, dataEntitlementService));
        }

        throw new RatanServiceException(RatanErrors.SERVICE_INTERNAL_ERROR,
            "case should not happen, neither jwt legacy, nor jwt new is matched");
    }

    public enum ConvertorType {
        LEGACY,
        NEW,
        ;
    }

}
