package com.scb.ratan.flowzero.designer.entity.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Response VO for GET /api/v1/user/settings/{type}/{name}.
 * Conversion from entity is handled by {@link com.scb.ratan.flowzero.designer.converter.UserSettingsConverter}.
 *
 * @author Kinson Wang
 * @date 5/6/2026
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserSettingsVo implements Serializable {

    private static final long serialVersionUID = 5543210987654321001L;

    private String userId;

    private String type;

    private String name;

    /**
     * Free-form JSON settings — structure depends on the type.
     * Null when no settings have been saved yet.
     */
    private Object settings;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSSSS'Z'", timezone = "UTC")
    private LocalDateTime updatedAt;

    /**
     * Non-null when the settings entry does not exist yet.
     * Front-end should use this signal to prompt the user to save their preferences.
     * e.g. "No settings found. Please save your preferences."
     */
    private String hint;

}
