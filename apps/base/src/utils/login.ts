/**
 * @fileoverview Login and Authentication Utilities
 *
 * Provides functions for handling user authentication, including:
 * - JWT token management
 * - User session management
 * - Entity permission handling
 * - SSO response processing
 *
 * @module utils/login
 */

import type { AxiosResponse } from 'axios';
import { getHooksBase } from '../hooks/HooksBase';
import type { User } from '../hooks/model/root';
import { ActionType } from '../hooks/reducer/util/ActionType';
import { clearStorageWhenLogout, getJWTPayload, storeData } from './common';
import { getEntities } from './entities';

// =============================================================================
// Token Management
// =============================================================================

/**
 * Sets the authorization token in the application state and storage.
 * Also extracts and dispatches user login time from the JWT payload.
 *
 * @param token - The JWT authorization token
 */
export const setAuthorization = (token) => {
  const { baseDispatch } = getHooksBase();
  baseDispatch({
    type: ActionType.SET_TOKEN,
    data: { token },
  });
  storeData(ActionType.SET_TOKEN, token);

  // Parse JWT and set login time info
  const payload = getJWTPayload(token);
  dispacthUserLoginTime(payload);
};

/**
 * Dispatches user login time information from JWT payload.
 * Used for session expiry tracking.
 *
 * @param payload - Decoded JWT payload containing exp and iat claims
 */
export const dispacthUserLoginTime = (payload) => {
  if (payload.exp && payload.iat) {
    const { baseDispatch } = getHooksBase();
    baseDispatch({
      type: ActionType.SET_EXPIRED_TOKEN,
      data: {
        expiredIn: payload.exp,
        iat: payload.iat,
        userLoginTime: new Date(),
      },
    });
  }
};

// =============================================================================
// User Management
// =============================================================================

/**
 * Sets the current user in the application state and storage.
 *
 * @param user - The user object to store
 */
const setUser = (user: User) => {
  const { baseDispatch } = getHooksBase();
  // Ensure id and userId are set from sub claim
  user.id = user.sub;
  user.userId = user.sub;
  baseDispatch({
    type: ActionType.SET_USER,
    data: { user },
  });
  storeData(ActionType.SET_USER, JSON.stringify(user));
};

// =============================================================================
// Response Handlers (for processing authentication API responses)
// =============================================================================

/**
 * Handles login response by extracting and storing the authorization token.
 * Checks for the token in both camelCase and lowercase header formats.
 *
 * @param response - Axios response from login API
 */
export const handleLogin = (response: AxiosResponse) => {
  if (
    response?.headers &&
    (response?.headers['Single-UI-Authorization'] || response?.headers['single-ui-authorization'])
  ) {
    const token = `${
      response.headers['Single-UI-Authorization'] ?? response.headers['single-ui-authorization']
    }`;
    setAuthorization(token);
  }
};

/**
 * Handles user info from API response.
 * Parses user info JSON, extracts entitlements, and sets fullName from OUD.
 *
 * @param response - Axios response containing userInfo and optional entitlementsToken
 */
export const handleUser = (response: AxiosResponse) => {
  if (response?.data?.userInfo) {
    const userInfo = JSON.parse(response?.data?.userInfo);

    // Extract entitlements from separate token if present
    if (response?.data?.entitlementsToken) {
      const payload = getJWTPayload('B ' + response?.data?.entitlementsToken);
      userInfo.entitlements = JSON.parse(payload.entitlements);
    }

    // Normalize user properties
    userInfo.id = userInfo.sub;
    userInfo.fullName = userInfo.fullName ?? userInfo.sub;
    userInfo.name = userInfo.sub;
    userInfo.userId = userInfo.sub;

    // Extract full name from OUD (Organizational User Directory) if available
    if (userInfo.oud) {
      userInfo.oud = JSON.parse(userInfo.oud);
      userInfo.fullName = userInfo.oud.fullName;
    }

    setUser(userInfo);
  }
};

/**
 * Handles entities from API response and stores them in state.
 *
 * @param response - Axios response containing entities array
 */
export const handleEntities = (response: AxiosResponse) => {
  if (response?.data?.entities) {
    const entities = response?.data?.entities;
    const { baseDispatch } = getHooksBase();
    baseDispatch({
      type: ActionType.SET_ENTITIES,
      data: { entities },
    });
  }
};

/**
 * Handles drawer/tile configuration from API response.
 *
 * @param response - Axios response containing drawers array
 */
export const handleDrawers = (response: AxiosResponse) => {
  if (response?.data?.drawers?.length) {
    const drawers = response?.data?.drawers;
    const { baseDispatch } = getHooksBase();
    baseDispatch({
      type: ActionType.SET_DRAWERS,
      data: { drawers },
    });
  }
};

/**
 * Sets the refresh token in application state.
 *
 * @param refreshToken - The refresh token for obtaining new access tokens
 */
export const setRefreshToken = (refreshToken) => {
  const { baseDispatch } = getHooksBase();
  baseDispatch({
    type: ActionType.SET_REFRESH_TOKEN,
    data: { refreshToken },
  });
};

/**
 * Handles refresh token from API response.
 * Checks for the token in both camelCase and lowercase header formats.
 *
 * @param response - Axios response containing refresh token header
 */
export const handleRefreshToken = (response: AxiosResponse) => {
  if (
    response?.headers &&
    (response?.headers['Single-UI-Refresh'] || response?.headers['single-ui-refresh'])
  ) {
    const refreshToken = `${
      response.headers['Single-UI-Refresh'] ?? response.headers['single-ui-refresh']
    }`;
    setRefreshToken(refreshToken);
  }
};

/**
 * Handles entitlements token from API response.
 *
 * @param response - Axios response containing entitlementsToken
 */
export const handleEntitlementsToken = (response: AxiosResponse) => {
  if (response?.data?.entitlementsToken) {
    const { baseDispatch } = getHooksBase();
    baseDispatch({
      type: ActionType.SET_ENTITLEMENTS_TOKEN,
      data: { entitlementsToken: response?.data?.entitlementsToken },
    });
  }
};

/**
 * Validates user entities and handles unauthorized access.
 * Clears storage and shows error if user has no matching entitlements.
 *
 * @param entities_ - User's entity permissions from login response
 * @param dispatch - Redux dispatch function
 * @param drawers - Drawer/tile configuration for entity matching
 */
export const handleLoginEntities = (entities_, dispatch, drawers) => {
  let isValid = false;

  // Get list of valid entities from drawer configuration
  const entities = Object.keys(getEntities(drawers));

  // Check if user has any matching entity
  entities_?.every((curr) => {
    if (entities.includes(curr.name)) {
      isValid = true;
    }
    return !isValid; // Continue if not valid yet
  });

  // Clear URL state
  const { history } = window;
  history.replaceState(null, '', '/');

  // Handle unauthorized access
  if (!isValid) {
    clearStorageWhenLogout(dispatch);
    dispatch({
      type: ActionType.SET_ERRORMSG,
      data: { errorMsg: 'No entitlements found.' },
    });
  }
};
