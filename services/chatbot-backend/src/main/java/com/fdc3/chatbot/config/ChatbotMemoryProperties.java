package com.fdc3.chatbot.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.constraints.NotBlank;
import java.time.Duration;

/**
 * Configuration properties for the chatbot long-term memory system.
 *
 * <p>Controls the SQL-backed memory service integration. The legacy
 * AutoMemoryTools file directory remains configurable while the chatbot moves
 * to service-backed operator memory.
 *
 * <p>See: Spring AI Agentic Patterns (Part 6) — AutoMemoryTools
 */
@Validated
@ConfigurationProperties("chatbot.memory")
public class ChatbotMemoryProperties {

    /** Enable long-term memory. */
    private boolean enabled = true;

    /** Base URL for the standalone memory service. */
    @NotBlank
    private String baseUrl = "http://localhost:8084";

    /** Tenant sent to the memory service for local and POC deployments. */
    @NotBlank
    private String tenantId = "default";

    /** Timeout for memory service calls. Memory lookup is best-effort. */
    private Duration requestTimeout = Duration.ofSeconds(2);

    /** Maximum number of memories to inject into a prompt. */
    private int contextLimit = 8;

    /**
     * Legacy directory where AutoMemoryTools memory files are stored.
     * Each memory is a Markdown file with a YAML frontmatter header.
     * A MEMORY.md index file keeps track of all entries.
     */
    @NotBlank
    private String directory = "./data/memories";

    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }

    public String getBaseUrl() { return baseUrl; }
    public void setBaseUrl(String baseUrl) { this.baseUrl = baseUrl; }

    public String getTenantId() { return tenantId; }
    public void setTenantId(String tenantId) { this.tenantId = tenantId; }

    public Duration getRequestTimeout() { return requestTimeout; }
    public void setRequestTimeout(Duration requestTimeout) { this.requestTimeout = requestTimeout; }

    public int getContextLimit() { return contextLimit; }
    public void setContextLimit(int contextLimit) { this.contextLimit = contextLimit; }

    public String getDirectory() { return directory; }
    public void setDirectory(String directory) { this.directory = directory; }
}
