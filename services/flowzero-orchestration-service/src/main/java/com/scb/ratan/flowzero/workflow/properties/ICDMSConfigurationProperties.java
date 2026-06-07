package com.scb.ratan.flowzero.workflow.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration properties for iCDMS API endpoints and the retry scheduler.
 *
 * <p>YAML binding example:
 * <pre>
 * ratanone.static-data.icdms:
 *   create-endpoint: https://...
 *   metadata-endpoint: https://...
 *   sync-endpoint: https://...
 *   retry:
 *     scheduler:
 *       enabled: true
 *       cron: "0 *&#47;5 * * * *"
 *       batch-size: 50
 * </pre>
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "ratanone.static-data.icdms")
public class ICDMSConfigurationProperties {

    private String createEndpoint;
    private String metadataEndpoint;
    /** Endpoint for binding fileId + LEID + metadata (workflow attachment sync). */
    private String syncEndpoint;

    private final Retry retry = new Retry();

    @Data
    public static class Retry {

        private final Scheduler scheduler = new Scheduler();

        @Data
        public static class Scheduler {

            /** Maximum number of retry tasks processed per scheduler execution. Default: 50. */
            private int batchSize = 50;
            /** Cron expression for the retry scheduler. Default: every 5 minutes. */
            private String cron = "0 */5 * * * *";
            /** Whether the retry scheduler is enabled. */
            private boolean enabled = true;

        }

    }

}
