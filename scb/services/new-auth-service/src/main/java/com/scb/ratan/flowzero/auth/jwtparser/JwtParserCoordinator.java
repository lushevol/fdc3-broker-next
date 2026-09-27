package com.scb.ratan.flowzero.auth.jwtparser;

import com.scb.ratan.flowzero.auth.jwtparser.convertor.ConvertorFactory;
import com.scb.ratan.flowzero.auth.jwtparser.convertor.JwtConvertor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
public class JwtParserCoordinator {

    private final ConvertorFactory factory;

    public JwtConvertor.JwtConvertorResponse convertUserResponse(String originalUserInfo) {

        return retrieveByJwtNew(originalUserInfo);

    }

    private JwtConvertor.JwtConvertorResponse retrieveByJwtNew(String inputUserInfo) {

        return factory.retrieveConvertor(ConvertorFactory.ConvertorType.NEW).convert(inputUserInfo);
    }

}
