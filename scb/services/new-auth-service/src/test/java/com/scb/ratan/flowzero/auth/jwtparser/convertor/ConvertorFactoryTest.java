package com.scb.ratan.flowzero.auth.jwtparser.convertor;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.ratan.flowzero.auth.jwtparser.fetcher.OudDataFetcher;
import com.scb.ratan.flowzero.auth.repository.RoleRepository;
import com.scb.ratan.flowzero.auth.repository.UserRepository;
import com.scb.ratan.flowzero.auth.util.RatanObjectMapper;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;

class ConvertorFactoryTest {

    @Test
    void retrieveConvertor_shouldReturnLegacyAndNewInstances() {
        ConvertorFactory factory = new ConvertorFactory(
            new RatanObjectMapper(new ObjectMapper()),
            mock(OudDataFetcher.class),
            mock(UserRepository.class),
            mock(RoleRepository.class));

        assertTrue(factory.retrieveConvertor(ConvertorFactory.ConvertorType.NEW) instanceof JwtConvertorForNewUse);
    }

}
