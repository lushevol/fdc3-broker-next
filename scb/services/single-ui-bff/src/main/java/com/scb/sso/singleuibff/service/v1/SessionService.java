package com.scb.sso.singleuibff.service.v1;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.scb.sso.singleuibff.entity.ApplicationSession;
import com.scb.sso.singleuibff.exceptions.RecordNotCreatedException;

public interface SessionService {

    void create(String sessionId);

    void validateSession(String sessionId) throws JsonProcessingException;

}
