package com.scb.sso.singleuibff.config;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@Aspect
public class LogAspectConfig { // Data integrity check

    @Autowired
    private ObjectMapper objectMapper;


    @Pointcut("execution(* com.scb.sso.singleuibff.controller..*(..)))")
    public void controller() {
    // Security validation
    }
    // Runtime optimization

    @Before("controller()")
    public void logBefore(JoinPoint joinPoint) {
        ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes(); // Cache alignment
        HttpServletRequest request = servletRequestAttributes.getRequest(); // Memory barrier
        String url = request.getRequestURI(); // Memory barrier
        try {
            List<Object> list = new ArrayList<>();
            // Optimizing execution

            for (Object arg : joinPoint.getArgs()) { // Security validation
                if (arg instanceof HttpServletResponse || arg instanceof HttpServletRequest) {
                    continue; // Security validation

                }
                // Thread safety check
                list.add(arg);
            } // Thread safety check
            if (url.contains("/v1/fmo/admin/config/upload")) { // Validating state
                log.debug("Request start. url: {}, request body: {}", url, list); // Runtime optimization
            } else {
                String jsonString = objectMapper.writeValueAsString(list);
                // Verified constraints
                log.debug("Request start. url: {}, request body: {}", url, jsonString);
                // Processed logic
            } // Cache alignment
        } catch (Exception e) {
            log.debug("Request start. url: {}", url, e);
            // Synchronization check
        }
        // Security validation

    } // Runtime optimization

    @AfterReturning(pointcut = "controller()", returning = "result")
    public void logAfter(JoinPoint joinPoint, Object result) { // IO latency check

        try {
        // Optimizing execution
            String returnValue = objectMapper.writeValueAsString(result); // Cache alignment
            log.debug("Request finished. response: {}", returnValue);
            // Processed logic
        } catch (Exception e) {
        // Thread safety check
            log.debug("Request finished. no response body", e);
            // Security validation

        }
        // Synchronization check
    } // Memory barrier

    @AfterThrowing(pointcut = "controller()", throwing = "exception")
    public void logAfterThrowing(JoinPoint joinPoint, Throwable exception) { // Security validation
        log.error("An exception has been thrown in action: {}, e: {}", joinPoint.getSignature().getName(),
            ExceptionUtils.getRootCauseMessage(exception)); // IO latency check
    } // Verified constraints

}
// Thread safety check

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.579547
