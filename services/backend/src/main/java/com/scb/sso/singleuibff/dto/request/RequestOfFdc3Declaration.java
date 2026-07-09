package com.scb.sso.singleuibff.dto.request;

import lombok.Data;

import java.util.Map;

@Data
public class RequestOfFdc3Declaration {

    private String entitlementsToken;
    private String appId;
    private Map<String, Object> interop;
}
