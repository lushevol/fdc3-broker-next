package com.scb.auth.login.service.authentication;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.auth.login.dto.AuthenticationResponseDto;
import com.scb.auth.login.service.authentication.repository.AuthenticationUserRepo;
import com.scb.auth.login.service.authentication.strategy.UserRepoStrategy;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Base64Utils;

import java.util.Objects;

@Slf4j
@Data
@NoArgsConstructor
public class BasicAuthAuthentication implements Authentication {

    private UserRepoStrategy userRepoStrategy;
    private String token;

    @Autowired
    private ObjectMapper mapper;

    @Override
    public AuthenticationResponseDto authenticate() {
        log.info("start to do user authenticate with basic token");

        if (StringUtils.isBlank(token)) {
            response401();
        }

        String[] tokenArr = StringUtils.split(token, " ");
        if (tokenArr.length != 2) {
            response401();
        }

        String[] requestPayload = StringUtils.split(new String(Base64Utils.decodeFromString(tokenArr[1])), ":");
        if (requestPayload.length != 2) {
            response401();
        }

        String username = requestPayload[0];
        String password = requestPayload[1];

        AuthenticationUserRepo authenticationUserRepo = userRepoStrategy.getAuthenticationUserRepo(username);

        log.info("find user repo for userId {} with basic token", username);

        AuthenticationResponseDto authenticationResponseDto = authenticationUserRepo.findUser(username, password);

        if (Objects.isNull(authenticationResponseDto)) {
            response401();
        }

        log.info("authenticate successfully for userId {} with basic token", username);
        return authenticationResponseDto;
    }

}
