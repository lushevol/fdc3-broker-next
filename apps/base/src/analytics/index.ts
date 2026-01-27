/**
 * @fileoverview Analytics Hook
 *
 * Provides a React hook for tracking user interactions and events.
 * Sends analytics data to the backend for monitoring and reporting purposes.
 *
 * Supported event types:
 * - Tile events (open, close)
 * - Modal events (open, close)
 * - Tab events (click)
 * - Button events (click)
 * - Switch events (toggle)
 * - Dropdown events (select)
 *
 * @module analytics
 */

import React from 'react';
import { useContext } from '../hooks/provider';
import { postService } from '../hooks/service';
import type {
  AnalyticsButtonOrTabOrSwitchEventType,
  AnalyticsData,
  AnalyticsDropDownEventType,
  AnalyticsTileOrModalEventType,
  AnalyticsType,
} from './model';

/**
 * Analytics Hook
 *
 * Provides methods for tracking various user interaction events.
 * All events include the user's authorization token for backend identification.
 *
 * @returns Object containing event tracking methods
 *
 * @example
 * const { TileEvent, ButtonEvent } = useAnalytics();
 *
 * // Track a tile open event
 * TileEvent('open', { tileName: 'Dashboard', entity: 'TRADING' });
 *
 * // Track a button click
 * ButtonEvent('click', { buttonName: 'Submit', component: 'OrderForm' });
 */
const useAnalytics = () => {
  const [store] = useContext();

  /**
   * Posts analytics data to the backend.
   * Errors are logged but don't block the UI.
   */
  const post = (data: AnalyticsType) => {
    postService('/analytics/v1/fmo/print', data).catch((e) => console.error(e));
  };

  // Use refresh token if available, otherwise fall back to access token
  const singleUIAuthorization = store.refreshToken ?? store.token;

  /**
   * Tracks tile-related events (open/close).
   *
   * @param event - The event type ('open' or 'close')
   * @param analyticsData - Additional data about the tile interaction
   */
  const TileEvent = (event: AnalyticsTileOrModalEventType, analyticsData: AnalyticsData) => {
    const data: AnalyticsType = {
      singleUIAuthorization,
      key: 'tile',
      event,
      ...analyticsData,
    };
    post(data);
  };

  /**
   * Tracks modal-related events (open/close).
   *
   * @param event - The event type ('open' or 'close')
   * @param analyticsData - Additional data about the modal interaction
   */
  const ModalEvent = (event: AnalyticsTileOrModalEventType, analyticsData: AnalyticsData) => {
    const data: AnalyticsType = {
      singleUIAuthorization,
      key: 'modal',
      event,
      ...analyticsData,
    };
    post(data);
  };

  /**
   * Tracks tab click events.
   *
   * @param event - The event type ('click')
   * @param analyticsData - Additional data about the tab interaction
   */
  const TabEvent = (event: AnalyticsButtonOrTabOrSwitchEventType, analyticsData: AnalyticsData) => {
    const data: AnalyticsType = {
      singleUIAuthorization,
      key: 'tab',
      event,
      ...analyticsData,
    };
    post(data);
  };

  /**
   * Tracks button click events.
   *
   * @param event - The event type ('click')
   * @param analyticsData - Additional data about the button interaction
   */
  const ButtonEvent = (
    event: AnalyticsButtonOrTabOrSwitchEventType,
    analyticsData: AnalyticsData,
  ) => {
    const data: AnalyticsType = {
      singleUIAuthorization,
      key: 'button',
      event,
      ...analyticsData,
    };
    post(data);
  };

  /**
   * Tracks switch/toggle events.
   *
   * @param event - The event type ('click')
   * @param analyticsData - Additional data about the switch interaction
   */
  const SwitchEvent = (
    event: AnalyticsButtonOrTabOrSwitchEventType,
    analyticsData: AnalyticsData,
  ) => {
    const data: AnalyticsType = {
      singleUIAuthorization,
      key: 'switch',
      event,
      ...analyticsData,
    };
    post(data);
  };

  /**
   * Tracks dropdown selection events.
   *
   * @param event - The event type ('select')
   * @param analyticsData - Additional data about the dropdown interaction
   */
  const DropDownEvent = (event: AnalyticsDropDownEventType, analyticsData: AnalyticsData) => {
    const data: AnalyticsType = {
      singleUIAuthorization,
      key: 'dropdown',
      event,
      ...analyticsData,
    };
    post(data);
  };

  return {
    TileEvent,
    ModalEvent,
    TabEvent,
    ButtonEvent,
    DropDownEvent,
    SwitchEvent,
  };
};

export default useAnalytics;
