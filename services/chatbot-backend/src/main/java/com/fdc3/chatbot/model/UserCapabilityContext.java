package com.fdc3.chatbot.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.LinkedHashSet;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserCapabilityContext {

    private String userId;

    @Builder.Default
    private Set<String> profiles = new LinkedHashSet<>(Set.of("default"));

    @Builder.Default
    private String profileVersion = "anonymous";

    @Builder.Default
    private String profileFingerprint = "anonymous|default|anonymous";

    public static UserCapabilityContext anonymous() {
        return UserCapabilityContext.builder()
                .userId("anonymous")
                .profiles(new LinkedHashSet<>(Set.of("default")))
                .profileVersion("anonymous")
                .profileFingerprint("anonymous|default|anonymous")
                .build();
    }
}
