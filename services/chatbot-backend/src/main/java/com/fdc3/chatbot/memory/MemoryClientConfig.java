package com.fdc3.chatbot.memory;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fdc3.chatbot.config.ChatbotMemoryProperties;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(ChatbotMemoryProperties.class)
@ConditionalOnProperty(name = "chatbot.memory.enabled", havingValue = "true", matchIfMissing = true)
public class MemoryClientConfig {

    @Bean
    @ConditionalOnMissingBean
    public MemoryClient memoryClient(ObjectMapper objectMapper, ChatbotMemoryProperties properties) {
        return new HttpMemoryClient(objectMapper, properties);
    }

    @Bean
    @ConditionalOnMissingBean
    public MemoryContextBuilder memoryContextBuilder(MemoryClient memoryClient, ChatbotMemoryProperties properties) {
        return new MemoryContextBuilder(memoryClient, properties);
    }
}
