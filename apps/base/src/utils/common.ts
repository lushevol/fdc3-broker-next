/**
 * @fileoverview Common Utility Functions
 *
 * Provides a collection of commonly used utility functions for the application.
 * Includes helpers for:
 * - Local/session storage operations
 * - JWT token parsing
 * - Date formatting and validation
 * - Environment detection
 * - SSO and survey link generation
 * - Tile and workspace validation
 *
 * @module utils/common
 */

import { Buffer } from 'buffer';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import { v4 } from 'uuid';
import type { Tile } from '../components/Drawer/common/interface';
import { getHooksBase } from '../hooks/HooksBase';
import type { Entity } from '../hooks/model/root';
import { firstWorkspace, type Workspace } from '../hooks/model/workspaces';
import { ActionType } from '../hooks/reducer/util/ActionType';
import { findTile } from './drawer';

// Extend dayjs with UTC and duration plugins
dayjs.extend(utc);
dayjs.extend(duration);

// =============================================================================
// Storage Utilities
// =============================================================================

/**
 * Gets the browser's localStorage instance.
 * @returns The window.localStorage object
 */
export const getLocalStorage = () => {
  const { localStorage } = window;
  return localStorage;
};

/**
 * Gets the window.open function for opening new windows/tabs.
 * @returns The window.open function
 */
export const getWindowOpen = () => {
  const { open } = window;
  return open;
};

/**
 * Gets the browser's sessionStorage instance.
 * @returns The window.sessionStorage object
 */
export const getSessionStorage = () => {
  const { sessionStorage } = window;
  return sessionStorage;
};

/**
 * Parses a JWT token and extracts its payload.
 *
 * @param token - The JWT token string (format: "Bearer <token>")
 * @returns The decoded payload object, or empty string if invalid
 *
 * @example
 * const payload = getJWTPayload("Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...");
 * console.log(payload.sub); // User ID
 */
export const getJWTPayload = (token: string): any => {
  const payload = token.split(' ');
  if (payload && payload[1]) {
    const tokenParts: string[] = payload[1].split('.');
    return JSON.parse(Buffer.from(tokenParts[1], 'base64').toString('utf8'));
  }
  return '';
};

/**
 * Stores data in both localStorage and sessionStorage.
 *
 * @param key - The storage key
 * @param data - The data to store (must be string)
 */
export const storeData = (key: string, data: string): void => {
  getLocalStorage().setItem(key, data);
  getSessionStorage().setItem(key, data);

  window.dispatchEvent(new CustomEvent('ratan-storage-updated', { detail: { key, data } }));
};

/**
 * Clears storage items and optionally dispatches a clear action.
 *
 * @param dispacth - Optional dispatch function for state management
 * @param actionTypes - Optional array of specific action types to clear; if empty, clears all
 */
export const clearLocalStorage = (dispacth?, actionTypes?: ActionType[]): void => {
  if (actionTypes && actionTypes.length > 0) {
    // Clear specific keys only
    actionTypes.forEach((actionType) => {
      getLocalStorage().removeItem(actionType);
      window.dispatchEvent(
        new CustomEvent('ratan-storage-updated', { detail: { key: actionType } }),
      );
    });
  } else {
    // Clear all localStorage
    getLocalStorage().clear();
    window.dispatchEvent(new CustomEvent('ratan-storage-updated', { detail: { key: '*' } }));
  }
  // Always clear sessionStorage completely
  getSessionStorage().clear();

  // Dispatch clear action if dispatcher provided
  if (dispacth) {
    dispacth({
      type: ActionType.CLEAR,
      data: {},
    });
  }
};

/**
 * Clears authentication-related storage items on logout.
 *
 * @param dispacth - Dispatch function for state management
 */
export const clearStorageWhenLogout = (dispacth) => {
  clearLocalStorage(dispacth, [
    ActionType.SET_TOKEN,
    ActionType.SET_USER,
    ActionType.SET_EXPIRED_TOKEN,
    ActionType.SET_ENTITIES,
  ]);
};

// =============================================================================
// UUID and Error Utilities
// =============================================================================

/**
 * Generates a new UUID v4 string.
 * @returns A unique UUID string
 */
export const uuidv4 = () => {
  return v4();
};

/**
 * Displays a global error message via the application's snackbar.
 *
 * @param errorMsg - The error message to display
 */
export const showErrorMsg = (errorMsg) => {
  const { baseDispatch } = getHooksBase();
  baseDispatch({ type: ActionType.SET_ERRORMSG, data: { errorMsg } });
};

//This function is reported as code smell in Sonar Qube
//please replace all CommonUtil.show_error_msg to CommonUtil.showErrorMsg
/**
 * @deprecated Use showErrorMsg instead
 * Legacy function for displaying error messages.
 */
export const show_error_msg = (errorMsg) => {
  showErrorMsg(errorMsg);
};

// =============================================================================
// Environment and URL Utilities
// =============================================================================

/**
 * Gets the current hostname from window.location.
 * @returns The current hostname
 */
export const getHostName = () => {
  const { location } = window;
  const { hostname } = location;
  return hostname;
};

/**
 * Gets the window.location object.
 * @returns The window.location object
 */
export const getLocation = () => {
  const { location } = window;
  return location;
};

/**
 * Returns the appropriate survey link based on the current environment.
 * Production environments use the live survey, others use preview mode.
 *
 * @returns The survey URL string
 */
export const getSurveyLink = () => {
  let surveyLink =
    'https://surveys.sc.com/jfe/preview/previewId/b35e7b90-467e-473f-9ff3-8b6a099569d5/SV_cUVyvBdVELMVr02?Q_CHL=preview&Q_SurveyVersionID=current';
  if (['PROD', 'PRE-PROD'].includes(getEnv())) {
    surveyLink = 'https://surveys.sc.com/jfe/form/SV_cUVyvBdVELMVr02';
  }
  return surveyLink;
};

/**
 * Determines the current environment based on hostname.
 *
 * @returns Environment string: 'LOCAL', 'DEV', 'UAT', 'PRE-PROD', 'EKS', 'SIT', or 'PROD'
 */
export const getEnv = () => {
  const hostname = getHostName();
  if (hostname === 'localhost') {
    return 'LOCAL';
  } else if (hostname === 'fmo-mfe-dev.uk.dev.net') {
    return 'DEV';
  } else if (hostname === 'fmo-mfe.uk.dev.net' || hostname === 'uklvadapp1344.uk.dev.net') {
    return 'UAT';
  } else if (hostname === 'fmo-mfe-preprod.pi.dev.net') {
    return 'PRE-PROD';
  } else if (hostname === 'ratan-aws-app-fmo-mfe.ir.standardchartered.com') {
    return 'EKS';
  } else if (hostname === 'ratan-aws-sit-ns4-fmo-mfe.ir.standardchartered.com') {
    return 'SIT';
  } else {
    return 'PROD';
  }
};

/**
 * Returns the SSO authentication link based on the current environment.
 * Different environments use different OAuth2 authorization endpoints.
 *
 * @returns The SSO authorization URL
 */
export const getSSOLink = () => {
  if (['LOCAL', 'DEV', 'SIT', 'EKS'].includes(getEnv())) {
    return 'https://sitigmfa.hk.standardchartered.com:8443/openam/oauth2/realms/root/realms/sso/authorize?client_id=51358ratan&redirect_uri=https://fmo-mfe-dev.uk.dev.net:8453/mfa/callback&response_type=code';
  } else if (['UAT'].includes(getEnv())) {
    return 'https://sitigmfa.hk.standardchartered.com:8443/openam/oauth2/realms/root/realms/sso/authorize?client_id=51358ratanuat&redirect_uri=https://fmo-mfe.uk.dev.net:8453/mfa/callback&response_type=code';
  } else {
    return 'https://mfaig.global.standardchartered.com/openam/oauth2/realms/root/realms/sso/authorize?client_id=51358ratan&redirect_uri=https://fmo-mfe.gdc.standardchartered.com:8453/mfa/callback&response_type=code';
  }
};

// =============================================================================
// Type Validation Utilities
// =============================================================================

/**
 * Checks if a value is a valid number.
 *
 * @param val - The value to check
 * @returns True if the value is a valid number, false otherwise
 */
export const isNumber = (val: any) => {
  return (
    val &&
    val !== '' &&
    !isNaN(val as unknown as number) &&
    !isNaN(parseFloat(val)) &&
    isFinite(val)
  );
};

/**
 * Checks if a value is a valid date.
 *
 * @param val - The value to check
 * @returns True if the value is a valid date, false otherwise
 */
export const isDate = (val: any) => {
  if (isEmpty(val) || (isNumber(val) && val.toString().length !== 13)) {
    return false;
  }

  const result = new Date(val);
  return result instanceof Date && !isNaN(result.valueOf());
};

/**
 * Checks if a value can be formatted as a date.
 * Validates against ISO date format with time component.
 *
 * @param val - The value to check
 * @returns True if valid for date formatting, false otherwise
 */
export const isValidationToFormateDate = (val: any) => {
  const result = new Date(val);
  const regez = /^\d{4}-\d{2}-\d{2}[T|\s]\d{2}:\d{2}:\d{2}/;
  if (!isEmpty(val) && result instanceof Date && !isNaN(result.valueOf()) && regez.test(val)) {
    return true;
  }
  return false;
};

// =============================================================================
// Date Formatting Functions
// =============================================================================

/**
 * Formats a time value into a readable date string.
 *
 * Formats that do not need to be converted need to be excluded.
 * Possible parameter formats:
 *   1. 1594006198764 (No conversion is required as may conflict with price)
 *   2. 2020-02-02 (No conversion is required)
 *   3. 2020-06-17T03:04:13Z
 *   4. 2020-06-17 03:04:13
 *
 * @param time - The time value to format
 * @param isAccurateToDay - If true, formats to day only (YYYY MMM DD)
 * @returns Formatted date string or original value if not formattable
 */
export const formatDate = (time: any, isAccurateToDay: boolean) => {
  if (isValidationToFormateDate(time) || isAccurateToDay) {
    const realTime = isNumber(time) ? parseInt(time) : time;
    let result = '';
    if (isAccurateToDay) {
      result = dayjs(realTime).format('YYYY MMM DD');
    } else {
      result = dayjs(realTime).format('YYYY-MM-DD HH:mm:ss');
    }
    return result !== 'Invalid Date' ? result : time;
  }
  return time;
};

/**
 * Formats a time value to ISO format (UTC).
 *
 * @param time - The time value to format
 * @param isAccurateToDay - If true, formats to day only
 * @returns ISO formatted date string or original value
 */
export const formatDateToISO = (time: any, isAccurateToDay: boolean) => {
  if (isValidationToFormateDate(time) || isAccurateToDay) {
    let newTime = '';
    try {
      const realTime = isNumber(time) ? parseInt(time) : time;
      if (isAccurateToDay) {
        newTime = dayjs.utc(realTime).format('YYYY MMM DD');
      } else {
        newTime = dayjs.utc(realTime).format();
      }
    } catch (error) {
      newTime = time;
    }

    return newTime;
  }
  return time;
};

/**
 * Checks if a value is empty (null, undefined, empty string, or "null").
 *
 * @param value - The value to check
 * @returns True if the value is considered empty
 */
export const isEmpty = (value: any) => {
  return value === '' || value === null || value === undefined || value === 'null';
};

/**
 * Formats a dayjs date object to "YYYY MMM DD" format.
 *
 * @param date - A dayjs date object
 * @returns Formatted date string or empty string if no date
 */
export const getDate = (date) => (date ? date.format('YYYY MMM DD') : '');

// =============================================================================
// Tile and Workspace Validation
// =============================================================================

/**
 * Validates if a user has access to a specific tile based on their entities.
 *
 * @param entities - User's entity permissions
 * @param entity - Entity name(s) required for the tile
 * @param subject - Subject/permission required
 * @returns True if user has access, false otherwise
 */
export const validateTile = (
  entities: Entity[] | [] | undefined,
  entity: string | string[] | undefined,
  subject: string | undefined,
): boolean => {
  if (entities?.length && entity && subject) {
    const entityIndex = entities.findIndex(
      (item: Entity) => item.name === entity || entity?.includes(item.name),
    );
    if (entityIndex >= 0) {
      const subjectIndex = entities[entityIndex].subjects.findIndex(
        (item: { name: string; longName?: string }) =>
          item.name === subject || item.longName === subject,
      );
      if (subjectIndex >= 0) {
        return true;
      }
    }
    /**
     * @author Tech
     * @description  X_RATANONE will release after MENU Contorl so add below code to control entity level
     *  */
    if (entity === 'X_RATANONE') {
      const entityIndexEqSubject = entities.findIndex((item: Entity) => item.name === subject);
      if (entityIndexEqSubject >= 0) {
        return true;
      }
    }
  }
  return false;
};

/**
 * Filters workspaces based on user's entity permissions.
 * Returns only workspaces the user has access to, or a default workspace if none.
 *
 * @param workspaces - All available workspaces
 * @param entities - User's entity permissions
 * @param drawers - Drawer/tile configuration
 * @returns Filtered array of accessible workspaces
 */
export const validateWorkspace = (
  workspaces: Workspace[],
  entities: Entity[] | [] | undefined,
  drawers: any,
): Workspace[] => {
  let newWorkspaces = workspaces.reduce((result: Workspace[], workspace: Workspace) => {
    if (workspace.containers.length === 0) {
      // Empty workspaces are always accessible
      result.push(workspace);
    } else {
      // Check tile permissions
      const tile: Tile | undefined = findTile(drawers, workspace);
      if (tile?.isTemplate || validateTile(entities, tile?.entity, tile?.subject)) {
        result.push(workspace);
      }
    }
    return result;
  }, []);

  // Ensure at least one workspace exists
  if (newWorkspaces.length === 0) {
    newWorkspaces = [firstWorkspace()];
  }
  return newWorkspaces;
};

// =============================================================================
// Miscellaneous Utilities
// =============================================================================

/**
 * Creates a promise that resolves after a specified delay.
 *
 * @param time - Delay in milliseconds (default: 2000)
 * @returns A promise that resolves to true after the delay
 */
export const waitFor = (time = 2000) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });

/**
 * Returns the first truthy value between two options (nullish coalescing).
 *
 * @param a - First value to check
 * @param b - Fallback value
 * @returns a if not nullish, otherwise b
 */
export const aOrb = (a, b) => {
  return a ?? b;
};
