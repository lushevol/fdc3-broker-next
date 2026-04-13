package com.fdc3.chatbot.controlplane;

import com.fdc3.chatbot.controlplane.model.CapabilityDefinition;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CapabilityRegistryServiceTest {

    @Test
    void loadsReadOnlyMcpCapabilityDefinitionsFromJson() {
        CapabilityRegistryService registryService = new CapabilityRegistryService(
                new ObjectMapper(),
                "capabilities/control-plane-capabilities.json"
        );

        List<CapabilityDefinition> definitions = registryService.loadDefinitions();

        assertFalse(definitions.isEmpty());
        CapabilityDefinition statisticsCapability = definitions.stream()
                .filter(definition -> "app-usage-statistics".equals(definition.getCapabilityId()))
                .findFirst()
                .orElseThrow();

        assertEquals("mcp", statisticsCapability.getExecutionType());
        assertEquals("read", statisticsCapability.getAccessType());
        assertEquals("elasticsearch-analytics", statisticsCapability.getProviderId());
        assertEquals("statistic_count_by_app", statisticsCapability.getTargetName());
        assertTrue(statisticsCapability.getRequiredInputs().contains("startTime"));
        assertTrue(statisticsCapability.getRequiredInputs().contains("endTime"));
        assertTrue(statisticsCapability.getOptionalInputs().contains("appId"));
        assertTrue(statisticsCapability.getOptionalInputs().contains("appName"));
    }
}
