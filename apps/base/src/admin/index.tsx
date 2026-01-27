/**
 * @fileoverview Admin Module Entry Point
 *
 * This file serves as the entry point for the admin module, which provides
 * administrative interfaces for managing tiles, categories, import maps,
 * and FDC3 declarations.
 *
 * The admin module uses a separate MemoryRouter to maintain its own navigation
 * state independent of the main application router.
 *
 * @module admin
 */

import React, { type ReactElement, Suspense } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Splash from '../components/Splash';
import type { AdminModuleProps } from './common/interface';

/**
 * Lazy-loaded routing component to enable code splitting.
 * The actual route definitions are loaded on demand.
 */
const Routing = React.lazy(() => import('./Routing'));

/**
 * Admin Module Component
 *
 * Provides the root container for all admin functionality. Uses a MemoryRouter
 * to isolate admin navigation from the main application's browser history.
 *
 * Features:
 * - Lazy-loaded routing for optimal bundle splitting
 * - Suspense boundary with splash screen fallback
 * - Isolated navigation state via MemoryRouter
 *
 * @param props - Admin module configuration
 * @param props.module - The specific admin module to navigate to (e.g., '/tile', '/category')
 * @param props.tile - Current tile identifier
 * @param props.panelId - Panel identifier for the admin interface
 * @param props.tabId - Tab identifier for multi-tab support
 * @returns The admin module wrapped in routing providers
 *
 * @example
 * <Admin module="/tile" tile="admin-tile" panelId="panel-1" tabId="tab-1" />
 */
const Admin: React.FC<AdminModuleProps> = (props: AdminModuleProps): ReactElement => {
  return (
    <Suspense fallback={<Splash />}>
      <MemoryRouter>
        <Routes>
          <Route path="/*" element={<Routing {...props} />}></Route>
        </Routes>
      </MemoryRouter>
    </Suspense>
  );
};

export default React.memo(Admin);
