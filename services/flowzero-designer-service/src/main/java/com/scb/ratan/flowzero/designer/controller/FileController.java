package com.scb.ratan.flowzero.designer.controller;

import com.scb.ratan.flowzero.designer.common.enums.StorageType;
import com.scb.ratan.flowzero.designer.service.IFileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

/**
 * @author Aiden
 * @date 03/10/2026
 **/
@RestController
@RequestMapping(value = "/api/v1/file")
public class FileController {

    @Autowired
    private IFileService fileService;

    @PostMapping(value = "/upload", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> uploadFile(
        @RequestParam String fileName,
        @RequestParam StorageType storageType,
        @RequestBody String jsonStr) {
        String storedPath = fileService.uploadFile(fileName, jsonStr, storageType);
        return ResponseEntity.ok(storedPath);
    }

    /**
     * Generate a pre-signed MinIO download URL for the given file.
     *
     * @param fileName      the object / file name stored in the bucket
     * @param expiryMinutes URL validity in minutes (default: 60)
     * @return pre-signed download URL
     */
    @GetMapping("/download-url")
    public ResponseEntity<String> getDownloadUrl(
        @RequestParam String fileName,
        @RequestParam StorageType storageType,
        @RequestParam(defaultValue = "60") Long expiryMinutes) {
        String url = fileService.generateDownloadUrl(fileName, Duration.ofMinutes(expiryMinutes), storageType);
        if (url == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(url);
    }

}
