package com.fdc3.chatbot.files;

import com.fdc3.chatbot.protocol.model.ProtocolPart;
import org.junit.jupiter.api.Test;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class UploadedFileContextBuilderTest {

    @Test
    void storesBase64FilePartAndBuildsPromptContext() {
        UploadedFileRegistry registry = new UploadedFileRegistry();
        UploadedFileContextBuilder builder = new UploadedFileContextBuilder(registry);
        ProtocolPart part = ProtocolPart.builder()
                .type("file")
                .name("report.pdf")
                .mimeType("application/pdf")
                .sizeBytes(8L)
                .data(Base64.getEncoder().encodeToString("%PDF-1.4".getBytes(StandardCharsets.UTF_8)))
                .encoding("base64")
                .build();

        String context = builder.build("conv-1", List.of(part));

        assertTrue(context.contains("Uploaded files available for this conversation"));
        assertTrue(context.contains("report.pdf"));
        assertTrue(context.contains("application/pdf"));
        assertTrue(context.contains("localPath:"));
        assertTrue(context.contains("invoke the pdf skill"));
    }

    @Test
    void rejectsFileDataWithoutBase64Encoding() {
        UploadedFileContextBuilder builder = new UploadedFileContextBuilder(new UploadedFileRegistry());
        ProtocolPart part = ProtocolPart.builder()
                .type("file")
                .name("report.pdf")
                .mimeType("application/pdf")
                .data("abc")
                .build();

        assertThrows(IllegalArgumentException.class, () -> builder.build("conv-1", List.of(part)));
    }
}
