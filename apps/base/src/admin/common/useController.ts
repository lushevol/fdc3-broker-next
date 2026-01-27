/**
 * @fileoverview Admin Module Controller Hook
 *
 * Provides navigation control for the admin module, automatically routing
 * to the specified sub-module when the admin panel is opened.
 *
 * @module admin/common/useController
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { AdminModuleProps } from './interface';

/**
 * Admin Module Controller Hook
 *
 * Handles automatic navigation to the specified admin sub-module on mount.
 * This ensures that when the admin panel opens with a specific module path
 * (e.g., '/tile', '/category'), the router navigates to that path.
 *
 * @param props - Admin module properties
 * @param props.module - The module path to navigate to (e.g., '/tile', '/category')
 * @returns An empty object (hook doesn't expose any values)
 *
 * @example
 * // Inside an admin component
 * useController({ module: '/tile', tile: 'admin', panelId: '1', tabId: '1' });
 * // Automatically navigates to /tile route on mount
 */
const useController = (props: AdminModuleProps) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    // Navigate to the specified module path if provided
    if (props?.module?.length) {
      navigate(props.module);
    }
    // Cleanup function (no cleanup needed)
    return () => {};
    // Note: Empty dependency array is intentional - this should only run on mount
    // biome-ignore lint/correctness/useExhaustiveDependencies: Intentionally run only on mount
  }, []);

  return {};
};

export default useController;
