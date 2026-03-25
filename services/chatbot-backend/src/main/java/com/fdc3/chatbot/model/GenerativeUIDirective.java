package com.fdc3.chatbot.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GenerativeUIDirective {
    private String name;
    private Map<String, Object> props;
    private String toolCallId;
}
