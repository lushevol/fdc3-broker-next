package com.scb.sso.singleuibff.poc;

import com.scb.sso.singleuibff.dto.ems2.v2.Action;
import com.scb.sso.singleuibff.dto.ems2.v2.Ems2Result;
import com.scb.sso.singleuibff.dto.ems2.v2.Entity;
import com.scb.sso.singleuibff.dto.ems2.v2.Subject;
import com.scb.sso.singleuibff.service.v2.AuthorizationService;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;

/** Local EMS2 stand-in used only to exercise mixed-provider routing. */
public final class FixtureEms2 implements AuthorizationService {
    private static final String RATAN_ENTITY = "X_RATANONE";
    private final AtomicInteger calls = new AtomicInteger();
    private final List<List<String>> scopes = new ArrayList<>();
    private volatile RuntimeException failure;

    @Override
    public synchronized Ems2Result getEntitlements(String userId, List<String> requestEntities) {
        calls.incrementAndGet();
        scopes.add(List.copyOf(requestEntities));
        if (failure != null) {
            throw failure;
        }
        if (userId == null || userId.isBlank() || requestEntities == null || requestEntities.isEmpty()) {
            throw new IllegalStateException("Invalid EMS2 fixture request");
        }
        var result = new Ems2Result();
        var entities = new ArrayList<Entity>();
        if (Set.of("poc-ratan", "poc-both", "poc-two-roles").contains(userId)
            && requestEntities.contains(RATAN_ENTITY)) {
            entities.add(ratanEntity());
            if (userId.equals("poc-two-roles")) {
                entities.add(ratanKoreaEntity());
            }
        }
        result.setEntities(List.copyOf(entities));
        result.setAccountName(userId);
        result.setStatus("SUCCESS");
        return result;
    }

    public synchronized void fail(RuntimeException exception) {
        failure = exception;
    }

    public int calls() {
        return calls.get();
    }

    public synchronized List<List<String>> scopes() {
        return List.copyOf(scopes);
    }

    private static Entity ratanEntity() {
        var entity = new Entity();
        entity.setId(1L);
        entity.setName(RATAN_ENTITY);
        entity.setApplicationName("RATAN_ENTITLEMENT_RULE");
        entity.setRoleId(10060L);
        entity.setRoleName("FMO_COO_SUP");
        entity.setSubjects(List.of(
            subject("RATAN_TRADE_BLOTTER", "/RATAN_TRADE_BLOTTER", "ACCESS_FMO_POST_TRADE_PORTAL"),
            subject("RATAN_FM_COO_RULE", "/RATAN_FM_COO_RULE", "ACCESS_FMO_POST_TRADE_PORTAL"),
            subject("RATAN_FM_COO_EXCEPTION", "/RATAN_FM_COO_EXCEPTION", "ACCESS_FMO_POST_TRADE_PORTAL")));
        return entity;
    }

    private static Entity ratanKoreaEntity() {
        var entity = new Entity();
        entity.setId(1L);
        entity.setName(RATAN_ENTITY);
        entity.setApplicationName("RATAN_ENTITLEMENT_RULE");
        entity.setRoleId(10061L);
        entity.setRoleName("FMO_KR_OPS");
        entity.setSubjects(List.of(subject("RATAN_KR_EXCEPTION", "/RATAN_KR_EXCEPTION",
            "ACCESS_FMO_POST_TRADE_PORTAL")));
        return entity;
    }

    private static Subject subject(String name, String longName, String... actionNames) {
        var subject = new Subject();
        subject.setName(name);
        subject.setLongName(longName);
        subject.setActions(List.of(actionNames).stream().map(actionName -> {
            var action = new Action();
            action.setName(actionName);
            return action;
        }).toList());
        return subject;
    }
}
