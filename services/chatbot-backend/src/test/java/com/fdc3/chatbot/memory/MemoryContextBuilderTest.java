package com.fdc3.chatbot.memory;

import com.fdc3.chatbot.config.ChatbotMemoryProperties;
import com.fdc3.chatbot.model.UserCapabilityContext;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class MemoryContextBuilderTest {
    @Test
    void buildsCompactOperatorMemoryBlock() {
        ChatbotMemoryProperties properties = new ChatbotMemoryProperties();
        properties.setTenantId("default");
        properties.setContextLimit(8);
        MemoryContextBuilder builder = new MemoryContextBuilder(
                request -> List.of(
                        new MemoryDtos.MemoryEntryDto(
                                "memory-1",
                                "PREFERENCE",
                                "Morning format",
                                "Prefers concise morning summaries focused on rates and FX.",
                                List.of("morning"),
                                "ACTIVE",
                                1
                        ),
                        new MemoryDtos.MemoryEntryDto(
                                "memory-2",
                                "BAU_WORKFLOW",
                                "Start of day",
                                "Checks USD rates blotter, failed trades, and top client RFQs.",
                                List.of("bau"),
                                "ACTIVE",
                                1
                        )
                ),
                properties
        );

        String context = builder.build(UserCapabilityContext.builder().userId("operator-1").build());

        assertThat(context).contains("Operator memory:");
        assertThat(context).contains("[PREFERENCE] Prefers concise morning summaries focused on rates and FX.");
        assertThat(context).contains("[BAU_WORKFLOW] Checks USD rates blotter, failed trades, and top client RFQs.");
    }

    @Test
    void returnsEmptyContextWhenMemoryServiceFails() {
        ChatbotMemoryProperties properties = new ChatbotMemoryProperties();
        MemoryContextBuilder builder = new MemoryContextBuilder(
                request -> {
                    throw new MemoryClientException("service unavailable");
                },
                properties
        );

        String context = builder.build(UserCapabilityContext.builder().userId("operator-1").build());

        assertThat(context).isEmpty();
    }
}
