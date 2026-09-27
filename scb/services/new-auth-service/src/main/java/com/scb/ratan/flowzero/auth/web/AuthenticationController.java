package com.scb.ratan.flowzero.auth.web;

import com.scb.ratan.flowzero.auth.authentication.IAuthenticationService;
import com.scb.ratan.flowzero.auth.entity.dto.AuthenticationPayloadDto;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@Slf4j
@RestController
public class AuthenticationController {

    @Autowired
    private IAuthenticationService authenticationService;

    @PostMapping(path = "/v1/authenticate")
    public ResponseEntity<AuthenticationPayloadDto> authenticate(HttpServletRequest httpServletRequest) {

        Mono<AuthenticationPayloadDto> authenticate = authenticationService.authenticate(httpServletRequest);

        return authenticate.map(payload -> ResponseEntity.ok().body(payload)).onErrorResume(e -> {
            log.error("Authentication failed: {}", e.getMessage(), e);
            return Mono.just(ResponseEntity.status(401).build());
        }).block();
    }

    /**
     * Health check endpoint for the sync service.
     * Can be used to verify the service is running and accessible.
     *
     * @return simple OK response
     */
    @PostMapping("/v1/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Entitlement sync service is running");
    }

}
