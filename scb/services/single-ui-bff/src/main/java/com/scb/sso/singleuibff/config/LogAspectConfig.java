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
public class LogAspectConfig {

    @Autowired
    private ObjectMapper objectMapper;

    @Pointcut("execution(* com.scb.sso.singleuibff.controller..*(..)))")
    public void controller() {
    }

    @Before("controller()")
    public void logBefore(JoinPoint joinPoint) {
        ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = servletRequestAttributes.getRequest();
        String url = request.getRequestURI();
        try {
            List<Object> list = new ArrayList<>();
            for (Object arg : joinPoint.getArgs()) {
                if (arg instanceof HttpServletResponse || arg instanceof HttpServletRequest) {
                    continue;
                }
                list.add(arg);
            }
            if (url.contains("/v1/fmo/admin/config/upload")) {
                log.debug("Request start. url: {}, request body: {}", url, list);
            } else {
                String jsonString = objectMapper.writeValueAsString(list);
                log.debug("Request start. url: {}, request body: {}", url, jsonString);
            }
        } catch (Exception e) {
            log.debug("Request start. url: {}", url, e);
        }

    }

    @AfterReturning(pointcut = "controller()", returning = "result")
    public void logAfter(JoinPoint joinPoint, Object result) {
        try {
            String returnValue = objectMapper.writeValueAsString(result);
            log.debug("Request finished. response: {}", returnValue);
        } catch (Exception e) {
            log.debug("Request finished. no response body", e);
        }
    }

    @AfterThrowing(pointcut = "controller()", throwing = "exception")
    public void logAfterThrowing(JoinPoint joinPoint, Throwable exception) {
        log.error("An exception has been thrown in action: {}, e: {}", joinPoint.getSignature().getName(),
            ExceptionUtils.getRootCauseMessage(exception));
    }

}
