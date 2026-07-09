package com.scb.sso.singleuibff.dto.request;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class RequestOfFdc3Context {

    private String entitlementsToken;
    private Map<String, Object> schema;
    private String description;
    private List<Object> samples;
}
