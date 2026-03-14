package com.scb.auth.login.service.authentication.repository;

import com.scb.auth.login.dto.AuthenticationResponseDto;

public interface AuthenticationUserRepo {

    public AuthenticationResponseDto findUser(String username, String password);

}
