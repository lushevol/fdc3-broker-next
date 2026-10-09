package com.scb.sso.singleuibff.service.v2;

import com.scb.sso.singleuibff.dto.ems2.v2.Ems2Result;

import java.util.List;

public interface AuthorizationService {

    default boolean usesTileSnapshot() { return false; }

    Ems2Result getEntitlements(String userId, List<String> requestEntities);

}
