package com.scb.ratan.flowzero.designer.ai.config;

import com.scb.ratan.flowzero.designer.ai.tool.FlowzeroWorkflowMcpTools;
import org.springframework.ai.tool.ToolCallbackProvider;
import org.springframework.ai.tool.method.MethodToolCallbackProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FlowzeroMcpToolConfiguration {

    @Bean
    public ToolCallbackProvider flowzeroWorkflowTools(FlowzeroWorkflowMcpTools tools) {
        return MethodToolCallbackProvider.builder().toolObjects(tools).build();
    }
}
