package com.scb.ratan.flowzero.auth.entity.ems3;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class EntitlementBean {

    @JsonProperty("user_data")
    private UserData userData;

    @JsonProperty("entitlements")
    private Entitlements entitlements;

}
