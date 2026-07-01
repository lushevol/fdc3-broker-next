package com.scb.ratan.flowzero.designer.controller;

import com.scb.ratan.flowzero.designer.common.enums.UserSettingsTypeEnum;
import com.scb.ratan.flowzero.designer.common.exception.BusinessException;
import com.scb.ratan.flowzero.designer.entity.dto.UserSettingsSaveDto;
import com.scb.ratan.flowzero.designer.service.IUserSettingsService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for user preference settings APIs.
 * UserId is always resolved from the JWT context on the server side.
 * The composite key (type, name) uniquely identifies a settings entry per user.
 *
 * @author Kinson Wang
 * @date 5/6/2026
 */
@RestController
@RequestMapping(value = "/api/v1/user/settings")
@Slf4j
public class UserSettingsController {

    @Autowired
    private IUserSettingsService userSettingsService;

    /**
     * 3.4.1  Get current user settings by type and name.
     * <p>GET /api/v1/user/settings/{type}/{name}</p>
     *
     * @param type settings scope identifier (TODO_COLUMNS | NAVIGATION_FAVOURITES)
     * @param name unique name of the settings entry within the given type
     */
    @GetMapping("/{type}/{name}")
    public ResponseEntity<?> getUserSettings(
            @PathVariable String type,
            @PathVariable String name) {
        validateType(type);
        return ResponseEntity.ok(userSettingsService.getUserSettings(type, name));
    }

    /**
     * 3.4.2  Create or update current user settings by type and name.
     * <p>PUT /api/v1/user/settings/{type}/{name}</p>
     *
     * @param type settings scope identifier (TODO_COLUMNS | NAVIGATION_FAVOURITES)
     * @param name unique name of the settings entry within the given type
     * @param dto  request body containing the free-form settings JSON
     */
    @PutMapping("/{type}/{name}")
    public ResponseEntity<?> saveUserSettings(
            @PathVariable String type,
            @PathVariable String name,
            @Valid @RequestBody UserSettingsSaveDto dto) {
        validateType(type);
        return ResponseEntity.ok(userSettingsService.saveUserSettings(type, name, dto));
    }

    /**
     * 3.4.3  Delete current user settings by type and name.
     * <p>DELETE /api/v1/user/settings/{type}/{name}</p>
     *
     * @param type settings scope identifier (TODO_COLUMNS | NAVIGATION_FAVOURITES)
     * @param name unique name of the settings entry to delete
     */
    @DeleteMapping("/{type}/{name}")
    public ResponseEntity<?> deleteUserSettings(
            @PathVariable String type,
            @PathVariable String name) {
        validateType(type);
        userSettingsService.deleteUserSettings(type, name);
        return ResponseEntity.ok("User settings deleted successfully");
    }

    /**
     * Validates that the provided type is one of the supported enum values.
     */
    private void validateType(String type) {
        for (UserSettingsTypeEnum e : UserSettingsTypeEnum.values()) {
            if (e.getCode().equals(type)) {
                return;
            }
        }
        throw new BusinessException("Invalid settings type: " + type + ". Allowed values: TODO_COLUMNS, NAVIGATION_FAVOURITES");
    }

}

