package com.fdc3.chatbot.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.core.io.ClassPathResource;
import org.springaicommunity.agent.common.task.subagent.SubagentDefinition;
import org.springaicommunity.agent.common.task.subagent.SubagentExecutor;
import org.springaicommunity.agent.common.task.subagent.SubagentReference;
import org.springaicommunity.agent.common.task.subagent.SubagentType;
import org.springaicommunity.agent.common.task.subagent.TaskCall;
import org.springaicommunity.agent.tools.AskUserQuestionTool;
import org.springaicommunity.agent.tools.AskUserQuestionTool.Question;
import org.springaicommunity.agent.tools.BraveWebSearchTool;
import org.springaicommunity.agent.tools.SkillsTool;
import org.springaicommunity.agent.tools.SmartWebFetchTool;
import org.springaicommunity.agent.tools.TodoWriteTool;
import org.springaicommunity.agent.tools.TodoWriteTool.Todos;
import org.springaicommunity.agent.tools.TodoWriteTool.TodoEventHandler;
import org.springaicommunity.agent.tools.task.TaskTool;
import org.springaicommunity.agent.tools.task.claude.ClaudeSubagentType;
import org.springaicommunity.agent.tools.task.repository.DefaultTaskRepository;
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

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    private static final TypeReference<List<Question>> ASK_USER_QUESTIONS_TYPE = new TypeReference<>() {
    };
    private static final TypeReference<Map<String, String>> ASK_USER_ANSWERS_TYPE = new TypeReference<>() {
    };
    private static final TypeReference<List<String>> STRING_LIST_TYPE = new TypeReference<>() {
    };
    private static final String WEB_FETCH_TOOL_DESCRIPTION = """
            Fetch content from a URL and run a prompt over the fetched content.
            """;
    private static final String WEB_FETCH_INPUT_SCHEMA = """
            {
              "type": "object",
              "properties": {
                "url": {
                  "type": "string",
                  "description": "The URL to fetch content from."
                },
                "prompt": {
                  "type": "string",
                  "description": "The prompt to run on the fetched content."
                }
              },
              "required": ["url", "prompt"]
            }
            """;
    private static final String WEB_SEARCH_TOOL_DESCRIPTION = """
            Search the web for current information using Brave Search.
            """;
    private static final String WEB_SEARCH_INPUT_SCHEMA = """
            {
              "type": "object",
              "properties": {
                "query": {
                  "type": "string",
                  "description": "The search query to use."
                },
                "allowedDomains": {
                  "type": "array",
                  "description": "Only include search results from these domains.",
                  "items": {"type": "string"}
                },
                "blockedDomains": {
                  "type": "array",
                  "description": "Never include search results from these domains.",
                  "items": {"type": "string"}
                }
              },
              "required": ["query"]
            }
            """;
    private static final String TODO_WRITE_TOOL_DESCRIPTION = """
            Create and update a structured todo list for the current task. Use it to track pending, in-progress, and completed work.
            """;
    private static final String TODO_WRITE_INPUT_SCHEMA = """
            {
              "type": "object",
              "properties": {
                "todos": {
                  "type": "array",
                  "description": "The full current todo list.",
                  "items": {
                    "type": "object",
                    "properties": {
                      "content": {
                        "type": "string",
                        "description": "Todo item content."
                      },
                      "status": {
                        "type": "string",
                        "description": "Todo item status.",
                        "enum": ["pending", "in_progress", "completed"]
                      },
                      "activeForm": {
                        "type": "string",
                        "description": "Present-tense form of the todo item while it is in progress."
                      }
                    },
                    "required": ["content", "status", "activeForm"]
                  }
                }
              },
              "required": ["todos"]
            }
            """;
    private static final String TASK_TOOL_DESCRIPTION_TEMPLATE = """
            Launch a new agent to handle complex, multi-step tasks autonomously.

            Available agent types and the tools they have access to:
            %s

            Usage notes:
            - Always include a short description summarizing what the agent will do
            - Provide a detailed prompt with the context and exact expected output
            - Set run_in_background to true only when you can continue without waiting for the result
            """;
    private static final String TASK_TOOL_INPUT_SCHEMA = """
            {
              "type": "object",
              "properties": {
                "description": {
                  "type": "string",
                  "description": "Short 3-5 word description of what the agent will do."
                },
                "prompt": {
                  "type": "string",
                  "description": "Detailed task prompt for the subagent."
                },
                "subagent_type": {
                  "type": "string",
                  "description": "The subagent type to run."
                },
                "model": {
                  "type": "string",
                  "description": "Optional model override for the subagent."
                },
                "resume": {
                  "type": "string",
                  "description": "Optional previous agent id to resume."
                },
                "run_in_background": {
                  "type": "boolean",
                  "description": "Whether to start the task in the background and return a task id."
                }
              },
              "required": ["description", "prompt", "subagent_type"]
            }
            """;

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
    private static final String ASK_USER_QUESTION_TOOL_DESCRIPTION = """
            Use this tool when you need to ask the user questions during execution. This allows you to:
            1. Gather user preferences or requirements
            2. Clarify ambiguous instructions
            3. Get decisions on implementation choices as you work
            4. Offer choices to the user about what direction to take.

            Usage notes:
            - Users will always be able to select "Other" to provide custom text input
            - Use multiSelect: true to allow multiple answers to be selected for a question
            - If you recommend a specific option, make that the first option in the list and add "(Recommended)" at the end of the label
            """;
    private static final String ASK_USER_QUESTION_INPUT_SCHEMA = """
            {
              "type": "object",
              "properties": {
                "questions": {
                  "type": "array",
                  "description": "Questions to ask the user (1-4 questions)",
                  "minItems": 1,
                  "maxItems": 4,
                  "items": {
                    "type": "object",
                    "properties": {
                      "question": {
                        "type": "string",
                        "description": "The complete question to ask the user. Should be clear, specific, and end with a question mark."
                      },
                      "header": {
                        "type": "string",
                        "description": "Very short label displayed as a chip/tag, max 12 characters."
                      },
                      "options": {
                        "type": "array",
                        "description": "The available choices for this question. Must have 2-4 options.",
                        "minItems": 2,
                        "maxItems": 4,
                        "items": {
                          "type": "object",
                          "properties": {
                            "label": {
                              "type": "string",
                              "description": "The display text for this option that the user will see and select."
                            },
                            "description": {
                              "type": "string",
                              "description": "Explanation of what this option means or what will happen if chosen."
                            }
                          },
                          "required": ["label", "description"]
                        }
                      },
                      "multiSelect": {
                        "type": "boolean",
                        "description": "Set to true to allow the user to select multiple options instead of just one."
                      }
                    },
                    "required": ["question", "header", "options"]
                  }
                },
                "answers": {
                  "type": "object",
                  "description": "User answers collected by the permission component",
                  "additionalProperties": {
                    "type": "string"
                  }
                }
              },
              "required": ["questions"]
            }
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
        Function<Map<String, Object>, String> webFetch = args -> tool.webFetch(
                (String) args.get("url"),
                (String) args.get("prompt")
        );
        return FunctionToolCallback.builder("WebFetch", webFetch)
                .description(WEB_FETCH_TOOL_DESCRIPTION)
                .inputType((java.lang.reflect.Type) Map.class)
                .inputSchema(WEB_FETCH_INPUT_SCHEMA)
                .build();
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
        Function<Map<String, Object>, String> webSearch = args -> tool.webSearch(
                (String) args.get("query"),
                stringList(args.get("allowedDomains")),
                stringList(args.get("blockedDomains"))
        );
        return FunctionToolCallback.builder("WebSearch", webSearch)
                .description(WEB_SEARCH_TOOL_DESCRIPTION)
                .inputType((java.lang.reflect.Type) Map.class)
                .inputSchema(WEB_SEARCH_INPUT_SCHEMA)
                .build();
    }

    @Bean
    @ConditionalOnProperty(name = "chatbot.agent-utils.ask-user.enabled", havingValue = "true", matchIfMissing = true)
    public ToolCallback askUserQuestionToolCallback(PendingQuestionRegistry pendingQuestionRegistry) {
        AskUserQuestionTool tool = AskUserQuestionTool.builder()
                .questionHandler(pendingQuestionRegistry)
                .answersValidation(true)
                .build();
        Function<Map<String, Object>, String> askUserQuestion = args -> {
            List<Question> questions = OBJECT_MAPPER.convertValue(args.get("questions"), ASK_USER_QUESTIONS_TYPE);
            Map<String, String> answers = args.containsKey("answers") && args.get("answers") != null
                    ? OBJECT_MAPPER.convertValue(args.get("answers"), ASK_USER_ANSWERS_TYPE)
                    : Map.of();
            return tool.askUserQuestion(questions, answers);
        };
        log.info("Created AskUserQuestionTool");
        return FunctionToolCallback.builder("AskUserQuestionTool", askUserQuestion)
                .description(ASK_USER_QUESTION_TOOL_DESCRIPTION)
                .inputType((java.lang.reflect.Type) Map.class)
                .inputSchema(ASK_USER_QUESTION_INPUT_SCHEMA)
                .build();
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
        Function<Map<String, Object>, String> todoWrite = args -> tool.todoWrite(
                OBJECT_MAPPER.convertValue(args, Todos.class)
        );
        log.info("Created TodoWriteTool");
        return FunctionToolCallback.builder("TodoWrite", todoWrite)
                .description(TODO_WRITE_TOOL_DESCRIPTION)
                .inputType((java.lang.reflect.Type) Map.class)
                .inputSchema(TODO_WRITE_INPUT_SCHEMA)
                .build();
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

        List<SubagentType> subagentTypes = List.of(subagentType);
        List<SubagentDefinition> subagents = defaultClaudeSubagentReferences().stream()
                .map(reference -> resolveSubagent(reference, subagentTypes))
                .toList();
        List<SubagentExecutor> subagentExecutors = subagentTypes.stream()
                .map(SubagentType::executor)
                .toList();
        String subagentRegistrations = subagents.stream()
                .map(SubagentDefinition::toSubagentRegistrations)
                .collect(Collectors.joining("\n"));
        TaskTool.TaskFunction taskFunction = new TaskTool.TaskFunction(
                subagents,
                subagentExecutors,
                new DefaultTaskRepository()
        );
        Function<Map<String, Object>, String> task = args -> taskFunction.apply(
                OBJECT_MAPPER.convertValue(args, TaskCall.class)
        );

        ToolCallback callback = FunctionToolCallback.builder("Task", task)
                .description(TASK_TOOL_DESCRIPTION_TEMPLATE.formatted(subagentRegistrations))
                .inputType((java.lang.reflect.Type) Map.class)
                .inputSchema(TASK_TOOL_INPUT_SCHEMA)
                .build();

        log.info("Created TaskTool");
        return callback;
    }

    private static List<SubagentReference> defaultClaudeSubagentReferences() {
        return List.of(
                new SubagentReference("classpath:/agent/GENERAL_PURPOSE_SUBAGENT.md", "CLAUDE"),
                new SubagentReference("classpath:/agent/EXPLORE_SUBAGENT.md", "CLAUDE"),
                new SubagentReference("classpath:/agent/PLAN_SUBAGENT.md", "CLAUDE"),
                new SubagentReference("classpath:/agent/BASH_SUBAGENT.md", "CLAUDE")
        );
    }

    private static SubagentDefinition resolveSubagent(
            SubagentReference reference,
            List<SubagentType> subagentTypes
    ) {
        return subagentTypes.stream()
                .map(SubagentType::resolver)
                .filter(resolver -> resolver.canResolve(reference))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("No subagent resolver for " + reference))
                .resolve(reference);
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

    private static List<String> stringList(Object value) {
        if (value == null) {
            return List.of();
        }
        return OBJECT_MAPPER.convertValue(value, STRING_LIST_TYPE);
    }
}
