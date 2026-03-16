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
import dev.langchain4j.model.StreamingResponseHandler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * AI Agent service using LangChain4j for conversation handling.
 */
@Slf4j
@Service
public class AgentService {

    @Value("${spring.ai.openai.api-key:}")
    private String openaiApiKey;

    @Value("${spring.ai.openai.base-url:}")
    private String openaiBaseUrl;

    @Value("${spring.ai.openai.model:gpt-4}")
    private String model;

    @Value("${spring.ai.openai.temperature:0.7}")
    private Double temperature;

    @Value("${chatbot.agent.max-tokens:4096}")
    private Integer maxTokens;

    @Value("${chatbot.agent.name:FDC3 Assistant}")
    private String agentName;

    @Value("${chatbot.mock.enabled:false}")
    private boolean mockEnabled;

    private final ToolRegistry toolRegistry;

    private ChatLanguageModel chatModel;
    private StreamingChatLanguageModel streamingChatModel;
    private final ScheduledExecutorService mockExecutor = Executors.newScheduledThreadPool(1);

    // In-memory conversation storage (use Redis/Database in production)
    private final Map<String, List<ChatMessage>> conversations = new ConcurrentHashMap<>();

    public AgentService(ToolRegistry toolRegistry) {
        this.toolRegistry = toolRegistry;
    }

    @PostConstruct
    public void init() {
        if (mockEnabled) {
            log.info("Mock mode enabled - using simulated responses");
            return;
        }

        if (openaiApiKey != null && !openaiApiKey.isEmpty()) {
            var chatModelBuilder = OpenAiChatModel.builder()
                    .apiKey(openaiApiKey)
                    .modelName(model)
                    .temperature(temperature)
                    .maxTokens(maxTokens)
                    .timeout(Duration.ofSeconds(60));

            var streamingModelBuilder = OpenAiStreamingChatModel.builder()
                    .apiKey(openaiApiKey)
                    .modelName(model)
                    .temperature(temperature)
                    .maxTokens(maxTokens)
                    .timeout(Duration.ofSeconds(60));

            // Add base URL if configured (for OpenAI-compatible APIs like Azure, etc.)
            if (openaiBaseUrl != null && !openaiBaseUrl.isEmpty()) {
                chatModelBuilder.baseUrl(openaiBaseUrl);
                streamingModelBuilder.baseUrl(openaiBaseUrl);
                log.info("Using custom OpenAI base URL: {}", openaiBaseUrl);
            }

            this.chatModel = chatModelBuilder.build();
            this.streamingChatModel = streamingModelBuilder.build();

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
        // Mock mode - simulate streaming response
        if (mockEnabled || streamingChatModel == null) {
            processMockStreaming(userMessage, onNext, onComplete);
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
            streamingChatModel.generate(messages, new StreamingResponseHandler<AiMessage>() {
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
     * Simulate a streaming response for mock mode.
     */
    private void processMockStreaming(
            String userMessage,
            java.util.function.Consumer<String> onNext,
            java.lang.Runnable onComplete
    ) {
        String mockResponse = generateMockResponse(userMessage);
        String[] words = mockResponse.split(" ");

        // Stream words with delays
        for (int i = 0; i < words.length; i++) {
            final int index = i;
            final String word = words[i] + (i < words.length - 1 ? " " : "");
            mockExecutor.schedule(() -> {
                onNext.accept(word);
                if (index == words.length - 1) {
                    onComplete.run();
                }
            }, (i + 1) * 100L, TimeUnit.MILLISECONDS);
        }
    }

    /**
     * Generate a mock response based on the user message.
     */
    private String generateMockResponse(String userMessage) {
        String lowerMessage = userMessage.toLowerCase();

        if (lowerMessage.contains("hello") || lowerMessage.contains("hi")) {
            return "Hello! I'm the FDC3 Assistant, running in mock mode. How can I help you today?";
        }

        if (lowerMessage.contains("help")) {
            return "I'm a mock chatbot assistant. In production, I would help you with:\n\n" +
                   "- FDC3 interoperability questions\n" +
                   "- Financial workflow automation\n" +
                   "- Platform navigation\n\n" +
                   "For now, I can respond to basic messages to test the integration.";
        }

        if (lowerMessage.contains("fdc3")) {
            return "FDC3 (Financial Desktop Connectivity and Consoritum) is an open standard for " +
                   "financial desktop interoperability. It enables applications to communicate and " +
                   "share context across the desktop. This is a mock response for testing.";
        }

        return String.format("You said: \"%s\"\n\nThis is a mock response. In production, I would " +
                             "provide helpful information about FDC3 and financial workflows.", userMessage);
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
        return mockEnabled || chatModel != null;
    }

    /**
     * Confirm or cancel a tool call.
     * This is a placeholder implementation - in production, this would manage
     * pending tool executions and resume the conversation flow.
     */
    public void confirmToolCall(String conversationId, String toolCallId, boolean confirmed) {
        log.info("Tool call {} for conversation {}: {}",
                toolCallId, conversationId, confirmed ? "confirmed" : "cancelled");

        if (confirmed) {
            // In production: execute the tool and continue the conversation
            log.debug("Would execute tool {} for conversation {}", toolCallId, conversationId);
        } else {
            // In production: cancel the tool execution and notify the user
            log.debug("Cancelled tool {} for conversation {}", toolCallId, conversationId);
        }
    }
}