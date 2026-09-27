package com.scb.ratan.flowzero.auth.service.ems3.impl;

import com.scb.ratan.flowzero.auth.entity.dbo.User;
import com.scb.ratan.flowzero.auth.entity.ems3.EntitlementBean;
import com.scb.ratan.flowzero.auth.entity.ems3.UserEntitlement;
import com.scb.ratan.flowzero.auth.repository.UserRepository;
import com.scb.ratan.flowzero.auth.service.ems3.EM3DataSyncService;
import com.scb.ratan.flowzero.auth.service.ems3.EMS3DataFetchService;
import com.scb.ratan.flowzero.auth.service.ems3.EMS3DataCoordinator;
import com.scb.ratan.flowzero.auth.service.user.IUserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DataSyncControllerImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private IUserService userService;

    @Mock
    private EMS3DataCoordinator ems3SyncEntitlementService;

    @Mock
    private EMS3DataFetchService ems3DataFetchService;

    @InjectMocks
    private EM3DataSyncService service;

    @Test
    void syncUsers_whenDbEmpty_shouldSaveAllUsersFromEms3() {
        UserEntitlement userEntitlement1 = new UserEntitlement();
        userEntitlement1.setUserIds(List.of("u1", "u2"));
        UserEntitlement userEntitlement2 = new UserEntitlement();
        userEntitlement2.setUserIds(List.of("u2", "u3"));

        when(ems3DataFetchService.fetchUserList()).thenReturn(List.of(userEntitlement1, userEntitlement2));
        when(userRepository.findAllActive()).thenReturn(List.of());

        service.syncUsers();

        verify(userService).saveOrUpdateUsers(List.of("u1", "u2", "u3"), List.of());
        verify(userRepository, never()).deleteByBankIdIn(anyList());
    }

    @Test
    void syncUsers_whenDbHasUsers_shouldDeleteMissingUsers() {
        UserEntitlement userEntitlement = new UserEntitlement();
        userEntitlement.setUserIds(List.of("u1", "u2"));

        User dbUser = new User();
        dbUser.setBankId("u1");
        User dbUser2 = new User();
        dbUser2.setBankId("u9");

        when(ems3DataFetchService.fetchUserList()).thenReturn(List.of(userEntitlement));
        when(userRepository.findAllActive()).thenReturn(List.of(dbUser, dbUser2));

        service.syncUsers();

        verify(userService).saveOrUpdateUsers(List.of("u1", "u2"), List.of("u1", "u9"));
        verify(userRepository, never()).deleteByBankIdIn(anyList());
    }

    @Test
    void syncEntitlement_shouldSyncEachUserEntitlement() {
        User user = new User();
        user.setBankId("u1");

        EntitlementBean bean = new EntitlementBean();
        bean.setEntitlements(null);

        when(userRepository.findAllActive()).thenReturn(List.of(user));
        when(ems3DataFetchService.fetchEntitlementInfo("u1")).thenReturn(List.of(bean));

        service.syncEntitlement();

        verify(ems3SyncEntitlementService).syncEntitlements(null, user);
    }

}
