package com.sc.faas.service;

import com.sc.faas.dto.MyObject;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static io.restassured.RestAssured.given;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import jakarta.ws.rs.core.Response;

@QuarkusTest
public class ProcessServiceTest {
    @Inject
    ProcessService processService;

    @Test
    public void test() {
        MyObject object = processService.getObjectById(1L);
        Assertions.assertEquals(object.getId(), 1L);

    }


}