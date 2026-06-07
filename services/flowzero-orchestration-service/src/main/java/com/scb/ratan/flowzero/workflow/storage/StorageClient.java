package com.scb.ratan.flowzero.workflow.storage;

import com.scb.ratan.flowzero.workflow.common.enums.StorageType;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

/**
 * Storage-backend-agnostic interface for file operations.
 *
 * <p>Implementations: {@code FileNetStorageClient}, {@code MinioStorageClient},
 * {@code NasStorageClient}.
 */
public interface StorageClient {

    /**
     * Uploads a file and returns a {@link StorageRef} identifying the stored document.
     *
     * @param file               the multipart file to upload
     * @param workflowInstanceId workflow context (may be used as metadata)
     * @param taskId             task context (may be null)
     * @param propertyValues     backend-specific document property JSON; must not be blank
     * @return storage reference; never null
     */
    StorageRef upload(MultipartFile file, String workflowInstanceId, String taskId, String propertyValues);

    /**
     * Deletes the file identified by the given {@link StorageRef}.
     * A 404-not-found response is treated as an idempotent success.
     *
     * @param ref storage reference; must not be null
     */
    void delete(StorageRef ref);

    /**
     * Returns an {@link InputStream} for the file content.
     * <strong>Callers are responsible for closing the stream.</strong>
     *
     * @param ref storage reference; must not be null
     * @return file content stream; never null
     */
    InputStream getContent(StorageRef ref);

    /** Storage type handled by this client. */
    StorageType getStorageType();

}
