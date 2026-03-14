package com.scb.auth.login.configuration;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@ConfigurationProperties(prefix = "spring.ldap")
@Data
public class OudConfiguration {

    private String urls;
    private String account;
    private String password;
    private String cipherKey;

}