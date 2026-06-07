package com.scb.ratan.flowzero.designer.controller;

import com.scb.ratan.flowzero.designer.entity.dto.BasePageDto;
import com.scb.ratan.flowzero.designer.entity.dto.CreateUserDto;
import com.scb.ratan.flowzero.designer.entity.dto.UpdateUserDto;
import com.scb.ratan.flowzero.designer.entity.dto.UserQueryDto;
import com.scb.ratan.flowzero.designer.service.IUserService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @auther Aiden
 * @date 2/11/2026
 **/
@RestController
@RequestMapping(value = "/api/v1/user")
@Slf4j
public class UserController {

    @Autowired
    private IUserService userService;

    /**
     * Query users with pagination
     */
    @GetMapping(value = "/page")
    public ResponseEntity<?> page(UserQueryDto queryDto, @Valid BasePageDto basePageDto) {
        return ResponseEntity.ok(userService.page(queryDto, basePageDto));
    }

    /**
     * Search users by conditions
     */
    @GetMapping(value = "/search")
    public ResponseEntity<?> search(UserQueryDto queryDto) {
        return ResponseEntity.ok(userService.searchByConditions(queryDto));
    }

    /**
     * Create a new user
     */
    @PostMapping(value = "/create")
    public ResponseEntity<?> create(@Valid @RequestBody CreateUserDto userDto) {
        return ResponseEntity.ok(userService.create(userDto));
    }

    /**
     * Update an existing user
     */
    @PostMapping(value = "/update")
    public ResponseEntity<?> update(@Valid @RequestBody UpdateUserDto userDto) {
        return ResponseEntity.ok(userService.update(userDto));
    }

    /**
     * Delete a user by ID
     */
    @DeleteMapping(value = "/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        userService.delete(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    /**
     * Get user detail by ID
     */
    @GetMapping(value = "/detail/{id}")
    public ResponseEntity<?> detail(@PathVariable String id) {
        return ResponseEntity.ok(userService.findById(id));
    }

    /**
     * Get user by bankId
     */
    @GetMapping(value = "/bankId/{bankId}")
    public ResponseEntity<?> findByBankId(@PathVariable String bankId) {
        return ResponseEntity.ok(userService.findByBankId(bankId));
    }

    /**
     * Get user by email
     */
    @GetMapping(value = "/email/{email}")
    public ResponseEntity<?> findByEmail(@PathVariable String email) {
        return ResponseEntity.ok(userService.findByEmail(email));
    }

    /**
     * Get users by country code
     */
    @GetMapping(value = "/country/{countryCode}")
    public ResponseEntity<?> findByCountryCode(@PathVariable String countryCode) {
        return ResponseEntity.ok(userService.findByCountryCode(countryCode));
    }

    /**
     * Get users by user name (fuzzy search)
     */
    @GetMapping(value = "/userName/{userName}")
    public ResponseEntity<?> findByUserName(@PathVariable String userName) {
        return ResponseEntity.ok(userService.findByUserName(userName));
    }

    /**
     * Get all users
     */
    @GetMapping(value = "/all")
    public ResponseEntity<?> findAll() {
        return ResponseEntity.ok(userService.findAll());
    }

    /**
     * Get users by role name (exact match)
     */
    @GetMapping(value = "/role/{roleName}")
    public ResponseEntity<?> findByRoleName(@PathVariable String roleName) {
        return ResponseEntity.ok(userService.findByRoleName(roleName));
    }

    /**
     * Get users by a list of bankIds.
     * Accepts a JSON array of bankId strings in the request body.
     */
    @PostMapping(value = "/bankIds")
    public ResponseEntity<?> findByBankIds(@RequestBody List<String> bankIds) {
        return ResponseEntity.ok(userService.findByBankIds(bankIds));
    }

}
