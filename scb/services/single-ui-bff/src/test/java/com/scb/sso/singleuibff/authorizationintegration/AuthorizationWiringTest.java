package com.scb.sso.singleuibff.authorizationintegration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.sso.singleuibff.config.AuthConfig;
import com.scb.sso.singleuibff.config.EMS2ConfigProperties;
import com.scb.sso.singleuibff.config.EMS3ConfigProperties;
import com.scb.sso.singleuibff.repository.AuthorizationApplicationRepo;
import com.scb.sso.singleuibff.entity.AuthorizationApplication;
import java.util.List;
import com.scb.sso.singleuibff.service.v2.implementation.RoutingAuthorizationService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.http.MediaType;

import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

class AuthorizationWiringTest {
    @Test
    void productionBeanUsesDatabaseRoutingAndEms2WorksWithoutEms3Credentials() {
        AuthConfig config = new AuthConfig();
        ReflectionTestUtils.setField(config, "objectMapper", new ObjectMapper());
        var ems2 = new EMS2ConfigProperties();
        ems2.setUserRoles("https://ems2.test/accounts/%s");
        ReflectionTestUtils.setField(config, "ems2ConfigProperties", ems2);
        ReflectionTestUtils.setField(config, "ems3ConfigProperties", new EMS3ConfigProperties());
        var repository = mock(AuthorizationApplicationRepo.class);
        var route = new AuthorizationApplication();
        route.setBffEntityName("X_RATANONE");
        when(repository.findByBffEntityNameIn(List.of("X_RATANONE"))).thenReturn(List.of(route));
        ReflectionTestUtils.setField(config, "authorizationApplicationRepo", repository);
        MockRestServiceServer[] server = new MockRestServiceServer[1];
        var provider = config.buildAuthorizationService(new RestTemplateBuilder()
            .additionalCustomizers(http -> server[0] = MockRestServiceServer.bindTo(http).build()));
        assertInstanceOf(RoutingAuthorizationService.class, provider);
        server[0].expect(requestTo("https://ems2.test/accounts/test-user"))
            .andRespond(withSuccess("{\"accountName\":\"test-user\",\"entitlementTypes\":[]}", MediaType.APPLICATION_JSON));
        assertTrue(provider.getEntitlements("test-user", List.of("X_RATANONE")).getEntities().isEmpty());
        server[0].verify();
    }
}
