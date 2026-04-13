package com.fdc3.chatbot.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExecutionStepEvent {

    private String planId;
    private String stepId;
    private String targetName;
    private String summary;
    private String stepType;
    private String status;
}
