package com.fdc3.chatbot.config;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import com.fdc3.chatbot.config.AgentUtilsProperties.Bash;
import com.fdc3.chatbot.config.AgentUtilsProperties.Tasks;
import com.fdc3.chatbot.config.AgentUtilsProperties.WebFetch;
import com.fdc3.chatbot.config.AgentUtilsProperties.WebSearch;
import com.fdc3.chatbot.tool.agentutils.BashTool;
import com.fdc3.chatbot.tool.agentutils.PendingQuestionRegistry;
import com.fdc3.chatbot.tool.agentutils.ToolExecutionBridge;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.tool.ToolCallback;
import org.springframework.ai.tool.function.FunctionToolCallback;
import org.springframework.ai.tool.method.MethodToolCallbackProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.core.io.ClassPathResource;
import org.springaicommunity.agent.common.task.subagent.SubagentType;
import org.springaicommunity.agent.tools.AskUserQuestionTool;
import org.springaicommunity.agent.tools.BraveWebSearchTool;
import org.springaicommunity.agent.tools.SkillsTool;
import org.springaicommunity.agent.tools.SmartWebFetchTool;
import org.springaicommunity.agent.tools.TodoWriteTool;
import org.springaicommunity.agent.tools.TodoWriteTool.TodoEventHandler;
import org.springaicommunity.agent.tools.task.TaskTool;
import org.springaicommunity.agent.tools.task.claude.ClaudeSubagentType;
import org.springaicommunity.agent.utils.Skills;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
/**
 * Wires spring-ai-agent-utils tools into Spring context.
 * Each tool is conditional on its enabled flag in chatbot.agent-utils.*.
 * Enabled by default unless explicitly disabled in configuration.
 */
@Slf4j
@Configuration
@EnableConfigurationProperties(AgentUtilsProperties.class)
public class AgentUtilsConfig {

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
            List<ToolCallback> agentUtilsCallbacks,
            PendingQuestionRegistry pendingQuestionRegistry
    ) {
        return new ToolExecutionBridge(agentUtilsCallbacks, pendingQuestionRegistry);
    }

    @Bean
    @ConditionalOnProperty(name = "chatbot.agent-utils.web-fetch.enabled", havingValue = "true", matchIfMissing = true)
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
                    .map(s -> "Base directory for this skill: %s%n%n%s%n%n%s".formatted(
                            resolveSkillBaseDirectory(s.basePath()),
                            s.content(),
                            describeSkillFiles(s.basePath())
                    ))
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

    private static String describeSkillFiles(String basePath) {
        Path root = resolveSkillBaseDirectory(basePath);
        if (root == null || !Files.isDirectory(root)) {
            return "Available skill files: unavailable";
        }

        try (var stream = Files.walk(root, 2)) {
            String files = stream
                    .filter(path -> !path.equals(root))
                    .map(root::relativize)
                    .map(Path::toString)
                    .map(path -> Files.isDirectory(root.resolve(path)) ? path + "/" : path)
                    .sorted()
                    .collect(Collectors.joining("\n"));
            if (files.isBlank()) {
                return "Available skill files: none";
            }
            return "Available skill files:\n" + files;
        } catch (IOException exception) {
            throw new UncheckedIOException("Failed to list skill files under " + basePath, exception);
        }
    }

    private static Path resolveSkillBaseDirectory(String basePath) {
        if (basePath == null || basePath.isBlank()) {
            return null;
        }

        Path root = Path.of(basePath);
        if (Files.isDirectory(root)) {
            return root;
        }

        try {
            return new ClassPathResource(basePath).getFile().toPath();
        } catch (IOException exception) {
            return null;
        }
    }

    @Bean
    @ConditionalOnProperty(name = "chatbot.agent-utils.web-search.enabled", havingValue = "true", matchIfMissing = true)
    @ConditionalOnExpression("'${CHATBOT_BRAVE_SEARCH_API_KEY:}' != ''")
    public ToolCallback webSearchToolCallback(
            AgentUtilsProperties properties,
            @Value("${CHATBOT_BRAVE_SEARCH_API_KEY:}") String braveApiKey
    ) {
        if (braveApiKey.isEmpty()) {
            log.warn("CHATBOT_BRAVE_SEARCH_API_KEY not set — WebSearchTool will fail at runtime");
        }
        WebSearch config = properties.getWebSearch();
        BraveWebSearchTool tool = BraveWebSearchTool.builder(braveApiKey)
                .resultCount(config.getResultCount())
                .build();
        log.info("Created WebSearchTool: resultCount={}", config.getResultCount());
        return toToolCallback(tool);
    }

    @Bean
    @ConditionalOnProperty(name = "chatbot.agent-utils.ask-user.enabled", havingValue = "true", matchIfMissing = true)
    public ToolCallback askUserQuestionToolCallback(PendingQuestionRegistry pendingQuestionRegistry) {
        AskUserQuestionTool tool = AskUserQuestionTool.builder()
                .questionHandler(pendingQuestionRegistry)
                .answersValidation(true)
                .build();
        log.info("Created AskUserQuestionTool");
        return toToolCallback(tool);
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
        return toToolCallback(tool);
    }

    @Bean
    @ConditionalOnProperty(name = "chatbot.agent-utils.tasks.enabled", havingValue = "true", matchIfMissing = true)
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

        ToolCallback callback = TaskTool.builder()
                .subagentTypes(subagentType)
                .build();

        log.info("Created TaskTool");
        return callback;
    }

    @Bean
    @ConditionalOnProperty(name = "chatbot.agent-utils.bash.enabled", havingValue = "true", matchIfMissing = true)
    public ToolCallback bashToolCallback(AgentUtilsProperties properties) {
        Bash config = properties.getBash();
        BashTool bashTool = new BashTool(config.getTimeoutSeconds(), config.getMaxOutputChars());

        java.util.function.Function<java.util.Map<String, Object>, String> executeFunction = args -> {
            String command = (String) args.get("command");
            String workdir = (String) args.get("workdir");
            return bashTool.execute(command, workdir);
        };

        log.info("Created BashTool: timeoutSeconds={}, maxOutputChars={}",
                config.getTimeoutSeconds(), config.getMaxOutputChars());
        return org.springframework.ai.tool.function.FunctionToolCallback.builder("Bash", executeFunction)
                .description("Execute a shell command and return its output. Use this to run Python scripts (e.g. pypdf, pdfplumber, reportlab), shell commands, or any CLI tool.")
                .inputType(java.util.Map.class)
                .inputSchema("""
                        {"type":"object","properties":{
                          "command":{"type":"string","description":"The shell command to execute, e.g. 'python3 script.py'"},
                          "workdir":{"type":"string","description":"Working directory for execution (optional)"}
                        },"required":["command"]}
                        """)
                .build();
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
