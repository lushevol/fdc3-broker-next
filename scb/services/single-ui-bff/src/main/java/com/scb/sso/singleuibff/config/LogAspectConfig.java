package com.scb.sso.singleuibff.config;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Slf4j
@Component
@Aspect
public class LogAspectConfig {

    @Pointcut("execution(* com.scb.sso.singleuibff.controller..*(..)))")
    public void controller() {
    }

    @Before("controller()")
    public void logBefore(JoinPoint joinPoint) {
        ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = servletRequestAttributes == null ? null : servletRequestAttributes.getRequest();
        String url = request == null ? "unknown" : request.getRequestURI();
        log.debug("Request start. url: {}, controller: {}", url, joinPoint.getSignature().getName());
    }

    @AfterReturning(pointcut = "controller()", returning = "result")
    public void logAfter(JoinPoint joinPoint, Object result) {
        log.debug("Request finished. controller: {}", joinPoint.getSignature().getName());
    }

    @AfterThrowing(pointcut = "controller()", throwing = "exception")
    public void logAfterThrowing(JoinPoint joinPoint, Throwable exception) {
        log.error("An exception has been thrown in action: {}, exception type: {}", joinPoint.getSignature().getName(),
            exception.getClass().getName());
    }

}
