package com.fdc3.chatbot.tool.agentutils;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.ai.tool.ToolCallback;
import org.springframework.ai.tool.definition.ToolDefinition;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ToolExecutionBridgeTest {

    private ToolCallback mockCallback;
    private ToolDefinition mockDefinition;

    @BeforeEach
    void setUp() {
        mockCallback = mock(ToolCallback.class);
        mockDefinition = mock(ToolDefinition.class);
        when(mockCallback.getToolDefinition()).thenReturn(mockDefinition);
        when(mockDefinition.name()).thenReturn("TestTool");
    }

    @Test
    void constructorAcceptsNullList() {
        ToolExecutionBridge bridge = new ToolExecutionBridge(null);
        assertNotNull(bridge);
        assertFalse(bridge.hasCallback("anything"));
    }

    @Test
    void constructorAcceptsEmptyList() {
        ToolExecutionBridge bridge = new ToolExecutionBridge(List.of());
        assertNotNull(bridge);
        assertFalse(bridge.hasCallback("anything"));
    }

    @Test
    void hasCallbackReturnsTrueForRegisteredTool() {
        ToolExecutionBridge bridge = new ToolExecutionBridge(List.of(mockCallback));
        assertTrue(bridge.hasCallback("TestTool"));
    }

    @Test
    void hasCallbackReturnsFalseForUnknownTool() {
        ToolExecutionBridge bridge = new ToolExecutionBridge(List.of(mockCallback));
        assertFalse(bridge.hasCallback("UnknownTool"));
    }

    @Test
    void getCallbackReturnsRegisteredCallback() {
        ToolExecutionBridge bridge = new ToolExecutionBridge(List.of(mockCallback));
        ToolCallback result = bridge.getCallback("TestTool");
        assertSame(mockCallback, result);
    }

    @Test
    void getCallbackReturnsNullForUnknownTool() {
        ToolExecutionBridge bridge = new ToolExecutionBridge(List.of(mockCallback));
        assertNull(bridge.getCallback("UnknownTool"));
    }

    @Test
    void getCallbackMapReturnsAllRegisteredCallbacks() {
        ToolExecutionBridge bridge = new ToolExecutionBridge(List.of(mockCallback));
        Map<String, ToolCallback> map = bridge.getCallbackMap();
        assertEquals(1, map.size());
        assertSame(mockCallback, map.get("TestTool"));
    }

    @Test
    void constructorSkipsNullCallbacks() {
        ToolExecutionBridge bridge = new ToolExecutionBridge(Arrays.asList(null, mockCallback, null));
        assertTrue(bridge.hasCallback("TestTool"));
        assertEquals(1, bridge.getCallbackMap().size());
    }

    @Test
    void constructorHandlesDuplicateNames() {
        ToolCallback second = mock(ToolCallback.class);
        ToolDefinition secondDef = mock(ToolDefinition.class);
        when(second.getToolDefinition()).thenReturn(secondDef);
        when(secondDef.name()).thenReturn("TestTool");

        ToolExecutionBridge bridge = new ToolExecutionBridge(List.of(mockCallback, second));
        assertTrue(bridge.hasCallback("TestTool"));
        // First registration wins
        assertSame(mockCallback, bridge.getCallback("TestTool"));
    }
}
