package com.scb.sso.singleuibff.service.v1;

import com.scb.sso.singleuibff.dto.request.RequestOfFdc3Declaration;
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
}
