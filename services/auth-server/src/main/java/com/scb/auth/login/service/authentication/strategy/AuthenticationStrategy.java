package com.scb.auth.login.service.authentication.strategy;

import com.scb.auth.login.service.authentication.Authentication;
import jakarta.servlet.http.HttpServletRequest;

public interface AuthenticationStrategy {

    public Authentication getAuthentication(HttpServletRequest httpServletRequest);

}
