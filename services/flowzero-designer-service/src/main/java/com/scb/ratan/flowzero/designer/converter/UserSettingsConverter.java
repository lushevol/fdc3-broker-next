package com.scb.ratan.flowzero.designer.converter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.ratan.flowzero.designer.entity.dbo.UserSettings;
import com.scb.ratan.flowzero.designer.entity.vo.UserSettingsSaveVo;
import com.scb.ratan.flowzero.designer.entity.vo.UserSettingsVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Converter between {@link UserSettings} entity and its response VOs.
 *
 * @author Kinson Wang
 * @date 5/6/2026
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class UserSettingsConverter {

    private final ObjectMapper objectMapper;

    /**
     * Converts a {@link UserSettings} entity to a {@link UserSettingsVo}.
     * The {@code settings} JSON string is deserialized into a plain {@link Object}
     * so it is rendered as a nested JSON object in the API response.
     *
     * @param entity the entity to convert
     * @return the converted VO
     */
    public UserSettingsVo toVo(UserSettings entity) {
        if (entity == null) {
            return null;
        }
        UserSettingsVo vo = new UserSettingsVo();
        vo.setUserId(entity.getUserId());
        vo.setType(entity.getType());
        vo.setName(entity.getName());
        vo.setUpdatedAt(entity.getUpdatedAt());
        if (entity.getSettings() != null) {
            try {
                vo.setSettings(objectMapper.readValue(entity.getSettings(), Object.class));
            } catch (Exception e) {
                log.warn("Failed to parse user settings JSON for userId={}, type={}, name={}",
                        entity.getUserId(), entity.getType(), entity.getName(), e);
                vo.setSettings(entity.getSettings());
            }
        }
        return vo;
    }

    /**
     * Converts a list of {@link UserSettings} entities to a list of {@link UserSettingsVo}.
     *
     * @param entities the list of entities
     * @return the list of VOs
     */
    public List<UserSettingsVo> toVoList(List<UserSettings> entities) {
        if (entities == null) {
            return List.of();
        }
        return entities.stream().map(this::toVo).collect(Collectors.toList());
    }

    /**
     * Converts a {@link UserSettings} entity to a {@link UserSettingsSaveVo}
     * (lighter VO used for PUT / upsert responses — does not include the settings payload).
     *
     * @param entity the entity to convert
     * @return the converted save VO
     */
    public UserSettingsSaveVo toSaveVo(UserSettings entity) {
        if (entity == null) {
            return null;
        }
        UserSettingsSaveVo vo = new UserSettingsSaveVo();
        vo.setUserId(entity.getUserId());
        vo.setType(entity.getType());
        vo.setName(entity.getName());
        vo.setUpdatedAt(entity.getUpdatedAt());
        return vo;
    }
}

