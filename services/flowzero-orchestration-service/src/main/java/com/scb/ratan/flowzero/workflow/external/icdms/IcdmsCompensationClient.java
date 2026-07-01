package com.scb.ratan.flowzero.workflow.external.icdms;

import com.scb.ratan.flowzero.workflow.common.enums.IcdmsErrorCode;
import com.scb.ratan.flowzero.workflow.common.exception.IcdmsClientException;
import com.scb.ratan.flowzero.workflow.common.exception.IcdmsSyncException;
import com.scb.ratan.flowzero.workflow.properties.ICDMSConfigurationProperties;
import io.github.resilience4j.circuitbreaker.CallNotPermittedException;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.ratelimiter.RequestNotPermitted;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import io.github.resilience4j.timelimiter.annotation.TimeLimiter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClient;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeoutException;

/**
 * Async iCDMS client for the workflow-attachment compensation flow.
 *
 * <p>Decorated with a three-layer Resilience4j protection chain:
 * <pre>
 * RateLimiter → CircuitBreaker → TimeLimiter
 * </pre>
 * Returns {@link CompletableFuture} so that callers can block with {@code .get()} or
 * compose asynchronously. All non-2xx outcomes are mapped to typed exceptions:
 * <ul>
 *   <li>{@link IcdmsClientException} — 4xx data error (does NOT trip circuit breaker)</li>
 *   <li>{@link IcdmsSyncException}   — 5xx / timeout / CB OPEN / rate-limit (trips CB)</li>
 * </ul>
 *
 * <p>This class is intentionally separate from {@link ICDMSApiClient} which handles
 * synchronous business calls. Keeping them apart follows the Single Responsibility Principle.
 *
 * @author Aiden
 * @date 05/27/2026
 */
@Slf4j
@Component
public class IcdmsCompensationClient {

    private final RestClient kongCertRestClient;
    private final ICDMSConfigurationProperties icdmsConfigurationProperties;
    private final KongGatewayAuthService authServerClient;
    private final IcdmsErrorParser errorParser;

    public IcdmsCompensationClient(
        @Qualifier("kongCertRestClient") RestClient kongCertRestClient,
        ICDMSConfigurationProperties icdmsConfigurationProperties,
        KongGatewayAuthService authServerClient,
        IcdmsErrorParser errorParser) {
        this.kongCertRestClient = kongCertRestClient;
        this.icdmsConfigurationProperties = icdmsConfigurationProperties;
        this.authServerClient = authServerClient;
        this.errorParser = errorParser;
    }

    /**
     * Sends document metadata to iCDMS asynchronously.
     *
     * <p>Execution order of decorators (outer → inner):
     * <ol>
     *   <li>{@code @RateLimiter}    — token-bucket; rejects burst immediately via fallback</li>
     *   <li>{@code @CircuitBreaker} — trips on high failure/slow-call rate; prevents cascade</li>
     *   <li>{@code @TimeLimiter}    — cancels the future after 8 s; prevents thread starvation</li>
     * </ol>
     *
     * @param payload document metadata to sync; must not be {@code null}
     * @return {@link CompletableFuture} completed normally on 2xx, exceptionally on any failure
     */
    @RateLimiter(name = "icdmsClient", fallbackMethod = "rateLimitFallback")
    @CircuitBreaker(name = "icdmsClient", fallbackMethod = "circuitBreakerFallback")
    @TimeLimiter(name = "icdmsClient")
    public CompletableFuture<Void> sendDocumentMetadata(IcdmsSyncPayload payload) {
        String accessToken = authServerClient.fetchAccessToken();

        return CompletableFuture.runAsync(() -> doSend(payload, accessToken));
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private void doSend(IcdmsSyncPayload payload, String accessToken) {
        String url = icdmsConfigurationProperties.getSyncEndpoint();
        log.info("sendDocumentMetadata >>> [POST] url={} attachmentId={}", url, payload.getAttachmentId());

        try {
            kongCertRestClient.post()
                .uri(url)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .body(payload)
                .retrieve()
                .toBodilessEntity();

            log.info("sendDocumentMetadata <<< SUCCESS attachmentId={}", payload.getAttachmentId());

        } catch (HttpStatusCodeException e) {
            String errorBody = e.getResponseBodyAsString();
            log.error("sendDocumentMetadata <<< FAILED status={} body={}", e.getStatusCode(), errorBody);
            if (e.getStatusCode().is4xxClientError()) {
                IcdmsErrorCode clientCode = errorParser.resolveClientErrorCode(errorBody);
                throw new IcdmsClientException(clientCode,
                    errorParser.buildErrorMessage("iCDMS sendDocumentMetadata", e.getStatusCode().toString(), errorBody), e);
            }
            throw new IcdmsSyncException(IcdmsErrorCode.SERVER_ERROR,
                "iCDMS sync failed [" + e.getStatusCode() + "] attachmentId=" + payload.getAttachmentId(), e);
        } catch (IcdmsClientException | IcdmsSyncException e) {
            throw e;
        } catch (Exception e) {
            log.error("sendDocumentMetadata <<< exception attachmentId={}", payload.getAttachmentId(), e);
            throw new IcdmsSyncException(IcdmsErrorCode.UNKNOWN,
                "iCDMS sync exception: " + e.getMessage() + " attachmentId=" + payload.getAttachmentId(), e);
        }
    }

    // ── Resilience4j fallbacks (called via reflection — @SuppressWarnings is
    // intentional) ──

    /** Fallback — CircuitBreaker OPEN. */
    @SuppressWarnings("unused")
    private CompletableFuture<Void> circuitBreakerFallback(IcdmsSyncPayload payload, CallNotPermittedException e) {
        log.warn("[ICDMS][CB_OPEN] Circuit Breaker OPEN, skip sync attachmentId={}", payload.getAttachmentId());
        return CompletableFuture.failedFuture(
            new IcdmsSyncException(IcdmsErrorCode.CIRCUIT_BREAKER_OPEN,
                "Circuit Breaker OPEN – iCDMS unavailable attachmentId=" + payload.getAttachmentId(), e));
    }

    /** Fallback — TimeLimiter timeout. */
    @SuppressWarnings("unused")
    private CompletableFuture<Void> circuitBreakerFallback(IcdmsSyncPayload payload, TimeoutException e) {
        log.warn("[ICDMS][TIMEOUT] sendDocumentMetadata timed out attachmentId={}", payload.getAttachmentId());
        return CompletableFuture.failedFuture(
            new IcdmsSyncException(IcdmsErrorCode.TIMEOUT,
                "iCDMS request timed out (>8s) attachmentId=" + payload.getAttachmentId(), e));
    }

    /** Fallback — RateLimiter quota exhausted. */
    @SuppressWarnings("unused")
    private CompletableFuture<Void> rateLimitFallback(IcdmsSyncPayload payload, RequestNotPermitted e) {
        log.warn("[ICDMS][RATE_LIMIT] Rate limit exceeded, skip sync attachmentId={}", payload.getAttachmentId());
        return CompletableFuture.failedFuture(
            new IcdmsSyncException(IcdmsErrorCode.RATE_LIMIT_EXCEEDED,
                "iCDMS rate limit exceeded attachmentId=" + payload.getAttachmentId(), e));
    }

}
