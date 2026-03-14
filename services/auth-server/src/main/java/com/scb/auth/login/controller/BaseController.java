package com.scb.auth.login.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;

import static com.scb.auth.login.util.Constant.TOKEN_BAK_KEY;
import static com.scb.auth.login.util.Constant.TOKEN_KEY;
import static com.scb.auth.login.util.Constant.X_TOKEN;

/**
 * Created by 1604522 on 6/23/2020.
 */
public class BaseController {

    @Autowired
    protected StringRedisTemplate stringRedisTemplate;

    protected String getUserId(HttpServletRequest request) {
        String token = request.getHeader(X_TOKEN);
        return getUserId(token);
    }

    protected String getUserId(String token) {
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

    protected String getToken(HttpServletRequest request) {
        String token = request.getHeader(X_TOKEN);
        return token;
    }

}
