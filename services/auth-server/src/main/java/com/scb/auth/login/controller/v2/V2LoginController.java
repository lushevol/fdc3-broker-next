package com.scb.auth.login.controller.v2;

import static com.scb.auth.login.util.Constant.SESSION_TIMEOUT;
import static com.scb.auth.login.util.Constant.SESSION_TIMEOUT_BAK;
import static com.scb.auth.login.util.Constant.TOKEN_BAK_KEY;
import static com.scb.auth.login.util.Constant.TOKEN_KEY;
import static com.scb.auth.login.util.Constant.USER_ACTIONS;
import static com.scb.auth.login.util.Constant.USER_INFO;
import static com.scb.auth.login.util.Constant.X_TOKEN;
import static java.util.stream.Collectors.toList;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.scb.auth.login.controller.BaseController;
import com.scb.auth.login.dto.LoginResponseDto;
import com.scb.auth.login.entity.AuthEntity;
import com.scb.auth.login.exceptions.AuthServiceError;
import com.scb.auth.login.service.LoginService;
import com.scb.ratan.commons.exception.RatanServiceException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
public class V2LoginController extends BaseController {

    @Autowired
    private LoginService loginService;

    @PostMapping(value = "/v2/login")
    public ResponseEntity<AuthEntity> loginV2(@RequestBody Map<String, String> requestBody, HttpServletResponse response,
        HttpServletRequest request) {

        String lastLoginToken = getToken(request);
        if (lastLoginToken != null) {
            stringRedisTemplate.delete(TOKEN_KEY + lastLoginToken);
        }

        String username = requestBody.get("username");
        String password = requestBody.get("password");

        log.info("username: {} is trying to login with /v2/login", username);

        LoginResponseDto loginResponseDto = loginService.loginV2(username, password);

        response.setHeader(X_TOKEN, loginResponseDto.getToken());

        AuthEntity authEntity = new AuthEntity();
        authEntity.setUserInfo(loginResponseDto.getUserInfo());
        authEntity.setEntitlement(loginResponseDto.getEntitlement());
        authEntity.setLastLoginTime(loginResponseDto.getLastLoginTime());
        authEntity.setToken(loginResponseDto.getToken());

        stringRedisTemplate.opsForValue().set(USER_INFO + username,
            JSON.toJSONString(loginResponseDto, SerializerFeature.DisableCircularReferenceDetect));

        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(authEntity);
    }

    @PostMapping(value = "/v2/logout")
    ResponseEntity<AuthEntity> logoutV2(HttpServletRequest request) {

        String token = getToken(request);

        log.info("token: {} is trying to login with /v2/logout", token);

        if (StringUtils.isNotBlank(token)) {
            stringRedisTemplate.delete(TOKEN_KEY + token);
        }
        AuthEntity authEntity = new AuthEntity();

        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(authEntity);
    }

    @PostMapping(value = "/v2/heartBeat")
    ResponseEntity<AuthEntity> heartBeatV2(HttpServletRequest request, HttpServletResponse response) {

        String userId = getUserId(request);

        log.info("userId: {} is trying to do /v2/heartBeat", userId);

        if (StringUtils.isBlank(userId)) {
            throw new RatanServiceException(AuthServiceError.AUTHORIZE_ERROR, "User Session Timeout");
        }
        String token = getToken(request);
        if (token != null) {
            stringRedisTemplate.opsForValue().set(TOKEN_BAK_KEY + token, userId, SESSION_TIMEOUT_BAK, TimeUnit.SECONDS);
            stringRedisTemplate.delete(TOKEN_KEY + token);
        }
        String newToken = UUID.randomUUID().toString();
        stringRedisTemplate.opsForValue().set(TOKEN_KEY + newToken, userId, SESSION_TIMEOUT, TimeUnit.MINUTES);

        response.setHeader(X_TOKEN, newToken);
        AuthEntity authEntity = new AuthEntity();
        authEntity.setToken(newToken);

        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(authEntity);
    }

    @GetMapping(value = "/v2/user")
    public ResponseEntity<String> userV2(@RequestParam(value = "xToken", defaultValue = "") String xToken) {

        String userId = getUserId(xToken);

        log.info("userId: {} is trying to do /v2/user", userId);

        if (StringUtils.isBlank(userId)) {
            throw new RatanServiceException(AuthServiceError.NOT_AUTHORIZED_ERROR, "NOT_AUTHORIZED");
        } else {
            String userInfo = stringRedisTemplate.opsForValue().get(USER_INFO + userId);
            return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(userInfo);
        }
    }

    @GetMapping(value = "/v2/userInfo")
    public ResponseEntity<String> userV2(HttpServletRequest request) {

        String userId = getUserId(request);

        log.info("userId: {} is trying to do /v2/userInfo", userId);

        if (StringUtils.isBlank(userId)) {
            throw new RatanServiceException(AuthServiceError.NOT_AUTHORIZED_ERROR, "NOT_AUTHORIZED");
        } else {
            String userInfo = stringRedisTemplate.opsForValue().get(USER_INFO + userId);
            return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(userInfo);
        }
    }

    /**
     * Provide the EMS2 authorization rest API with specified username and password
     */
    @PostMapping(value = "/v2/authenticate")
    ResponseEntity<AuthEntity> authenticateV2(HttpServletRequest request,
        @RequestBody Map<String, List> action) {
        String userId = getUserId(request);

        log.info("userId: {} is trying to do POST /v2/authenticate", userId);

        if (StringUtils.isBlank(userId)) {
            throw new RatanServiceException(AuthServiceError.NOT_AUTHORIZED_ERROR, "User Session Timeout");
        }

        if (action != null && action.size() > 0) {
            List actionForCheck = action.get("action");
            Object obj = stringRedisTemplate.opsForValue().get(USER_ACTIONS + userId);
            List userActionList = JSON.parseObject(obj.toString(), List.class);

            List intersection = (List) actionForCheck.stream().filter(item -> userActionList.contains(item)).collect(toList());
            AuthEntity authEntity = new AuthEntity();
            if (intersection != null && intersection.size() > 0) {
                authEntity.setResult(true);
            } else {
                throw new RatanServiceException(AuthServiceError.ENTITLEMENT_FORBIDDEN_ERROR, "No entitlement setting in EMS2");
            }
            return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(authEntity);
        } else {
            throw new RatanServiceException(AuthServiceError.ENTITLEMENT_FORBIDDEN_ERROR, "No entitlement setting in EMS2");
        }
    }

    @GetMapping(value = "/v2/authenticate")
    public ResponseEntity<String> authV2(HttpServletRequest request) {
        String userId = getUserId(request);

        log.info("userId: {} is trying to do GET /v2/authenticate", userId);

        if (StringUtils.isBlank(userId)) {
            throw new RatanServiceException(AuthServiceError.NOT_AUTHORIZED_ERROR, "User Session Timeout");
        } else {
            String userInfo = stringRedisTemplate.opsForValue().get(USER_INFO + userId);
            return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(userInfo);
        }
    }

}
