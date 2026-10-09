package com.scb.sso.singleuibff.controller.v2;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.sso.singleuibff.dto.ems2.v2.Action;
import com.scb.sso.singleuibff.dto.ems2.v2.Ems2Result;
import com.scb.sso.singleuibff.dto.ems2.v2.Entity;
import com.scb.sso.singleuibff.dto.ems2.v2.Subject;
import com.scb.sso.singleuibff.dto.request.RequestOfAuthenticate;
import com.scb.sso.singleuibff.service.v1.AnalyticService;
import com.scb.sso.singleuibff.service.v1.ApplicationCategoryService;
import com.scb.sso.singleuibff.service.v1.implementation.OUDAuthenticationService;
import com.scb.sso.singleuibff.service.v2.AuthorizationService;
import com.scb.sso.singleuibff.util.AdminModuleUtil;
import com.scb.sso.singleuibff.util.JwtTokenUtil;
import com.scb.sso.singleuibff.util.OudUtil;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.util.ReflectionTestUtils;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class TileEntitlementJwtTest {
    @Test
    void jwtUnionsRepeatedRoleAndSubjectFragmentsAndUsesAuthorizedSnapshotWithoutASecondQuery() throws Exception {
        var controller = new JwtAuthenticationController();
        var authorization = mock(AuthorizationService.class);
        var categories = mock(ApplicationCategoryService.class);
        var jwt = mock(JwtTokenUtil.class);
        var oud = mock(OUDAuthenticationService.class);
        var admin = mock(AdminModuleUtil.class);
        var json = new ObjectMapper();
        var response = new Ems2Result();
        response.setEntities(List.of(entity("RATAN_CASHFLOW_BLOTTER", "Read"),
            entity("RATAN_STRATEGIC_CASHFLOW_BLOTTER", "F_Export_Data"),
            entity("RATAN_STRATEGIC_CASHFLOW_BLOTTER", "F_Export_Data", "F_Hold")));
        var snapshot = List.<Map<String, Object>>of(Map.of("application_tile_id", 37L));
        response.setAuthorizedTiles(snapshot);
        when(authorization.usesTileSnapshot()).thenReturn(true);
        when(authorization.getEntitlements("test-user", List.of())).thenReturn(response);
        when(admin.getEntityFromApplicationCategory(List.of())).thenReturn(List.of());
        when(admin.getDrawer(snapshot, response.getEntities())).thenReturn(List.of());
        when(oud.authenticate(any())).thenReturn(new HashMap<>(Map.of("fullName", "Test User")));
        when(jwt.generateEntitlementToken(eq("test-user"), any())).thenReturn("entitlement-token");
        when(jwt.doGenerateTokenWithAuthTime(eq("test-user"), any())).thenReturn("session-token");
        ReflectionTestUtils.setField(controller, "authorizationService", authorization);
        ReflectionTestUtils.setField(controller, "applicationCategoryService", categories);
        ReflectionTestUtils.setField(controller, "jwtTokenUtil", jwt);
        ReflectionTestUtils.setField(controller, "objectMapper", json);
        ReflectionTestUtils.setField(controller, "adminModuleUtil", admin);
        ReflectionTestUtils.setField(controller, "oudAuthenticationService", oud);
        ReflectionTestUtils.setField(controller, "httpSession", new MockHttpSession());
        ReflectionTestUtils.setField(controller, "oudUtil", mock(OudUtil.class));
        ReflectionTestUtils.setField(controller, "analyticService", mock(AnalyticService.class));
        var request = new RequestOfAuthenticate(); request.setUsername("test-user");

        var result = controller.authenticate(request, new MockHttpServletRequest(), new MockHttpServletResponse());

        assertEquals(200, result.getStatusCode().value());
        @SuppressWarnings("unchecked")
        ArgumentCaptor<Map<String, String>> payload = ArgumentCaptor.forClass(Map.class);
        verify(jwt).generateEntitlementToken(eq("test-user"), payload.capture());
        var claims = json.readTree(payload.getValue().get("entitlements"));
        assertEquals(json.readTree("{\"X_RATANONE:FMO_OPS_BO\":{\"RATAN_CASHFLOW_BLOTTER\":[\"Read\"],\"RATAN_STRATEGIC_CASHFLOW_BLOTTER\":[\"F_Export_Data\",\"F_Hold\"]}}"), claims);
        verifyNoInteractions(categories);
        verify(authorization, times(1)).getEntitlements("test-user", List.of());
        verify(admin).getDrawer(snapshot, response.getEntities());
    }

    private static Entity entity(String subjectName, String... permissions) {
        var entity = new Entity(); entity.setName("X_RATANONE"); entity.setRoleName("FMO_OPS_BO");
        var subject = new Subject(); subject.setName(subjectName);
        subject.setActions(Arrays.stream(permissions).map(permission -> {
            var action = new Action(); action.setName(permission); return action;
        }).toList());
        entity.setSubjects(List.of(subject)); return entity;
    }
}
