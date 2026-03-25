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
public class FrontendToolManifestEntry {
    private String name;
    private String description;
    private Map<String, Object> inputSchema;
    private boolean humanInTheLoop;
    private boolean hasRender;
}
