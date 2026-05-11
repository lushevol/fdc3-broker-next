package com.fdc3.chatbot.config;

import java.util.Map;

import com.fdc3.chatbot.config.AgentUtilsProperties.Skills;
import com.fdc3.chatbot.config.AgentUtilsProperties.WebFetch;
import com.fdc3.chatbot.tool.agentutils.PendingQuestionRegistry;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.tool.ToolCallback;
import org.springframework.ai.tool.method.MethodToolCallbackProvider;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springaicommunity.agent.tools.AskUserQuestionTool;
import org.springaicommunity.agent.tools.AskUserQuestionTool.QuestionHandler;
import org.springaicommunity.agent.tools.SkillsTool;
import org.springaicommunity.agent.tools.SmartWebFetchTool;
import org.springaicommunity.agent.tools.TodoWriteTool;
import org.springaicommunity.agent.tools.TodoWriteTool.TodoEventHandler;
import org.springframework.ai.chat.client.ChatClient;

/**
 * Wires spring-ai-agent-utils tools into Spring context.
 * Each tool is conditional on its enabled flag in chatbot.agent-utils.*.
 */
@Slf4j
@Configuration
@EnableConfigurationProperties(AgentUtilsProperties.class)
public class AgentUtilsConfig {

    @Bean
    public PendingQuestionRegistry pendingQuestionRegistry() {
        return new PendingQuestionRegistry();
    }

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

    @Bean
    @ConditionalOnProperty(name = "chatbot.agent-utils.ask-user.enabled", havingValue = "true", matchIfMissing = true)
    public ToolCallback askUserQuestionToolCallback(
            PendingQuestionRegistry pendingQuestionRegistry,
            AgentUtilsProperties properties
    ) {
        // QuestionHandler receives questions from the tool and returns answers.
        // When questions arrive, the handler stores them in the registry and
        // blocks until the user responds via the QuestionController endpoint.
        QuestionHandler handler = questions -> {
            log.info("AskUserQuestion: {} questions pending", questions.size());
            // In production, this would:
            // 1. Generate a questionId
            // 2. Emit an SSE user_question event
            // 3. Register the CompletableFuture in pendingQuestionRegistry
            // 4. Block on future.get() until the user responds
            // For now, return a default answer to unblock the tool
            return Map.of();
        };
        AskUserQuestionTool tool = AskUserQuestionTool.builder()
                .questionHandler(handler)
                .answersValidation(false)
                .build();
        log.info("Created AskUserQuestionTool");
        ToolCallback[] callbacks = MethodToolCallbackProvider.builder()
                .toolObjects(tool)
                .build()
                .getToolCallbacks();
        if (callbacks.length > 0) {
            return callbacks[0];
        }
        throw new IllegalStateException("No @Tool-annotated methods found on AskUserQuestionTool");
    }

    @Bean
    @ConditionalOnProperty(name = "chatbot.agent-utils.todo.enabled", havingValue = "true", matchIfMissing = true)
    public ToolCallback todoWriteToolCallback() {
        TodoEventHandler handler = todos -> {
            log.info("TodoWrite: {} items received", todos.todos().size());
        };
        TodoWriteTool tool = TodoWriteTool.builder()
                .todoEventHandler(handler)
                .build();
        log.info("Created TodoWriteTool");
        ToolCallback[] callbacks = MethodToolCallbackProvider.builder()
                .toolObjects(tool)
                .build()
                .getToolCallbacks();
        if (callbacks.length > 0) {
            return callbacks[0];
        }
        throw new IllegalStateException("No @Tool-annotated methods found on TodoWriteTool");
    }
}
