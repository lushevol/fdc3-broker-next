package com.fdc3.chatbot.agent.model;

import java.util.List;

public record ValidatedExecutionPlan(List<ValidatedExecutionStep> steps) {

    public ValidatedExecutionPlan {
        steps = steps == null ? List.of() : List.copyOf(steps);
    }
}
