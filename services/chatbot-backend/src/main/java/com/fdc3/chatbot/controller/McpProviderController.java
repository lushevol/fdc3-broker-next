package com.fdc3.chatbot.controller;

import com.fdc3.chatbot.mcp.McpProviderRegistrationRequest;
import com.fdc3.chatbot.mcp.McpProviderRegistryService;
import com.fdc3.chatbot.mcp.RegisteredMcpProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat/mcp/providers")
@RequiredArgsConstructor
public class McpProviderController {

    private final McpProviderRegistryService registryService;

    @PostMapping
    public RegisteredMcpProvider register(@Valid @RequestBody McpProviderRegistrationRequest request) {
        return registryService.register(request);
    }

    @GetMapping
    public List<RegisteredMcpProvider> listProviders() {
        return registryService.listProviders();
    }

    @DeleteMapping("/{providerId}")
    public Map<String, Object> unregister(@PathVariable String providerId) {
        registryService.unregister(providerId);
        return Map.of(
                "success", true,
                "providerId", providerId
        );
    }
}
