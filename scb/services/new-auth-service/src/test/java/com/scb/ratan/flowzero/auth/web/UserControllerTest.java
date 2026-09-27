package com.scb.ratan.flowzero.auth.web;

import com.scb.ratan.flowzero.auth.service.user.IUserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private IUserService userService;

    @Test
    void findEntitlementByBankIds_emptyList_shouldReturnBadRequest() throws Exception {
        mockMvc.perform(post("/v1/user/entitlements")
            .contentType(MediaType.APPLICATION_JSON)
            .content("[]"))
            .andExpect(status().isBadRequest());
    }

    @Test
    void findEntitlementByBankIds_over100Items_shouldReturnBadRequest() throws Exception {
        List<String> bankIds = IntStream.range(0, 101)
            .mapToObj(i -> "bank-" + i)
            .collect(Collectors.toList());

        mockMvc.perform(post("/v1/user/entitlements")
            .contentType(MediaType.APPLICATION_JSON)
            .content(asJson(bankIds)))
            .andExpect(status().isBadRequest());
    }

    @Test
    void findEntitlementByBankIds_validList_shouldReturnOk() throws Exception {
        when(userService.findEntitlementByBankIds(anyList())).thenReturn(Collections.emptyList());

        mockMvc.perform(post("/v1/user/entitlements")
            .contentType(MediaType.APPLICATION_JSON)
            .content("[\"bank-1\",\"bank-2\"]"))
            .andExpect(status().isOk());

        verify(userService).findEntitlementByBankIds(anyList());
    }

    private String asJson(Object value) throws Exception {
        return new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(value);
    }

}