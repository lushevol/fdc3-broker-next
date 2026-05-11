package com.fdc3.chatbot.config;

import java.util.List;

import com.fdc3.chatbot.config.AgentUtilsProperties.Skills;
import com.fdc3.chatbot.config.AgentUtilsProperties.Tasks;
import com.fdc3.chatbot.config.AgentUtilsProperties.WebFetch;
import com.fdc3.chatbot.tool.agentutils.PendingQuestionRegistry;
import com.fdc3.chatbot.tool.agentutils.ToolExecutionBridge;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.tool.ToolCallback;
import org.springframework.ai.tool.method.MethodToolCallbackProvider;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.core.io.ClassPathResource;
import org.springaicommunity.agent.common.task.subagent.SubagentReference;
import org.springaicommunity.agent.common.task.subagent.SubagentType;
import org.springaicommunity.agent.tools.SkillsTool;
import org.springaicommunity.agent.tools.SmartWebFetchTool;
import org.springaicommunity.agent.tools.TodoWriteTool;
import org.springaicommunity.agent.tools.TodoWriteTool.TodoEventHandler;
import org.springaicommunity.agent.tools.task.TaskTool;
import org.springaicommunity.agent.tools.task.claude.ClaudeSubagentReferences;
import org.springaicommunity.agent.tools.task.claude.ClaudeSubagentType;

/**
 * Wires spring-ai-agent-utils tools into Spring context.
 * Each tool is conditional on its enabled flag in chatbot.agent-utils.*.
 *
 * NOTE: agent-utils 0.7.0 has a dependency on Spring Framework 7.x class
 * {@code org.springframework.core.Nullness}. All agent-utils tool beans are
 * disabled by default ({@code matchIfMissing = false}) to avoid context
 * loading failures on Spring Boot 3.5.x / Spring Framework 6.x. Enable them
 * explicitly via {@code chatbot.agent-utils.<feature>.enabled=true} when
 * running on a compatible Spring version.
 */
@Slf4j
@Configuration
@EnableConfigurationProperties(AgentUtilsProperties.class)
public class AgentUtilsConfig {

    @PostConstruct
    void checkCompatibility() {
        try {
            Class.forName("org.springframework.core.Nullness");
        } catch (ClassNotFoundException e) {
            log.error("spring-ai-agent-utils 0.7.0 requires Spring Framework 7.x class "
                    + "org.springframework.core.Nullness which is not on the classpath. "
                    + "Agent-utils tools will fail at runtime when invoked.");
        }
    }

    @Bean
    public PendingQuestionRegistry pendingQuestionRegistry() {
        return new PendingQuestionRegistry();
    }

    @Bean
    @Lazy
    public ToolExecutionBridge toolExecutionBridge(
            List<ToolCallback> agentUtilsCallbacks
    ) {
        return new ToolExecutionBridge(agentUtilsCallbacks);
    }

    @Bean
    @ConditionalOnProperty(name = "chatbot.agent-utils.web-fetch.enabled", havingValue = "true", matchIfMissing = false)
    public ToolCallback webFetchToolCallback(@Lazy ChatModel chatModel, AgentUtilsProperties properties) {
        WebFetch config = properties.getWebFetch();
        ChatClient chatClient = ChatClient.builder(chatModel).build();
        SmartWebFetchTool tool = SmartWebFetchTool.builder(chatClient)
                .maxContentLength(config.getMaxContentLength())
                .domainSafetyCheck(config.isDomainSafetyCheck())
                .build();
        log.info("Created WebFetch tool: maxContentLength={}, userAgent={}",
                config.getMaxContentLength(), config.getUserAgent());
        return toToolCallback(tool);
    }

    @Bean
    @ConditionalOnProperty(name = "chatbot.agent-utils.skills.enabled", havingValue = "true", matchIfMissing = false)
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
    @ConditionalOnProperty(name = "chatbot.agent-utils.todo.enabled", havingValue = "true", matchIfMissing = false)
    public ToolCallback todoWriteToolCallback() {
        TodoEventHandler handler = todos -> {
            log.info("TodoWrite: {} items received", todos.todos().size());
        };
        TodoWriteTool tool = TodoWriteTool.builder()
                .todoEventHandler(handler)
                .build();
        log.info("Created TodoWriteTool");
        return toToolCallback(tool);
    }

    @Bean
    @ConditionalOnProperty(name = "chatbot.agent-utils.tasks.enabled", havingValue = "true", matchIfMissing = false)
    public ToolCallback taskToolCallback(
            @Lazy ChatModel chatModel,
            AgentUtilsProperties properties
    ) {
        Tasks config = properties.getTasks();
        log.info("Creating TaskTool with defaultModel={}", config.getSubAgentConfig().getDefaultModel());

        ChatClient.Builder defaultBuilder = ChatClient.builder(chatModel);

        SubagentType subagentType = ClaudeSubagentType.builder()
                .chatClientBuilder("default", defaultBuilder)
                .skillsDirectories(List.of("skills"))
                .build();

        List<SubagentReference> refs = ClaudeSubagentReferences.fromResources(
                new ClassPathResource("agents"));

        ToolCallback callback = TaskTool.builder()
                .subagentReferences(refs)
                .subagentTypes(subagentType)
                .build();

        log.info("Created TaskTool with {} sub-agent definitions", refs.size());
        return callback;
    }

    private static ToolCallback toToolCallback(Object tool) {
        ToolCallback[] callbacks = MethodToolCallbackProvider.builder()
                .toolObjects(tool)
                .build()
                .getToolCallbacks();
        if (callbacks.length > 0) {
            return callbacks[0];
        }
        throw new IllegalStateException("No @Tool-annotated methods found on " + tool.getClass().getSimpleName());
    }
}
