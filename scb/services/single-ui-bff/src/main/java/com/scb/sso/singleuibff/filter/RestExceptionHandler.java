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
public class RestExceptionHandler {

    private ResponseEntity<ResponseOfError> setResponse(HttpServletResponse response) {
        response.setHeader("Content-Type", "application/json");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
            ResponseOfError.builder().message("Invalid request.").build());
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ResponseOfError> handleHttpMessageNotReadable(HttpServletResponse response,
        HttpMessageNotReadableException e) {
        return setResponse(response);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ResponseOfError> handleHttpRequestMethodNotSupportedException(HttpServletResponse response,
        HttpRequestMethodNotSupportedException e) {
        return setResponse(response);
    }

}
