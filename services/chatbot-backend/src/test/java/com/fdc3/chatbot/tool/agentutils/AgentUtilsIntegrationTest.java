package com.fdc3.chatbot.tool.agentutils;

import com.fdc3.chatbot.config.AgentUtilsProperties;
import org.junit.jupiter.api.Test;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.ai.tool.ToolCallback;
import org.springframework.ai.tool.method.MethodToolCallbackProvider;
import org.springframework.core.io.ClassPathResource;
import org.springaicommunity.agent.common.task.subagent.SubagentReference;
import org.springaicommunity.agent.common.task.subagent.SubagentType;
import org.springaicommunity.agent.tools.SkillsTool;
import org.springaicommunity.agent.tools.SmartWebFetchTool;
import org.springaicommunity.agent.tools.TodoWriteTool;
import org.springaicommunity.agent.tools.task.TaskTool;
import org.springaicommunity.agent.tools.task.claude.ClaudeSubagentReferences;
import org.springaicommunity.agent.tools.task.claude.ClaudeSubagentType;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest(classes = {AgentUtilsIntegrationTest.TestConfig.class})
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

        @Bean
        public PendingQuestionRegistry pendingQuestionRegistry() {
            return new PendingQuestionRegistry();
        }

        @Bean
        public ToolCallback webFetchToolCallback(ChatModel chatModel) {
            ChatClient chatClient = ChatClient.builder(chatModel).build();
            SmartWebFetchTool tool = SmartWebFetchTool.builder(chatClient)
                    .maxContentLength(10000)
                    .domainSafetyCheck(true)
                    .build();
            ToolCallback[] callbacks = MethodToolCallbackProvider.builder()
                    .toolObjects(tool)
                    .build()
                    .getToolCallbacks();
            return callbacks[0];
        }

        @Bean
        public ToolCallback skillsToolCallback() {
            return SkillsTool.builder()
                    .addSkillsResource(new ClassPathResource("skills"))
                    .build();
        }

        @Bean
        public ToolCallback todoWriteToolCallback() {
            TodoWriteTool tool = TodoWriteTool.builder()
                    .todoEventHandler(todos -> {})
                    .build();
            ToolCallback[] callbacks = MethodToolCallbackProvider.builder()
                    .toolObjects(tool)
                    .build()
                    .getToolCallbacks();
            return callbacks[0];
        }

        @Bean
        public ToolCallback taskToolCallback(ChatModel chatModel) {
            ChatClient.Builder defaultBuilder = ChatClient.builder(chatModel);
            SubagentType subagentType = ClaudeSubagentType.builder()
                    .chatClientBuilder("default", defaultBuilder)
                    .skillsDirectories(List.of("skills"))
                    .build();

            // Use a single agent reference to avoid duplicate-key issues
            List<SubagentReference> refs = ClaudeSubagentReferences.fromResource(
                    new ClassPathResource("agents/explore.md"));

            return TaskTool.builder()
                    .subagentReferences(refs)
                    .subagentTypes(subagentType)
                    .build();
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
        assertTrue(callbackMap.containsKey("Skill"),
                "Skill callback should be registered");
        assertTrue(callbackMap.containsKey("TodoWrite"),
                "TodoWrite callback should be registered");
        assertTrue(callbackMap.containsKey("Task"),
                "Task callback should be registered");
    }
}
