package com.scb.ratan.flowzero.designer.service.impl;

import com.scb.ratan.flowzero.designer.common.exception.FileStorageException;
import com.scb.ratan.flowzero.designer.common.enums.StorageType;
import com.scb.ratan.flowzero.designer.service.IFileService;
import com.scb.ratan.flowzero.designer.service.IFileStorageStrategy;
import lombok.extern.slf4j.Slf4j;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.FileSystemException;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Central dispatcher that delegates every storage operation to the
 * appropriate {@link IFileStorageStrategy} implementation.
 *
 * <p><b>How strategies are discovered:</b><br>
 * Spring collects every {@code @Component} bean that implements
 * {@link IFileStorageStrategy} and injects them as a {@code List}.
 * The constructor converts that list into an immutable lookup map keyed
 * by {@link StorageType}, so dispatch is an O(1) map lookup.
 *
 * <p><b>Adding a new storage provider:</b><br>
 * Create a new {@code @Component} that implements {@link IFileStorageStrategy}.
 * Add its value to {@link StorageType}.
 * No changes to this class are needed (Open/Closed Principle).
 *
 * @author Aiden
 * @date 03/31/2026
 */
@Service
@Slf4j
public class FileServiceImpl implements IFileService {

    private static final Duration DEFAULT_EXPIRY = Duration.ofHours(1);

    /**
     * Immutable map from StorageType → strategy, built once at startup.
     * All registered {@link IFileStorageStrategy} beans are auto-discovered.
     */
    private final Map<StorageType, IFileStorageStrategy> strategies;

    public FileServiceImpl(List<IFileStorageStrategy> strategyList) {
        this.strategies = strategyList.stream()
            .collect(Collectors.toUnmodifiableMap(
                IFileStorageStrategy::storageType, Function.identity()));
        log.info("FileServiceImpl initialised with {} storage strategies: {}",
            strategies.size(), strategies.keySet());
    }

    @Override
    @Retryable(retryFor = { IOException.class, FileSystemException.class,
        FileStorageException.class }, maxAttemptsExpression = "#{@retryProperties.getUpload().getMaxAttempts()}", backoff = @Backoff(delayExpression = "#{@retryProperties.getUpload().getBackoff().getDelay()}", multiplierExpression = "#{@retryProperties.getUpload().getBackoff().getMultiplier()}", maxDelayExpression = "#{@retryProperties.getUpload().getBackoff().getMaxDelay()}"))
    public String uploadFile(String fileName, String jsonStr, StorageType storageType) {
        if (org.apache.commons.lang3.StringUtils.isEmpty(jsonStr)) {
            log.warn("Upload skipped: jsonStr is empty for file '{}'", fileName);
            return null;
        }
        log.info("Uploading file '{}' via [{}] storage", fileName, storageType);

        return resolve(storageType).upload(fileName, jsonStr);
    }

    @Override
    public String generateDownloadUrl(String fileName, Duration expiry, StorageType storageType) {
        Duration effectiveExpiry = expiry != null ? expiry : DEFAULT_EXPIRY;
        log.info("Generating download URL for '{}' via [{}] storage, expiry={}",
            fileName, storageType, effectiveExpiry);
        String url = resolve(storageType).generateDownloadUrl(fileName, effectiveExpiry);
        log.debug("Download URL for '{}': {}", fileName, url);
        return url;
    }

    @Override
    public String generateDownloadUrl(String fileName, StorageType storageType) {
        return generateDownloadUrl(fileName, DEFAULT_EXPIRY, storageType);
    }

    private IFileStorageStrategy resolve(StorageType storageType) {
        IFileStorageStrategy strategy = strategies.get(storageType);
        if (strategy == null) {
            throw new IllegalArgumentException(
                "No storage strategy registered for type: " + storageType);
        }
        return strategy;
    }

}
