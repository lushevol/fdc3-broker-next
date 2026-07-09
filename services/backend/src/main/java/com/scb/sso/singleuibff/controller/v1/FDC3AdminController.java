package com.scb.sso.singleuibff.controller.v1;

import com.scb.sso.singleuibff.dto.request.RequestOfFdc3Declaration;
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

    private ResponseEntity<ResponseOfAdminModule> badRequest(String message) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ResponseOfAdminModule.builder().result(false).errorMessage(message).build());
    }
}
