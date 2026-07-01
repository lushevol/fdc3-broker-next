package com.scb.ratan.flowzero.designer.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "retry")
public class RetryProperties {

    @Data
    public static class RetryConfig {

        private int maxAttempts;
        private Backoff backoff = new Backoff();

    }

    @Data
    public static class Backoff {

        private long delay;
        private double multiplier;
        private long maxDelay;

    }

    private RetryConfig upload;
    private RetryConfig download;
    private RetryConfig def;

    public RetryConfig getUpload() {
        return upload != null ? upload : def;
    }

    public RetryConfig getDownload() {
        return download != null ? download : def;
    }

}
