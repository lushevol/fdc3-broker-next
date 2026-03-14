package com.scb.auth.login.service.authentication.repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.auth.login.dto.AuthenticationResponseDto;
import com.scb.auth.login.entity.UserInfo;
import com.scb.auth.login.entity.ratan.RatanEntitlement;
import com.scb.auth.login.exceptions.AuthServiceError;
import com.scb.auth.login.service.authentication.config.AuthenticationProperties;
import com.scb.ratan.commons.exception.RatanServiceException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jasypt.properties.PropertyValueEncryptionUtils;
import org.jasypt.util.text.BasicTextEncryptor;

@Slf4j
@AllArgsConstructor
public class RatanUserRepo implements AuthenticationUserRepo {

    private AuthenticationProperties authenticationProperties;
    private ObjectMapper objectMapper;

    @Override
    public AuthenticationResponseDto findUser(String username, String password) {
        log.info("start to find user info from ratan user repo for userId {}", username);

        for (AuthenticationProperties.RatanUser ratanUser : authenticationProperties.getUsers()) {
            if (ratanUser.getUsername().equals(username) && decode(ratanUser.getPassword(), authenticationProperties.getCipherKey())
                .equals(password)) {
                AuthenticationResponseDto authenticationResponseDto = new AuthenticationResponseDto();

                UserInfo userInfo = new UserInfo();
                userInfo.setUserId(username);

                authenticationResponseDto.setUserInfo(userInfo);
                try {
                    RatanEntitlement ratanEntitlement = new RatanEntitlement();
                    ratanUser.getActions().forEach(action -> ratanEntitlement.appendAction(action));
                    authenticationResponseDto.setEntitlement(objectMapper.writeValueAsString(ratanEntitlement));
                } catch (Exception ex) {
                    throw new RatanServiceException(AuthServiceError.ENTITLEMENT_FORBIDDEN_ERROR, ex.getMessage());
                }

                log.info("successfully find user info from ratan user repo for userId {}", username);
                return authenticationResponseDto;
            }
        }

        log.info("failed to find user info from ratan user repo for userId {}", username);
        return null;
    }

    private String decode(String password, String key) {
        if (PropertyValueEncryptionUtils.isEncryptedValue(password)) {
            BasicTextEncryptor encryptor = new BasicTextEncryptor();
            encryptor.setPassword(key);
            return PropertyValueEncryptionUtils.decrypt(password, encryptor);
        } else {
            return password;
        }
    }

}
