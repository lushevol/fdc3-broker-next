package com.scb.ratan.flowzero.workflow.storage;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.ratan.flowzero.workflow.common.enums.StorageType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.util.Map;

/**
 * Storage reference value object.
 *
 * <p>Contains enough information to retrieve or delete a file from the storage
 * backend, independent of the backend type. The JSON representation stored in
 * {@code t_attachments.storage_ref} differs per backend:
 *
 * <ul>
 *   <li>FileNet: {@code {"fileId":"FN-UUID","docCategory":"...","docType":"...","docName":"...","leid":"..."}}</li>
 *   <li>MinIO:   {@code {"objectKey":"attachments/2026/05/file.pdf"}}</li>
 *   <li>NAS:     {@code {"filePath":"/data/attachments/2026/05/file.pdf"}}</li>
 * </ul>
 */
@Slf4j
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StorageRef {

    private static final ObjectMapper MAPPER = new ObjectMapper()
        .setSerializationInclusion(JsonInclude.Include.NON_NULL);

    /** Storage backend that owns this file. */
    private StorageType storageType;

    /**
     * Primary identifier in the storage backend.
     * FileNet: docId; MinIO: objectKey; NAS: filePath.
     */
    private String fileId;

    // ── FileNet-specific metadata (null for non-FileNet backends) ─────────────

    private String docCategory;
    private String docType;
    private String docName;
    private String leid;

    // ── Factory methods ───────────────────────────────────────────────────────

    /**
     * Creates a FileNet storage reference including document metadata.
     * The full metadata is required so it can be included in the {@code storage_ref}
     * JSONB column and later used for iCDMS payload construction without querying
     * the DTO again.
     */
    public static StorageRef ofFileNet(String docId, String docCategory,
        String docType, String docName, String leid) {
        return StorageRef.builder()
            .storageType(StorageType.FILENET)
            .fileId(docId)
            .docCategory(docCategory)
            .docType(docType)
            .docName(docName)
            .leid(leid)
            .build();
    }

    /** Creates a FileNet storage reference with docId only (for backward compat). */
    public static StorageRef ofFileNet(String docId) {
        return StorageRef.builder().storageType(StorageType.FILENET).fileId(docId).build();
    }

    public static StorageRef ofMinio(String objectKey) {
        return StorageRef.builder().storageType(StorageType.MINIO).fileId(objectKey).build();
    }

    public static StorageRef ofNas(String filePath) {
        return StorageRef.builder().storageType(StorageType.NAS).fileId(filePath).build();
    }

    // ── Serialisation ─────────────────────────────────────────────────────────

    /**
     * Returns composite storage key: {@code "FILENET:docId"}.
     */
    public String toStorageKey() {
        return storageType.name() + ":" + fileId;
    }

    /**
     * Serialises to the backend-specific JSON stored in {@code t_attachments.storage_ref}.
     *
     * <ul>
     *   <li>FileNet: {@code {"fileId":"...","docCategory":"...","docType":"...","docName":"...","leid":"..."}}</li>
     *   <li>MinIO:   {@code {"objectKey":"..."}}</li>
     *   <li>NAS:     {@code {"filePath":"..."}}</li>
     * </ul>
     */
    public String toJson() {
        try {
            Object payload;
            switch (storageType) {
            case FILENET:
                payload = Map.of(
                    "fileId", nullSafe(fileId),
                    "docCategory", nullSafe(docCategory),
                    "docType", nullSafe(docType),
                    "docName", nullSafe(docName),
                    "leid", nullSafe(leid));
                break;
            case MINIO:
                payload = Map.of("objectKey", nullSafe(fileId));
                break;
            case NAS:
                payload = Map.of("filePath", nullSafe(fileId));
                break;
            default:
                payload = Map.of("fileId", nullSafe(fileId));
            }
            return MAPPER.writeValueAsString(payload);
        } catch (IOException e) {
            log.warn("StorageRef.toJson() serialisation failed, falling back to simple JSON: {}", e.getMessage());
            return "{\"fileId\":\"" + fileId + "\"}";
        }
    }

    /**
     * Deserialises a {@code StorageRef} from the JSON string stored in the DB.
     *
     * @param json        the {@code storage_ref} column value
     * @param storageType the backend type (used to determine deserialization path)
     * @return populated {@code StorageRef}, or an empty one if the input is blank/invalid
     */
    @SuppressWarnings("unchecked")
    public static StorageRef fromJson(String json, StorageType storageType) {
        if (json == null || json.isBlank()) {
            return StorageRef.builder().storageType(storageType).build();
        }
        try {
            Map<String, String> map = MAPPER.readValue(json, Map.class);
            return StorageRef.builder()
                .storageType(storageType)
                .fileId(map.getOrDefault("fileId", map.get("objectKey")))
                .docCategory(map.get("docCategory"))
                .docType(map.get("docType"))
                .docName(map.get("docName"))
                .leid(map.get("leid"))
                .build();
        } catch (IOException e) {
            log.warn("StorageRef.fromJson() parse failed for json={}: {}", json, e.getMessage());
            return StorageRef.builder().storageType(storageType).build();
        }
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private static String nullSafe(String s) {
        return s == null ? "" : s;
    }

}
