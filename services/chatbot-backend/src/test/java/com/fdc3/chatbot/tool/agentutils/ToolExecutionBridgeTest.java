package com.fdc3.chatbot.tool.agentutils;

import org.junit.jupiter.api.Test;
import org.springframework.ai.tool.ToolCallback;
import org.springframework.ai.tool.definition.ToolDefinition;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ToolExecutionBridgeTest {

    @Test
    void storesAndRetrievesCallbacks() {
        ToolCallback callback = mock(ToolCallback.class);
        ToolDefinition def = mock(ToolDefinition.class);
        when(callback.getToolDefinition()).thenReturn(def);
        when(def.name()).thenReturn("WebFetch");

        ToolExecutionBridge bridge = new ToolExecutionBridge(List.of(callback));

        assertTrue(bridge.hasCallback("WebFetch"));
        assertSame(callback, bridge.getCallback("WebFetch"));
    }

    @Test
    void returnsNullForUnknownTool() {
        ToolExecutionBridge bridge = new ToolExecutionBridge(List.of());
        assertNull(bridge.getCallback("UnknownTool"));
        assertFalse(bridge.hasCallback("UnknownTool"));
    }

    @Test
    void handlesNullCallbackList() {
        ToolExecutionBridge bridge = new ToolExecutionBridge(null);
        assertTrue(bridge.getCallbackMap().isEmpty());
    }

    @Test
    void handlesDuplicateNamesGracefully() {
        ToolCallback cb1 = mock(ToolCallback.class);
        ToolDefinition def1 = mock(ToolDefinition.class);
        when(cb1.getToolDefinition()).thenReturn(def1);
        when(def1.name()).thenReturn("DuplicatedTool");

        ToolCallback cb2 = mock(ToolCallback.class);
        ToolDefinition def2 = mock(ToolDefinition.class);
        when(cb2.getToolDefinition()).thenReturn(def2);
        when(def2.name()).thenReturn("DuplicatedTool");

        ToolExecutionBridge bridge = new ToolExecutionBridge(List.of(cb1, cb2));
        assertSame(cb1, bridge.getCallback("DuplicatedTool"));
    }

    @Test
    void getCallbackMapReturnsSnapshot() {
        ToolExecutionBridge bridge = new ToolExecutionBridge(List.of());
        assertThrows(UnsupportedOperationException.class,
                () -> bridge.getCallbackMap().put("x", null));
    }
}
