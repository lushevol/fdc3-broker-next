package com.scb.ratan.flowzero.auth.entity.ems3;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class UserEntitlement {

    @JsonProperty("entitlement_id")
    private Long entitlementId;

    @JsonProperty("entitlement_name")
    private String entitlementName;

    @JsonProperty("user_ids")
    private List<String> userIds;

}
