package com.fdc3.chatbot.agent;

import com.fdc3.chatbot.model.ChatMessage;
import com.fdc3.chatbot.tool.ToolRegistry;
import dev.langchain4j.agent.tool.ToolSpecification;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.chat.StreamingChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.model.openai.OpenAiStreamingChatModel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * AI Agent service using LangChain4j for conversation handling.
 */
@Slf4j
@Service
public class AgentService {

    @Value("${spring.ai.openai.api-key:}")
    private String openaiApiKey;

    @Value("${spring.ai.openai.model:gpt-4}")
    private String model;

    @Value("${spring.ai.openai.temperature:0.7}")
    private Double temperature;

    @Value("${chatbot.agent.max-tokens:4096}")
    private Integer maxTokens;

    @Value("${chatbot.agent.name:FDC3 Assistant}")
    private String agentName;

    private final ToolRegistry toolRegistry;

    private ChatLanguageModel chatModel;
    private StreamingChatLanguageModel streamingChatModel;

    // In-memory conversation storage (use Redis/Database in production)
    private final Map<String, List<ChatMessage>> conversations = new ConcurrentHashMap<>();

    public AgentService(ToolRegistry toolRegistry) {
        this.toolRegistry = toolRegistry;
    }

    @PostConstruct
    public void init() {
        if (openaiApiKey != null && !openaiApiKey.isEmpty()) {
            this.chatModel = OpenAiChatModel.builder()
                    .apiKey(openaiApiKey)
                    .modelName(model)
                    .temperature(temperature)
                    .maxTokens(maxTokens)
                    .timeout(Duration.ofSeconds(60))
                    .build();

            this.streamingChatModel = OpenAiStreamingChatModel.builder()
                    .apiKey(openaiApiKey)
                    .modelName(model)
                    .temperature(temperature)
                    .maxTokens(maxTokens)
                    .timeout(Duration.ofSeconds(60))
                    .build();

            log.info("Initialized OpenAI chat model with model: {}", model);
        } else {
            log.warn("OpenAI API key not configured. Chat functionality will be limited.");
        }
    }

    /**
     * Process a chat message and return a streaming response.
     */
    public void processMessageStreaming(
            String conversationId,
            String userMessage,
            List<ChatMessage> history,
            java.util.function.Consumer<String> onNext,
            java.util.function.Consumer<Throwable> onError,
            java.lang.Runnable onComplete
    ) {
        if (streamingChatModel == null) {
            onError.accept(new IllegalStateException("Chat model not configured"));
            return;
        }

        try {
            // Build message list for LangChain4j
            List<dev.langchain4j.data.message.ChatMessage> messages = new java.util.ArrayList<>();

            // Add system message
            messages.add(new SystemMessage(buildSystemPrompt()));

            // Add history
            if (history != null) {
                for (ChatMessage msg : history) {
                    switch (msg.getRole()) {
                        case USER -> messages.add(new UserMessage(msg.getContent()));
                        case ASSISTANT -> messages.add(new AiMessage(msg.getContent()));
                        default -> {}
                    }
                }
            }

            // Add current user message
            messages.add(new UserMessage(userMessage));

            log.debug("Processing message for conversation: {}", conversationId);

            // Generate streaming response
            streamingChatModel.generate(messages, new dev.langchain4j.model.output.StreamingResponseHandler<AiMessage>() {
                private final StringBuilder responseBuilder = new StringBuilder();

                @Override
                public void onNext(String token) {
                    responseBuilder.append(token);
                    onNext.accept(token);
                }

                @Override
                public void onComplete(dev.langchain4j.model.output.Response<AiMessage> response) {
                    log.debug("Completed streaming response for conversation: {}", conversationId);
                    onComplete.run();
                }

                @Override
                public void onError(Throwable error) {
                    log.error("Error in streaming response", error);
                    onError.accept(error);
                }
            });

        } catch (Exception e) {
            log.error("Error processing message", e);
            onError.accept(e);
        }
    }

    /**
     * Process a chat message and return a complete response.
     */
    public String processMessage(String conversationId, String userMessage, List<ChatMessage> history) {
        if (chatModel == null) {
            throw new IllegalStateException("Chat model not configured");
        }

        try {
            // Build message list for LangChain4j
            List<dev.langchain4j.data.message.ChatMessage> messages = new java.util.ArrayList<>();

            // Add system message
            messages.add(new SystemMessage(buildSystemPrompt()));

            // Add history
            if (history != null) {
                for (ChatMessage msg : history) {
                    switch (msg.getRole()) {
                        case USER -> messages.add(new UserMessage(msg.getContent()));
                        case ASSISTANT -> messages.add(new AiMessage(msg.getContent()));
                        default -> {}
                    }
                }
            }

            // Add current user message
            messages.add(new UserMessage(userMessage));

            log.debug("Processing message for conversation: {}", conversationId);

            // Generate response
            dev.langchain4j.model.output.Response<AiMessage> response = chatModel.generate(messages);

            return response.content().text();

        } catch (Exception e) {
            log.error("Error processing message", e);
            throw new RuntimeException("Failed to process message", e);
        }
    }

    private String buildSystemPrompt() {
        return String.format("""
                You are %s, a helpful AI assistant integrated into an FDC3-enabled financial desktop platform.

                You can help users with:
                - Answering questions about financial data and workflows
                - Executing tools on behalf of the user
                - Navigating the platform and finding information
                - Automating repetitive tasks

                Available tools:
                %s

                When using tools, always explain what you're doing and show the results clearly.
                Be concise but helpful. If you need clarification, ask follow-up questions.

                Always be professional and accurate in your responses.
                """,
                agentName,
                toolRegistry.getAllTools().keySet().stream()
                        .map(name -> "- " + name + ": " + toolRegistry.getTool(name).getDescription())
                        .reduce((a, b) -> a + "\n" + b)
                        .orElse("No tools currently available")
        );
    }

    /**
     * Check if the agent is ready.
     */
    public boolean isReady() {
        return chatModel != null;
    }
}