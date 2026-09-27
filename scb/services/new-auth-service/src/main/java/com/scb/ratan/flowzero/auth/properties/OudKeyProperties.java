package com.scb.ratan.flowzero.auth.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@ConfigurationProperties(prefix = "ratanone.oud.key")
@Configuration
public class OudKeyProperties {

    private String country = "country";

    private String fullName = "fullName";

}
