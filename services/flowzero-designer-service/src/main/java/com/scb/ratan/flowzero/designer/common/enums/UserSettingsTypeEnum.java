package com.scb.ratan.flowzero.designer.common.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Enum for user settings type.
 * TODO_COLUMNS: column visibility and order for the Todo list table.
 * NAVIGATION_FAVOURITES: pinned/favourite workflows in the navigation sidebar.
 *
 * @author Kinson Wang
 * @date 5/6/2026
 */
@Getter
@AllArgsConstructor
public enum UserSettingsTypeEnum {

    TODO_COLUMNS("TODO_COLUMNS"),

    NAVIGATION_FAVOURITES("NAVIGATION_FAVOURITES");

    private final String code;

}

