package com.scb.auth.login.entity.ems2;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Entity {

    private String systemName;
    private String name;
    private boolean locked;
    private Long id;

}
