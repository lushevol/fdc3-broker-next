package com.scb.sso.singleuibff.service.v1.implementation;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.sso.singleuibff.dto.request.RequestOfFdc3Declaration;
import com.scb.sso.singleuibff.dto.request.RequestOfFdc3Intent;
import com.scb.sso.singleuibff.entity.Fdc3Declaration;
import com.scb.sso.singleuibff.entity.Fdc3Intent;
import com.scb.sso.singleuibff.exceptions.RecordNotCreatedException;
import com.scb.sso.singleuibff.exceptions.RecordNotFoundException;
import com.scb.sso.singleuibff.exceptions.RecordNotUpdatedException;
import com.scb.sso.singleuibff.repository.Fdc3DeclarationRepo;
import com.scb.sso.singleuibff.repository.Fdc3IntentRepo;
import com.scb.sso.singleuibff.service.v1.Fdc3AdminService;
import com.scb.sso.singleuibff.util.AdminModuleUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.apache.commons.lang3.StringUtils;

import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@AllArgsConstructor
public class Fdc3AdminServiceImpl implements Fdc3AdminService {

    private final Fdc3DeclarationRepo declarationRepo;
    private final Fdc3IntentRepo intentRepo;
    private final AdminModuleUtil adminModuleUtil;
    private final ObjectMapper objectMapper;

    @Override
    public List<Map<String, Object>> listDeclarations(String entitlementsToken, HttpServletRequest request) {
        Map<String, String> payload = adminModuleUtil.validate(request, entitlementsToken);
        return declarationRepo.findByEms2RoleAndIsActiveOrderByUpdatedAtDesc(payload.get("ems2Role"), true)
                .stream()
                .map(this::toDeclarationResponse)
                .toList();
    }

    @Override
    public Map<String, Object> createDeclaration(RequestOfFdc3Declaration declaration, HttpServletRequest request)
            throws RecordNotCreatedException {
        Map<String, String> payload = adminModuleUtil.validate(request, declaration.getEntitlementsToken());
        String appId = requireAppId(declaration.getAppId(), "FDC3 declaration appId is required.");
        String ems2Role = payload.get("ems2Role");

        if (declarationRepo.existsByAppIdAndEms2RoleAndIsActive(appId, ems2Role, true)) {
            throw RecordNotCreatedException.builder().message("FDC3 declaration already exists.").build();
        }

        Date now = new Date();
        Fdc3Declaration saved = declarationRepo.save(Fdc3Declaration.builder()
                .appId(appId)
                .interopJson(writeJson(defaultInterop(declaration.getInterop())))
                .ems2Role(ems2Role)
                .isActive(true)
                .createdAt(now)
                .updatedAt(now)
                .createdBy(payload.get("sub"))
                .updatedBy(payload.get("sub"))
                .build());
        return toDeclarationResponse(saved);
    }

    @Override
    public Map<String, Object> updateDeclaration(RequestOfFdc3Declaration declaration, HttpServletRequest request)
            throws RecordNotCreatedException, RecordNotFoundException, RecordNotUpdatedException {
        Map<String, String> payload = adminModuleUtil.validate(request, declaration.getEntitlementsToken());
        String appId = requireAppId(declaration.getAppId(), "FDC3 declaration appId is required.");
        Fdc3Declaration existing = findActiveDeclaration(appId, payload.get("ems2Role"));

        existing.setInteropJson(writeJson(defaultInterop(declaration.getInterop())));
        existing.setUpdatedAt(new Date());
        existing.setUpdatedBy(payload.get("sub"));

        try {
            return toDeclarationResponse(declarationRepo.save(existing));
        } catch (RuntimeException exception) {
            throw RecordNotUpdatedException.builder().message("FDC3 declaration not updated.").build();
        }
    }

    @Override
    public Map<String, Object> deleteDeclaration(RequestOfFdc3Declaration declaration, HttpServletRequest request)
            throws RecordNotCreatedException, RecordNotFoundException, RecordNotUpdatedException {
        Map<String, String> payload = adminModuleUtil.validate(request, declaration.getEntitlementsToken());
        String appId = requireAppId(declaration.getAppId(), "FDC3 declaration appId is required.");
        Fdc3Declaration existing = findActiveDeclaration(appId, payload.get("ems2Role"));

        existing.setActive(false);
        existing.setUpdatedAt(new Date());
        existing.setUpdatedBy(payload.get("sub"));

        try {
            return toDeclarationResponse(declarationRepo.save(existing));
        } catch (RuntimeException exception) {
            throw RecordNotUpdatedException.builder().message("FDC3 declaration not deleted.").build();
        }
    }

    @Override
    public List<Map<String, Object>> listIntents(String entitlementsToken, HttpServletRequest request) {
        Map<String, String> payload = adminModuleUtil.validate(request, entitlementsToken);
        return intentRepo.findByEms2RoleAndIsActiveOrderByUpdatedAtDesc(payload.get("ems2Role"), true)
                .stream()
                .map(this::toIntentResponse)
                .toList();
    }

    @Override
    public Map<String, Object> createIntent(RequestOfFdc3Intent intent, HttpServletRequest request)
            throws RecordNotCreatedException {
        Map<String, String> payload = adminModuleUtil.validate(request, intent.getEntitlementsToken());
        String name = requireName(intent.getName(), "FDC3 intent name is required.");
        String ems2Role = payload.get("ems2Role");

        if (intentRepo.existsByNameAndEms2RoleAndIsActive(name, ems2Role, true)) {
            throw RecordNotCreatedException.builder().message("FDC3 intent already exists.").build();
        }

        Date now = new Date();
        Fdc3Intent saved = intentRepo.save(Fdc3Intent.builder()
                .name(name)
                .description(StringUtils.defaultString(intent.getDescription()))
                .ems2Role(ems2Role)
                .isActive(true)
                .createdAt(now)
                .updatedAt(now)
                .createdBy(payload.get("sub"))
                .updatedBy(payload.get("sub"))
                .build());
        return toIntentResponse(saved);
    }

    @Override
    public Map<String, Object> updateIntent(RequestOfFdc3Intent intent, HttpServletRequest request)
            throws RecordNotCreatedException, RecordNotFoundException, RecordNotUpdatedException {
        Map<String, String> payload = adminModuleUtil.validate(request, intent.getEntitlementsToken());
        Fdc3Intent existing = findActiveIntent(requireName(intent.getName(), "FDC3 intent name is required."),
                payload.get("ems2Role"));

        existing.setDescription(StringUtils.defaultString(intent.getDescription()));
        existing.setUpdatedAt(new Date());
        existing.setUpdatedBy(payload.get("sub"));

        try {
            return toIntentResponse(intentRepo.save(existing));
        } catch (RuntimeException exception) {
            throw RecordNotUpdatedException.builder().message("FDC3 intent not updated.").build();
        }
    }

    @Override
    public Map<String, Object> deleteIntent(RequestOfFdc3Intent intent, HttpServletRequest request)
            throws RecordNotCreatedException, RecordNotFoundException, RecordNotUpdatedException {
        Map<String, String> payload = adminModuleUtil.validate(request, intent.getEntitlementsToken());
        Fdc3Intent existing = findActiveIntent(requireName(intent.getName(), "FDC3 intent name is required."),
                payload.get("ems2Role"));

        existing.setActive(false);
        existing.setUpdatedAt(new Date());
        existing.setUpdatedBy(payload.get("sub"));

        try {
            return toIntentResponse(intentRepo.save(existing));
        } catch (RuntimeException exception) {
            throw RecordNotUpdatedException.builder().message("FDC3 intent not deleted.").build();
        }
    }

    private Fdc3Declaration findActiveDeclaration(String appId, String ems2Role) throws RecordNotFoundException {
        return declarationRepo.findByAppIdAndEms2RoleAndIsActive(appId, ems2Role, true)
                .orElseThrow(() -> RecordNotFoundException.builder().message("FDC3 declaration not found.").build());
    }

    private Fdc3Intent findActiveIntent(String name, String ems2Role) throws RecordNotFoundException {
        return intentRepo.findByNameAndEms2RoleAndIsActive(name, ems2Role, true)
                .orElseThrow(() -> RecordNotFoundException.builder().message("FDC3 intent not found.").build());
    }

    private Map<String, Object> toDeclarationResponse(Fdc3Declaration declaration) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("appId", declaration.getAppId());
        response.put("interop", readJsonObject(declaration.getInteropJson()));
        return response;
    }

    private Map<String, Object> toIntentResponse(Fdc3Intent intent) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("name", intent.getName());
        response.put("description", intent.getDescription());
        return response;
    }

    private String requireAppId(String appId, String message) throws RecordNotCreatedException {
        if (StringUtils.isBlank(appId)) {
            throw RecordNotCreatedException.builder().message(message).build();
        }
        return appId.trim();
    }

    private String requireName(String name, String message) throws RecordNotCreatedException {
        if (StringUtils.isBlank(name)) {
            throw RecordNotCreatedException.builder().message(message).build();
        }
        return name.trim();
    }

    private Map<String, Object> defaultInterop(Map<String, Object> interop) {
        if (interop == null) {
            return Map.of("intents", Map.of("listensFor", List.of(), "raises", List.of()));
        }
        return interop;
    }

    private String writeJson(Object value) throws RecordNotCreatedException {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (Exception exception) {
            throw RecordNotCreatedException.builder().message("FDC3 declaration JSON is invalid.").build();
        }
    }

    private Map<String, Object> readJsonObject(String value) {
        try {
            return objectMapper.readValue(value, new TypeReference<>() {
            });
        } catch (Exception exception) {
            return Map.of("intents", Map.of("listensFor", List.of(), "raises", List.of()));
        }
    }
}
