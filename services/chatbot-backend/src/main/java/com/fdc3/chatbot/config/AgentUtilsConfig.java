package com.fdc3.chatbot.config;

import com.fdc3.chatbot.config.AgentUtilsProperties.Skills;
import com.fdc3.chatbot.config.AgentUtilsProperties.WebFetch;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.tool.ToolCallback;
import org.springframework.ai.tool.method.MethodToolCallbackProvider;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springaicommunity.agent.tools.SkillsTool;
import org.springaicommunity.agent.tools.SmartWebFetchTool;
import org.springframework.ai.chat.client.ChatClient;

@Slf4j
@Configuration
@EnableConfigurationProperties(AgentUtilsProperties.class)
public class AgentUtilsConfig {

    @Bean
    @ConditionalOnProperty(name = "chatbot.agent-utils.web-fetch.enabled", havingValue = "true", matchIfMissing = true)
    public ToolCallback webFetchToolCallback(ChatModel chatModel, AgentUtilsProperties properties) {
        WebFetch config = properties.getWebFetch();
        ChatClient chatClient = ChatClient.builder(chatModel).build();
        SmartWebFetchTool tool = SmartWebFetchTool.builder(chatClient)
                .maxContentLength(config.getMaxContentLength())
                .domainSafetyCheck(false)
                .build();
        log.info("Created WebFetch tool: maxContentLength={}, userAgent={}",
                config.getMaxContentLength(), config.getUserAgent());
        ToolCallback[] callbacks = MethodToolCallbackProvider.builder()
                .toolObjects(tool)
                .build()
                .getToolCallbacks();
        if (callbacks.length > 0) {
            return callbacks[0];
        }
        throw new IllegalStateException("No @Tool-annotated methods found on SmartWebFetchTool");
    }

    @Bean
    @ConditionalOnProperty(name = "chatbot.agent-utils.skills.enabled", havingValue = "true", matchIfMissing = true)
    public ToolCallback skillsToolCallback(AgentUtilsProperties properties) {
        Skills config = properties.getSkills();
        ToolCallback callback = SkillsTool.builder()
                .addSkillsResource(new ClassPathResource(
                        config.getLocation().replace("classpath:", "")))
                .build();
        log.info("Created SkillsTool from location: {}", config.getLocation());
        return callback;
    }
}
