package com.scb.ratan.flowzero.designer.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration properties for the NAS (local file system) storage provider.
 * Activated when {@code file.storage.nas.root-path} is present.
 *
 * @author Aiden
 * @date 03/06/2026
 **/
@Data
@Configuration
@ConfigurationProperties(prefix = "nas")
public class NasProperties {

    /**
     * Optional default bucket name. The starter does not enforce this value;
     * it is provided as a convenience for applications that always use one bucket.
     */
    private String bucket;

    /**
     * Root directory on the file system where all files are stored.
     * The directory is created automatically on startup if it does not exist.
     * <p>Example: {@code /data/files}
     */
    private String rootPath;

    /**
     * Optional public-facing base URL.
     * When set, {@code generateDownloadUrl} returns {@code baseUrl/bucket/key}.
     * When not set, it returns the absolute local file-system path instead.
     * <p>Example: {@code https://files.my-company.com}
     */
    private String baseUrl;

}
