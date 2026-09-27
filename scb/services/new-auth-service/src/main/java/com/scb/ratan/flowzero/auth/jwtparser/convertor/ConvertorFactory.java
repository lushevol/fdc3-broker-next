package com.scb.ratan.flowzero.auth.jwtparser.convertor;

import com.scb.ratan.flowzero.auth.jwtparser.fetcher.OudDataFetcher;
import com.scb.ratan.flowzero.auth.repository.RoleRepository;
import com.scb.ratan.flowzero.auth.repository.UserRepository;
import com.scb.ratan.flowzero.auth.util.RatanObjectMapper;
import lombok.RequiredArgsConstructor;

import java.util.concurrent.ConcurrentHashMap;

@RequiredArgsConstructor
public class ConvertorFactory {

    private final RatanObjectMapper objectMapper;

    private final OudDataFetcher oudDataFetcher;

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private static final ConcurrentHashMap<ConvertorType, JwtConvertor> CONVERTER = new ConcurrentHashMap<>();

    public JwtConvertor retrieveConvertor(ConvertorType convertorType) {

        return switch (convertorType) {
        case NEW -> CONVERTER.computeIfAbsent(ConvertorType.NEW,
            __ -> new JwtConvertorForNewUse(objectMapper, oudDataFetcher, userRepository, roleRepository));
        };
    }

    public enum ConvertorType {
        NEW
    }

}
