package com.fdc3.chatbot.config;

import com.fdc3.chatbot.agent.MemoryToolsFactory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.nio.file.Path;

/**
 * Wires the AutoMemoryTools persistent long-term memory system into the
 * chatbot backend.
 *
 * <p>Rather than creating a singleton {@code AutoMemoryTools} with a fixed
 * directory (which would share memory across all users), this config exposes
 * a {@link MemoryToolsFactory} that creates per-user instances so each user's
 * memories are stored in their own subdirectory.
 *
 * @see MemoryToolsFactory
 * @see ChatbotMemoryProperties
 */
@Slf4j
@Configuration
@EnableConfigurationProperties(ChatbotMemoryProperties.class)
@ConditionalOnProperty(name = "chatbot.memory.enabled", havingValue = "true", matchIfMissing = true)
public class AutoMemoryToolsConfig {

    @Bean
    public MemoryToolsFactory memoryToolsFactory(ChatbotMemoryProperties properties) {
        Path baseDir = Path.of(properties.getDirectory()).toAbsolutePath();
        log.info("Initializing MemoryToolsFactory – base directory: {}", baseDir);
        return new MemoryToolsFactory(baseDir);
    }
}
