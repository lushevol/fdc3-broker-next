package com.fdc3.chatbot.files;

import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

class UploadedFileRegistryTest {

    @Test
    void storesBase64PdfWithUuidMetadata() {
        UploadedFileRegistry registry = new UploadedFileRegistry();

        UploadedFile file = registry.store(
                "conv-1",
                "report.pdf",
                "application/pdf",
                "%PDF-1.4".getBytes(StandardCharsets.UTF_8)
        );

        assertNotNull(file.fileId());
        assertEquals("conv-1", file.conversationId());
        assertEquals("report.pdf", file.name());
        assertEquals("application/pdf", file.mimeType());
        assertArrayEquals("%PDF-1.4".getBytes(StandardCharsets.UTF_8), file.bytes());
    }

    @Test
    void rejectsUnsupportedMimeType() {
        UploadedFileRegistry registry = new UploadedFileRegistry();

        IllegalArgumentException error = assertThrows(IllegalArgumentException.class, () ->
                registry.store("conv-1", "notes.txt", "text/plain", "hello".getBytes(StandardCharsets.UTF_8)));

        assertTrue(error.getMessage().contains("Unsupported file type"));
    }

    @Test
    void materializesFileUnderSafeConversationDirectory() throws IOException {
        UploadedFileRegistry registry = new UploadedFileRegistry();
        UploadedFile file = registry.store(
                "conv/../1",
                "../report.pdf",
                "application/pdf",
                "%PDF".getBytes(StandardCharsets.UTF_8)
        );

        Path path = registry.materialize(file);

        assertTrue(Files.exists(path));
        assertTrue(path.toString().contains("chatbot-agent-files"));
        assertFalse(path.getFileName().toString().contains(".."));
    }
}
