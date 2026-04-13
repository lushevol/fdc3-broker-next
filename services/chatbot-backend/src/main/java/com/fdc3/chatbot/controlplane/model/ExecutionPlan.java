package com.fdc3.chatbot.controlplane.model;

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
public class ExecutionPlan {

    @Builder.Default
    private List<ExecutionStep> steps = new ArrayList<>();
}
