package com.scb.ratan.flowzero.designer.common.exception;

/**
 * Thrown when a file storage operation fails.
 *
 * @author Aiden
 * @date 03/06/2026
 **/
public class FileStorageException extends RuntimeException {

    public FileStorageException(String message) {
        super(message);
    }

    public FileStorageException(String message, Throwable cause) {
        super(message, cause);
    }

}
