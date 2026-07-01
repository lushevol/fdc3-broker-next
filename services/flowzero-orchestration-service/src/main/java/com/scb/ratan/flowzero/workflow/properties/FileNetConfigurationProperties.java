package com.scb.ratan.flowzero.workflow.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Centralised configuration properties for all FileNet integration settings.
 *
 * <p>Bound from {@code application.yml} under the prefix
 * {@code ratanone.static-data.file-net}.
 *
 * <p>Example configuration:
 * <pre>
 * ratanone:
 *   static-data:
 *     file-net:
 *       multipart-endpoint: https://filenet-host/upload
 *       http-pool:
 *         max-total: 10
 *         max-per-route: 10
 *         connect-timeout-millis: 5000
 *         read-timeout-millis: 60000
 *         connection-request-timeout-millis: 5000
 * </pre>
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "ratanone.static-data.file-net")
public class FileNetConfigurationProperties {

    private String jwtEndpoint;
    private String multipartEndpoint;
    private String metadataEndpoint;
    private String deleteEndpoint;
    private String retrieveEndpoint;
    private String clientId;
    private String clientSecret;
    private String objectStore;
    private String documentClass;
    private HttpPool httpPool = new HttpPool();

    @Data
    public static class HttpPool {

        /**
         * Total number of HTTP connections kept in the pool across all routes.
         *
         * <p>Sizing basis: max 20 concurrent users across 3 nodes ≈ 7 concurrent uploads
         * per node.  A value of 10 provides a small headroom buffer.
         * Default: {@code 10}.
         */
        private int maxTotal = 10;

        /**
         * Maximum HTTP connections to a single target host (route).
         *
         * <p>FileNet is the only target host, so this should equal {@code maxTotal}.
         * Default: {@code 10}.
         */
        private int maxPerRoute = 10;

        /**
         * Timeout in milliseconds for establishing a TCP connection to FileNet.
         * Default: {@code 5000} ms (5 s).
         */
        private int connectTimeoutMillis = 5000;

        /**
         * Timeout in milliseconds for reading a response from FileNet after the
         * connection is established (socket timeout).
         *
         * <p>Worst-case estimate: 10 MB max file ÷ 2 MB/s bandwidth = 5 s transfer
         * + FileNet processing overhead.  30 s provides a safe margin while still
         * bounding the worst-case thread-blocking time.
         * Default: {@code 30000} ms (30 s).
         */
        private int readTimeoutMillis = 30000;

        /**
         * Timeout in milliseconds for obtaining a connection from the pool when
         * all connections are in use.  Fail fast rather than queue indefinitely.
         * Default: {@code 5000} ms (5 s).
         */
        private int connectionRequestTimeoutMillis = 5000;

    }

}
