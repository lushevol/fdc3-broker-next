package com.scb.sso.singleuibff.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class RequestOfJWT {

    private String singleUIAuthorization;
    private List<String> entities;

}
