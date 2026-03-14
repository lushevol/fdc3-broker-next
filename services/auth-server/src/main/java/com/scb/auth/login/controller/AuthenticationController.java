package com.scb.auth.login.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.auth.login.dto.AuthenticationResponseDto;
import com.scb.auth.login.entity.UserInfo;
import com.scb.auth.login.entity.ratan.RatanEntitlement;
import com.scb.auth.login.exceptions.AuthServiceError;
import com.scb.auth.login.jwtparser.JwtParserCoordinator;
import com.scb.auth.login.jwtparser.convertor.JwtConvertor;
import com.scb.auth.login.service.Ems2EntitlementService;
import com.scb.auth.login.service.FMAAAuthService;
import com.scb.auth.login.service.KongGatewayAuthService;
import com.scb.auth.login.service.authentication.AuthenticationService;
import com.scb.fmaa.client.oauth2.ValidationResponse;
import com.scb.fmoportal.auth.util.JwtTokenUtil;
import com.scb.ratan.commons.RatanErrors;
import com.scb.ratan.commons.exception.RatanServiceException;
import com.scb.ratan.context.RatanApiContextHolder;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Enumeration;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

import static com.scb.auth.login.util.Constant.X_TOKEN;

@Slf4j
@RestController
public class AuthenticationController {

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private JwtParserCoordinator jwtParserCoordinator;

    @Autowired
    Ems2EntitlementService ems2EntitlementService;
    @Autowired
    FMAAAuthService fmaaAuthService;
    @Autowired
    KongGatewayAuthService kongGatewayAuthService;

    @Autowired
    private ObjectMapper objectMapper;

    public static final String HEADER_JWT_TOKEN = "Single-UI-Authorization";

    private static final String HEADER_JWT_TOKEN_VALUE_PREFIX = "Bearer ";

    private static final String HEADER_FMAA_JWT_TOKEN = "FMAA-Token";
    public static final String HEADER_FMAA_USER_ID = "FMAA-UserId";
    public static final String HEADER_FMAA_APP_ID = "FMAA-AppId";
    public static final String HEADER_BANK_ID = "Bank-Id";

    @PostMapping(path = "/v3/authenticate")
    public ResponseEntity<AuthenticationResponseDto> authenticate(HttpServletRequest httpServletRequest) {

        log.info("RatanApiContextHolder values: {} ", RatanApiContextHolder.getContext().values());

        Enumeration<String> names = httpServletRequest.getHeaderNames();
        while (names.hasMoreElements()) {
            String name = names.nextElement();
            log.info("get header key {} with value {}", name, httpServletRequest.getHeader(name));

        }

        if (StringUtils.isNotBlank(httpServletRequest.getHeader(X_TOKEN))) {

            AuthenticationResponseDto authenticationResponseDto = authenticationService.authenticate(httpServletRequest);
            return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(authenticationResponseDto);

        } else if (StringUtils.isNotBlank(httpServletRequest.getHeader(HEADER_JWT_TOKEN))) {

            String originalToken = retrieveHeaderToken(httpServletRequest.getHeader(HEADER_JWT_TOKEN));

            Optional<String> originalUserInfo = JwtTokenUtil.validateToken(originalToken);

            if (!originalUserInfo.isPresent()) {
                throw new RatanServiceException(RatanErrors.SERVICE_INTERNAL_ERROR,
                    "original user information is not retrieved from token, need check");
            }

            JwtConvertor.JwtConvertorResponse jwtConvertorResponse = convertUserResponse(originalUserInfo.get());

            return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(innerConvert(jwtConvertorResponse));
        } else if (StringUtils.isNotBlank(httpServletRequest.getHeader(HEADER_FMAA_JWT_TOKEN))) {
            log.info("Get FMAA_JWT_TOKEN from header will handle it. ");
            String fmaaToken = httpServletRequest.getHeader(HEADER_FMAA_JWT_TOKEN);
            String userId = httpServletRequest.getHeader(HEADER_FMAA_USER_ID);
            String appId = httpServletRequest.getHeader(HEADER_FMAA_APP_ID);
            String bankUserId = httpServletRequest.getHeader(HEADER_BANK_ID);

            log.info("will check token info with FMAA with FMAAToken {} , userId {}, appId {}, bankUserId {}", fmaaToken, userId, appId,
                bankUserId);

            ValidationResponse validationResponse = fmaaAuthService.authTokenWithFMAA(fmaaToken, userId, appId);
            log.info("check token info with FMAA, then get {}", validationResponse.toString());
            if (validationResponse.isActive()) {

                String userIdfromFMAA = validationResponse.getUserId();
                RatanEntitlement ratanEntitlement = new RatanEntitlement();
                try {

                    ratanEntitlement = ems2EntitlementService.getSysAccountEntitlementByUserId(userIdfromFMAA);

                    log.info("get auth info from EMS2  {}", ratanEntitlement);

                    if (StringUtils.isNotBlank(bankUserId)) {

                        RatanEntitlement userDataEntitlementRoles = ems2EntitlementService.queryDataEntitlementRoles(bankUserId);

                        log.info("get userDataEntitlementRoles for bankUserId {} info from EMS2  {}", bankUserId, userDataEntitlementRoles);

                        ratanEntitlement.setDataEntitlementRoles(userDataEntitlementRoles.getDataEntitlementRoles());

                    }

                    return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON)
                        .body(convertFMAAAuthResponse(validationResponse, bankUserId, ratanEntitlement));

                } catch (Exception ex) {
                    log.error("get auth info from EMS2 Error {}", ex.getMessage());
                    throw new RatanServiceException(AuthServiceError.ENTITLEMENT_CONFIG_ERROR, ex.getMessage(), ex);
                }
            } else {
                AuthenticationResponseDto authenticationResponseDto = new AuthenticationResponseDto();
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(authenticationResponseDto);

            }
        }

        AuthenticationResponseDto authenticationResponseDto = authenticationService.authenticate(httpServletRequest);

        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(authenticationResponseDto);
    }

    private AuthenticationResponseDto innerConvert(JwtConvertor.JwtConvertorResponse jwtConvertorResponse) {

        if (Objects.isNull(jwtConvertorResponse)) {
            return null;
        }

        AuthenticationResponseDto responseDto = new AuthenticationResponseDto();
        responseDto.setUserInfo(jwtConvertorResponse.getUserInfo());
        responseDto.setEntitlement(jwtConvertorResponse.getEntitlement());
        return responseDto;
    }

    private JwtConvertor.JwtConvertorResponse convertUserResponse(String originalUserInfo) {

        return jwtParserCoordinator.convertUserResponse(originalUserInfo);
    }

    private String retrieveHeaderToken(String inputHeaderValue) {

        if (!org.springframework.util.StringUtils.hasLength(inputHeaderValue)) {
            throw new RuntimeException("TOKEN_INVALID_EXPIRED", new Error("Invalid format"));
        }

        String[] headerValue = inputHeaderValue.split(HEADER_JWT_TOKEN_VALUE_PREFIX);
        if (headerValue.length == 2) {
            return headerValue[1];
        }
        throw new RuntimeException("TOKEN_INVALID_EXPIRED", new Error("Invalid format"));
    }

    private AuthenticationResponseDto convertFMAAAuthResponse(ValidationResponse validate, String bankUserId,
        RatanEntitlement ratanEntitlement) throws JsonProcessingException {
        if (validate == null) {
            return null;
        }
        String result = objectMapper.writeValueAsString(ratanEntitlement);
        UserInfo userInfoResponse = new UserInfo();
        userInfoResponse.setUserId(bankUserId);
        userInfoResponse.setFullName(validate.getUserId());

        AuthenticationResponseDto responseDto = new AuthenticationResponseDto();
        responseDto.setUserInfo(userInfoResponse);

        responseDto.setEntitlement(result);
        return responseDto;

    }

    @GetMapping("v3/token")
    public ResponseEntity<String> getFmaaToken() throws Exception {

        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(fmaaAuthService.getFmaaToken());
    }

    @GetMapping("v3/kong/token")
    public ResponseEntity<String> getKongToken() throws Exception {
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(kongGatewayAuthService.fetchAccessToken());
    }

}
