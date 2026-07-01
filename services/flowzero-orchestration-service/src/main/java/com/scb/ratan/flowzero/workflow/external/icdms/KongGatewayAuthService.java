package com.scb.ratan.flowzero.workflow.external.icdms;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.LoadingCache;
import com.scb.ratan.flowzero.workflow.common.KongConstants;
import com.scb.ratan.flowzero.workflow.properties.KongConfigurationProperties;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClient;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.concurrent.TimeUnit;

/**
 * Manages the Kong OAuth2 access token lifecycle using <b>Caffeine in-process cache</b> (no Redis).
 *
 * <h3>Caffeine configuration</h3>
 * <pre>
 * tokenCache (LoadingCache):
 *   expireAfterWrite = 60 min  ← hard expiry, matches Kong token TTL
 *   refreshAfterWrite = 55 min ← proactive async background refresh, 5-min safety window
 *   CacheLoader = loadToken()  ← called on initial access, expiry, and background refresh
 *
 * credentialCache (Cache):
 *   no expiry                  ← client_id / client_secret are stable for the app lifetime
 * </pre>
 *
 * <h3>Why Caffeine replaces @Scheduled + ReentrantLock + AtomicReference</h3>
 * <ul>
 *   <li>{@code refreshAfterWrite} triggers a non-blocking background reload automatically —
 *       callers always get the last valid token without waiting.</li>
 *   <li>Caffeine serialises concurrent loads for the same key internally — no manual lock needed.</li>
 *   <li>If a background refresh fails, Caffeine retains the old value and retries on the next
 *       access — the token stays valid for the remaining 5-min window.</li>
 * </ul>
 *
 * <h3>Multi-instance deployment</h3>
 * Each JVM instance maintains its own Caffeine cache independently.
 * {@code client_credentials} tokens are stateless: every instance holds its own equally-valid
 * token. No cross-machine synchronisation is required.
 */
@Slf4j
@Component
public class KongGatewayAuthService {

    @Autowired
    private KongConfigurationProperties kongConfigurationProperties;
    @Autowired
    @Qualifier("kongCertRestClient")
    private RestClient certRestClient;

    /**
     * Token cache — auto-refreshes in background at 55 min, hard expires at 60 min.
     * {@link LoadingCache#get(Object)} always returns a value (loads on miss) and is thread-safe.
     */
    private LoadingCache<String, String> tokenCache;

    /**
     * Client credential cache — loaded once from DCR at startup, no expiry.
     * client_id and client_secret are stable for the application lifetime.
     */
    private Cache<String, String> credentialCache;

    // ── Lifecycle ─────────────────────────────────────────────────────────────

    @PostConstruct
    public void init() {
        credentialCache = Caffeine.newBuilder().build();

        tokenCache = Caffeine.newBuilder()
            .expireAfterWrite(60, TimeUnit.MINUTES)
            .refreshAfterWrite(55, TimeUnit.MINUTES)
            .build(key -> loadToken());

        loadAndCacheCredentials();
        tokenCache.get(KongConstants.CACHE_KEY_TOKEN);
    }

    /**
     * Returns a valid access token from Caffeine cache.
     * <ul>
     *   <li>Cache hit (normal): returns immediately, O(1), no network call.</li>
     *   <li>Cache miss / expiry: blocks until {@link #loadToken()} completes.</li>
     *   <li>Stale (after 55 min): returns old token + Caffeine schedules async reload.</li>
     * </ul>
     */
    public String fetchAccessToken() {
        return tokenCache.get(KongConstants.CACHE_KEY_TOKEN);
    }

    // ── Caffeine CacheLoader ──────────────────────────────────────────────────

    private String loadToken() {
        String clientId = credentialCache.getIfPresent(KongConstants.CACHE_KEY_CLIENT_ID);
        String clientSec = credentialCache.getIfPresent(KongConstants.CACHE_KEY_CLIENT_SEC);

        if (StringUtils.isAnyEmpty(clientId, clientSec)) {
            log.info("loadToken – credentials absent, re-fetching from DCR");
            loadAndCacheCredentials();
            clientId = credentialCache.getIfPresent(KongConstants.CACHE_KEY_CLIENT_ID);
            clientSec = credentialCache.getIfPresent(KongConstants.CACHE_KEY_CLIENT_SEC);
        }

        if (StringUtils.isAnyEmpty(clientId, clientSec)) {
            throw new IllegalStateException("loadToken – unable to obtain client credentials");
        }

        String url = kongConfigurationProperties.getTokenEndpoint();
        String authorization = KongConstants.BASIC_AUTH_PREFIX + encodeBase64(clientId + ":" + clientSec);

        log.info("loadToken >>> [POST] {}", url);

        String responseBody = certRestClient.post()
            .uri(url)
            .header(HttpHeaders.AUTHORIZATION, authorization)
            .contentType(MediaType.APPLICATION_JSON)
            .body(KongConstants.TOKEN_REQUEST_BODY)
            .retrieve()
            .body(String.class);

        JSONObject json = new JSONObject(responseBody);
        String token = json.optString(KongConstants.FIELD_ACCESS_TOKEN, null);
        long expiresIn = json.optLong(KongConstants.FIELD_EXPIRES_IN, 3600L);

        if (StringUtils.isEmpty(token)) {
            throw new IllegalStateException(
                "loadToken – response missing '" + KongConstants.FIELD_ACCESS_TOKEN + "' field");
        }
        log.info("loadToken <<< token obtained (expires_in={}s)", expiresIn);
        return token;
    }

    private void loadAndCacheCredentials() {
        String url = kongConfigurationProperties.getClientEndpoint();
        String authHeader = KongConstants.BASIC_AUTH_PREFIX + encodeBase64(
            kongConfigurationProperties.getAccount() + ":" + kongConfigurationProperties.getSec());

        log.info("loadAndCacheCredentials >>> [GET] {}", url);

        try {
            String responseBody = certRestClient.get()
                .uri(url)
                .header(HttpHeaders.AUTHORIZATION, authHeader)
                .retrieve()
                .body(String.class);

            if (StringUtils.isNotEmpty(responseBody)) {
                JSONObject json = new JSONObject(responseBody);
                String id = json.getString(KongConstants.FIELD_CLIENT_ID);
                String sec = json.getString(KongConstants.FIELD_CLIENT_SECRET);
                credentialCache.put(KongConstants.CACHE_KEY_CLIENT_ID, id);
                credentialCache.put(KongConstants.CACHE_KEY_CLIENT_SEC, sec);
                log.info("loadAndCacheCredentials <<< credentials cached (client_id={})", id);
            }
        } catch (HttpStatusCodeException e) {
            log.error("loadAndCacheCredentials <<< failed – status={}, body={}",
                e.getStatusCode(), e.getResponseBodyAsString());
        } catch (Exception e) {
            log.error("loadAndCacheCredentials <<< exception calling {}", url, e);
        }
    }

    private String encodeBase64(String value) {
        return Base64.getEncoder().encodeToString(value.getBytes(StandardCharsets.UTF_8));
    }

}
