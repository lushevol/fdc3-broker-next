package com.fdc3.chatbot.controlplane;

import com.fdc3.chatbot.controlplane.model.CapabilityDefinition;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.util.List;

@Service
public class CapabilityRegistryService {

    private static final TypeReference<List<CapabilityDefinition>> CAPABILITY_LIST_TYPE = new TypeReference<>() {
    };

    private final ObjectMapper objectMapper;
    private final String resourcePath;

    @Autowired
    public CapabilityRegistryService(ObjectMapper objectMapper) {
        this(objectMapper, "capabilities/control-plane-capabilities.json");
    }

    CapabilityRegistryService(ObjectMapper objectMapper, String resourcePath) {
        this.objectMapper = objectMapper;
        this.resourcePath = resourcePath;
    }

    public List<CapabilityDefinition> loadDefinitions() {
        ClassPathResource resource = new ClassPathResource(resourcePath);
        try (InputStream inputStream = resource.getInputStream()) {
            return objectMapper.readValue(inputStream, CAPABILITY_LIST_TYPE);
        } catch (IOException exception) {
            throw new UncheckedIOException("Failed to load capability definitions from " + resourcePath, exception);
        }
    }
}
