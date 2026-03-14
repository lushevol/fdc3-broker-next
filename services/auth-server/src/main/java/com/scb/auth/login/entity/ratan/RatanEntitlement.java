package com.scb.auth.login.entity.ratan;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class RatanEntitlement {

    private String role;
    private List<String> actions = new ArrayList<>();

    private String dataEntitlementRoles;

    public List<String> appendActions(List<String> appendActions) {
        actions.addAll(appendActions);
        return Collections.unmodifiableList(actions);
    }

    public List<String> appendAction(String appendAction) {
        actions.add(appendAction);
        return Collections.unmodifiableList(actions);
    }

}
