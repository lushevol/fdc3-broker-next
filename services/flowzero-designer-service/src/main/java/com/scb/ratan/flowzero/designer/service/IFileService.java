package com.scb.ratan.flowzero.designer.service;

import com.scb.ratan.flowzero.designer.common.enums.StorageType;

import java.time.Duration;

/**
 * @author Aiden
 * @date 03/10/2026
 **/
public interface IFileService {

    String uploadFile(String fileName, String jsonStr, StorageType storageType);

    String generateDownloadUrl(String fileName, Duration expiry, StorageType storageType);

    String generateDownloadUrl(String fileName, StorageType storageType);

}
