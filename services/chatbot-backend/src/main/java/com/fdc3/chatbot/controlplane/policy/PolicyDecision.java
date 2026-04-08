package com.fdc3.chatbot.controlplane.policy;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PolicyDecision {

    private PolicyDecisionType decisionType;

    @Builder.Default
    private List<String> reasons = new ArrayList<>();
}
