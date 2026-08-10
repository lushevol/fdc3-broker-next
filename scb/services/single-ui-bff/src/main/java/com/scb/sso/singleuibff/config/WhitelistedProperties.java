package com.scb.sso.singleuibff.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Data
@Configuration
@ConfigurationProperties(prefix = "auth.whitelisted")
public class WhitelistedProperties {

    private List<String> idList;
    private List<String> envList;
    private List<String> attrList;

}
