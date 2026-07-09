package com.scb.sso.singleuibff.controller.v1;

import com.scb.sso.singleuibff.dto.request.RequestOfFdc3Context;
import com.scb.sso.singleuibff.dto.request.RequestOfFdc3Declaration;
import com.scb.sso.singleuibff.dto.request.RequestOfFdc3Intent;
import com.scb.sso.singleuibff.dto.response.ResponseOfAdminModule;
import com.scb.sso.singleuibff.exceptions.JwtException;
import com.scb.sso.singleuibff.exceptions.RecordNotCreatedException;
import com.scb.sso.singleuibff.exceptions.RecordNotFoundException;
import com.scb.sso.singleuibff.exceptions.RecordNotUpdatedException;
import com.scb.sso.singleuibff.service.v1.Fdc3AdminService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class FDC3AdminController {

    private final Fdc3AdminService fdc3AdminService;

    @PostMapping(value = "v1/fmo/admin/fdc3/data")
    public ResponseEntity<?> getDeclarations(@NotNull @RequestBody RequestOfFdc3Declaration request,
            HttpServletRequest httpServletRequest) {
        try {
            return ResponseEntity.ok().body(ResponseOfAdminModule.builder()
                    .result(true)
                    .data(fdc3AdminService.listDeclarations(request.getEntitlementsToken(), httpServletRequest))
                    .build());
        } catch (JwtException exception) {
            return badRequest(exception.getMessage());
        }
    }

    @PostMapping(value = "v1/fmo/admin/fdc3/create")
    public ResponseEntity<?> createDeclaration(@NotNull @RequestBody RequestOfFdc3Declaration request,
            HttpServletRequest httpServletRequest) {
        try {
            return ResponseEntity.ok().body(ResponseOfAdminModule.builder()
                    .result(true)
                    .data(fdc3AdminService.createDeclaration(request, httpServletRequest))
                    .build());
        } catch (RecordNotCreatedException | JwtException exception) {
            return badRequest(exception.getMessage());
        }
    }

    @PostMapping(value = "v1/fmo/admin/fdc3/update")
    public ResponseEntity<?> updateDeclaration(@NotNull @RequestBody RequestOfFdc3Declaration request,
            HttpServletRequest httpServletRequest) {
        try {
            return ResponseEntity.ok().body(ResponseOfAdminModule.builder()
                    .result(true)
                    .data(fdc3AdminService.updateDeclaration(request, httpServletRequest))
                    .build());
        } catch (RecordNotFoundException | RecordNotUpdatedException | RecordNotCreatedException | JwtException exception) {
            return badRequest(exception.getMessage());
        }
    }

    @PostMapping(value = "v1/fmo/admin/fdc3/delete")
    public ResponseEntity<?> deleteDeclaration(@NotNull @RequestBody RequestOfFdc3Declaration request,
            HttpServletRequest httpServletRequest) {
        try {
            return ResponseEntity.ok().body(ResponseOfAdminModule.builder()
                    .result(true)
                    .data(fdc3AdminService.deleteDeclaration(request, httpServletRequest))
                    .build());
        } catch (RecordNotFoundException | RecordNotUpdatedException | RecordNotCreatedException | JwtException exception) {
            return badRequest(exception.getMessage());
        }
    }

    @PostMapping(value = "v1/fmo/admin/fdc3/intent/data")
    public ResponseEntity<?> getIntents(@NotNull @RequestBody RequestOfFdc3Intent request,
            HttpServletRequest httpServletRequest) {
        try {
            return ResponseEntity.ok().body(ResponseOfAdminModule.builder()
                    .result(true)
                    .data(fdc3AdminService.listIntents(request.getEntitlementsToken(), httpServletRequest))
                    .build());
        } catch (JwtException exception) {
            return badRequest(exception.getMessage());
        }
    }

    @PostMapping(value = "v1/fmo/admin/fdc3/intent/create")
    public ResponseEntity<?> createIntent(@NotNull @RequestBody RequestOfFdc3Intent request,
            HttpServletRequest httpServletRequest) {
        try {
            return ResponseEntity.ok().body(ResponseOfAdminModule.builder()
                    .result(true)
                    .data(fdc3AdminService.createIntent(request, httpServletRequest))
                    .build());
        } catch (RecordNotCreatedException | JwtException exception) {
            return badRequest(exception.getMessage());
        }
    }

    @PostMapping(value = "v1/fmo/admin/fdc3/intent/update")
    public ResponseEntity<?> updateIntent(@NotNull @RequestBody RequestOfFdc3Intent request,
            HttpServletRequest httpServletRequest) {
        try {
            return ResponseEntity.ok().body(ResponseOfAdminModule.builder()
                    .result(true)
                    .data(fdc3AdminService.updateIntent(request, httpServletRequest))
                    .build());
        } catch (RecordNotCreatedException | RecordNotFoundException | RecordNotUpdatedException | JwtException exception) {
            return badRequest(exception.getMessage());
        }
    }

    @PostMapping(value = "v1/fmo/admin/fdc3/intent/delete")
    public ResponseEntity<?> deleteIntent(@NotNull @RequestBody RequestOfFdc3Intent request,
            HttpServletRequest httpServletRequest) {
        try {
            return ResponseEntity.ok().body(ResponseOfAdminModule.builder()
                    .result(true)
                    .data(fdc3AdminService.deleteIntent(request, httpServletRequest))
                    .build());
        } catch (RecordNotCreatedException | RecordNotFoundException | RecordNotUpdatedException | JwtException exception) {
            return badRequest(exception.getMessage());
        }
    }

    @PostMapping(value = "v1/fmo/admin/fdc3/context/data")
    public ResponseEntity<?> getContexts(@NotNull @RequestBody RequestOfFdc3Context request,
            HttpServletRequest httpServletRequest) {
        try {
            return ResponseEntity.ok().body(ResponseOfAdminModule.builder()
                    .result(true)
                    .data(fdc3AdminService.listContexts(request.getEntitlementsToken(), httpServletRequest))
                    .build());
        } catch (JwtException exception) {
            return badRequest(exception.getMessage());
        }
    }

    @PostMapping(value = "v1/fmo/admin/fdc3/context/create")
    public ResponseEntity<?> createContext(@NotNull @RequestBody RequestOfFdc3Context request,
            HttpServletRequest httpServletRequest) {
        try {
            return ResponseEntity.ok().body(ResponseOfAdminModule.builder()
                    .result(true)
                    .data(fdc3AdminService.createContext(request, httpServletRequest))
                    .build());
        } catch (RecordNotCreatedException | JwtException exception) {
            return badRequest(exception.getMessage());
        }
    }

    @PostMapping(value = "v1/fmo/admin/fdc3/context/update")
    public ResponseEntity<?> updateContext(@NotNull @RequestBody RequestOfFdc3Context request,
            HttpServletRequest httpServletRequest) {
        try {
            return ResponseEntity.ok().body(ResponseOfAdminModule.builder()
                    .result(true)
                    .data(fdc3AdminService.updateContext(request, httpServletRequest))
                    .build());
        } catch (RecordNotCreatedException | RecordNotFoundException | RecordNotUpdatedException | JwtException exception) {
            return badRequest(exception.getMessage());
        }
    }

    @PostMapping(value = "v1/fmo/admin/fdc3/context/delete")
    public ResponseEntity<?> deleteContext(@NotNull @RequestBody RequestOfFdc3Context request,
            HttpServletRequest httpServletRequest) {
        try {
            return ResponseEntity.ok().body(ResponseOfAdminModule.builder()
                    .result(true)
                    .data(fdc3AdminService.deleteContext(request, httpServletRequest))
                    .build());
        } catch (RecordNotCreatedException | RecordNotFoundException | RecordNotUpdatedException | JwtException exception) {
            return badRequest(exception.getMessage());
        }
    }

    private ResponseEntity<ResponseOfAdminModule> badRequest(String message) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ResponseOfAdminModule.builder().result(false).errorMessage(message).build());
    }
}
