package com.fdc3.chatbot.protocol.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ChatToolSource {
    FRONTEND("frontend"),
    BACKEND("backend"),
    HUMAN("human"),
    MCP("mcp");

    private final String value;

    ChatToolSource(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static ChatToolSource fromValue(String value) {
        if (value == null) {
            return null;
        }
        for (ChatToolSource source : values()) {
            if (source.value.equalsIgnoreCase(value) || source.name().equalsIgnoreCase(value)) {
                return source;
            }
        }
        throw new IllegalArgumentException("Unknown ChatToolSource: " + value);
    }
}