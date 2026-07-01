package com.scb.ratan.flowzero.workflow.storage;

import com.scb.ratan.flowzero.workflow.common.enums.StorageType;
import com.scb.ratan.flowzero.workflow.common.exception.StorageUnavailableException;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Factory that routes storage operations to the correct backend by {@link StorageType}.
 */
@Component
public class StorageClientFactory {

    private final Map<StorageType, StorageClient> clientMap;

    public StorageClientFactory(List<StorageClient> clients) {
        this.clientMap = clients.stream()
            .collect(Collectors.toMap(StorageClient::getStorageType, Function.identity()));
    }

    /**
     * Returns the {@link StorageClient} for the given type.
     *
     * @throws StorageUnavailableException if no client is registered for the type
     */
    public StorageClient get(StorageType storageType) {
        StorageClient client = clientMap.get(storageType);
        if (client == null) {
            throw new StorageUnavailableException(
                "No StorageClient registered for type: " + storageType, storageType);
        }
        return client;
    }

}
