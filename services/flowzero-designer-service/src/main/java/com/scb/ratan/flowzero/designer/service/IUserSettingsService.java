package com.scb.ratan.flowzero.designer.service;

import com.scb.ratan.flowzero.designer.entity.dto.UserSettingsSaveDto;
import com.scb.ratan.flowzero.designer.entity.vo.UserSettingsSaveVo;
import com.scb.ratan.flowzero.designer.entity.vo.UserSettingsVo;

/**
 * Service interface for managing user preference settings.
 * The userId is always resolved from the JWT context.
 *
 * @author Kinson Wang
 * @date 5/6/2026
 */
public interface IUserSettingsService {

    /**
     * Retrieve the saved settings for the current user identified by (type, name).
     *
     * @param type settings scope identifier (TODO_COLUMNS or NAVIGATION_FAVOURITES)
     * @param name unique name of the settings entry within the given type
     * @return settings VO
     */
    UserSettingsVo getUserSettings(String type, String name);

    /**
     * Upsert (create or replace) the settings for the current user identified by (type, name).
     *
     * @param type settings scope identifier
     * @param name unique name of the settings entry
     * @param dto  request body containing the free-form settings JSON
     * @return save result VO
     */
    UserSettingsSaveVo saveUserSettings(String type, String name, UserSettingsSaveDto dto);

    /**
     * Delete the settings record for the current user identified by (type, name).
     * Throws BusinessException if the record does not exist.
     *
     * @param type settings scope identifier
     * @param name unique name of the settings entry
     */
    void deleteUserSettings(String type, String name);

}

