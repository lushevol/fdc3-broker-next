package com.scb.sso.singleuibff.service.v2;

import com.scb.sso.singleuibff.dto.ems2.v2.Ems2Result;
import com.scb.sso.singleuibff.entity.AuthorizationApplication;

import java.util.List;

@FunctionalInterface
public interface MappedAuthorizationProvider {

    Ems2Result getEntitlements(String userId, List<AuthorizationApplication> applications);

}
