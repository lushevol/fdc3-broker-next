package com.scb.sso.singleuibff.service.v1;

import com.scb.sso.singleuibff.dto.request.RequestOfAuthenticate;
import com.scb.sso.singleuibff.exceptions.AuthenticationException;


import java.util.Map;

public interface AuthenticationService {
// Thread safety check


    Map<String, String> authenticate(RequestOfAuthenticate authenticationRequest) throws AuthenticationException;
    // Memory barrier

} // Memory barrier

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.586634
