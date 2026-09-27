package com.scb.ratan.flowzero.auth.web;

import com.scb.ratan.flowzero.auth.service.DataSyncService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(DataSyncController.class)
class DataSyncControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private DataSyncService dataSyncService;

    @Test
    void syncEntitlements_whenSyncStarts_shouldReturnSuccessResult() throws Exception {
        mockMvc.perform(get("/v1/sync/entitlements"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.message")
                .value("Already to start sync all user entitlements from EMS3."))
            .andExpect(jsonPath("$.syncStartTime").isNotEmpty());

        verify(dataSyncService).syncAll();
    }

    @Test
    void syncEntitlements_whenSyncFails_shouldPropagateServiceException() {
        doThrow(new IllegalStateException("EMS3 synchronization failed"))
            .when(dataSyncService)
            .syncAll();

        org.junit.jupiter.api.Assertions.assertThrows(
            Exception.class,
            () -> mockMvc.perform(get("/v1/sync/entitlements")).andReturn());

        verify(dataSyncService).syncAll();
    }

}
