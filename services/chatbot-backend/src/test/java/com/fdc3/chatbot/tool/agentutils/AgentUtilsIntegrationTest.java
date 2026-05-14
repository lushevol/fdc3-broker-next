package com.fdc3.chatbot.tool.agentutils;

import com.fdc3.chatbot.config.AgentUtilsConfig;
import org.junit.jupiter.api.Test;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.ai.tool.ToolCallback;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest(
        classes = {AgentUtilsConfig.class, AgentUtilsIntegrationTest.TestConfig.class},
        properties = {
                "CHATBOT_BRAVE_SEARCH_API_KEY=test-brave-key",
                "chatbot.agent-utils.skills.enabled=true"
        }
)
class AgentUtilsIntegrationTest {

    @Autowired
    private List<ToolCallback> agentUtilsCallbacks;

    @Autowired(required = false)
    private PendingQuestionRegistry pendingQuestionRegistry;

    @Configuration
    static class TestConfig {

        @Bean
        public ChatModel chatModel() {
            return mock(ChatModel.class);
        }
    }

    @Test
    void contextLoads() {
        assertNotNull(agentUtilsCallbacks);
        assertNotNull(pendingQuestionRegistry);
    }

    @Test
    void allAgentUtilsCallbacksAreRegistered() {
        Map<String, ToolCallback> callbackMap = new java.util.HashMap<>();
        for (ToolCallback cb : agentUtilsCallbacks) {
            if (cb != null) {
                callbackMap.put(cb.getToolDefinition().name(), cb);
            }
        }

        assertTrue(callbackMap.containsKey("WebFetch"),
                "WebFetch callback should be registered");
        assertTrue(callbackMap.containsKey("WebSearch"),
                "WebSearch callback should be registered");
        assertTrue(callbackMap.containsKey("Skill"),
                "Skill callback should be registered");
        assertTrue(callbackMap.containsKey("TodoWrite"),
                "TodoWrite callback should be registered");
        assertTrue(callbackMap.containsKey("Task"),
                "Task callback should be registered");
        assertTrue(callbackMap.containsKey("AskUserQuestionTool"),
                "AskUserQuestionTool callback should be registered");
    }
}
