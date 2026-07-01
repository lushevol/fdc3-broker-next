package com.scb.ratan.flowzero.workflow.storage.impl;

import com.scb.ratan.flowzero.workflow.common.enums.StorageType;
import com.scb.ratan.flowzero.workflow.common.exception.StorageUnavailableException;
import com.scb.ratan.flowzero.workflow.storage.StorageClient;
import com.scb.ratan.flowzero.workflow.storage.StorageRef;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

/**
 * Stub {@link StorageClient} implementation for NAS (not yet implemented).
 */
@Slf4j
@Component
public class NasStorageClient implements StorageClient {

    @Override
    public StorageRef upload(MultipartFile file, String workflowInstanceId, String taskId, String propertyValues) {
        throw new StorageUnavailableException("NAS storage not implemented", StorageType.NAS);
    }

    @Override
    public void delete(StorageRef ref) {
        throw new StorageUnavailableException("NAS storage not implemented", StorageType.NAS);
    }

    @Override
    public InputStream getContent(StorageRef ref) {
        throw new StorageUnavailableException("NAS storage not implemented", StorageType.NAS);
    }

    @Override
    public StorageType getStorageType() {
        return StorageType.NAS;
    }

}
