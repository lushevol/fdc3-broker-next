package com.scb.ratan.flowzero.designer.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.ratan.flowzero.designer.common.ContextHolder;
import com.scb.ratan.flowzero.designer.common.exception.BusinessException;
import com.scb.ratan.flowzero.designer.converter.UserSettingsConverter;
import com.scb.ratan.flowzero.designer.entity.dbo.UserSettings;
import com.scb.ratan.flowzero.designer.entity.dto.UserSettingsSaveDto;
import com.scb.ratan.flowzero.designer.entity.vo.UserSettingsSaveVo;
import com.scb.ratan.flowzero.designer.entity.vo.UserSettingsVo;
import com.scb.ratan.flowzero.designer.repository.UserSettingsRepository;
import com.scb.ratan.flowzero.designer.service.IUserSettingsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * @author Kinson Wang
 * @date 5/6/2026
 */
@Service
@Slf4j
public class UserSettingsServiceImpl implements IUserSettingsService {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    @Autowired
    private UserSettingsRepository userSettingsRepository;

    @Autowired
    private UserSettingsConverter userSettingsConverter;

    @Override
    public UserSettingsVo getUserSettings(String type, String name) {
        String userId = ContextHolder.getUserId();
        Optional<UserSettings> optional = userSettingsRepository.findByUserIdAndTypeAndName(userId, type, name);
        if (optional.isEmpty()) {
            // Not found — return an empty VO with a hint instead of throwing an error.
            // Front-end should use hint != null as a signal to prompt the user to save settings.
            UserSettingsVo empty = new UserSettingsVo();
            empty.setType(type);
            empty.setName(name);
            empty.setHint("No settings found for type=" + type + ", name=" + name + ". Please save your preferences.");
            return empty;
        }
        return userSettingsConverter.toVo(optional.get());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public UserSettingsSaveVo saveUserSettings(String type, String name, UserSettingsSaveDto dto) {
        String userId = ContextHolder.getUserId();
        String settingsJson = toJson(dto.getSettings());

        Optional<UserSettings> optional = userSettingsRepository.findByUserIdAndTypeAndName(userId, type, name);
        UserSettings entity;
        if (optional.isPresent()) {
            entity = optional.get();
            entity.setSettings(settingsJson);
        } else {
            entity = new UserSettings();
            entity.setUserId(userId);
            entity.setType(type);
            entity.setName(name);
            entity.setSettings(settingsJson);
        }
        entity = userSettingsRepository.save(entity);
        return userSettingsConverter.toSaveVo(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteUserSettings(String type, String name) {
        String userId = ContextHolder.getUserId();
        if (!userSettingsRepository.existsByUserIdAndTypeAndName(userId, type, name)) {
            throw new BusinessException(
                String.format("User settings not found for type=%s, name=%s", type, name));
        }
        userSettingsRepository.deleteByUserIdAndTypeAndName(userId, type, name);
    }

    private String toJson(Object obj) {
        if (obj == null) {
            return null;
        }
        if (obj instanceof String str) {
            return str;
        }
        try {
            return OBJECT_MAPPER.writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize settings to JSON", e);
            throw new BusinessException("Invalid settings format");
        }
    }

}

