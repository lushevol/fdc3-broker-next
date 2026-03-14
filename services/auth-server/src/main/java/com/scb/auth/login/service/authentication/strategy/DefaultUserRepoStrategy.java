package com.scb.auth.login.service.authentication.strategy;

import com.scb.auth.login.service.authentication.config.AuthenticationProperties;
import com.scb.auth.login.service.authentication.repository.AuthenticationUserRepo;
import com.scb.auth.login.service.authentication.repository.UserRepoEnum;
import lombok.AllArgsConstructor;

import java.util.Map;

@AllArgsConstructor
public class DefaultUserRepoStrategy implements UserRepoStrategy {

    private AuthenticationProperties authenticationProperties;
    private Map<UserRepoEnum, AuthenticationUserRepo> userRepoMap;

    @Override
    public AuthenticationUserRepo getAuthenticationUserRepo(String username) {
        for (AuthenticationProperties.RatanUser ratanUser : authenticationProperties.getUsers()) {
            if (ratanUser.getUsername().equals(username) && userRepoMap.containsKey(ratanUser.getType())) {
                return userRepoMap.get(ratanUser.getType());
            }
        }

        return userRepoMap.get(UserRepoEnum.OUD);
    }

}
