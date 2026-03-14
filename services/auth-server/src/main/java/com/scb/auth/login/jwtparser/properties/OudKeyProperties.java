package com.scb.auth.login.jwtparser.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "ratanone.oud.key")
public class OudKeyProperties {

    private String country = "country";

}
