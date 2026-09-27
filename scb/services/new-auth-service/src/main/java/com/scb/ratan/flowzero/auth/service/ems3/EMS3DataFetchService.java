package com.scb.ratan.flowzero.auth.service.ems3;

import com.fasterxml.jackson.core.type.TypeReference;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.scb.ratan.flowzero.auth.constant.AuthConstant;
import com.scb.ratan.flowzero.auth.entity.ems3.EntitlementBean;
import com.scb.ratan.flowzero.auth.entity.ems3.UserEntitlement;
import com.scb.ratan.flowzero.auth.properties.EMS3Properties;
import com.scb.ratan.flowzero.auth.util.RatanObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
public class EMS3DataFetchService {

    private static final String TOKEN_CACHE_KEY = "ems3:access_token";

    private static final long TOKEN_CACHE_SECONDS = Duration.ofHours(1).minusMinutes(5).toSeconds();

    @Autowired
    private EMS3Properties ems3Properties;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private RatanObjectMapper objectMapper;

    @Autowired
    private EMS3TokenService ems3TokenService;

    private static final Cache<String, String> TOKEN_CACHE = Caffeine.newBuilder()
        .maximumSize(200)
        .expireAfterWrite(TOKEN_CACHE_SECONDS, TimeUnit.SECONDS)
        .build();

    /**
     * Get the access token from cache or fetch a new one if not present or expired.
     *
     * @return the access token
     */
    public String getAccessToken() {

        String cachedToken = TOKEN_CACHE.getIfPresent(TOKEN_CACHE_KEY);

        if (StringUtils.isNotBlank(cachedToken)) {
            return cachedToken;
        }

        // Atomically fetch and cache the token to avoid multiple threads fetching the
        // token simultaneously
        return TOKEN_CACHE.get(
            TOKEN_CACHE_KEY,
            key -> ems3TokenService.fetchAccessToken());
    }

    @Retryable(retryFor = { Exception.class }, maxAttempts = 3, backoff = @Backoff(delay = 1000, multiplier = 2))
    public List<EntitlementBean> fetchEntitlementInfo(String userId) {

        String accessToken = getAccessToken();

        if (StringUtils.isBlank(accessToken)) {
            log.warn("Access token is blank, cannot fetch EMS3 entitlement info");
            return List.of();
        }

        if (StringUtils.isBlank(userId)) {
            // unreachable – bankId always not null, but just in case, we log a warning and
            // return an empty list
            log.warn("UserId is blank, cannot fetch EMS3 entitlement info");
            return List.of();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(
            ems3Properties.getEntitlementUrl() + AuthConstant.SLASH + userId,
            HttpMethod.GET,
            request,
            String.class);

        if (!response.getStatusCode().is2xxSuccessful() || StringUtils.isBlank(response.getBody())) {
            throw new IllegalStateException(
                "Failed to fetch EMS3 user info, status=" + response.getStatusCode() + ", response body=" + response.getBody());
        }

        return objectMapper.readValue(response.getBody(), new TypeReference<>() {});
    }

    @Retryable(retryFor = { Exception.class }, maxAttempts = 3, backoff = @Backoff(delay = 1000, multiplier = 2))
    public List<UserEntitlement> fetchUserList() {

        String accessToken = getAccessToken();

        if (StringUtils.isBlank(accessToken)) {
            log.warn("Access token is blank, cannot fetch EMS3 user info");
            return List.of();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(
            ems3Properties.getUserUrl(),
            HttpMethod.GET,
            request,
            String.class);

        if (!response.getStatusCode().is2xxSuccessful() || StringUtils.isBlank(response.getBody())) {
            throw new IllegalStateException(
                "Failed to fetch EMS3 user info, status=" + response.getStatusCode() + ", response body=" + response.getBody());
        }

        return objectMapper.readValue(response.getBody(), new TypeReference<>() {});
    }

}
