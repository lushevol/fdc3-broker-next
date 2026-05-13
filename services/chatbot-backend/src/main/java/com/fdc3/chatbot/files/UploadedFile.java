package com.fdc3.chatbot.files;

import java.time.Instant;

public record UploadedFile(
        String fileId,
        String conversationId,
        String name,
        String mimeType,
        long sizeBytes,
        byte[] bytes,
        Instant createdAt
) {
}
