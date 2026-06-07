package com.scb.ratan.flowzero.designer.entity.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request body for creating or updating user settings.
 *
 * @author Kinson Wang
 * @date 5/6/2026
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserSettingsSaveDto {

    /**
     * Free-form JSON settings payload — structure depends on the type.
     * e.g. for TODO_COLUMNS: {"columns": [{"fieldId": "...", "label": "...", "visible": true, "order": 0}]}
     * e.g. for NAVIGATION_FAVOURITES: {"favourites": [{"workflowKey": "loan-approval"}]}
     */
    @NotNull(message = "settings must not be null")
    private Object settings;

}

