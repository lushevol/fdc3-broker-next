package com.fdc3.chatbot.tool.agentutils;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springaicommunity.agent.common.task.subagent.SubagentReference;
import org.springaicommunity.agent.common.task.subagent.SubagentType;
import org.springaicommunity.agent.tools.task.TaskTool;
import org.springaicommunity.agent.tools.task.claude.ClaudeSubagentReferences;
import org.springaicommunity.agent.tools.task.claude.ClaudeSubagentType;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.tool.ToolCallback;
import org.springframework.core.io.ClassPathResource;

@ExtendWith(MockitoExtension.class)
class TaskToolTest {

    @Mock
    private ChatModel chatModel;

    @Test
    void claudeSubagentReferencesFromResourcesReturnsNonNullList() {
        List<SubagentReference> refs = ClaudeSubagentReferences.fromResources(
                new ClassPathResource("agents"));
        assertNotNull(refs);
    }

    @Test
    void taskToolBuildsWithCorrectName() {
        ChatClient.Builder defaultBuilder = ChatClient.builder(chatModel);

        SubagentType subagentType = ClaudeSubagentType.builder()
                .chatClientBuilder("default", defaultBuilder)
                .skillsDirectories(List.of("skills"))
                .build();

        // Load a single agent reference to avoid potential duplicate-key issues
        // when processing the multi-file agents directory
        List<SubagentReference> refs = ClaudeSubagentReferences.fromResource(
                new ClassPathResource("agents/explore.md"));

        ToolCallback callback = TaskTool.builder()
                .subagentReferences(refs)
                .subagentTypes(subagentType)
                .build();

        assertNotNull(callback);
        assertEquals("Task", callback.getToolDefinition().name());
        assertNotNull(callback.getToolDefinition().description());
    }

    @Test
    void taskToolWithEmptyReferencesStillBuilds() {
        ChatClient.Builder defaultBuilder = ChatClient.builder(chatModel);

        SubagentType subagentType = ClaudeSubagentType.builder()
                .chatClientBuilder("default", defaultBuilder)
                .skillsDirectories(List.of("skills"))
                .build();

        ToolCallback callback = TaskTool.builder()
                .subagentReferences(List.of())
                .subagentTypes(subagentType)
                .build();

        assertNotNull(callback);
        assertEquals("Task", callback.getToolDefinition().name());
    }
}
