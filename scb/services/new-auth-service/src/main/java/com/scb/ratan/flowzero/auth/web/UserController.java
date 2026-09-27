package com.scb.ratan.flowzero.auth.web;

import com.scb.ratan.flowzero.auth.service.user.IUserService;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @auther Aiden
 * @date 2/11/2026
 **/
@RestController
@RequestMapping(value = "/v1/user")
@Slf4j
@Validated
public class UserController {

    @Autowired
    private IUserService userService;

    @PostMapping(value = "/entitlements")
    public ResponseEntity<?> findEntitlementByBankIds(
        @RequestBody @NotEmpty(message = "bankIds cannot be empty") @Size(max = 100, message = "bankIds size must be <= 100") List<String> bankIds) {

        return ResponseEntity.ok(userService.findEntitlementByBankIds(bankIds));
    }

}
