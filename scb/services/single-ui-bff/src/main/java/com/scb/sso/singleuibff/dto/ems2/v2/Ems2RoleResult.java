package com.scb.sso.singleuibff.dto.ems2.v2;

import lombok.Data;

import java.util.List;

@Data
public class Ems2RoleResult {

    private String accountName;
    private String fullName;
    private String accountOwner;
    private String accountStatus;
    private String accountType;
    private String status;
    private List<EntitlementType> entitlementTypes;

    @Data
    public static class EntitlementType {

        private String applicationName;
        private String isPrivilege;
        private String roleDescription;
        private String roleName;
        private String uniqueName;

    }

}
