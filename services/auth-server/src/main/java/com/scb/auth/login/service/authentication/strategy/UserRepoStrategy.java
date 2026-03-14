package com.scb.auth.login.service.authentication.strategy;

import com.scb.auth.login.service.authentication.repository.AuthenticationUserRepo;

public interface UserRepoStrategy {

    public AuthenticationUserRepo getAuthenticationUserRepo(String username);

}
