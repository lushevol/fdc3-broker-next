package com.scb.ratan.flowzero.auth.service.user.impl;

import com.scb.ratan.flowzero.auth.constant.DataStatusEnum;
import com.scb.ratan.flowzero.auth.entity.dbo.User;
import com.scb.ratan.flowzero.auth.entity.vo.EntitlementVo;
import com.scb.ratan.flowzero.auth.repository.UserRepository;
import com.scb.ratan.flowzero.auth.util.RatanObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.IntStream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RatanObjectMapper objectMapper;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    void saveBatchUsers_shouldSkipBlankIdsAndSaveInBatches() {
        List<String> bankIds = new ArrayList<>();
        IntStream.rangeClosed(1, 201).forEach(i -> bankIds.add("bank-" + i));
        bankIds.add("");
        bankIds.add(" ");

        List<List<User>> batches = new ArrayList<>();
        doAnswer(invocation -> {
            batches.add(new ArrayList<>(invocation.getArgument(0)));
            return null;
        }).when(userRepository).saveAll(anyList());

        userService.saveBatchUsers(bankIds);

        verify(userRepository, org.mockito.Mockito.times(3)).saveAll(anyList());
        assertEquals(100, batches.get(0).size());
        assertEquals(100, batches.get(1).size());
        assertEquals(1, batches.get(2).size());
        assertEquals("bank-201", batches.get(2).get(0).getBankId());
    }

    @Test
    void saveBatchUsers_whenInputIsEmpty_shouldNotSave() {
        userService.saveBatchUsers(Collections.emptyList());
        userService.saveBatchUsers(null);

        verify(userRepository, never()).saveAll(anyList());
    }

    @Test
    void saveOrUpdateUsers_shouldDeleteMissingAndAddNewUsers() {
        userService.saveOrUpdateUsers(List.of("bank-1", "bank-3"), List.of("bank-1", "bank-2"));

        verify(userRepository).deleteByBankIdIn(List.of("bank-2"));
        verify(userRepository).saveAll(anyList());
    }

    @Test
    void saveOrUpdateUsers_whenDatabaseIsEmpty_shouldSaveAllEmsUsers() {
        userService.saveOrUpdateUsers(List.of("bank-1", "bank-2"), Collections.emptyList());

        verify(userRepository).saveAll(anyList());
        verify(userRepository, never()).deleteByBankIdIn(anyList());
    }

    @Test
    void findEntitlementByBankIds_whenInputIsEmpty_shouldReturnEmpty() {
        assertEquals(Collections.emptyList(), userService.findEntitlementByBankIds(Collections.emptyList()));
        verify(userRepository, never()).findByBankIdIn(any());
    }

    @Test
    void findEntitlementByBankIds_whenJsonIsValid_shouldSetBankId() {
        User user = user("bank-1", "Alice", "alice@example.com");
        user.setDataEntitlement("{\"roles\":[\"ADMIN\"]}");
        EntitlementVo entitlement = new EntitlementVo();
        entitlement.setRoles(List.of("ADMIN"));
        when(userRepository.findByBankIdIn(List.of("bank-1"))).thenReturn(List.of(user));
        when(objectMapper.readValue(eq(user.getDataEntitlement()), eq(EntitlementVo.class))).thenReturn(entitlement);

        EntitlementVo result = userService.findEntitlementByBankIds(List.of("bank-1")).get(0);

        assertSame(entitlement, result);
        assertEquals("bank-1", result.getBankId());
    }

    @Test
    void findEntitlementByBankIds_whenJsonIsBlankOrInvalid_shouldReturnEmptyEntitlement() {
        User blank = user("bank-1", "Alice", "alice@example.com");
        User invalid = user("bank-2", "Bob", "bob@example.com");
        invalid.setDataEntitlement("{}");
        when(userRepository.findByBankIdIn(List.of("bank-1", "bank-2"))).thenReturn(List.of(blank, invalid));
        when(objectMapper.readValue(eq("{}"), eq(EntitlementVo.class))).thenThrow(new RuntimeException("invalid JSON"));

        List<EntitlementVo> result = userService.findEntitlementByBankIds(List.of("bank-1", "bank-2"));

        assertEquals("bank-1", result.get(0).getBankId());
        assertEquals("bank-2", result.get(1).getBankId());
        assertNull(result.get(0).getRoles());
        assertNull(result.get(1).getRoles());
    }

    private User user(String bankId, String userName, String email) {
        User user = new User();
        user.setBankId(bankId);
        user.setUserName(userName);
        user.setEmail(email);
        user.setStatus(DataStatusEnum.ACTIVE);
        return user;
    }

}
