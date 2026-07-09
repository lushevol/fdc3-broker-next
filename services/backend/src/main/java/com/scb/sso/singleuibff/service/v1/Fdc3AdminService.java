package com.scb.sso.singleuibff.service.v1;

import com.scb.sso.singleuibff.dto.request.RequestOfFdc3Declaration;
import com.scb.sso.singleuibff.dto.request.RequestOfFdc3Context;
import com.scb.sso.singleuibff.dto.request.RequestOfFdc3Intent;
import com.scb.sso.singleuibff.exceptions.RecordNotCreatedException;
import com.scb.sso.singleuibff.exceptions.RecordNotFoundException;
import com.scb.sso.singleuibff.exceptions.RecordNotUpdatedException;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;
import java.util.Map;

public interface Fdc3AdminService {

    List<Map<String, Object>> listDeclarations(String entitlementsToken, HttpServletRequest request);

    Map<String, Object> createDeclaration(RequestOfFdc3Declaration declaration, HttpServletRequest request)
            throws RecordNotCreatedException;

    Map<String, Object> updateDeclaration(RequestOfFdc3Declaration declaration, HttpServletRequest request)
            throws RecordNotCreatedException, RecordNotFoundException, RecordNotUpdatedException;

    Map<String, Object> deleteDeclaration(RequestOfFdc3Declaration declaration, HttpServletRequest request)
            throws RecordNotCreatedException, RecordNotFoundException, RecordNotUpdatedException;

    List<Map<String, Object>> listIntents(String entitlementsToken, HttpServletRequest request);

    Map<String, Object> createIntent(RequestOfFdc3Intent intent, HttpServletRequest request)
            throws RecordNotCreatedException;

    Map<String, Object> updateIntent(RequestOfFdc3Intent intent, HttpServletRequest request)
            throws RecordNotCreatedException, RecordNotFoundException, RecordNotUpdatedException;

    Map<String, Object> deleteIntent(RequestOfFdc3Intent intent, HttpServletRequest request)
            throws RecordNotCreatedException, RecordNotFoundException, RecordNotUpdatedException;

    List<Map<String, Object>> listContexts(String entitlementsToken, HttpServletRequest request);

    Map<String, Object> createContext(RequestOfFdc3Context context, HttpServletRequest request)
            throws RecordNotCreatedException;

    Map<String, Object> updateContext(RequestOfFdc3Context context, HttpServletRequest request)
            throws RecordNotCreatedException, RecordNotFoundException, RecordNotUpdatedException;

    Map<String, Object> deleteContext(RequestOfFdc3Context context, HttpServletRequest request)
            throws RecordNotCreatedException, RecordNotFoundException, RecordNotUpdatedException;
}
