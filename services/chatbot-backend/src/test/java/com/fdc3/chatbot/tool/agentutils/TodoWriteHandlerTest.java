package com.fdc3.chatbot.tool.agentutils;

import com.fdc3.chatbot.config.AgentUtilsConfig;
import org.junit.jupiter.api.Test;
import org.springframework.ai.tool.ToolCallback;

import static org.junit.jupiter.api.Assertions.*;

class TodoWriteHandlerTest {

    @Test
    void handlerReceivesTodos() {
        ToolCallback callback = new AgentUtilsConfig().todoWriteToolCallback();

        String result = callback.call("""
                {
                  "todos": [{
                    "content": "Review task state",
                    "status": "in_progress",
                    "activeForm": "Reviewing task state"
                  }]
                }
                """);

        assertTrue(result.contains("Todos have been modified successfully"));
        assertNotNull(callback.getToolDefinition());
        assertEquals("TodoWrite", callback.getToolDefinition().name());
        assertNotNull(callback.getToolDefinition().description());
    }

    @Test
    void handlerWithNullTodosDoesNotThrow() {
        ToolCallback callback = new AgentUtilsConfig().todoWriteToolCallback();

        assertThrows(IllegalArgumentException.class, () -> callback.call("{}"));
    }

    @Test
    void todoWriteToolHasCorrectName() {
        ToolCallback callback = new AgentUtilsConfig().todoWriteToolCallback();

        assertEquals("TodoWrite", callback.getToolDefinition().name());
    }
}
