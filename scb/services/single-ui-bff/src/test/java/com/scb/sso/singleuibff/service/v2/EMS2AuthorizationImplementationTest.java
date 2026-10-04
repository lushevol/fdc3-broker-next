package com.scb.sso.singleuibff.service.v2;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.sso.singleuibff.config.EMS2ConfigProperties;
import com.scb.sso.singleuibff.service.v2.implementation.EMS2AuthorizationImplementation;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.MediaType;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.*;

class EMS2AuthorizationImplementationTest {
    private static final String ROLES = """
        {"accountName":"test-user","fullName":"Test User","entitlementTypes":[
          {"applicationName":"Ratan","roleName":"VIEWER","uniqueName":"10|X_RATANONE|20|VIEWER"}]}
        """;
    private MockRestServiceServer server;
    private EMS2AuthorizationImplementation provider;
    private final ObjectMapper json = new ObjectMapper();

    @BeforeEach
    void setup() {
        RestTemplate http = new RestTemplate();
        server = MockRestServiceServer.bindTo(http).build();
        EMS2ConfigProperties config = new EMS2ConfigProperties();
        config.setUserRoles("https://ems2.test/accounts/%s");
        config.setNewUserAuthorizationOnEntity("https://ems2.test/grants");
        provider = new EMS2AuthorizationImplementation(http, new ObjectMapper(), config);
    }

    @Test
    void providerFailureAbortsAuthorizationInsteadOfReturningEmptyGrants() {
        server.expect(requestTo("https://ems2.test/accounts/test-user")).andRespond(withServerError());
        assertThrows(AuthorizationUnavailableException.class,
            () -> provider.getEntitlements("test-user", List.of("X_RATANONE")));
        server.verify();
    }

    @Test
    void responseForAnotherUserCannotAuthorizeTheRequestedUser() {
        server.expect(requestTo("https://ems2.test/accounts/test-user"))
            .andRespond(withSuccess("{\"accountName\":\"another-user\",\"entitlementTypes\":[]}", MediaType.APPLICATION_JSON));
        assertThrows(AuthorizationUnavailableException.class,
            () -> provider.getEntitlements("test-user", List.of("X_RATANONE")));
    }

    @ParameterizedTest
    @ValueSource(strings = {
        "{\"other-user\":{\"count\":0,\"entitlements\":[]}}",
        "{\"test-user\":{\"entitlements\":[]}}",
        "{\"test-user\":{\"count\":1,\"entitlements\":[]}}",
        "{\"test-user\":{\"count\":0,\"entitlements\":null}}",
        "{\"test-user\":{\"count\":-1,\"entitlements\":[]}}"
    })
    void malformedOrWrongUserGrantResponseAbortsAuthorization(String body) {
        server.expect(requestTo("https://ems2.test/accounts/test-user")).andRespond(withSuccess(ROLES, MediaType.APPLICATION_JSON));
        server.expect(requestTo("https://ems2.test/grants")).andRespond(withSuccess(body, MediaType.APPLICATION_JSON));
        assertThrows(AuthorizationUnavailableException.class,
            () -> provider.getEntitlements("test-user", List.of("X_RATANONE")));
    }

    @Test
    void sameRoleIdInTwoApplicationsCannotLeakSubjectsBetweenApplications() {
        String roles = """
            {"accountName":"test-user","entitlementTypes":[
              {"uniqueName":"10|X_RATANONE|20|VIEWER"},
              {"uniqueName":"11|OTHER|20|VIEWER"}]}
            """;
        server.expect(requestTo("https://ems2.test/accounts/test-user")).andRespond(withSuccess(roles, MediaType.APPLICATION_JSON));
        server.expect(requestTo("https://ems2.test/grants")).andRespond(withSuccess(grantResponse("OTHER", 11), MediaType.APPLICATION_JSON));
        var result = provider.getEntitlements("test-user", List.of("X_RATANONE", "OTHER"));
        assertTrue(result.getEntities().get(0).getSubjects().isEmpty());
        assertEquals("SEARCH", result.getEntities().get(1).getSubjects().get(0).getName());
        assertEquals(90L, result.getEntities().get(1).getSubjects().get(0).getActions().get(0).getEntitlementId());
    }

    private static String grantResponse(String entity, long entityId) {
        return """
            {"test-user":{"count":1,"entitlements":[{
              "id":90,
              "role":{"id":20,"name":"VIEWER","entity":{"id":%d,"name":"%s"}},
              "subject":{"id":30,"name":"SEARCH","longName":"/SEARCH","entity":{"id":%d,"name":"%s"}},
              "action":{"id":40,"name":"READ","entity":{"id":%d,"name":"%s"}}
            }]}}
            """.formatted(entityId, entity, entityId, entity, entityId, entity);
    }

    @ParameterizedTest
    @ValueSource(strings = {"null", "{}", "{\"accountName\":\"test-user\"}",
        "{\"accountName\":\"test-user\",\"status\":\"ERROR\",\"entitlementTypes\":[]}",
        "{\"accountName\":\"test-user\",\"entitlementTypes\":[null]}",
        "{\"accountName\":\"test-user\",\"entitlementTypes\":[{\"uniqueName\":\"\"}]}",
        "{\"accountName\":\"test-user\",\"entitlementTypes\":[{\"uniqueName\":\"0|X_RATANONE|20|VIEWER\"}]}"})
    void malformedRoleResponseIsNotAnEmptySuccess(String body) {
        server.expect(requestTo("https://ems2.test/accounts/test-user")).andRespond(withSuccess(body, MediaType.APPLICATION_JSON));
        assertThrows(AuthorizationUnavailableException.class,
            () -> provider.getEntitlements("test-user", List.of("X_RATANONE")));
    }

    @ParameterizedTest
    @ValueSource(strings = {"roleId", "roleName", "subjectEntity", "actionEntity", "entityId", "subjectId", "actionId", "grantId", "longName"})
    void inconsistentGrantCannotBecomeAValidPermission(String corruption) {
        String body = grantResponse("X_RATANONE", 10);
        body = switch (corruption) {
            case "roleId" -> body.replace("\"id\":20", "\"id\":21");
            case "roleName" -> body.replace("VIEWER", "ADMIN");
            case "subjectEntity" -> body.replace("\"longName\":\"/SEARCH\",\"entity\":{\"id\":10,\"name\":\"X_RATANONE\"}", "\"longName\":\"/SEARCH\",\"entity\":{\"id\":11,\"name\":\"OTHER\"}");
            case "actionEntity" -> body.replace("\"name\":\"READ\",\"entity\":{\"id\":10", "\"name\":\"READ\",\"entity\":{\"id\":11");
            case "entityId" -> body.replace("\"id\":10", "\"id\":11");
            case "subjectId" -> body.replace("\"id\":30", "\"id\":0");
            case "actionId" -> body.replace("\"id\":40", "\"id\":null");
            case "grantId" -> body.replace("\"id\":90", "\"id\":-1");
            default -> body.replace("\"longName\":\"/SEARCH\"", "\"longName\":null");
        };
        server.expect(requestTo("https://ems2.test/accounts/test-user")).andRespond(withSuccess(ROLES, MediaType.APPLICATION_JSON));
        server.expect(requestTo("https://ems2.test/grants")).andRespond(withSuccess(body, MediaType.APPLICATION_JSON));
        assertThrows(AuthorizationUnavailableException.class,
            () -> provider.getEntitlements("test-user", List.of("X_RATANONE")));
    }

    @Test
    void emptyScopeMakesNoProviderCallAndInvalidRequestsAreRejected() {
        assertTrue(provider.getEntitlements("test-user", List.of()).getEntities().isEmpty());
        assertThrows(AuthorizationUnavailableException.class, () -> provider.getEntitlements(null, List.of("X_RATANONE")));
        assertThrows(AuthorizationUnavailableException.class, () -> provider.getEntitlements(" ", List.of("X_RATANONE")));
        assertThrows(AuthorizationUnavailableException.class, () -> provider.getEntitlements("test-user", null));
        server.verify();
    }

    @ParameterizedTest
    @ValueSource(strings = {"{\"accountName\":\"test-user\",\"entitlementTypes\":[]}",
        "{\"accountName\":\"test-user\",\"status\":\"SUCCESS\",\"entitlementTypes\":[{\"uniqueName\":\"11|OTHER|21|VIEWER\"}]}"})
    void validNoRolesOrOnlyUnselectedRolesReturnNoEntities(String body) {
        server.expect(requestTo("https://ems2.test/accounts/test-user")).andRespond(withSuccess(body, MediaType.APPLICATION_JSON));
        assertTrue(provider.getEntitlements("test-user", List.of("X_RATANONE")).getEntities().isEmpty());
        server.verify();
    }

    @ParameterizedTest
    @ValueSource(strings = {"", "bad", "10||20|VIEWER", "10|X_RATANONE|20|", "10|X_RATANONE|0|VIEWER", "x|X_RATANONE|20|VIEWER"})
    void rejectsUnusableRoleIdentities(String identity) {
        server.expect(requestTo("https://ems2.test/accounts/test-user"))
            .andRespond(withSuccess(ROLES.replace("10|X_RATANONE|20|VIEWER", identity), MediaType.APPLICATION_JSON));
        assertThrows(AuthorizationUnavailableException.class, () -> provider.getEntitlements("test-user", List.of("X_RATANONE")));
    }

    @ParameterizedTest
    @ValueSource(strings = {"{}", "[]", "null", "{\"test-user\":{\"count\":9999999999999999,\"entitlements\":[]}}",
        "{\"test-user\":{\"count\":\"0\",\"entitlements\":[]}}", "not-json"})
    void rejectsInvalidGrantEnvelope(String body) {
        server.expect(requestTo("https://ems2.test/accounts/test-user")).andRespond(withSuccess(ROLES, MediaType.APPLICATION_JSON));
        server.expect(requestTo("https://ems2.test/grants")).andRespond(withSuccess(body, MediaType.APPLICATION_JSON));
        assertThrows(AuthorizationUnavailableException.class, () -> provider.getEntitlements("test-user", List.of("X_RATANONE")));
    }

    @Test
    void explicitEmptyGrantsKeepAssignedRoleWithoutSubjects() {
        server.expect(requestTo("https://ems2.test/accounts/test-user")).andRespond(withSuccess(ROLES, MediaType.APPLICATION_JSON));
        server.expect(requestTo("https://ems2.test/grants"))
            .andRespond(withSuccess("{\"test-user\":{\"count\":0,\"entitlements\":[]}}", MediaType.APPLICATION_JSON));
        var result = provider.getEntitlements("test-user", List.of("X_RATANONE"));
        assertEquals("Test User", result.getFullName());
        assertEquals("VIEWER", result.getEntities().get(0).getRoleName());
        assertTrue(result.getEntities().get(0).getSubjects().isEmpty());
    }

    @ParameterizedTest
    @ValueSource(strings = {"valid", "conflictingName", "conflictingLongName", "duplicateGrant", "secondSubject"})
    void groupsActionsOnlyWhenSubjectIdentityIsConsistent(String variation) throws Exception {
        var root = json.readTree(grantResponse("X_RATANONE", 10));
        var grants = (com.fasterxml.jackson.databind.node.ArrayNode) root.at("/test-user/entitlements");
        var second = (com.fasterxml.jackson.databind.node.ObjectNode) grants.get(0).deepCopy();
        second.put("id", variation.equals("duplicateGrant") ? 90 : 91);
        ((com.fasterxml.jackson.databind.node.ObjectNode) second.get("action")).put("id", 41).put("name", "WRITE");
        var subject = (com.fasterxml.jackson.databind.node.ObjectNode) second.get("subject");
        if (variation.equals("conflictingName")) subject.put("name", "ADMIN");
        if (variation.equals("conflictingLongName")) subject.put("longName", "/ADMIN");
        if (variation.equals("secondSubject")) subject.put("id", 31).put("name", "OTHER").put("longName", "/OTHER");
        grants.add(second);
        ((com.fasterxml.jackson.databind.node.ObjectNode) root.get("test-user")).put("count", 2);
        server.expect(requestTo("https://ems2.test/accounts/test-user")).andRespond(withSuccess(ROLES, MediaType.APPLICATION_JSON));
        server.expect(requestTo("https://ems2.test/grants")).andRespond(withSuccess(root.toString(), MediaType.APPLICATION_JSON));
        if (variation.equals("valid")) {
            var subjects = provider.getEntitlements("test-user", List.of("X_RATANONE")).getEntities().get(0).getSubjects();
            assertEquals(1, subjects.size());
            assertEquals(List.of("READ", "WRITE"), subjects.get(0).getActions().stream().map(a -> a.getName()).toList());
        } else if (variation.equals("secondSubject")) {
            assertEquals(2, provider.getEntitlements("test-user", List.of("X_RATANONE")).getEntities().get(0).getSubjects().size());
        } else {
            assertThrows(AuthorizationUnavailableException.class, () -> provider.getEntitlements("test-user", List.of("X_RATANONE")));
        }
    }

    @Test
    void redirectsAndDuplicateJsonKeysAreNotAcceptedAsSuccess() {
        server.expect(requestTo("https://ems2.test/accounts/test-user"))
            .andRespond(withStatus(org.springframework.http.HttpStatus.FOUND).body(ROLES).contentType(MediaType.APPLICATION_JSON));
        assertThrows(AuthorizationUnavailableException.class, () -> provider.getEntitlements("test-user", List.of("X_RATANONE")));
        server.reset();
        server.expect(requestTo("https://ems2.test/accounts/test-user"))
            .andRespond(withSuccess(ROLES.replace("\"accountName\":", "\"accountName\":\"other-user\",\"accountName\":"), MediaType.APPLICATION_JSON));
        assertThrows(AuthorizationUnavailableException.class, () -> provider.getEntitlements("test-user", List.of("X_RATANONE")));
    }

    @ParameterizedTest
    @ValueSource(strings = {"account", "grants"})
    void rejectsTrailingJsonAfterAnOtherwiseValidResponse(String endpoint) {
        server.expect(requestTo("https://ems2.test/accounts/test-user"))
            .andRespond(withSuccess(ROLES + (endpoint.equals("account") ? " {}" : ""), MediaType.APPLICATION_JSON));
        if (endpoint.equals("grants")) {
            server.expect(requestTo("https://ems2.test/grants"))
                .andRespond(withSuccess(grantResponse("X_RATANONE", 10) + " {}", MediaType.APPLICATION_JSON));
        }
        assertThrows(AuthorizationUnavailableException.class, () -> provider.getEntitlements("test-user", List.of("X_RATANONE")));
    }

    @ParameterizedTest
    @ValueSource(strings = {"{}", "[]", "123", "true"})
    void rejectsWrongTypeAccountStatus(String status) {
        server.expect(requestTo("https://ems2.test/accounts/test-user"))
            .andRespond(withSuccess("{\"accountName\":\"test-user\",\"entitlementTypes\":[],\"status\":" + status + "}", MediaType.APPLICATION_JSON));
        assertThrows(AuthorizationUnavailableException.class, () -> provider.getEntitlements("test-user", List.of("X_RATANONE")));
    }
}
