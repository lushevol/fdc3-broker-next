package com.scb.ratan.flowzero.workflow.config;

import com.scb.ratan.flowzero.workflow.properties.FileNetConfigurationProperties;
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
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

import javax.net.ssl.SSLContext;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class FileNetRestClientConfig {

    private final FileNetConfigurationProperties fileNetConfigurationProperties;

    @Bean("fileNetRestClient")
    public RestClient fileNetRestClient(CloseableHttpClient fileNetHttpClient) {
        return RestClient.builder()
            .requestFactory(new HttpComponentsClientHttpRequestFactory(fileNetHttpClient))
            .build();
    }

    @Bean(destroyMethod = "close")
    public CloseableHttpClient fileNetHttpClient() throws Exception {
        FileNetConfigurationProperties.HttpPool pool = fileNetConfigurationProperties.getHttpPool();

        CloseableHttpClient httpClient = HttpClients.custom()
            .setConnectionManager(buildConnectionManager(pool))
            .setDefaultRequestConfig(buildRequestConfig(pool))
            .evictExpiredConnections()
            .evictIdleConnections(TimeValue.ofSeconds(30))
            .build();

        log.info("fileNetHttpClient created (maxTotal={}, maxPerRoute={}, "
            + "connectMs={}, readMs={}, poolWaitMs={}, idleEvictSecs=30)",
            pool.getMaxTotal(), pool.getMaxPerRoute(),
            pool.getConnectTimeoutMillis(), pool.getReadTimeoutMillis(),
            pool.getConnectionRequestTimeoutMillis());

        return httpClient;
    }

    /** curl -k: trust all server certificates (self-signed certs on UAT/test). */
    private SSLContext buildTrustAllSslContext() throws Exception {
        return SSLContextBuilder.create()
            .loadTrustMaterial(null, (chain, authType) -> true)
            .build();
    }

    /** HttpClient5 5.2+: connectTimeout and socketTimeout belong on ConnectionConfig. */
    private ConnectionConfig buildConnectionConfig(FileNetConfigurationProperties.HttpPool pool) {
        return ConnectionConfig.custom()
            .setConnectTimeout(Timeout.ofMilliseconds(pool.getConnectTimeoutMillis()))
            .setSocketTimeout(Timeout.ofMilliseconds(pool.getReadTimeoutMillis()))
            .build();
    }

    /** Pooling connection manager with SSL, size limits, and per-connection timeouts. */
    private HttpClientConnectionManager buildConnectionManager(
        FileNetConfigurationProperties.HttpPool pool) throws Exception {
        return PoolingHttpClientConnectionManagerBuilder.create()
            .setSSLSocketFactory(
                SSLConnectionSocketFactoryBuilder.create()
                    .setSslContext(buildTrustAllSslContext())
                    .build())
            .setMaxConnTotal(pool.getMaxTotal())
            .setMaxConnPerRoute(pool.getMaxPerRoute())
            .setDefaultConnectionConfig(buildConnectionConfig(pool))
            .build();
    }

    /** Request-level config: only connectionRequestTimeout (pool-wait time). */
    private RequestConfig buildRequestConfig(FileNetConfigurationProperties.HttpPool pool) {
        return RequestConfig.custom()
            .setConnectionRequestTimeout(
                Timeout.ofMilliseconds(pool.getConnectionRequestTimeoutMillis()))
            .build();
    }

}
