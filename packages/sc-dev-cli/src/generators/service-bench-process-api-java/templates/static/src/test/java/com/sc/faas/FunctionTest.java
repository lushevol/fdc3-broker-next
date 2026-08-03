package com.sc.faas;

import com.sc.faas.dto.MyObject;
import com.sc.faas.service.ProcessService;
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
class FunctionTest {

    @InjectMock
    ProcessService processService;



    @Test
    public void  func() {
        MyObject object = new MyObject(123L, "Hello World");
        when(processService.getObjectById(any()))
            .thenReturn(object);

        given()
            .when()
            .get("/api/experience/v1/objects/123")
            .then()
            .statusCode(200);
    }
}