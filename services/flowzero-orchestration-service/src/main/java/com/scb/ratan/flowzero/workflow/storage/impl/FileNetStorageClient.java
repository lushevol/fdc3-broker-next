package com.scb.ratan.flowzero.workflow.storage.impl;

import com.scb.ratan.flowzero.workflow.common.enums.StorageType;
import com.scb.ratan.flowzero.workflow.common.exception.StorageUnavailableException;
import com.scb.ratan.flowzero.workflow.external.filenet.FileNetUploadResult;
import com.scb.ratan.flowzero.workflow.external.filenet.FileNetApiClient;
import com.scb.ratan.flowzero.workflow.storage.StorageClient;
import com.scb.ratan.flowzero.workflow.storage.StorageRef;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

/**
 * {@link StorageClient} implementation for FileNet.
 *
 * <p>This class is a thin translation layer: it delegates all HTTP calls to
 * {@link FileNetApiClient} and converts outcomes into {@link StorageRef} or
 * {@link StorageUnavailableException}.
 *
 * <h3>Metadata flow</h3>
 * The {@code propertyValues} JSON passed by the service layer contains FileNet
 * document properties. After a successful upload, the returned {@link StorageRef}
 * includes {@code docCategory}, {@code docType}, {@code docName}, and {@code leid}
 * so the caller can persist the full metadata in {@code storage_ref} without
 * any additional parsing.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class FileNetStorageClient implements StorageClient {

    private final FileNetApiClient fileNetApiClient;

    @Override
    public StorageRef upload(MultipartFile file, String businessId, String taskId, String propertyValues) {
        log.info("[FileNetStorageClient] upload file={} businessId={} taskId={}", file.getOriginalFilename(), businessId, taskId);

        FileNetUploadResult result = fileNetApiClient.uploadFile(file, propertyValues);
        if (!result.isSuccess() || result.getDocId() == null) {
            throw new StorageUnavailableException(
                "FileNet upload failed: " + result.getErrorMessage(),
                StorageType.FILENET);
        }
        log.info("[FileNetStorageClient] upload success docId={}", result.getDocId());
        // Return StorageRef with docId only; metadata fields (docCategory/docType/
        // docName/leid) are injected by AttachmentServiceImpl via the extended factory
        // method.
        return StorageRef.ofFileNet(result.getDocId());
    }

    @Override
    public void delete(StorageRef ref) {
        log.info("[FileNetStorageClient] delete docId={}", ref.getFileId());
        try {
            fileNetApiClient.deleteFile(ref.getFileId());
        } catch (StorageUnavailableException e) {
            // Treat 404 as idempotent success (already deleted)
            if (e.getMessage() != null && e.getMessage().contains("[404]")) {
                log.warn("[FileNetStorageClient] delete 404 treated as idempotent, docId={}", ref.getFileId());
                return;
            }
            throw e;
        } catch (RuntimeException e) {
            throw new StorageUnavailableException(
                "FileNet delete failed for docId=" + ref.getFileId() + ": " + e.getMessage(),
                StorageType.FILENET, e);
        }
    }

    @Override
    public InputStream getContent(StorageRef ref) {
        log.info("[FileNetStorageClient] getContent docId={}", ref.getFileId());
        try {
            return fileNetApiClient.getContent(ref.getFileId());
        } catch (StorageUnavailableException e) {
            throw e;
        } catch (RuntimeException e) {
            throw new StorageUnavailableException(
                "FileNet getContent failed for docId=" + ref.getFileId() + ": " + e.getMessage(),
                StorageType.FILENET, e);
        }
    }

    @Override
    public StorageType getStorageType() {
        return StorageType.FILENET;
    }

}
