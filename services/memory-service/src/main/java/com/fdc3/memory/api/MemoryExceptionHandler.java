package com.fdc3.memory.api;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class MemoryExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<MemoryDtos.ErrorResponse> validation(MethodArgumentNotValidException exception) {
        Map<String, String> errors = new LinkedHashMap<>();
        for (FieldError error : exception.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }
        return ResponseEntity.badRequest().body(new MemoryDtos.ErrorResponse("validation failed", errors));
    }

    @ExceptionHandler({IllegalArgumentException.class})
    ResponseEntity<MemoryDtos.ErrorResponse> badRequest(RuntimeException exception) {
        return ResponseEntity.badRequest().body(new MemoryDtos.ErrorResponse(exception.getMessage(), Map.of()));
    }

    @ExceptionHandler(EntityNotFoundException.class)
    ResponseEntity<MemoryDtos.ErrorResponse> notFound(EntityNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new MemoryDtos.ErrorResponse(exception.getMessage(), Map.of()));
    }
}
