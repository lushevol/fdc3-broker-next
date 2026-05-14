package com.fdc3.chatbot.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.constraints.NotBlank;

/**
 * Configuration properties for the chatbot long-term memory system.
 *
 * <p>Controls the AutoMemoryTools-based persistent file memory that allows
 * the AI agent to remember facts, user preferences, project context, and
 * behavioral feedback across sessions.
 *
 * <p>See: Spring AI Agentic Patterns (Part 6) — AutoMemoryTools
 */
@Validated
@ConfigurationProperties("chatbot.memory")
public class ChatbotMemoryProperties {

    /** Enable the long-term memory system (AutoMemoryTools). */
    private boolean enabled = true;

    /**
     * Directory where memory files are stored.
     * Each memory is a Markdown file with a YAML frontmatter header.
     * A MEMORY.md index file keeps track of all entries.
     */
    @NotBlank
    private String directory = "./data/memories";

    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }

    public String getDirectory() { return directory; }
    public void setDirectory(String directory) { this.directory = directory; }
}
