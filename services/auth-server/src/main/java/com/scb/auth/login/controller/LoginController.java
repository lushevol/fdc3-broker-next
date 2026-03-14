package com.scb.auth.login.controller;

import static com.scb.auth.login.controller.AuthenticationController.HEADER_JWT_TOKEN;
import static com.scb.auth.login.util.Constant.SESSION_TIMEOUT;
import static com.scb.auth.login.util.Constant.SESSION_TIMEOUT_BAK;
import static com.scb.auth.login.util.Constant.TOKEN_BAK_KEY;
import static com.scb.auth.login.util.Constant.TOKEN_KEY;
import static com.scb.auth.login.util.Constant.USER_ACTIONS;
import static com.scb.auth.login.util.Constant.USER_INFO;
import static com.scb.auth.login.util.Constant.X_TOKEN;
import static java.util.stream.Collectors.toList;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.auth.login.dto.LoginResponseDto;
import com.scb.auth.login.exceptions.AuthServiceError;
import com.scb.auth.login.jwtparser.JwtParserCoordinator;
import com.scb.auth.login.jwtparser.convertor.JwtConvertor;
import com.scb.auth.login.service.LoginService;
import com.scb.fmoportal.auth.util.JwtTokenUtil;
import com.scb.ratan.common.lib.ApiRequest;
import com.scb.ratan.common.lib.ResponseCode;
import com.scb.ratan.commons.RatanErrors;
import com.scb.ratan.commons.exception.RatanServiceException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
public class LoginController extends BaseController {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private LoginService loginService;

    @Autowired
    private JwtParserCoordinator jwtParserCoordinator;

    /**
     * Provide the OUD authentication rest API with specified username and password
     */
    @PostMapping(value = "/v1/login", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> login(@RequestBody ApiRequest<Map<String, String>> requestBody, HttpServletResponse response,
        HttpServletRequest request) {

        String lastLoginToken = getToken(request);
        if (lastLoginToken != null) {
            stringRedisTemplate.delete(TOKEN_KEY + lastLoginToken);
        }

        Map<String, Object> result = new HashMap<>();
        Map<String, String> data = requestBody.getData();

        String username = data.get("username");
        String password = data.get("password");

        log.info("user is trying to login through /v1/login api, userId: {}", username);

        LoginResponseDto loginResponseDto = loginService.login(username, password);

        response.setHeader(X_TOKEN, loginResponseDto.getToken());

        result.put("userInfo", loginResponseDto.getUserInfo());
        result.put("entitlement", loginResponseDto.getEntitlement());
        result.put("lastLoginTime", loginResponseDto.getLastLoginTime());
        result.put("token", loginResponseDto.getToken());
        result.put("responseCode", ResponseCode.SUCCESS);

        stringRedisTemplate.opsForValue().set(USER_INFO + username,
            JSON.toJSONString(loginResponseDto, SerializerFeature.DisableCircularReferenceDetect));
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON)
            .body(JSON.toJSONString(result, SerializerFeature.DisableCircularReferenceDetect));
    }

    @PostMapping(value = "/v1/logout")
    ResponseEntity<String> logout(HttpServletRequest request) {
        String token = getToken(request);
        if (StringUtils.isNotBlank(token)) {
            stringRedisTemplate.delete(TOKEN_KEY + token);
        }
        Map<String, Object> result = new HashMap<>();
        result.put("responseCode", ResponseCode.SUCCESS);
        result.put("errorReason", "");

        log.info("user is trying to log out through /v1/logout api");

        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON)
            .body(JSON.toJSONString(result, SerializerFeature.DisableCircularReferenceDetect));
    }

    @PostMapping(value = "/v1/heartBeat")
    ResponseEntity<String> heartBeat(HttpServletRequest request, HttpServletResponse response) {
        String userId = getUserId(request);
        Map<String, Object> result = new HashMap<>();
        if (StringUtils.isBlank(userId)) {

            result.put("responseCode", ResponseCode.NOT_AUTHORIZED);
            result.put("errorReason", "User Session Timeout");
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_TYPE, "application/json");
            return new ResponseEntity<>(JSON.toJSONString(result, SerializerFeature.DisableCircularReferenceDetect), headers,
                HttpStatus.UNAUTHORIZED);
        }
        String token = getToken(request);
        if (token != null) {
            stringRedisTemplate.opsForValue().set(TOKEN_BAK_KEY + token, userId, SESSION_TIMEOUT_BAK, TimeUnit.SECONDS);
            stringRedisTemplate.delete(TOKEN_KEY + token);
        }
        String newToken = UUID.randomUUID().toString();
        stringRedisTemplate.opsForValue().set(TOKEN_KEY + newToken, userId, SESSION_TIMEOUT, TimeUnit.MINUTES);

        result.put("token", newToken);
        response.setHeader(X_TOKEN, newToken);
        result.put("responseCode", ResponseCode.SUCCESS);
        result.put("errorReason", "");
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON)
            .body(JSON.toJSONString(result, SerializerFeature.DisableCircularReferenceDetect));
    }

    @GetMapping(value = "/v1/user")
    public ResponseEntity<String> user(
        @RequestHeader(value = "Single-UI-Authorization", required = false) String jwtToken,
        @RequestParam(value = "xToken", defaultValue = "") String xToken,
        HttpServletRequest httpServletRequest) {

        if (StringUtils.isNotEmpty(jwtToken)) {

            String originalToken = retrieveHeaderToken(httpServletRequest.getHeader(HEADER_JWT_TOKEN));

            Optional<String> originalUserInfo = JwtTokenUtil.validateToken(originalToken);

            if (!originalUserInfo.isPresent()) {
                throw new RatanServiceException(RatanErrors.SERVICE_INTERNAL_ERROR, "user information is not retrieved, need check");
            }

            JwtConvertor.JwtConvertorResponse jwtConvertorResponse = convertUserResponse(originalUserInfo.get());

            return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(innerConvert(jwtConvertorResponse));

        }

        if (StringUtils.isNotEmpty(xToken)) {
            // X-Token is 2nd priority
            String userId = getUserId(xToken);

            log.info("now checking with xToken, userId: {}", userId);

            if (StringUtils.isBlank(userId)) {

                return buildUnAuthorizedResponse();

            } else {
                String userInfoPreviousMethod = stringRedisTemplate.opsForValue().get(USER_INFO + userId);
                return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(userInfoPreviousMethod);
            }
        }

        return buildUnAuthorizedResponse();
    }

    private String innerConvert(JwtConvertor.JwtConvertorResponse jwtConvertorResponse) {

        if (Objects.isNull(jwtConvertorResponse)) {
            log.error("nothing converted from jwt token, need check!");
            return null;
        }

        try {

            LoginResponseDto dto = new LoginResponseDto();

            dto.setUserInfo(jwtConvertorResponse.getUserInfo());
            dto.setEntitlement(jwtConvertorResponse.getEntitlement());

            return objectMapper.writeValueAsString(dto);
        } catch (Exception e) {
            log.error("error occurred, need check, e", e);
            return null;
        }

    }

    private JwtConvertor.JwtConvertorResponse convertUserResponse(String originalUserInfo) {

        return jwtParserCoordinator.convertUserResponse(originalUserInfo);
    }

    private String retrieveHeaderToken(String inputHeaderValue) {

        if (!org.springframework.util.StringUtils.hasLength(inputHeaderValue)) {
            return "";
        }

        String[] headerValue = inputHeaderValue.split("Bearer ");

        if (headerValue.length == 2) {
            return headerValue[1];
        }

        return "";
    }

    private ResponseEntity<String> buildUnAuthorizedResponse() {

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, "application/json");
        Map<String, Object> result = new HashMap<>();
        result.put("responseCode", ResponseCode.NOT_AUTHORIZED);
        result.put("errorReason", "NOT_AUTHORIZED");
        return new ResponseEntity<>(JSON.toJSONString(result, SerializerFeature.DisableCircularReferenceDetect), headers,
            HttpStatus.FORBIDDEN);
    }

    @GetMapping(value = "/v1/userInfo")
    public ResponseEntity<String> user(HttpServletRequest request) {

        String userId = getUserId(request);
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, "application/json");
        Map<String, Object> result = new HashMap<>();
        if (StringUtils.isBlank(userId)) {
            result.put("responseCode", ResponseCode.NOT_AUTHORIZED);
            result.put("errorReason", "NOT_AUTHORIZED");
            return new ResponseEntity<>(JSON.toJSONString(result, SerializerFeature.DisableCircularReferenceDetect), headers,
                HttpStatus.FORBIDDEN);
        } else {
            String userInfo = stringRedisTemplate.opsForValue().get(USER_INFO + userId);
            return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(userInfo);
        }
    }

    @GetMapping(value = "/v1/validateUser")
    public ResponseEntity<Map<String, Object>> fetchUserInfo(
        @RequestParam(value = "includeUserInfo", required = false, defaultValue = "false") Boolean includeUserInfo,
        HttpServletRequest request) throws JsonProcessingException {
        String token = request.getHeader(X_TOKEN);

        if (StringUtils.isBlank(token)) {
            throw new RatanServiceException(AuthServiceError.INVALID_TOKEN);
        }

        Map<String, Object> responseMap = new HashMap<>();
        String userId = getUserId(token);

        log.info("user is trying validate through api v1/validateUser, userId: {}", userId);

        if (StringUtils.isNotBlank(userId)) {
            responseMap.put("validUser", Boolean.TRUE);

            if (Boolean.TRUE.equals(includeUserInfo)) {
                String userInfo = stringRedisTemplate.opsForValue().get(USER_INFO + userId);
                LoginResponseDto loginResponseDto = objectMapper.readValue(userInfo, LoginResponseDto.class);
                responseMap.put("userInfo", loginResponseDto.getUserInfo());
            }
        } else {
            responseMap.put("validUser", Boolean.FALSE);
        }

        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(responseMap);
    }

    /**
     * Provide the EMS2 authorization rest API with specified username and password
     */
    @PostMapping(value = "/v1/authenticate")
    ResponseEntity<String> authenticate(HttpServletRequest request,
        @RequestBody Map<String, List> action) {
        String userId = getUserId(request);
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, "application/json");
        Map<String, Object> result = new HashMap<>();
        if (StringUtils.isBlank(userId)) {
            result.put("responseCode", ResponseCode.NOT_AUTHORIZED);
            result.put("errorReason", "User Session Timeout");
            return new ResponseEntity<>(JSON.toJSONString(result, SerializerFeature.DisableCircularReferenceDetect), headers,
                HttpStatus.UNAUTHORIZED);
        }

        log.info("user is trying authenticate through api Post /v1/authenticate, userId: {}", userId);

        if (action != null && action.size() > 0) {
            List actionForCheck = action.get("action");
            Object obj = stringRedisTemplate.opsForValue().get(USER_ACTIONS + userId);
            List userActionList = JSON.parseObject(obj.toString(), List.class);

            List intersection = (List) actionForCheck.stream().filter(item -> userActionList.contains(item)).collect(toList());

            if (intersection != null && intersection.size() > 0) {
                result.put("result", true);
            } else {
                result.put("responseCode", ResponseCode.NOT_AUTHORIZED);
                result.put("errorReason", "User Session Timeout");
                return new ResponseEntity<>(JSON.toJSONString(result, SerializerFeature.DisableCircularReferenceDetect), headers,
                    HttpStatus.FORBIDDEN);
            }
            return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON)
                .body(JSON.toJSONString(result, SerializerFeature.DisableCircularReferenceDetect));
        } else {
            result.put("responseCode", ResponseCode.NOT_AUTHORIZED);
            result.put("errorReason", "User Session Timeout");
            return new ResponseEntity<>(JSON.toJSONString(result, SerializerFeature.DisableCircularReferenceDetect), headers,
                HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping(value = "/v1/authenticate")
    public ResponseEntity<String> auth(HttpServletRequest request) {
        String userId = getUserId(request);
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, "application/json");
        Map<String, Object> result = new HashMap<>();
        if (StringUtils.isBlank(userId)) {
            result.put("responseCode", ResponseCode.SESSION_EXPIRED);
            result.put("errorReason", "User Session Timeout");
            return new ResponseEntity(JSON.toJSONString(result, SerializerFeature.DisableCircularReferenceDetect), headers,
                HttpStatus.UNAUTHORIZED);
        } else {

            log.info("user is trying authenticate through api Get /v1/authenticate, userId: {}", userId);

            String userInfo = stringRedisTemplate.opsForValue().get(USER_INFO + userId);
            return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(userInfo);
        }
    }

}
