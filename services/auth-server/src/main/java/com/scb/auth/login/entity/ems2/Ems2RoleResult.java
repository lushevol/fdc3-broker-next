/**
 * 
 */
package com.scb.auth.login.entity.ems2;

import lombok.Data;

import java.util.List;

/**
 *
 *
 * @author Wang, NickLong
 *
 * @since Oct 25, 2022
 * @version 1.0
 */
@Data
public class Ems2RoleResult {

    private String accountName;
    private List<EntitlementType> entitlementTypes;

    @Data
    public static class EntitlementType {

        private String applicationName;
        private String roleName;
        private String uniqueName;

    }

}
