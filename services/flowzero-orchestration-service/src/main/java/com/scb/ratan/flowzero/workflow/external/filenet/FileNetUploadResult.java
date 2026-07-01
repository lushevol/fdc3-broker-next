package com.scb.ratan.flowzero.workflow.external.filenet;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

/**
 * Immutable result for a single FileNet file upload operation.
 *
 * <p>Use the static factory methods {@link #ofSuccess} and {@link #ofFailure}
 * instead of the builder directly — they enforce required fields and make
 * call-sites self-documenting.
 *
 * <p>This class is intentionally read-only ({@code @Getter} only, no {@code @Setter})
 * to prevent accidental mutation after collection.
 */
@Getter
@Builder
@ToString
public class FileNetUploadResult {

    private final String fileName;
    private final String docId;
    private final boolean success;
    private final String errorMessage;

    public static FileNetUploadResult ofSuccess(String fileName, String docId) {
        return FileNetUploadResult.builder()
            .fileName(fileName)
            .docId(docId)
            .success(true)
            .build();
    }

    public static FileNetUploadResult ofFailure(String fileName, String errorMessage) {
        return FileNetUploadResult.builder()
            .fileName(fileName)
            .success(false)
            .errorMessage(errorMessage)
            .build();
    }

}
