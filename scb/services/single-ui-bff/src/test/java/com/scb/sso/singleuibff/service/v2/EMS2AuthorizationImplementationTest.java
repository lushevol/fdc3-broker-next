package com.scb.sso.singleuibff.service.v2;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.sso.singleuibff.config.EMS2ConfigProperties;
import com.scb.sso.singleuibff.dto.ems2.v2.Ems2Result;
import com.scb.sso.singleuibff.dto.ems2.v2.Entity;
import com.scb.sso.singleuibff.exceptions.JwtException;
import com.scb.sso.singleuibff.service.v2.implementation.EMS2AuthorizationImplementation;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EMS2AuthorizationImplementationTest {

    @InjectMocks
    EMS2AuthorizationImplementation ems2AuthorizationImplementation;
    @Mock
    RestTemplate restTemplate;

    @Spy
    ObjectMapper objectMapper;
    @Mock
    EMS2ConfigProperties ems2ConfigProperties;

    String roleResponse = "{\"accountName\":\"2001208\",\"accountOwner\":\"\",\"accountStatus\":\"A\",\"accountType\":\"User\",\"entitlementTypes\":[{\"applicationName\":\"\",\"isPrivilege\":\"N\",\"roleDescription\":\"\",\"roleName\":\"EMS2_ADMIN\",\"uniqueName\":\"65|EMS2|66|EMS2_ADMIN\"},{\"applicationName\":\"SSIPLUS\",\"isPrivilege\":\"N\",\"roleDescription\":\"\",\"roleName\":\"SSI_SUPER_USER\",\"uniqueName\":\"11279700|SSIPLUS|11279756|SSI_SUPER_USER\"}],\"fullName\":\"Khairul Anshar1\",\"status\":\"\"}";
    String entityResponse = "{\"SSIPLUS:SSI_SUPER_USER\":{\"SEARCH\":[\"WRITE\"],\"VALIDATIONRULES\":[\"WRITE\"],\"STATIC\":[\"WRITE\"]},\"EMS2:EMS2_ADMIN\":{}}";
    String roleResponseNull = "{\"accountName\":\"2001208\",\"accountOwner\":\"\",\"accountStatus\":\"A\",\"accountType\":\"User\",\"entitlementTypes\":[],\"fullName\":\"Khairul Anshar1\",\"status\":\"\"}";
    String roleResponse1 = "{\"accountName\":\"2001208\",\"accountOwner\":\"\",\"accountStatus\":\"A\",\"accountType\":\"User\",\"entitlementTypes\":[{\"applicationName\":\"\",\"isPrivilege\":\"N\",\"roleDescription\":\"\",\"roleName\":\"EMS2_ADMIN\",\"uniqueName\":\"65|EMS2|66|EMS2_ADMIN\"},{\"applicationName\":\"SSIPLUS\",\"isPrivilege\":\"N\",\"roleDescription\":\"\",\"roleName\":\"SSI_SUPER_USER\",\"uniqueName\":\"11279700|SSIPLUS|11279756|SSI_SUPER_USER\"}],\"fullName\":\"Khairul Anshar1\",\"status\":\"\"}";
    String entityResponse1 = "{\"SSIPLUS:SSI_SUPER_USER\":{},\"EMS2:EMS2_ADMIN\":{}}";
    String newEntity = "{\"2001208\":{\"count\":3,\"entitlements\":[{\"subject\":{\"entity\":{\"locked\":true,\"systemName\":\"SSIPLUS\",\"name\":\"SSIPLUS\",\"id\":11279700},\"longName\":\"/SEARCH\",\"name\":\"SEARCH\",\"id\":11279801},\"role\":{\"entity\":{\"locked\":true,\"systemName\":\"SSIPLUS\",\"name\":\"SSIPLUS\",\"id\":11279700},\"isPrivilege\":null,\"roleDescription\":null,\"name\":\"SSI_SUPER_USER\",\"id\":11279756},\"action\":{\"entity\":{\"locked\":true,\"systemName\":\"SSIPLUS\",\"name\":\"SSIPLUS\",\"id\":11279700},\"name\":\"WRITE\",\"id\":11279851},\"id\":11280762},{\"subject\":{\"entity\":{\"locked\":true,\"systemName\":\"SSIPLUS\",\"name\":\"SSIPLUS\",\"id\":11279700},\"longName\":\"/STATIC\",\"name\":\"STATIC\",\"id\":11279800},\"role\":{\"entity\":{\"locked\":true,\"systemName\":\"SSIPLUS\",\"name\":\"SSIPLUS\",\"id\":11279700},\"isPrivilege\":null,\"roleDescription\":null,\"name\":\"SSI_SUPER_USER\",\"id\":11279756},\"action\":{\"entity\":{\"locked\":true,\"systemName\":\"SSIPLUS\",\"name\":\"SSIPLUS\",\"id\":11279700},\"name\":\"WRITE\",\"id\":11279851},\"id\":11280763},{\"subject\":{\"entity\":{\"locked\":true,\"systemName\":\"SSIPLUS\",\"name\":\"SSIPLUS\",\"id\":11279700},\"longName\":\"/VALIDATIONRULES\",\"name\":\"VALIDATIONRULES\",\"id\":11279802},\"role\":{\"entity\":{\"locked\":true,\"systemName\":\"SSIPLUS\",\"name\":\"SSIPLUS\",\"id\":11279700},\"isPrivilege\":null,\"roleDescription\":null,\"name\":\"SSI_SUPER_USER\",\"id\":11279756},\"action\":{\"entity\":{\"locked\":true,\"systemName\":\"SSIPLUS\",\"name\":\"SSIPLUS\",\"id\":11279700},\"name\":\"WRITE\",\"id\":11279851},\"id\":11280764}]}}";

    @Test
    void testGetEntitlementsRequestEntitiesIsNull() {
        when(ems2ConfigProperties.getUserRoles()).thenReturn("/ems2/rest/account/%s");
        when(ems2ConfigProperties.getNewUserAuthorizationOnEntity()).thenReturn("/ems2/rest/entitlements/entitlementList");

        ResponseEntity responseEntity = mock(ResponseEntity.class);
        when(responseEntity.getBody()).thenReturn(roleResponse);
        when(restTemplate.getForEntity(anyString(), any())).thenReturn(responseEntity);

        ResponseEntity responseEntity2 = mock(ResponseEntity.class);
        when(responseEntity2.getBody()).thenReturn(entityResponse);
        when(restTemplate.postForEntity(anyString(), any(), any())).thenReturn(responseEntity2);

        Ems2Result ems2Result = ems2AuthorizationImplementation.getEntitlements("userId", List.of("EMS2", "SSIPLUS"));
        List<Entity> entities = ems2Result.getEntities();
        Assertions.assertNotNull(ems2Result);
        Assertions.assertNotNull(entities);
        Assertions.assertEquals(2, entities.size());
        Assertions.assertEquals("EMS2", entities.get(0).getName());
        Assertions.assertEquals("EMS2_ADMIN", entities.get(0).getRoleName());
        Assertions.assertEquals(0, entities.get(0).getSubjects().size());
        Assertions.assertEquals("SSIPLUS", entities.get(1).getName());
        Assertions.assertEquals("SSI_SUPER_USER", entities.get(1).getRoleName());
    }

    @Test
    void testGetEntitlementsRequestEntitiesIsEmpty() {
        when(ems2ConfigProperties.getUserRoles()).thenReturn("/ems2/rest/account/%s");
        when(ems2ConfigProperties.getNewUserAuthorizationOnEntity()).thenReturn("/ems2/rest/entitlements/entitlementList");

        ResponseEntity responseEntity = mock(ResponseEntity.class);
        when(responseEntity.getBody()).thenReturn(roleResponse);
        when(restTemplate.getForEntity(anyString(), any())).thenReturn(responseEntity);

        ResponseEntity responseEntity2 = mock(ResponseEntity.class);
        when(responseEntity2.getBody()).thenReturn(entityResponse);
        when(restTemplate.postForEntity(anyString(), any(), any())).thenReturn(responseEntity2);

        Ems2Result ems2Result = ems2AuthorizationImplementation.getEntitlements("userId", new ArrayList<String>());
        List<Entity> entities = ems2Result.getEntities();
        Assertions.assertNotNull(ems2Result);
        Assertions.assertNotNull(entities);
        Assertions.assertEquals(2, entities.size());
        Assertions.assertEquals("EMS2", entities.get(0).getName());
        Assertions.assertEquals("EMS2_ADMIN", entities.get(0).getRoleName());
        Assertions.assertEquals(0, entities.get(0).getSubjects().size());
        Assertions.assertEquals("SSIPLUS", entities.get(1).getName());
        Assertions.assertEquals("SSI_SUPER_USER", entities.get(1).getRoleName());
    }

    @Test
    void testGetEntitlements() {
        when(ems2ConfigProperties.getUserRoles()).thenReturn("/ems2/rest/account/%s");
        when(ems2ConfigProperties.getNewUserAuthorizationOnEntity()).thenReturn("/ems2/rest/entitlements/entitlementList");

        ResponseEntity responseEntity = mock(ResponseEntity.class);
        when(responseEntity.getBody()).thenReturn(roleResponse);
        when(restTemplate.getForEntity(anyString(), any())).thenReturn(responseEntity);

        ResponseEntity responseEntity2 = mock(ResponseEntity.class);
        when(responseEntity2.getBody()).thenReturn(newEntity);
        when(restTemplate.postForEntity(anyString(), any(), any())).thenReturn(responseEntity2);

        Ems2Result ems2Result = ems2AuthorizationImplementation.getEntitlements("userId", new ArrayList<String>());
        List<Entity> entities = ems2Result.getEntities();
        Assertions.assertNotNull(ems2Result);
        Assertions.assertNotNull(entities);
        Assertions.assertEquals(2, entities.size());
        Assertions.assertEquals("EMS2", entities.get(0).getName());
        Assertions.assertEquals("EMS2_ADMIN", entities.get(0).getRoleName());
        Assertions.assertEquals(0, entities.get(0).getSubjects().size());
        Assertions.assertEquals("SSIPLUS", entities.get(1).getName());
        Assertions.assertEquals("SSI_SUPER_USER", entities.get(1).getRoleName());
    }

    @Test
    void testGetEntitlementsOne() {
        when(ems2ConfigProperties.getUserRoles()).thenReturn("/ems2/rest/account/%s");
        when(ems2ConfigProperties.getNewUserAuthorizationOnEntity()).thenReturn("/ems2/rest/entitlements/entitlementList");

        ResponseEntity responseEntity = mock(ResponseEntity.class);
        when(responseEntity.getBody()).thenReturn(roleResponse);
        when(restTemplate.getForEntity(anyString(), any())).thenReturn(responseEntity);

        ResponseEntity responseEntity2 = mock(ResponseEntity.class);
        when(responseEntity2.getBody()).thenReturn(newEntity);
        when(restTemplate.postForEntity(anyString(), any(), any())).thenReturn(responseEntity2);

        Ems2Result ems2Result = ems2AuthorizationImplementation.getEntitlements("userId", new ArrayList<String>());
        List<Entity> entities = ems2Result.getEntities();
        Assertions.assertNotNull(ems2Result);
        Assertions.assertNotNull(entities);
        Assertions.assertEquals(2, entities.size());
        Assertions.assertEquals(3, entities.get(1).getSubjects().size());
        Assertions.assertEquals("EMS2", entities.get(0).getName());
        Assertions.assertEquals("SSIPLUS", entities.get(1).getName());
        Assertions.assertEquals("SSI_SUPER_USER", entities.get(1).getRoleName());
    }

    @Test
    void testGetEntitlementsUserEntitlementList() {
        when(ems2ConfigProperties.getUserRoles()).thenReturn("/ems2/rest/account/%s");
        when(ems2ConfigProperties.getNewUserAuthorizationOnEntity()).thenReturn("/ems2/rest/entitlements/entitlementList");

        ResponseEntity responseEntity = mock(ResponseEntity.class);
        when(responseEntity.getBody()).thenReturn(roleResponse);
        when(restTemplate.getForEntity(anyString(), any())).thenReturn(responseEntity);

        ResponseEntity responseEntity2 = mock(ResponseEntity.class);
        when(responseEntity2.getBody()).thenReturn(newEntity);
        when(restTemplate.postForEntity(anyString(), any(), any())).thenReturn(responseEntity2);

        Ems2Result ems2Result = ems2AuthorizationImplementation.getEntitlements("userId", new ArrayList<String>());
        List<Entity> entities = ems2Result.getEntities();
        Assertions.assertNotNull(ems2Result);
        Assertions.assertNotNull(entities);
        Assertions.assertEquals(2, entities.size());
        Assertions.assertEquals("EMS2", entities.get(0).getName());
        Assertions.assertEquals("EMS2_ADMIN", entities.get(0).getRoleName());
        Assertions.assertEquals(0, entities.get(0).getSubjects().size());
        Assertions.assertEquals("SSIPLUS", entities.get(1).getName());
        Assertions.assertEquals("SSI_SUPER_USER", entities.get(1).getRoleName());
    }

    @Test
    void testGetEntitlementsNull() {
        when(ems2ConfigProperties.getUserRoles()).thenReturn("/ems2/rest/account/%s");

        ResponseEntity responseEntity = mock(ResponseEntity.class);
        when(responseEntity.getBody()).thenReturn(roleResponseNull);
        when(restTemplate.getForEntity(anyString(), any())).thenReturn(responseEntity);

        Ems2Result ems2Result = ems2AuthorizationImplementation.getEntitlements("userId", new ArrayList<String>());
        List<Entity> entities = ems2Result.getEntities();
        Assertions.assertNotNull(ems2Result);
        Assertions.assertNotNull(entities);
        Assertions.assertEquals(0, entities.size());
    }

    @Test
    void testGetEntitlementsError() {
        when(ems2ConfigProperties.getUserRoles()).thenReturn("/ems2/rest/account/%s");
        doThrow(JwtException.builder().message("jwtToken is empty, validation failed.").build()).when(restTemplate)
            .getForEntity(anyString(), any());
        try {
            Ems2Result ems2Result = ems2AuthorizationImplementation.getEntitlements("userId", new ArrayList<String>());
        } catch (Exception e) {
            assertEquals("test", e.getMessage());
        }
    }

    @Test
    void testGetEntityResponseEmpty() {
        when(ems2ConfigProperties.getUserRoles()).thenReturn("/ems2/rest/account/%s");
        when(ems2ConfigProperties.getNewUserAuthorizationOnEntity()).thenReturn("/ems2/rest/entitlements/entitlementList");

        ResponseEntity responseEntity = mock(ResponseEntity.class);
        when(responseEntity.getBody()).thenReturn(roleResponse1);
        when(restTemplate.getForEntity(anyString(), any())).thenReturn(responseEntity);

        ResponseEntity responseEntity2 = mock(ResponseEntity.class);
        when(responseEntity2.getBody()).thenReturn(entityResponse1);
        when(restTemplate.postForEntity(anyString(), any(), any())).thenReturn(responseEntity2);

        Ems2Result ems2Result = ems2AuthorizationImplementation.getEntitlements("userId", new ArrayList<String>());
        List<Entity> entities = ems2Result.getEntities();
        Assertions.assertNotNull(ems2Result);
        Assertions.assertNotNull(entities);
        Assertions.assertEquals(2, entities.size());
        Assertions.assertEquals("EMS2", entities.get(0).getName());
        Assertions.assertEquals("EMS2_ADMIN", entities.get(0).getRoleName());
        Assertions.assertEquals("SSIPLUS", entities.get(1).getName());
        Assertions.assertEquals("SSI_SUPER_USER", entities.get(1).getRoleName());
        Assertions.assertEquals(0, entities.get(1).getSubjects().size());
    }

    @Test
    void testGetEntityResponseError() {
        when(ems2ConfigProperties.getUserRoles()).thenReturn("/ems2/rest/account/%s");
        when(ems2ConfigProperties.getNewUserAuthorizationOnEntity()).thenReturn("/ems2/rest/entitlements/entitlementList");

        ResponseEntity responseEntity = mock(ResponseEntity.class);
        when(responseEntity.getBody()).thenReturn(roleResponse1);
        when(restTemplate.getForEntity(anyString(), any())).thenReturn(responseEntity);

        doThrow(JwtException.builder().message("jwtToken is empty, validation failed.").build()).when(restTemplate)
            .postForEntity(anyString(), any(), any());
        try {
            Ems2Result ems2Result = ems2AuthorizationImplementation.getEntitlements("userId", new ArrayList<String>());
        } catch (Exception e) {
            assertEquals("test", e.getMessage());
        }
    }

    @Test
    void testGetRawEntitlementsError() {
        when(ems2ConfigProperties.getUserRoles()).thenReturn("/ems2/rest/account/%s");
        when(ems2ConfigProperties.getNewUserAuthorizationOnEntity()).thenReturn("/ems2/rest/entitlements/entitlementList");

        ResponseEntity responseEntity = mock(ResponseEntity.class);
        when(responseEntity.getBody()).thenReturn(roleResponse1);
        when(restTemplate.getForEntity(anyString(), any())).thenReturn(responseEntity);

        ResponseEntity responseEntity2 = mock(ResponseEntity.class);
        when(responseEntity2.getBody()).thenReturn("12345");
        when(restTemplate.postForEntity(anyString(), any(), any())).thenReturn(responseEntity2);

        Ems2Result ems2Result = ems2AuthorizationImplementation.getEntitlements("userId", new ArrayList<String>());
        List<Entity> entities = ems2Result.getEntities();
        Assertions.assertNotNull(ems2Result);
        Assertions.assertNotNull(entities);
        Assertions.assertEquals(2, entities.size());
    }

    @Test
    void testGetRawEntitlementsNullError() {
        when(ems2ConfigProperties.getUserRoles()).thenReturn("/ems2/rest/account/%s");
        when(ems2ConfigProperties.getNewUserAuthorizationOnEntity()).thenReturn("/ems2/rest/entitlements/entitlementList");

        ResponseEntity responseEntity = mock(ResponseEntity.class);
        when(responseEntity.getBody()).thenReturn(roleResponse1);
        when(restTemplate.getForEntity(anyString(), any())).thenReturn(responseEntity);

        ResponseEntity responseEntity2 = mock(ResponseEntity.class);
        when(responseEntity2.getBody()).thenReturn(null);
        when(restTemplate.postForEntity(anyString(), any(), any())).thenReturn(responseEntity2);

        Ems2Result ems2Result = ems2AuthorizationImplementation.getEntitlements("userId", new ArrayList<String>());
        List<Entity> entities = ems2Result.getEntities();
        Assertions.assertNotNull(ems2Result);
        Assertions.assertNotNull(entities);
        Assertions.assertEquals(2, entities.size());
    }

    @Test
    void testFetchDataEntitlementRolesError() {
        when(ems2ConfigProperties.getUserRoles()).thenReturn("/ems2/rest/account/%s");

        ResponseEntity responseEntity = mock(ResponseEntity.class);
        when(responseEntity.getBody()).thenReturn("1234");
        when(restTemplate.getForEntity(anyString(), any())).thenReturn(responseEntity);

        Ems2Result ems2Result = ems2AuthorizationImplementation.getEntitlements("userId", new ArrayList<String>());
        List<Entity> entities = ems2Result.getEntities();
        Assertions.assertNotNull(ems2Result);
        Assertions.assertNotNull(entities);
        Assertions.assertEquals(0, entities.size());
    }

}
