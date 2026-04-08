package com.fdc3.chatbot.mcp;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Data
@Component
@ConfigurationProperties(prefix = "chatbot.mcp")
public class McpBootstrapProperties {

    private int registrationMaxAttempts = 10;

    private long registrationRetryDelayMillis = 1000L;

    private List<Provider> providers = new ArrayList<>();

    @Data
    public static class Provider {
        private boolean enabled;
        private String providerId;
        private String serviceName;
        private McpTransportType transportType;
        private String url;
        private List<String> enabledProfiles = new ArrayList<>();
        private String description;
    }
}
