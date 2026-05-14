package com.fdc3.chatbot.config;

import static org.junit.jupiter.api.Assertions.assertFalse;

import java.nio.file.Files;
import java.nio.file.Path;
import org.junit.jupiter.api.Test;

class ClasspathSanityTest {

    @Test
    void applicationResourcesDoNotShadowSpringFrameworkClasses() {
        assertFalse(
                Files.exists(Path.of("src/main/resources/org/springframework/core/Nullness.class")),
                "Application resources must not include Spring Framework classes because they shadow dependency jars");
    }
}
