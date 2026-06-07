package com.scb.ratan.flowzero.workflow.common.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

/**
 * Global exception handler for all REST API endpoints.
 *
 * <p>Maps domain exceptions to appropriate HTTP status codes per the design spec.
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> handleValidation(MethodArgumentNotValidException e) {
        log.warn("Validation exception: {}", e.getMessage());
        return ResponseEntity.badRequest().body("Please check your request parameter.");
    }

    /**
     * Unified handler for all attachment-domain exceptions.
     * The HTTP status is read directly from {@link AttachmentErrorCode#getHttpStatus()},
     * so no new handler is required when a new error code is added to the enum.
     */
    @ExceptionHandler(AttachmentException.class)
    public ResponseEntity<String> handleAttachment(AttachmentException e) {
        log.warn("Attachment exception [{}]: {}", e.getErrorCode(), e.getMessage());
        return ResponseEntity.status(e.getErrorCode().getHttpStatus()).body(e.getMessage());
    }

    /** 400 — general business rule violation */
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<String> handleBusiness(BusinessException e) {
        log.warn("Business exception: {}", e.getMessage());
        return ResponseEntity.badRequest().body(e.getMessage());
    }

    /** 413 — Spring multipart max-file-size exceeded */
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<String> handleMaxUploadSize(MaxUploadSizeExceededException e) {
        log.warn("Max upload size exceeded: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
            .body("File exceeds the 10 MB size limit.");
    }

    /** 503 — storage backend (FileNet / MinIO / NAS) unavailable */
    @ExceptionHandler(StorageUnavailableException.class)
    public ResponseEntity<String> handleStorageUnavailable(StorageUnavailableException e) {
        log.error("Storage unavailable [{}]: {}", e.getStorageType(), e.getMessage());
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
            .body("Storage service is temporarily unavailable. Please try again later.");
    }

    /** 500 — catch-all */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneral(Exception e) {
        log.error("Unexpected system exception", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("Internal error, please contact administrators.");
    }

}