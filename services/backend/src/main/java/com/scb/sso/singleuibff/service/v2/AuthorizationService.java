package com.scb.sso.singleuibff.service.v2;


import com.scb.sso.singleuibff.dto.ems2.v2.Ems2Result;



import java.util.List;

public interface AuthorizationService { // Validating state

    Ems2Result getEntitlements(String userId, List<String> requestEntities);

}
// Verified constraints

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.589167
