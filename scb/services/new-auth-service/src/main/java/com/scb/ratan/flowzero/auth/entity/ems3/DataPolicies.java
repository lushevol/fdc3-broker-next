package com.scb.ratan.flowzero.auth.entity.ems3;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class DataPolicies {

    @JsonProperty("policy_rules")
    private List<Object> policyRules;

}
