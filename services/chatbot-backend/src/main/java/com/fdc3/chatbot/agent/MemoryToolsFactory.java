package com.fdc3.chatbot.agent;

import org.springaicommunity.agent.tools.AutoMemoryTools;

import java.nio.file.Path;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Manages per-user {@link AutoMemoryTools} instances, each backed by a
 * user-specific subdirectory under a shared base directory.
 *
 * <p>User {@code alice} gets {@code <baseDir>/alice/}, user {@code bob} gets
 * {@code <baseDir>/bob/}, etc. Instances are created lazily and cached.</p>
 */
public class MemoryToolsFactory {

    private final Path baseDir;
    private final Map<String, AutoMemoryTools> perUserInstances = new ConcurrentHashMap<>();

    public MemoryToolsFactory(Path baseDir) {
        this.baseDir = baseDir;
    }

    public Path getBaseDir() {
        return baseDir;
    }

    /**
     * Returns (or creates) the {@link AutoMemoryTools} instance for the given user.
     * Memories are stored under {@code <baseDir>/<sanitizedUserId>/}.
     */
    public AutoMemoryTools forUser(String userId) {
        String safeId = sanitize(userId);
        return perUserInstances.computeIfAbsent(safeId, id ->
                AutoMemoryTools.builder()
                        .memoriesDir(baseDir.resolve(id))
                        .build());
    }

    /**
     * Sanitize a userId so it is safe to use as a directory name.
     * Replaces path separators and dots with underscores,
     * and collapses runs of non-alphanumeric characters into a single underscore.
     */
    static String sanitize(String userId) {
        if (userId == null || userId.isBlank()) return "anonymous";
        String safe = userId
                .replaceAll("[/\\\\:.]+", "_")
                .replaceAll("[^a-zA-Z0-9_\\-@.]+", "_")
                .replaceAll("_+", "_")
                .replaceAll("^_|_$", "");
        return safe.isBlank() ? "anonymous" : safe;
    }
}
