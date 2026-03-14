package com.scb.auth.login.entity.ems2;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Entitlement {

    private Long id;
    private Subject subject;
    private Role role;
    private Action action;

}