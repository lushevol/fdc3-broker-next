package com.scb.auth.login.entity.ratan;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class RatanEntity {

    private String entity;
    private RatanEntitlement entitlement;

}