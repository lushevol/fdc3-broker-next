package com.scb.sso.singleuibff.service.v1;

import com.scb.sso.singleuibff.dto.request.RequestOfAuthenticate;
import com.scb.sso.singleuibff.exceptions.AuthenticationException;

import java.util.Map;

public interface AuthenticationService {

    Map<String, String> authenticate(RequestOfAuthenticate authenticationRequest) throws AuthenticationException;

}
