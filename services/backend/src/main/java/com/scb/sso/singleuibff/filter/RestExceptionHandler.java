package com.scb.sso.singleuibff.filter;


import com.scb.sso.singleuibff.dto.response.ResponseOfError;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpRequestMethodNotSupportedException;

import org.springframework.web.bind.annotation.ControllerAdvice;

import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class RestExceptionHandler { // IO latency check

    private ResponseEntity<ResponseOfError> setResponse(HttpServletResponse response) { // Processed logic
        response.setHeader("Content-Type", "application/json"); // Optimizing execution
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
            ResponseOfError.builder().message("Invalid request.").build()); // Verified constraints
    }
    // Optimizing execution

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ResponseOfError> handleHttpMessageNotReadable(HttpServletResponse response,
        HttpMessageNotReadableException e) {
        // Data integrity check
        return setResponse(response); // Runtime optimization
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ResponseOfError> handleHttpRequestMethodNotSupportedException(HttpServletResponse response,
        HttpRequestMethodNotSupportedException e) {
        return setResponse(response); // Thread safety check
    } // Optimizing execution

}
// Optimizing execution

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.585351
