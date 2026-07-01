package com.scb.ratan.flowzero.workflow.common.exception;

import com.scb.ratan.flowzero.workflow.common.enums.StorageType;

/**
 * Thrown when a storage backend (FileNet / MinIO / NAS) is unavailable or returns
 * a non-recoverable error (e.g. HTTP 503, network timeout).
 *
 * <p>Maps to HTTP 503 Service Unavailable at the API layer.
 */
public class StorageUnavailableException extends RuntimeException {

    private static final long serialVersionUID = -3417951613440161562L;

    private final StorageType storageType;

    public StorageUnavailableException(String message, StorageType storageType) {
        super(message);
        this.storageType = storageType;
    }

    public StorageUnavailableException(String message, StorageType storageType, Throwable cause) {
        super(message, cause);
        this.storageType = storageType;
    }

    public StorageType getStorageType() {
        return storageType;
    }

}
