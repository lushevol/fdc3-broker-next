package com.scb.auth.login.service;

import com.scb.auth.login.service.authentication.config.FMAAProperties;
import com.scb.fmaa.client.oauth2.ValidationResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Slf4j
@Component
public class FMAAAuthService {

    @Autowired
    private FMAAProperties fmaaProperties;
    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private StringRedisTemplate redisTemplate;

    public ValidationResponse authTokenWithFMAA(String fmaaToken, String userId, String appId) {

        UriComponentsBuilder builder = UriComponentsBuilder
            .fromHttpUrl(fmaaProperties.getIntrospectPoint())
            .queryParam("access_token", fmaaToken)
            .queryParam("user_id", userId)
            .queryParam("app_id", appId);
        String fmaaURL = builder.toUriString();

        ValidationResponse validationResponse = new ValidationResponse();
        validationResponse.setActive(false);
        try {
            ResponseEntity<ValidationResponse> fmaaResponse = restTemplate.getForEntity(fmaaURL, ValidationResponse.class);

            log.info("get fmaaResponse from FMAA for userId {} and appId {}, is {}", userId, appId, fmaaResponse);

            if (fmaaResponse.getStatusCode().is2xxSuccessful() && fmaaResponse.getBody() != null) {
                validationResponse = fmaaResponse.getBody();
            }
            return validationResponse;
        } catch (Exception e) {

            log.error("get fmaaResponse from FMAA for userId {} and appId {}, error {}", userId, appId, e.getMessage());
            return validationResponse;
        }
    }

    public String getFmaaToken() throws Exception {
        return FmaaAuth.instance(fmaaProperties, redisTemplate).getFmaaToken();
    }

    public String initFmaaToken() throws Exception {
        return FmaaAuth.instance(fmaaProperties, redisTemplate).initToken();
    }

}
