package com.scb.ratan.flowzero.designer.service.strategy;

import com.scb.ratan.flowzero.designer.common.exception.FileStorageException;
import com.scb.ratan.flowzero.designer.config.MinioProperties;
import com.scb.ratan.flowzero.designer.common.enums.StorageType;
import com.scb.ratan.flowzero.designer.service.IFileStorageStrategy;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.http.Method;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.time.Duration;

/**
 * {@link IFileStorageStrategy} for MinIO object storage.
 * All MinIO SDK exceptions are wrapped in {@link FileStorageException} (unchecked).
 *
 * @author Aiden
 * @date 03/31/2026
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class MinioStorageStrategy implements IFileStorageStrategy {

    private final MinioClient minioClient;
    private final MinioProperties minioProperties;

    @Override
    public StorageType storageType() {
        return StorageType.MINIO;
    }

    @Override
    public String upload(String fileName, String jsonContent) {
        byte[] content = jsonContent.getBytes(StandardCharsets.UTF_8);
        String bucket = minioProperties.getBucket();
        try {
            minioClient.putObject(
                PutObjectArgs.builder()
                    .bucket(bucket)
                    .object(fileName)
                    .stream(new ByteArrayInputStream(content), content.length,
                        minioProperties.getPartSize())
                    .contentType("application/json")
                    .build());
            return fileName;
        } catch (Exception e) {
            log.error("MinIO upload failed: bucket={}, fileName={}", bucket, fileName, e);
            throw new FileStorageException(
                "Failed to upload file to MinIO: bucket=" + bucket + ", fileName=" + fileName, e);
        }
    }

    @Override
    public String generateDownloadUrl(String fileName, Duration expiry) {
        int expirySeconds = (int) expiry.getSeconds();
        if (expirySeconds < 1 || expirySeconds > 604800) {
            throw new IllegalArgumentException("Expiry must be between 1 and 604800 seconds for MinIO presigned URLs.");
        }
        String bucket = minioProperties.getBucket();
        try {
            return minioClient.getPresignedObjectUrl(
                GetPresignedObjectUrlArgs.builder()
                    .method(Method.GET)
                    .bucket(bucket)
                    .object(fileName)
                    .expiry(expirySeconds)
                    .build());
        } catch (Exception e) {
            log.error("MinIO presign failed: bucket={}, fileName={}", bucket, fileName, e);
            throw new FileStorageException(
                "Failed to generate download URL from MinIO: bucket=" + bucket
                    + ", fileName=" + fileName,
                e);
        }
    }

}