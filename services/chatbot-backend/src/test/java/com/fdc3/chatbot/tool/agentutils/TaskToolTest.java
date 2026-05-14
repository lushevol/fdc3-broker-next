package com.fdc3.chatbot.tool.agentutils;

import com.fdc3.chatbot.config.AgentUtilsConfig;
import com.fdc3.chatbot.config.AgentUtilsProperties;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springaicommunity.agent.common.task.subagent.SubagentReference;
import org.springaicommunity.agent.tools.task.claude.ClaudeSubagentReferences;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
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
        ToolCallback callback = new AgentUtilsConfig().taskToolCallback(chatModel, new AgentUtilsProperties());

        assertNotNull(callback);
        assertEquals("Task", callback.getToolDefinition().name());
        assertNotNull(callback.getToolDefinition().description());
    }

    @Test
    void taskToolWithEmptyReferencesStillBuilds() {
        ToolCallback callback = new AgentUtilsConfig().taskToolCallback(chatModel, new AgentUtilsProperties());

        assertNotNull(callback);
        assertEquals("Task", callback.getToolDefinition().name());
    }
}
