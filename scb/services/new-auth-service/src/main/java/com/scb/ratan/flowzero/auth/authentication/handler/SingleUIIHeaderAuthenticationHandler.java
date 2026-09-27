package com.scb.ratan.flowzero.auth.authentication.handler;

import com.scb.fmoportal.auth.util.JwtTokenUtil;
import com.scb.ratan.commons.exception.RatanServiceException;
import com.scb.ratan.flowzero.auth.constant.AuthServiceErrorEnum;
import com.scb.ratan.flowzero.auth.entity.dto.AuthenticationResponseDto;
import com.scb.ratan.flowzero.auth.jwtparser.JwtParserCoordinator;
import com.scb.ratan.flowzero.auth.jwtparser.convertor.JwtConvertor;
import com.scb.ratan.flowzero.auth.constant.AuthConstant;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;

import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
public class SingleUIIHeaderAuthenticationHandler implements IHeaderAuthenticationHandler {

    private final JwtParserCoordinator jwtParserCoordinator;

    @Override
    public boolean supports(Map<String, String> headers) {
        return headers.keySet().stream()
            .anyMatch(key -> StringUtils.isNotBlank(key) && AuthConstant.HEADER_KEY_SINGLE_UI_AUTHORIZATION.equalsIgnoreCase(key));
    }

    @Override
    public AuthenticationResponseDto authenticate(Map<String, String> headers) {

        String singleUiHeaderValue = getSingleUIHeader(headers);

        String originalJwtToken = retrieveJwtToken(singleUiHeaderValue);

        Optional<String> originalUserInfo = JwtTokenUtil.validateToken(originalJwtToken);

        if (originalUserInfo.isEmpty()) {
            throw new RatanServiceException(AuthServiceErrorEnum.INVALID_TOKEN,
                "original user information is not retrieved from token");
        }

        JwtConvertor.JwtConvertorResponse jwtConvertorResponse = jwtParserCoordinator.convertUserResponse(originalUserInfo.get());
        return innerConvert(jwtConvertorResponse);
    }

    private String getSingleUIHeader(Map<String, String> headers) {

        for (Map.Entry<String, String> entry : headers.entrySet()) {
            if (entry.getKey() != null && AuthConstant.HEADER_KEY_SINGLE_UI_AUTHORIZATION.equalsIgnoreCase(entry.getKey())) {
                return entry.getValue();
            }
        }

        return null;
    }

    private AuthenticationResponseDto innerConvert(JwtConvertor.JwtConvertorResponse jwtConvertorResponse) {

        if (Objects.isNull(jwtConvertorResponse)) {
            log.warn("JwtConvertorResponse is null, cannot convert to AuthenticationResponseDto");
            return null;
        }

        AuthenticationResponseDto responseDto = new AuthenticationResponseDto();
        responseDto.setUserInfo(jwtConvertorResponse.getUserInfo());
        responseDto.setEntitlement(jwtConvertorResponse.getEntitlement());

        return responseDto;
    }

    private String retrieveJwtToken(String inputHeaderValue) {

        if (StringUtils.isBlank(inputHeaderValue)) {
            throw new RatanServiceException(AuthServiceErrorEnum.INVALID_TOKEN, "Token is empty or null");
        }

        if (inputHeaderValue.startsWith(AuthConstant.HEADER_TOKEN_PREFIX)) {
            return inputHeaderValue.substring(AuthConstant.HEADER_TOKEN_PREFIX.length());
        }

        throw new RatanServiceException(AuthServiceErrorEnum.INVALID_TOKEN, "Invalid token format");
    }

}
