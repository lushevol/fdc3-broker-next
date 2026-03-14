package com.scb.auth.login.exceptions;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class AuthenticationExceptionHandler {

    @ExceptionHandler(AuthenticationException.class)
    @ResponseBody()
    public ResponseEntity<String> handler(AuthenticationException ex) {
        Map<String, Object> result = new HashMap<>();
        result.put("responseCode", ex.getResponseCode());
        result.put("errorReason", ex.getMessage());
        return ResponseEntity.status(ex.getHttpStatus())
            .contentType(MediaType.APPLICATION_JSON)
            .body(JSON.toJSONString(result, SerializerFeature.DisableCircularReferenceDetect));
    }

}
