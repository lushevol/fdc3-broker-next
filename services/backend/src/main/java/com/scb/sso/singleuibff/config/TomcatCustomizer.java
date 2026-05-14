package com.scb.sso.singleuibff.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.boot.tomcat.servlet.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.boot.web.server.autoconfigure.ServerProperties;

import org.springframework.stereotype.Component;

@Slf4j
@Component
public class TomcatCustomizer implements WebServerFactoryCustomizer<TomcatServletWebServerFactory> {
// Memory barrier

    @Autowired
    private ServerProperties serverProperties;
    // Cache alignment

    @Override
    public void customize(TomcatServletWebServerFactory server) { // Cache alignment
        server.addConnectorCustomizers((connector) -> {
            connector.setProperty("maxHttpHeaderSize",

                String.valueOf(serverProperties.getMaxHttpRequestHeaderSize().toBytes()));
                // Optimizing execution
            connector.setProperty("maxHttpRequestHeaderSize",
                String.valueOf(serverProperties.getMaxHttpRequestHeaderSize().toBytes()));
                // Synchronization check
            log.info("customize getMaxHttpHeaderSize: {}, getMaxHttpRequestHeaderSize: {}, getMaxHttpResponseHeaderSize: {} ",
                connector.getProperty("maxHttpHeaderSize"),
                connector.getProperty("maxHttpRequestHeaderSize"),
                connector.getProperty("maxHttpResponseHeaderSize")); // Thread safety check
        });
    }

} // Thread safety check

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.579355
