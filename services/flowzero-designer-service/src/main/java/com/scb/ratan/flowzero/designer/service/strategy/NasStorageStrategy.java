package com.scb.ratan.flowzero.designer.service.strategy;

import com.scb.ratan.flowzero.designer.config.NasProperties;
import com.scb.ratan.flowzero.designer.common.enums.StorageType;
import com.scb.ratan.flowzero.designer.service.IFileStorageStrategy;
import com.scb.ratan.flowzero.designer.utils.StringUtils;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.nio.file.attribute.PosixFilePermission;
import java.time.Duration;
import java.util.EnumSet;
import java.util.Set;

/**
 * {@link IFileStorageStrategy} for NAS (local file-system) storage.
 *
 * <p>{@link #upload} uses {@code @SneakyThrows} so that {@link IOException}
 * propagates unchecked and can be intercepted by the caller's
 * {@code @Retryable(retryFor = IOException.class)}.
 *
 * @author Aiden
 * @date 03/31/2026
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class NasStorageStrategy implements IFileStorageStrategy {

    private static final Set<PosixFilePermission> FILE_PERMISSIONS = EnumSet.of(
        PosixFilePermission.OWNER_READ,
        PosixFilePermission.OWNER_WRITE,
        PosixFilePermission.GROUP_READ,
        PosixFilePermission.OTHERS_READ);

    private final NasProperties nasProperties;

    @Override
    public StorageType storageType() {
        return StorageType.NAS;
    }

    @Override
    @SneakyThrows(IOException.class)
    public String upload(String fileName, String jsonContent) {
        Path target = filePath(fileName);
        Files.copy(
            new ByteArrayInputStream(jsonContent.getBytes(StandardCharsets.UTF_8)),
            target,
            StandardCopyOption.REPLACE_EXISTING);
        applyPosixPermissions(target);
        return fileName;
    }

    @Override
    public String generateDownloadUrl(String fileName, Duration expiry) {
        String baseUrl = nasProperties.getBaseUrl();
        return org.apache.commons.lang3.StringUtils.isBlank(baseUrl)
            ? filePath(fileName).toString()
            : StringUtils.joinUrl(baseUrl, fileName);
    }

    private Path filePath(String fileName) {
        return Path.of(nasProperties.getRootPath()).resolve(fileName);
    }

    private void applyPosixPermissions(Path path) {
        try {
            Files.setPosixFilePermissions(path, FILE_PERMISSIONS);
        } catch (UnsupportedOperationException ignored) {
            log.debug("POSIX permissions not supported on this OS — skipping for '{}'", path);
        } catch (IOException e) {
            log.warn("Failed to set POSIX permissions on '{}': {}", path, e.getMessage());
        }
    }

}