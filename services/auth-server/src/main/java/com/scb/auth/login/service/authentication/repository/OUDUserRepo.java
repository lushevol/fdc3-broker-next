package com.scb.auth.login.service.authentication.repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.auth.login.dto.AuthenticationResponseDto;
import com.scb.auth.login.entity.OUDAuthResult;
import com.scb.auth.login.exceptions.AuthServiceError;
import com.scb.auth.login.exceptions.ExceptionConstant;
import com.scb.auth.login.service.Ems2EntitlementService;
import com.scb.auth.login.service.OUDAuthBO;
import com.scb.auth.login.util.Constant;
import com.scb.ratan.commons.exception.RatanServiceException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.redis.core.StringRedisTemplate;

import java.util.Map;
import java.util.concurrent.TimeUnit;

import static com.scb.auth.login.util.Constant.LIMIT_RETRY_OUD_TIMEOUT;

@Slf4j
@AllArgsConstructor
public class OUDUserRepo implements AuthenticationUserRepo {

    private static final int OUD_LIMIT_TIMEOUT = 300;

    private OUDAuthBO authBO;
    private Ems2EntitlementService ems2EntitlementService;
    private StringRedisTemplate stringRedisTemplate;
    private ObjectMapper objectMapper;

    @Override
    public AuthenticationResponseDto findUser(String username, String password) {
        log.info("start to find user info from OUD for userId {}", username);

        AuthenticationResponseDto responseDto = new AuthenticationResponseDto();

        OUDAuthResult authResult = null;

        checkOudTimeoutReachLimit();

        try {
            authResult = authBO.sysAccountAuthenticate(username, password);
        } catch (Exception e) {
            log.error("authBO.authentication error in OUD application. userId: {}, error message:{}", username, e.getLocalizedMessage());
        }

        if (authResult != null) {
            if (authResult.isSuccess()) {
                responseDto.setUserInfo(authResult.getUserInfo());

                try {
                    responseDto
                        .setEntitlement(
                            objectMapper.writeValueAsString(ems2EntitlementService.getSysAccountEntitlementByUserId(username)));
                    return responseDto;
                } catch (Exception ex) {
                    log.error("get user emtitlement error {}, userId: {}", ex.getLocalizedMessage(), username);
                    throw new RatanServiceException(AuthServiceError.ENTITLEMENT_FORBIDDEN_ERROR, ex.getMessage());
                }
            } else {
                String errorMsg = transformErrorMsg(authResult);

                calculateOudTimeout(authResult);

                if (StringUtils.isNotBlank(errorMsg)) {
                    throw new RatanServiceException(AuthServiceError.AUTHORIZE_ERROR, errorMsg);
                } else
                    throw new RatanServiceException(AuthServiceError.AUTHORIZE_ERROR, authResult.getError());
            }
        } else {
            log.error("AuthResult is null, userId: {}", username);
            throw new RatanServiceException(AuthServiceError.AUTHORIZE_ERROR, "AuthResult is null");
        }
    }

    private void checkOudTimeoutReachLimit() {
        if (stringRedisTemplate.hasKey(Constant.LIMIT_RETRY_OUD_TIMEOUT)) {
            Integer timeoutRetryTimes = Integer.parseInt(stringRedisTemplate.opsForValue().get(Constant.LIMIT_RETRY_OUD_TIMEOUT));
            if (timeoutRetryTimes >= 5) {
                log.error(
                    "OUD connection timeout, Maximum retry attempts 5,authentication service will not send any requests to OUD in {}s",
                    OUD_LIMIT_TIMEOUT);
                throw new RatanServiceException(AuthServiceError.AUTHORIZE_ERROR,
                    ExceptionConstant.EXCEPTION_OUD_CONNECTION_TIMEOUT_LIMIT);
            }
        }
    }

    private String transformErrorMsg(OUDAuthResult authResult) {
        if (authResult != null) {

            for (Map.Entry<String, String> entry : ExceptionConstant.EXCEPTION_MAP.entrySet()) {
                if (authResult.getError().contains(entry.getKey())) {
                    return entry.getValue();
                }
            }
        }
        return StringUtils.EMPTY;
    }

    protected void calculateOudTimeout(OUDAuthResult authResult) {
        if (checkTimeout(authResult)) {

            if (stringRedisTemplate.hasKey(LIMIT_RETRY_OUD_TIMEOUT)) {
                Integer timeoutRetryTimes = Integer.parseInt(stringRedisTemplate.opsForValue().get(Constant.LIMIT_RETRY_OUD_TIMEOUT));
                log.error("OUD connection timeoutRetryTimes: {}", timeoutRetryTimes);
                if (timeoutRetryTimes < 5) {
                    stringRedisTemplate.opsForValue().set(Constant.LIMIT_RETRY_OUD_TIMEOUT, String.valueOf(timeoutRetryTimes + 1),
                        OUD_LIMIT_TIMEOUT,
                        TimeUnit.SECONDS);
                    throw new RatanServiceException(AuthServiceError.AUTHORIZE_ERROR, ExceptionConstant.EXCEPTION_OUD_CONNECTION_TIMEOUT);
                } else {
                    throw new RatanServiceException(AuthServiceError.AUTHORIZE_ERROR,
                        ExceptionConstant.EXCEPTION_OUD_CONNECTION_TIMEOUT_LIMIT);
                }
            } else {
                stringRedisTemplate.opsForValue().set(Constant.LIMIT_RETRY_OUD_TIMEOUT, "1", OUD_LIMIT_TIMEOUT, TimeUnit.SECONDS);
                throw new RatanServiceException(AuthServiceError.AUTHORIZE_ERROR, ExceptionConstant.EXCEPTION_OUD_CONNECTION_TIMEOUT);
            }
        }
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

}
