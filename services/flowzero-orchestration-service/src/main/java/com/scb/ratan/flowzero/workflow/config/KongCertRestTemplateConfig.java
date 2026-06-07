package com.scb.ratan.flowzero.workflow.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.hc.client5.http.config.ConnectionConfig;
import org.apache.hc.client5.http.config.RequestConfig;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.client5.http.impl.io.PoolingHttpClientConnectionManagerBuilder;
import org.apache.hc.client5.http.io.HttpClientConnectionManager;
import org.apache.hc.client5.http.ssl.SSLConnectionSocketFactoryBuilder;
import org.apache.hc.core5.ssl.SSLContextBuilder;
import org.apache.hc.core5.util.TimeValue;
import org.apache.hc.core5.util.Timeout;
import org.springframework.boot.ssl.SslBundle;
import org.springframework.boot.ssl.SslBundles;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

import javax.net.ssl.SSLContext;

import static com.scb.ratan.flowzero.workflow.common.KongConstants.*;

/**
 * Configures the mTLS-enabled {@link RestClient} used to call iCDMS via Kong Gateway.
 *
 * <p>The client certificate and private key are loaded by Spring Boot from the PEM files
 * declared under {@code spring.ssl.bundle.pem.kong} in {@code application.yml}.
 *
 * <p>Two beans are declared:
 * <ul>
 *   <li>{@link #kongHttpClient()} — Apache HttpClient5 connection pool with mTLS + timeouts</li>
 *   <li>{@link #kongCertRestClient(CloseableHttpClient)} — Spring RestClient wrapping the above</li>
 * </ul>
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
public class KongCertRestTemplateConfig {

    private final SslBundles sslBundles;

    @Bean("kongCertRestClient")
    public RestClient kongCertRestClient(CloseableHttpClient kongHttpClient) {
        return RestClient.builder()
            .requestFactory(new HttpComponentsClientHttpRequestFactory(kongHttpClient))
            .build();
    }

    /**
     * Apache HttpClient5 connection pool with:
     * <ul>
     *   <li>mTLS client certificate loaded from Spring SslBundle</li>
     *   <li>Trust-all server certificate verification (equivalent to {@code curl -k})</li>
     *   <li>Connection/socket/pool-wait timeouts</li>
     *   <li>Idle connection eviction to prevent "Connection reset" on stale connections</li>
     * </ul>
     */
    @Bean(destroyMethod = "close")
    public CloseableHttpClient kongHttpClient() throws Exception {
        CloseableHttpClient httpClient = HttpClients.custom()
            .setConnectionManager(buildConnectionManager())
            .setDefaultRequestConfig(buildRequestConfig())
            .evictExpiredConnections()
            .evictIdleConnections(TimeValue.ofSeconds(IDLE_EVICT_SECONDS))
            .build();

        log.info("kongHttpClient bean created (maxTotal={}, maxPerRoute={}, "
            + "connectMs={}, readMs={}, poolWaitMs={}, idleEvictSecs={})",
            MAX_CONN_TOTAL, MAX_CONN_PER_ROUTE,
            CONNECT_TIMEOUT_MS, READ_TIMEOUT_MS,
            CONNECTION_REQUEST_TIMEOUT_MS, IDLE_EVICT_SECONDS);
        return httpClient;
    }

    /**
     * Builds an SSLContext with:
     * <ul>
     *   <li>Client certificate from the {@code kong} SslBundle (mTLS)</li>
     *   <li>Trust-all server certificate policy (skip hostname/cert validation)</li>
     * </ul>
     */
    private SSLContext buildSslContext() throws Exception {
        SslBundle bundle = sslBundles.getBundle(BUNDLE_NAME);
        String keyPassword = bundle.getKey().getPassword();
        char[] keyPasswordChars = keyPassword != null ? keyPassword.toCharArray() : new char[0];

        log.info("buildSslContext – loading mTLS cert from SslBundle '{}'", BUNDLE_NAME);
        return SSLContextBuilder.create()
            .loadKeyMaterial(bundle.getStores().getKeyStore(), keyPasswordChars)
            .loadTrustMaterial(null, (chain, authType) -> true)
            .build();
    }

    /** Pooling connection manager with mTLS SSL, size limits, and per-connection timeouts. */
    private HttpClientConnectionManager buildConnectionManager() throws Exception {
        ConnectionConfig connectionConfig = ConnectionConfig.custom()
            .setConnectTimeout(Timeout.ofMilliseconds(CONNECT_TIMEOUT_MS))
            .setSocketTimeout(Timeout.ofMilliseconds(READ_TIMEOUT_MS))
            .build();

        return PoolingHttpClientConnectionManagerBuilder.create()
            .setSSLSocketFactory(
                SSLConnectionSocketFactoryBuilder.create()
                    .setSslContext(buildSslContext())
                    .build())
            .setMaxConnTotal(MAX_CONN_TOTAL)
            .setMaxConnPerRoute(MAX_CONN_PER_ROUTE)
            .setDefaultConnectionConfig(connectionConfig)
            .build();
    }

    /** Request-level config: only connectionRequestTimeout (pool-wait time). */
    private RequestConfig buildRequestConfig() {
        return RequestConfig.custom()
            .setConnectionRequestTimeout(Timeout.ofMilliseconds(CONNECTION_REQUEST_TIMEOUT_MS))
            .build();
    }

}
