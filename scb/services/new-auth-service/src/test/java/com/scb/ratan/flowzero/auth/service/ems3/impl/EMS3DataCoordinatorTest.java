package com.scb.ratan.flowzero.auth.service.ems3.impl;

import com.scb.ratan.flowzero.auth.entity.dbo.User;
import com.scb.ratan.flowzero.auth.entity.ems3.DataEntitlement;
import com.scb.ratan.flowzero.auth.entity.ems3.Entitlements;
import com.scb.ratan.flowzero.auth.entity.ems3.RoleEntitlement;
import com.scb.ratan.flowzero.auth.repository.RoleRepository;
import com.scb.ratan.flowzero.auth.repository.UserRepository;
import com.scb.ratan.flowzero.auth.service.ems3.EMS3DataCoordinator;
import com.scb.ratan.flowzero.auth.util.RatanObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EMS3DataCoordinatorTest {

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RatanObjectMapper ratanObjectMapper;

    @InjectMocks
    private EMS3DataCoordinator service;

    @Test
    void syncEntitlements_shouldReturnWhenEntitlementsNull() {
        User user = new User();
        user.setBankId("u1");

        service.syncEntitlements(null, user);

        verifyNoInteractions(roleRepository, userRepository, ratanObjectMapper);
    }

    @Test
    void syncEntitlements_shouldSaveRolesAndUser() {
        User user = new User();
        user.setBankId("u1");

        Entitlements entitlements = new Entitlements();
        entitlements.setEntitlementName(List.of("ROLE_A", "ROLE_B"));
        entitlements.setDataEntitlements(List.of(buildDataEntitlement("k1", List.of("v1", "v2"))));
        entitlements.setRoleEntitlements(List.of(buildRoleEntitlement("feature1", "action1")));

        when(ratanObjectMapper.writeValueAsString(any())).thenReturn("{json}");

        service.syncEntitlements(entitlements, user);

        assertEquals("{json}", user.getDataEntitlement());
        assertEquals("{json}", user.getFunctionEntitlement());
        verify(roleRepository).deleteByBankId("u1");
        verify(roleRepository).saveAll(anyList());
        verify(userRepository).save(user);
    }

    private DataEntitlement buildDataEntitlement(String key, List<String> values) {
        DataEntitlement dataEntitlement = new DataEntitlement();
        dataEntitlement.setKey(key);
        dataEntitlement.setValues(values);
        return dataEntitlement;
    }

    private RoleEntitlement buildRoleEntitlement(String feature, String action) {
        RoleEntitlement roleEntitlement = new RoleEntitlement();
        roleEntitlement.setFeature(feature);
        roleEntitlement.setAction(action);
        return roleEntitlement;
    }

}
