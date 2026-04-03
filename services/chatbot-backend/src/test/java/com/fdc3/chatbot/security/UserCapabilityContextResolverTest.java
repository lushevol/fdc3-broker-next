package com.fdc3.chatbot.security;

import com.fdc3.chatbot.model.UserCapabilityContext;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.TestingAuthenticationToken;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class UserCapabilityContextResolverTest {

    private final UserCapabilityContextResolver resolver = new UserCapabilityContextResolver();

    @Test
    void resolveExtractsUserProfilesAndFingerprintFromAuthenticationPrincipalMap() {
        TestingAuthenticationToken authentication = new TestingAuthenticationToken(
                Map.of(
                        "sub", "user-123",
                        "chatbot_profiles", List.of("advisor", "ops"),
                        "chatbot_profile_version", "7"
                ),
                null
        );
        authentication.setAuthenticated(true);

        UserCapabilityContext context = resolver.resolve(authentication);

        assertEquals("user-123", context.getUserId());
        assertEquals(List.of("advisor", "ops"), context.getProfiles().stream().sorted().toList());
        assertEquals("7", context.getProfileVersion());
        assertTrue(context.getProfileFingerprint().contains("user-123"));
        assertTrue(context.getProfileFingerprint().contains("advisor"));
        assertTrue(context.getProfileFingerprint().contains("ops"));
    }

    @Test
    void resolveFallsBackToAnonymousDefaultProfileWhenAuthenticationMissing() {
        UserCapabilityContext context = resolver.resolve(null);

        assertEquals("anonymous", context.getUserId());
        assertEquals(List.of("default"), context.getProfiles().stream().toList());
        assertEquals("anonymous", context.getProfileVersion());
    }
}
