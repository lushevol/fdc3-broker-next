package com.fdc3.chatbot.config;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import com.fdc3.chatbot.config.AgentUtilsProperties.Tasks;
import com.fdc3.chatbot.config.AgentUtilsProperties.WebFetch;
import com.fdc3.chatbot.tool.agentutils.PendingQuestionRegistry;
import com.fdc3.chatbot.tool.agentutils.ToolExecutionBridge;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.tool.ToolCallback;
import org.springframework.ai.tool.function.FunctionToolCallback;
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
import org.springaicommunity.agent.utils.Skills;
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

    private static final String SKILL_TOOL_DESCRIPTION_TEMPLATE = """
            Execute a skill within the main conversation

            <skills_instructions>
            When users ask you to perform tasks, check if any of the available skills below can help complete the task more effectively. Skills provide specialized capabilities and domain knowledge.

            How to use skills:
            - Invoke skills using this tool with the skill name only (no arguments)
            - When you invoke a skill, you will see <command-message>The "{name}" skill is loading</command-message>
            - The skill's prompt will expand and provide detailed instructions on how to complete the task

            NOTE: Response always starts with the base directory of the skill execution environment. You can use this to retrieve additional files or call shell commands.
            Skill description follows after the base directory line.

            Important:
            - Only use skills listed in <available_skills> below
            - Do not invoke a skill that is already running
            </skills_instructions>

            <available_skills>
            %s
            </available_skills>
            """;

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
    public ToolCallback skillsToolCallback() {
        List<SkillsTool.Skill> skills = Skills.loadResource(new ClassPathResource("skills"));

        String skillsXml = skills.stream()
                .map(SkillsTool.Skill::toXml)
                .collect(Collectors.joining("\n"));

        String description = SKILL_TOOL_DESCRIPTION_TEMPLATE.formatted(skillsXml);

        Function<Map<String, Object>, String> lookup = args -> {
            String command = (String) args.get("command");
            return skills.stream()
                    .filter(s -> s.name().equals(command))
                    .findFirst()
                    .map(s -> "Base directory for this skill: %s%n%n%s".formatted(s.basePath(), s.content()))
                    .orElse("Unknown skill: " + command);
        };

        log.info("Created SkillsTool from classpath:skills/ ({} skills loaded)", skills.size());
        return FunctionToolCallback.builder("Skill", lookup)
                .description(description)
                .inputType((java.lang.reflect.Type) Map.class)
                .inputSchema(
                  "{\"type\":\"object\",\"properties\":{\"command\":{\"type\":\"string\"," +
                  "\"description\":\"The name of the skill to invoke\"}}," +
                  "\"required\":[\"command\"]}")
                .build();
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
