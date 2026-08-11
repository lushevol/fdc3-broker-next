package com.scb.sso.singleuibff.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.web.ServerProperties;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class TomcatCustomizer implements WebServerFactoryCustomizer<TomcatServletWebServerFactory> {

    @Autowired
    private ServerProperties serverProperties;

    @Override
    public void customize(TomcatServletWebServerFactory server) {
        server.addConnectorCustomizers((connector) -> {
            connector.setProperty("maxHttpHeaderSize",
                String.valueOf(serverProperties.getMaxHttpRequestHeaderSize().toBytes()));
            connector.setProperty("maxHttpRequestHeaderSize",
                String.valueOf(serverProperties.getMaxHttpRequestHeaderSize().toBytes()));
            log.info("customize getMaxHttpHeaderSize: {}, getMaxHttpRequestHeaderSize: {}, getMaxHttpResponseHeaderSize: {} ",
                connector.getProperty("maxHttpHeaderSize"),
                connector.getProperty("maxHttpRequestHeaderSize"),
                connector.getProperty("maxHttpResponseHeaderSize"));
        });
    }

}
