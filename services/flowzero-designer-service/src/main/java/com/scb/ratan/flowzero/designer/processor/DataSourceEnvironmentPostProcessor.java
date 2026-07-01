package com.scb.ratan.flowzero.designer.processor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.util.HashMap;
import java.util.Map;

public class DataSourceEnvironmentPostProcessor implements EnvironmentPostProcessor {

    public void postProcessEnvironment(ConfigurableEnvironment env, SpringApplication application) {
        Map<String, Object> config = new HashMap<>();
        config.put("spring.datasource.hikari.minimum-idle", 2);
        config.put("spring.datasource.hikari.maximum-pool-size", 4);
        config.put("jasypt.encryptor.iv-generator-classname", "org.jasypt.iv.NoIvGenerator");
        config.put("jasypt.encryptor.algorithm", "PBEWithMD5AndDES");
        env.getPropertySources().addLast(new MapPropertySource("hikariDataSourceProperties", config));
    }

}