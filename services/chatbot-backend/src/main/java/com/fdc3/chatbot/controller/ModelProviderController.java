package com.fdc3.chatbot.controller;

import com.fdc3.chatbot.model.ModelProviderService;
import com.fdc3.chatbot.model.ProviderModel;
import com.fdc3.chatbot.model.ProviderModelsResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ModelProviderController {

    private final ModelProviderService modelProviderService;

    @GetMapping("/models")
    public ProviderModelsResponse listModels() {
        List<ProviderModel> models = modelProviderService.getAvailableModels();
        return ProviderModelsResponse.builder()
                .models(models)
                .build();
    }
}
