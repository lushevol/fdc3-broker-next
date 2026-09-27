package com.scb.ratan.flowzero.auth.authentication;

import com.scb.ratan.commons.exception.RatanServiceException;
import com.scb.ratan.flowzero.auth.constant.AuthErrorEnum;
import com.scb.ratan.flowzero.auth.authentication.handler.AuthenticationHandlerResolver;
import com.scb.ratan.flowzero.auth.entity.dto.AuthenticationPayloadDto;
import com.scb.ratan.flowzero.auth.entity.dto.AuthenticationResponseDto;
import com.scb.ratan.flowzero.auth.entity.dto.UserEntitlementDto;
import com.scb.ratan.flowzero.auth.entity.dto.UserInfoDto;
import com.scb.ratan.flowzero.auth.exceptions.AuthenticationException;
import com.scb.ratan.flowzero.auth.constant.AuthConstant;
import com.scb.ratan.flowzero.auth.util.RatanObjectMapper;
import com.scb.ratan.flowzero.auth.util.RatanServerWebExchangeUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class HeaderAuthenticationService implements IAuthenticationService {

    private final RatanObjectMapper objectMapper;

    private final AuthenticationHandlerResolver authenticationHandlerResolver;

    private final List<String> supportedTokenHeaderNames = List.of(AuthConstant.HEADER_KEY_SINGLE_UI_AUTHORIZATION);

    @Override
    public Mono<AuthenticationPayloadDto> authenticate(HttpServletRequest httpServletRequest) {

        List<HeaderAuthToken> headerAuthTokens = extractHeaderValues(httpServletRequest);

        if (CollectionUtils.isEmpty(headerAuthTokens)) {
            return monoError(AuthErrorEnum.TOKEN_NOT_FOUND);
        }

        Map<String, String> headers = buildHeadersMap(httpServletRequest, headerAuthTokens);

        return Mono.fromCallable(() -> authenticationHandlerResolver.authenticate(headers))

            .subscribeOn(Schedulers.boundedElastic())

            .map(this::toAuthenticationPayloadDto)

            .onErrorMap(ex -> {

                if (ex instanceof RatanServiceException) {

                    int status = ((RatanServiceException) ex).getError().getStatus();

                    if (status == 400) {
                        return new AuthenticationException(AuthErrorEnum.AUTH_SERVICE_ERROR_BAD_REQUEST);
                    }

                    if (status == 401) {
                        return new AuthenticationException(AuthErrorEnum.TOKEN_INVALID_EXPIRED);
                    }

                    if (status == 404) {
                        return new AuthenticationException(AuthErrorEnum.USER_NOT_FOUND);
                    }
                }

                log.error("Auth service error: {}", ex.getMessage(), ex);

                return new AuthenticationException(AuthErrorEnum.AUTH_SERVICE_UNAVAILABLE);
            });
    }

    private Map<String, String> buildHeadersMap(HttpServletRequest httpServletRequest, List<HeaderAuthToken> headerAuthTokens) {
        Map<String, String> headers = new HashMap<>();

        for (HeaderAuthToken token : headerAuthTokens) {
            headers.put(token.name(), token.value());
        }

        String traceId = httpServletRequest.getHeader(RatanServerWebExchangeUtils.RATAN_TRACE_ID);
        if (StringUtils.isNotBlank(traceId)) {
            headers.put(AuthConstant.HEADER_X_RATAN_TRACE_ID, traceId);
        }

        return headers;
    }

    private AuthenticationPayloadDto toAuthenticationPayloadDto(AuthenticationResponseDto dto) {

        if (dto == null) {
            return null;
        }

        AuthenticationPayloadDto payload = new AuthenticationPayloadDto();

        if (dto.getUserInfo() != null) {

            UserInfoDto userInfoDto = new UserInfoDto();
            userInfoDto.setUserId(dto.getUserInfo().getUserId());
            userInfoDto.setFullName(dto.getUserInfo().getFullName());
            userInfoDto.setCountry(dto.getUserInfo().getCountry());

            payload.setUserInfo(userInfoDto);

        }

        if (StringUtils.isNotBlank(dto.getEntitlement())) {

            try {

                payload.setUserEntitlement(objectMapper.readValue(dto.getEntitlement(), UserEntitlementDto.class));

            } catch (RatanServiceException e) {

                log.error("Error parsing entitlement JSON", e);
            }
        }

        return payload;
    }

    private List<HeaderAuthToken> extractHeaderValues(HttpServletRequest httpServletRequest) {
        return supportedTokenHeaderNames().stream()
            .map(headerName -> new HeaderAuthToken(headerName, httpServletRequest.getHeader(headerName)))
            .filter(HeaderAuthToken::isValid).toList();
    }

    private List<String> supportedTokenHeaderNames() {
        return supportedTokenHeaderNames;
    }

    private record HeaderAuthToken(String name, String value) {

        public boolean isValid() {
            return StringUtils.isNotBlank(this.value);
        }
    }

}
