package com.scb.auth.login.service;

import static com.scb.auth.login.util.Constant.LIMIT_RETRY_OUD_TIMEOUT;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSON;
import com.scb.auth.login.dto.LoginResponseDto;
import com.scb.auth.login.entity.OUDAuthResult;
import com.scb.auth.login.exceptions.AuthServiceError;
import com.scb.auth.login.exceptions.AuthenticationException;
import com.scb.auth.login.exceptions.ExceptionConstant;
import com.scb.auth.login.util.Constant;
import com.scb.ratan.common.lib.ResponseCode;
import com.scb.ratan.commons.exception.RatanServiceException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class LoginService {

    private static final int OUD_LIMIT_TIMEOUT = 300;

    @Autowired
    private StringRedisTemplate stringRedisTemplate;
    @Autowired
    private OUDAuthBO authBO;
    @Autowired
    private Ems2EntitlementService ems2EntitlementService;

    public LoginResponseDto login(String username, String password) {
        if (StringUtils.isBlank(username) || StringUtils.isBlank(password)) {
            throw new AuthenticationException(HttpStatus.BAD_REQUEST, ResponseCode.FAIL,
                "Login failed, please enter valid username and password.");
        }

        if (!StringUtils.isNumeric(username) || StringUtils.length(username) != 7) {
            throw new AuthenticationException(HttpStatus.BAD_REQUEST, ResponseCode.FAIL,
                "Login failed, Invalid username, Non numeric values or wrong ids");
        }

        LoginResponseDto responseDto = new LoginResponseDto();
        OUDAuthResult authResult = null;

        checkOudTimeoutReachLimit();

        try {
            authResult = authBO.authenticate(username, password);
        } catch (Exception e) {
            log.error("authBO.authentication error in OUD application for username: {}, e: ", username, e);
        }

        if (authResult != null) {
            if (authResult.isSuccess()) {
                String token = UUID.randomUUID().toString();
                saveUserInfoToCacheForLogin(username, token);
                responseDto.setToken(token);
                responseDto.setUserInfo(authResult.getUserInfo());
                responseDto.setLastLoginTime(getUserLastLoginTime(username));

                try {
                    responseDto.setEntitlement(ems2EntitlementService.getEntitlementsByUserId(username));
                    Map entitlementMap = JSON.parseObject(responseDto.getEntitlement(), Map.class);
                    stringRedisTemplate.opsForValue().set(Constant.USER_ACTIONS + username, entitlementMap.get("actions").toString());
                    return responseDto;
                } catch (Exception ex) {

                    log.error("error occurred while fetching entitlement information username: {}, e: ", username, ex);

                    throw new AuthenticationException(HttpStatus.PRECONDITION_FAILED, ResponseCode.API_ERROR, ex.getMessage());
                }
            } else {
                String errorMsg = transformErrorMsg(authResult);
                calculateOudTimeout(authResult);
                if (StringUtils.isNotBlank(errorMsg)) {
                    throw new AuthenticationException(HttpStatus.BAD_REQUEST, ResponseCode.NOT_AUTHORIZED, errorMsg);
                } else {
                    throw new AuthenticationException(HttpStatus.BAD_REQUEST, ResponseCode.NOT_AUTHORIZED, authResult.getError());
                }

            }
        } else {
            log.error("AuthResult is null for username: {}, case should not happen", username);

            throw new AuthenticationException(HttpStatus.UNAUTHORIZED, ResponseCode.NOT_AUTHORIZED, "AuthResult is null");
        }
    }

    protected void calculateOudTimeout(OUDAuthResult authResult) {
        if (checkTimeout(authResult)) {

            if (stringRedisTemplate.hasKey(LIMIT_RETRY_OUD_TIMEOUT)) {
                Integer timeoutRetryTimes = Integer.parseInt(stringRedisTemplate.opsForValue().get(Constant.LIMIT_RETRY_OUD_TIMEOUT));

                log.warn("OUD connection timeoutRetryTimes: {}", timeoutRetryTimes);

                if (timeoutRetryTimes < 5) {
                    stringRedisTemplate.opsForValue().set(Constant.LIMIT_RETRY_OUD_TIMEOUT, String.valueOf(timeoutRetryTimes + 1),
                        OUD_LIMIT_TIMEOUT,
                        TimeUnit.SECONDS);
                    throw new RatanServiceException(AuthServiceError.OUD_RELATED_ERROR, ExceptionConstant.EXCEPTION_OUD_CONNECTION_TIMEOUT);
                } else {
                    throw new RatanServiceException(AuthServiceError.OUD_RELATED_ERROR,
                        ExceptionConstant.EXCEPTION_OUD_CONNECTION_TIMEOUT_LIMIT);
                }
            } else {
                stringRedisTemplate.opsForValue().set(Constant.LIMIT_RETRY_OUD_TIMEOUT, "1", OUD_LIMIT_TIMEOUT, TimeUnit.SECONDS);
                throw new AuthenticationException(HttpStatus.BAD_REQUEST, ResponseCode.NOT_AUTHORIZED,
                    ExceptionConstant.EXCEPTION_OUD_CONNECTION_TIMEOUT);
            }
        }
    }

    protected String transformErrorMsg(OUDAuthResult authResult) {
        if (authResult != null) {
            for (Map.Entry<String, String> entry : ExceptionConstant.EXCEPTION_MAP.entrySet()) {
                if (authResult.getError().contains(entry.getKey())) {
                    return entry.getValue();
                }
            }
        }
        return StringUtils.EMPTY;
    }

    private boolean checkTimeout(OUDAuthResult authResult) {
        if (authResult != null) {
            for (String error : ExceptionConstant.OUD_EXCEPTION_MAP.keySet()) {
                if (authResult.getError().contains(error)) {
                    return true;
                }
            }
        }
        return false;
    }

    protected void checkOudTimeoutReachLimit() {
        if (stringRedisTemplate.hasKey(Constant.LIMIT_RETRY_OUD_TIMEOUT)) {
            Integer timeoutRetryTimes = Integer.parseInt(stringRedisTemplate.opsForValue().get(Constant.LIMIT_RETRY_OUD_TIMEOUT));
            if (timeoutRetryTimes >= 5) {

                log.error(
                    "OUD connection timeout, Maximum retry attempts 5,authentication service will not send any requests to OUD in: {}s",
                    OUD_LIMIT_TIMEOUT);

                throw new RatanServiceException(AuthServiceError.OUD_RELATED_ERROR,
                    ExceptionConstant.EXCEPTION_OUD_CONNECTION_TIMEOUT_LIMIT);
            }
        }
    }

    protected Long getUserLastLoginTime(String username) {
        if (stringRedisTemplate.hasKey(Constant.LAST_LOGIN_TIME + username)) {
            String lastLoginTime = stringRedisTemplate.opsForValue().get(Constant.LAST_LOGIN_TIME + username);
            return Long.valueOf(lastLoginTime);
        }
        return System.currentTimeMillis();
    }

    private void saveUserInfoToCacheForLogin(String username, String token) {
        stringRedisTemplate.opsForValue().set(Constant.LAST_LOGIN_TIME + username, String.valueOf(System.currentTimeMillis()));
        stringRedisTemplate.opsForValue().set(Constant.TOKEN_KEY + token, username, Constant.SESSION_TIMEOUT, TimeUnit.MINUTES);
    }

    public LoginResponseDto loginV2(String username, String password) {
        if (StringUtils.isBlank(username) || StringUtils.isBlank(password)) {
            throw new RatanServiceException(AuthServiceError.INVALID_USERNAME_PWD_ERROR,
                "Login failed, please enter valid username and password.");
        }

        if (!StringUtils.isNumeric(username) || StringUtils.length(username) != 7) {
            throw new RatanServiceException(AuthServiceError.INVALID_USERNAME_PWD_FORMAT_ERROR,
                "Login failed, Invalid username, Non numeric values or wrong ids");
        }

        LoginResponseDto responseDto = new LoginResponseDto();
        OUDAuthResult authResult = null;
        try {
            checkOudTimeoutReachLimit();
            authResult = authBO.authenticate(username, password);
        } catch (Exception e) {

            log.error("authBO.authentication error in OUD application, username: {}, e:", username, e);

        }

        if (authResult != null) {

            if (authResult.isSuccess()) {

                String token = UUID.randomUUID().toString();
                saveUserInfoToCacheForLogin(username, token);
                responseDto.setToken(token);
                responseDto.setUserInfo(authResult.getUserInfo());
                responseDto.setLastLoginTime(getUserLastLoginTime(username));

                try {
                    responseDto.setEntitlement(ems2EntitlementService.getEntitlementsByUserId(username));

                    Map entitlementMap = JSON.parseObject(responseDto.getEntitlement(), Map.class);
                    stringRedisTemplate.opsForValue().set(Constant.USER_ACTIONS + username, entitlementMap.get("actions").toString());
                    return responseDto;
                } catch (Exception ex) {

                    log.error("exception occurred while get ems2 result, username: {}, e:", username, ex);

                    throw new RatanServiceException(AuthServiceError.ENTITLEMENT_CONFIG_ERROR, ex.getMessage(), ex);
                }
            } else {
                String errorMsg = transformErrorMsg(authResult);
                calculateOudTimeout(authResult);
                if (StringUtils.isNotBlank(errorMsg)) {
                    throw new RatanServiceException(AuthServiceError.OUD_RELATED_ERROR, errorMsg);
                } else {
                    throw new RatanServiceException(AuthServiceError.OUD_RELATED_ERROR, authResult.getError());
                }

            }
        } else {

            log.error("AuthResult is null, case should not happen, username: {}", username);

            throw new RatanServiceException(AuthServiceError.INVALID_USERNAME_PWD_ERROR,
                "Login failed, please enter valid username and password.");
        }
    }

}
