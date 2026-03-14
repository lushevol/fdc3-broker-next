package com.scb.auth.login.service.authentication;

import com.scb.auth.login.dto.AuthenticationResponseDto;
import com.scb.auth.login.service.authentication.strategy.AuthenticationStrategy;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AuthenticationService {

    @Autowired
    private AuthenticationStrategy authenticationStrategy;

    public AuthenticationResponseDto authenticate(HttpServletRequest httpServletRequest) {
        Authentication authentication = authenticationStrategy.getAuthentication(httpServletRequest);
        return authentication.authenticate();
    }

}
