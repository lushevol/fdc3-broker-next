package com.scb.ratan.flowzero.auth.jwtparser;

import com.scb.ratan.flowzero.auth.jwtparser.convertor.ConvertorFactory;
import com.scb.ratan.flowzero.auth.jwtparser.convertor.JwtConvertor;
import com.scb.ratan.flowzero.auth.jwtparser.convertor.JwtConvertorForNewUse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

class JwtParserCoordinatorTest {

    private ConvertorFactory factory;
    private JwtParserCoordinator coordinator;

    @BeforeEach
    void setUp() {
        factory = mock(ConvertorFactory.class);
        coordinator = new JwtParserCoordinator(factory);
    }

    @Test
    void convertUserResponse_shouldUseNewConvertorWhenSignIsMissing() {
        JwtConvertor newConvertor = mock(JwtConvertor.class);
        JwtConvertor.JwtConvertorResponse expected = JwtConvertor.JwtConvertorResponse.builder().build();

        when(factory.retrieveConvertor(ConvertorFactory.ConvertorType.NEW)).thenReturn(newConvertor);
        when(newConvertor.convert("{\"sub\":\"u1\"}")).thenReturn(expected);

        JwtConvertor.JwtConvertorResponse actual = coordinator.convertUserResponse("{\"sub\":\"u1\"}");

        assertNotNull(actual);
        assertEquals(expected, actual);
        verify(factory).retrieveConvertor(ConvertorFactory.ConvertorType.NEW);
        verify(newConvertor).convert("{\"sub\":\"u1\"}");
    }

    @Test
    void convertUserResponse_shouldUseNewConvertorWhenSignMissing() {
        JwtConvertor newConvertor = mock(JwtConvertorForNewUse.class);
        JwtConvertor.JwtConvertorResponse expected = JwtConvertor.JwtConvertorResponse.builder().build();

        when(factory.retrieveConvertor(ConvertorFactory.ConvertorType.NEW)).thenReturn(newConvertor);
        when(newConvertor.convert("{\"sub\":\"u1\"}")).thenReturn(expected);

        JwtConvertor.JwtConvertorResponse actual = coordinator.convertUserResponse("{\"sub\":\"u1\"}");

        assertNotNull(actual);
        assertEquals(expected, actual);
        verify(factory).retrieveConvertor(ConvertorFactory.ConvertorType.NEW);
        verify(newConvertor).convert("{\"sub\":\"u1\"}");
    }

    @Test
    void convertUserResponse_shouldFallbackToNewWhenMapReadFails() {
        JwtConvertor newConvertor = mock(JwtConvertorForNewUse.class);
        JwtConvertor.JwtConvertorResponse expected = JwtConvertor.JwtConvertorResponse.builder().build();

        when(factory.retrieveConvertor(ConvertorFactory.ConvertorType.NEW)).thenReturn(newConvertor);
        when(newConvertor.convert("not-json")).thenReturn(expected);

        JwtConvertor.JwtConvertorResponse actual = coordinator.convertUserResponse("not-json");

        assertNotNull(actual);
        assertEquals(expected, actual);
        verify(factory).retrieveConvertor(ConvertorFactory.ConvertorType.NEW);
        verify(newConvertor).convert("not-json");
    }

}
