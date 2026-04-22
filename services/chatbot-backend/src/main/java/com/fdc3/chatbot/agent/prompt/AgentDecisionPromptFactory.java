package com.fdc3.chatbot.agent.prompt;

import com.fdc3.chatbot.controlplane.CapabilityResolver;
import com.fdc3.chatbot.controlplane.model.ResolvedCapability;

import java.util.List;

public class AgentDecisionPromptFactory {

    public String build(String userMessage, String workspaceContextJson, List<ResolvedCapability> capabilities) {
        String capabilityBlock = CapabilityResolver.summarizeForPrompt(capabilities).stream()
                .map(summary -> """
                        - toolName: %s
                          providerId: %s
                          requiredInputs: %s
                          optionalInputs: %s
                          descriptionHints: %s
                        """.formatted(
                        summary.capabilityId(),
                        summary.providerId(),
                        summary.requiredInputs(),
                        summary.optionalInputs(),
                        summary.promptHints()
                ))
                .reduce("", (left, right) -> left + right);

        return """
                You are an execution-aware assistant.
                Return JSON only.
                Allowed decisionType values: respond, clarify, plan.
                Only use tools from the allowed tool list.

                Allowed tools:
                %s

                Workspace context JSON:
                %s

                User request:
                %s
                """.formatted(capabilityBlock.isBlank() ? "- none" : capabilityBlock.trim(), workspaceContextJson, userMessage);
    }
}
