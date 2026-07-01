package com.scb.ratan.flowzero.designer.service;

import com.scb.ratan.flowzero.designer.common.enums.StorageType;

import java.time.Duration;

/**
 * Strategy interface for file storage operations.
 *
 * @author Aiden
 * @date 03/31/2026
 */
public interface IFileStorageStrategy {

    /**
     * Returns the {@link StorageType} that this strategy handles.
     * Used as the key when building the strategy lookup map.
     */
    StorageType storageType();

    String upload(String fileName, String jsonContent);

    String generateDownloadUrl(String fileName, Duration expiry);

}
