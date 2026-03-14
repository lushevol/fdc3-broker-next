package com.scb.auth.login.service.authentication;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.auth.login.dto.AuthenticationResponseDto;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.redis.core.StringRedisTemplate;

import java.util.Objects;

import static com.scb.auth.login.util.Constant.TOKEN_BAK_KEY;
import static com.scb.auth.login.util.Constant.TOKEN_KEY;
import static com.scb.auth.login.util.Constant.USER_INFO;

@Slf4j
@Data
@NoArgsConstructor
public class AccessTokenAuthentication implements Authentication {

    private StringRedisTemplate stringRedisTemplate;
    private ObjectMapper objectMapper;
    private String token;

    @Override
    public AuthenticationResponseDto authenticate() {
        log.info("start to do user authenticate with x-token");
        String userId = getUserId(token);

        if (StringUtils.isBlank(userId)) {
            response401();
        }

        log.info("find userId {} by x-token", userId);

        String userInfo = stringRedisTemplate.opsForValue().get(USER_INFO + userId);

        if (StringUtils.isBlank(userInfo)) {
            response401();
        }

        AuthenticationResponseDto authenticationResponseDto = null;

        try {
            authenticationResponseDto = objectMapper.readValue(userInfo, AuthenticationResponseDto.class);
        } catch (JsonProcessingException e) {
            log.warn("user info parse error for userId {}, error message {}, userInfo {}", userId, e.getMessage(), userInfo);
        }

        if (Objects.isNull(authenticationResponseDto)) {
            response401();
        }

        log.info("authenticate successfully for userId {} with x-token", userId);
        return authenticationResponseDto;
    }

    private String getUserId(String token) {
        if (StringUtils.isBlank(token)) {
            return null;
        }
        String userId = stringRedisTemplate.opsForValue().get(TOKEN_KEY + token);
        if (StringUtils.isNotBlank(userId)) {
            return userId;
        } else {
            userId = stringRedisTemplate.opsForValue().get(TOKEN_BAK_KEY + token);
            if (StringUtils.isNotBlank(userId)) {
                return userId;
            } else {
                return null;
            }
        }
    }

}
