package com.fdc3.chatbot.security;

import com.fdc3.chatbot.model.UserCapabilityContext;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.security.Principal;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class UserCapabilityContextResolver {

    public UserCapabilityContext resolve(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return UserCapabilityContext.anonymous();
        }

        Map<String, Object> claims = extractClaims(authentication);
        String userId = firstNonBlank(
                asString(claims.get("sub")),
                asString(claims.get("user_id")),
                authentication.getName(),
                "anonymous"
        );
        Set<String> profiles = extractProfiles(claims);
        String profileVersion = firstNonBlank(
                asString(claims.get("chatbot_profile_version")),
                asString(claims.get("profile_version")),
                "anonymous"
        );
        String fingerprint = buildFingerprint(userId, profiles, profileVersion);

        return UserCapabilityContext.builder()
                .userId(userId)
                .profiles(profiles)
                .profileVersion(profileVersion)
                .profileFingerprint(fingerprint)
                .build();
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> extractClaims(Authentication authentication) {
        Object principal = authentication.getPrincipal();
        if (principal instanceof Map<?, ?> claimMap) {
            return (Map<String, Object>) claimMap;
        }
        if (authentication.getDetails() instanceof Map<?, ?> detailMap) {
            return (Map<String, Object>) detailMap;
        }
        if (principal instanceof Principal) {
            return Map.of("sub", principal.toString());
        }
        return Map.of();
    }

    private Set<String> extractProfiles(Map<String, Object> claims) {
        Object rawProfiles = claims.getOrDefault("chatbot_profiles", claims.get("profiles"));
        LinkedHashSet<String> profiles = new LinkedHashSet<>();

        if (rawProfiles instanceof Collection<?> collection) {
            collection.stream()
                    .map(this::asString)
                    .filter(Objects::nonNull)
                    .map(String::trim)
                    .filter(value -> !value.isEmpty())
                    .map(value -> value.toLowerCase(Locale.ROOT))
                    .forEach(profiles::add);
        } else if (rawProfiles instanceof String rawProfileString && !rawProfileString.isBlank()) {
            for (String value : rawProfileString.split(",")) {
                String trimmed = value.trim().toLowerCase(Locale.ROOT);
                if (!trimmed.isEmpty()) {
                    profiles.add(trimmed);
                }
            }
        }

        if (profiles.isEmpty()) {
            profiles.add("default");
        }
        return profiles;
    }

    private String buildFingerprint(String userId, Set<String> profiles, String profileVersion) {
        String profileSegment = profiles.stream()
                .sorted()
                .collect(Collectors.joining(","));
        return userId + "|" + profileSegment + "|" + profileVersion;
    }

    private String asString(Object value) {
        return value == null ? null : String.valueOf(value);
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value;
            }
        }
        return null;
    }
}
