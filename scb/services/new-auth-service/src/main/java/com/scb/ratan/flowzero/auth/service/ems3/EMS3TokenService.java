package com.scb.ratan.flowzero.auth.service.ems3;

import com.fasterxml.jackson.databind.JsonNode;
import com.scb.ratan.flowzero.auth.util.RatanObjectMapper;
import com.scb.ratan.flowzero.auth.properties.EMS3Properties;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.*;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
public class EMS3TokenService {

    @Autowired
    private EMS3Properties ems3Properties;

    @Autowired
    @Qualifier("proxyRestTemplate")
    private RestTemplate restTemplate;

    @Autowired
    private RatanObjectMapper objectMapper;

    private static final String KEY_ACCESS_TOKEN = "access_token";

    @Retryable(retryFor = { Exception.class }, maxAttempts = 3, backoff = @Backoff(delay = 1000, multiplier = 2))
    public String fetchAccessToken() {

        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", ems3Properties.getGrantTypeValue());
        body.add("client_id", ems3Properties.getClientId());
        body.add("client_secret", ems3Properties.getClientSecret());
        body.add("scope", ems3Properties.getScope());

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        log.info("Requesting EMS3 access token from {}", ems3Properties.getTokenUrl());

        ResponseEntity<String> response = restTemplate.exchange(
            ems3Properties.getTokenUrl(),
            HttpMethod.POST,
            request,
            String.class);

        if (response.getStatusCode().value() == HttpStatus.UNAUTHORIZED.value()) {
            throw new IllegalStateException("Failed to fetch EMS3 token, status=" + response.getStatusCode());
        }

        if (!response.getStatusCode().is2xxSuccessful() || StringUtils.isBlank(response.getBody())) {
            throw new IllegalStateException(
                "Failed to fetch EMS3 token, status=" + response.getStatusCode() + ", response body=" + response.getBody());
        }

        JsonNode json = objectMapper.readTree(response.getBody());

        String token = json.path(KEY_ACCESS_TOKEN).asText(null);
        if (StringUtils.isBlank(token)) {
            throw new IllegalStateException("EMS3 token response missing access_token");
        }

        log.info("EMS3 token fetched successfully");

        return token;
    }

}
