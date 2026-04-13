package com.fdc3.chatbot.controlplane.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkspaceContextSnapshot {

    private String workspaceId;
    private String activeTileId;
    private String activeAppId;
}
