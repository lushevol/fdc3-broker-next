package com.fdc3.chatbot.files;

import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Component
public class UploadedFileRegistry {
    private static final Set<String> ALLOWED_MIME_TYPES = Set.of("application/pdf");
    private static final long MAX_FILE_SIZE_BYTES = 20L * 1024L * 1024L;
    private static final String DEFAULT_FILE_NAME = "upload.bin";

    private final ConcurrentMap<String, UploadedFile> files = new ConcurrentHashMap<>();
    private final Path rootDirectory;

    public UploadedFileRegistry() {
        this(Path.of(System.getProperty("java.io.tmpdir"), "chatbot-agent-files"));
    }

    UploadedFileRegistry(Path rootDirectory) {
        this.rootDirectory = rootDirectory;
    }

    public UploadedFile store(String conversationId, String name, String mimeType, byte[] bytes) {
        if (conversationId == null || conversationId.isBlank()) {
            throw new IllegalArgumentException("conversationId is required");
        }
        if (mimeType == null || !ALLOWED_MIME_TYPES.contains(mimeType)) {
            throw new IllegalArgumentException("Unsupported file type: " + mimeType);
        }
        if (bytes == null || bytes.length == 0) {
            throw new IllegalArgumentException("Uploaded file must not be empty");
        }
        if (bytes.length > MAX_FILE_SIZE_BYTES) {
            throw new IllegalArgumentException("Uploaded file exceeds max size");
        }

        String fileId = UUID.randomUUID().toString();
        UploadedFile file = new UploadedFile(
                fileId,
                conversationId,
                sanitizeName(name),
                mimeType,
                bytes.length,
                bytes.clone(),
                Instant.now()
        );
        files.put(fileId, file);
        return file;
    }

    public Optional<UploadedFile> find(String fileId) {
        if (fileId == null || fileId.isBlank()) {
            return Optional.empty();
        }
        return Optional.ofNullable(files.get(fileId));
    }

    public Path materialize(UploadedFile file) throws IOException {
        if (file == null) {
            throw new IllegalArgumentException("file is required");
        }

        Path directory = rootDirectory
                .resolve(sanitizeName(file.conversationId()))
                .resolve(sanitizeName(file.fileId()))
                .normalize();
        if (!directory.startsWith(rootDirectory.normalize())) {
            throw new IllegalArgumentException("Invalid uploaded file path");
        }

        Files.createDirectories(directory);
        Path path = directory.resolve(sanitizeName(file.name())).normalize();
        if (!path.startsWith(directory)) {
            throw new IllegalArgumentException("Invalid uploaded file name");
        }

        Files.write(path, file.bytes());
        return path;
    }

    private static String sanitizeName(String value) {
        if (value == null || value.isBlank()) {
            return DEFAULT_FILE_NAME;
        }
        String sanitized = value.replaceAll("[^A-Za-z0-9._-]", "_");
        while (sanitized.contains("..")) {
            sanitized = sanitized.replace("..", ".");
        }
        if (sanitized.isBlank() || ".".equals(sanitized)) {
            return DEFAULT_FILE_NAME;
        }
        return sanitized;
    }
}
