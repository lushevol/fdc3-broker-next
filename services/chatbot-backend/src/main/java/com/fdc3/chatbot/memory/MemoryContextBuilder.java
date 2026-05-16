package com.fdc3.chatbot.memory;

import com.fdc3.chatbot.config.ChatbotMemoryProperties;
import com.fdc3.chatbot.model.UserCapabilityContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Objects;

public class MemoryContextBuilder {
    private static final Logger log = LoggerFactory.getLogger(MemoryContextBuilder.class);

    private final MemoryClient memoryClient;
    private final ChatbotMemoryProperties properties;

    public MemoryContextBuilder(MemoryClient memoryClient, ChatbotMemoryProperties properties) {
        this.memoryClient = memoryClient;
        this.properties = properties;
    }

    public String build(UserCapabilityContext context) {
        if (context == null || isBlank(context.getUserId())) {
            return "";
        }

        try {
            List<MemoryDtos.MemoryEntryDto> memories = memoryClient.search(new MemoryDtos.MemorySearchRequest(
                    properties.getTenantId(),
                    context.getUserId(),
                    null,
                    "ACTIVE",
                    null,
                    Math.max(1, properties.getContextLimit())
            ));
            if (memories == null || memories.isEmpty()) {
                return "";
            }

            StringBuilder builder = new StringBuilder("Operator memory:\n");
            memories.stream()
                    .filter(Objects::nonNull)
                    .filter(memory -> !isBlank(memory.body()))
                    .limit(Math.max(1, properties.getContextLimit()))
                    .forEach(memory -> builder
                            .append("- [")
                            .append(isBlank(memory.type()) ? "NOTE" : memory.type())
                            .append("] ")
                            .append(memory.body().trim())
                            .append('\n'));

            return builder.toString().trim();
        } catch (RuntimeException e) {
            log.debug("Skipping operator memory context: {}", e.getMessage());
            return "";
        }
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
