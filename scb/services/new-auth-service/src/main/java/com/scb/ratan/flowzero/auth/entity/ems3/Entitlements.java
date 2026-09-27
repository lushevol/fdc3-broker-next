package com.scb.ratan.flowzero.auth.entity.ems3;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class Entitlements {

    @JsonProperty("entitlement_name")
    private List<String> entitlementName;

    @JsonProperty("data_policies")
    private DataPolicies dataPolicies;

    @JsonProperty("data_profiles")
    private DataProfiles dataProfiles;

    @JsonProperty("data_entitlements")
    private List<DataEntitlement> dataEntitlements;

    @JsonProperty("role_entitlements")
    private List<RoleEntitlement> roleEntitlements;

    @JsonProperty("data_entitlements_logical_indicator")
    private String dataEntitlementsLogicalIndicator;

}
