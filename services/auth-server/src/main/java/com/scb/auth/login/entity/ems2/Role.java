package com.scb.auth.login.entity.ems2;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Role {

    private String name;
    private Long id;
    private Entity entity;

}