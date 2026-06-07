package com.scb.ratan.flowzero.workflow.external.filenet;

import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.LoadingCache;
import com.scb.ratan.flowzero.workflow.properties.FileNetConfigurationProperties;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClient;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

import static com.scb.ratan.flowzero.workflow.common.FileNetJwtConstants.*;

/**
 * Manages the FileNet JWT lifecycle using Caffeine in-process cache.
 * Tokens are refreshed asynchronously every 25 min and expire hard at 30 min.
 *
 * @author Aiden
 * @date 05/27/2026
 */
@Slf4j
@Component
public class FileNetJwtService {

    private final FileNetConfigurationProperties fileNetConfigurationProperties;
    private final RestClient fileNetRestClient;

    /**
     * JWT LoadingCache:
     * <ul>
     *   <li>{@code refreshAfterWrite(25, MINUTES)}: async background refresh at 25 min.</li>
     *   <li>{@code expireAfterWrite(30, MINUTES)}: hard expiry at 30 min (FileNet TTL).</li>
     * </ul>
     */
    // volatile: written once in @PostConstruct, read from any caller thread
    // thereafter
    private volatile LoadingCache<String, String> jwtCache;

    public FileNetJwtService(
        FileNetConfigurationProperties fileNetConfigurationProperties,
        @Qualifier("fileNetRestClient") RestClient fileNetRestClient) {
        this.fileNetConfigurationProperties = fileNetConfigurationProperties;
        this.fileNetRestClient = fileNetRestClient;
    }

    @PostConstruct
    public void init() {
        jwtCache = Caffeine.newBuilder()
            .expireAfterWrite(30, TimeUnit.MINUTES)
            .refreshAfterWrite(25, TimeUnit.MINUTES)
            .build(key -> loadJwt());

        // Pre-warm intentionally: fail fast at startup if FileNet credentials are
        // wrong.
        // An exception here prevents the service from starting with a broken JWT
        // config.
        log.info("FileNetJwtService – pre-warming JWT cache");
        String initialJwt = jwtCache.get(JWT_CACHE_KEY);
        int tokenLength = initialJwt != null ? initialJwt.length() : 0;
        log.info("FileNetJwtService – JWT cache warmed (token length={})", tokenLength);
    }

    /**
     * Returns a valid JWT from the Caffeine cache.
     *
     * <p>Callers should not cache the returned value; always call this method to
     * benefit from the auto-refresh behaviour.
     *
     * @return non-null JWT string
     * @throws IllegalStateException if the JWT cannot be loaded from FileNet
     */
    public String fetchJwt() {
        return jwtCache.get(JWT_CACHE_KEY);
    }

    // ── Caffeine CacheLoader ──────────────────────────────────────────────────

    /**
     * Loads a fresh JWT from the FileNet token endpoint.
     *
     * <p>Called by Caffeine on:
     * <ol>
     *   <li>First access (initial load).</li>
     *   <li>Background refresh at 25 min (async, non-blocking to callers).</li>
     *   <li>Hard expiry at 30 min (synchronous, blocks current caller).</li>
     * </ol>
     *
     * <p>On failure during background refresh, Caffeine retains the old value;
     * on failure during synchronous load, the exception propagates to the caller.
     *
     * @return fresh JWT string; never null
     * @throws IllegalStateException if the response does not contain a recognisable token
     */
    private String loadJwt() {
        String url = buildJwtUrl();
        String authorization = buildBasicAuthorization();
        log.info("loadJwt >>> [POST] {}", url);

        // HTTP call only inside try-catch: network/HTTP errors → IllegalStateException.
        // JWT validation is intentionally outside the try block so that its
        // IllegalStateException propagates with the original specific message,
        // instead of being swallowed by the generic catch(Exception) below.
        String responseBody = fetchJwtResponse(url, authorization);

        String jwt = parseJwt(responseBody);
        if (StringUtils.isEmpty(jwt)) {
            throw new IllegalStateException("loadJwt – JWT absent in response: " + responseBody);
        }
        log.info("loadJwt <<< JWT obtained successfully");
        return jwt;
    }

    /**
     * Executes the HTTP POST to the FileNet token endpoint and returns the raw response body.
     * All network / HTTP errors are converted to {@link IllegalStateException}.
     */
    private String fetchJwtResponse(String url, String authorization) {
        try {
            return fileNetRestClient.post()
                .uri(url)
                .header(HttpHeaders.AUTHORIZATION, authorization)
                .header(GRANT_TYPE_HEADER, GRANT_TYPE_VALUE)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(GRANT_TYPE_FORM_BODY)
                .retrieve()
                .body(String.class);
        } catch (HttpStatusCodeException e) {
            log.error("loadJwt <<< FAILED – status={}, body={}",
                e.getStatusCode(), e.getResponseBodyAsString());
            throw new IllegalStateException("loadJwt – HTTP " + e.getStatusCode(), e);
        } catch (Exception e) {
            log.error("loadJwt <<< exception calling {}", url, e);
            throw new IllegalStateException("loadJwt – unexpected error", e);
        }
    }

    /**
     * Appends the {@code grant_type} query parameter to the configured JWT endpoint URL.
     * Avoids duplicate parameters if the endpoint already contains a query string.
     */
    private String buildJwtUrl() {
        String endpoint = fileNetConfigurationProperties.getJwtEndpoint();
        return endpoint.contains("?")
            ? endpoint + "&grant_type=" + GRANT_TYPE_VALUE
            : endpoint + GRANT_TYPE_QUERY;
    }

    /** Builds the {@code Authorization: Basic <Base64(clientId:clientSecret)>} header value. */
    private String buildBasicAuthorization() {
        String credentials = fileNetConfigurationProperties.getClientId()
            + ":" + fileNetConfigurationProperties.getClientSecret();
        return BASIC + Base64.getEncoder().encodeToString(credentials.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Parses the JWT from the response body.
     *
     * <ol>
     *   <li>If the response is a JSON object, tries common token field names in order:
     *       {@code token}, {@code access_token}, {@code id_token}, {@code jwt}.</li>
     *   <li>If the response is a plain string (or no known field is found), returns the
     *       trimmed response as-is (raw JWT string).</li>
     * </ol>
     */
    private String parseJwt(String responseBody) {
        if (StringUtils.isBlank(responseBody)) {
            return StringUtils.EMPTY;
        }
        String trimmed = responseBody.trim();
        if (!trimmed.startsWith("{")) {
            // Plain string response (e.g. raw "eyJ..." token)
            return trimmed;
        }
        // JSON response — try to extract a known token field, fall back to raw string
        return extractTokenFromJson(trimmed).orElse(trimmed);
    }

    /** Tries to extract a JWT value from a JSON object by scanning well-known field names. */
    private Optional<String> extractTokenFromJson(String jsonBody) {
        try {
            JSONObject json = new JSONObject(jsonBody);
            for (String field : TOKEN_FIELDS) {
                String value = json.optString(field, null);
                if (StringUtils.isNotEmpty(value)) {
                    return Optional.of(value);
                }
            }
        } catch (Exception e) {
            log.warn("parseJwt – response looks like JSON but failed to parse, treating as raw token", e);
        }
        return Optional.empty();
    }

}
