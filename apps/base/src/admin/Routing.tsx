/**
 * @fileoverview Admin Module Routing Configuration
 *
 * Defines the routing structure for the admin module, mapping URL paths
 * to their corresponding admin sub-modules. Each sub-module is lazy-loaded
 * for optimal performance.
 *
 * Available routes:
 * - /importmap/* - Import map management
 * - /category/* - Category management
 * - /tile/* - Tile configuration
 * - /fdc3/* - FDC3 declaration management
 *
 * @module admin/Routing
 */

import React, { type ReactElement, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Splash from '../components/Splash';
import type { AdminModuleProps } from './common/interface';
import useController from './common/useController';

// =============================================================================
// Lazy-loaded Admin Sub-modules
// Each module is loaded on demand to reduce initial bundle size
// =============================================================================

/** Category management module - handles tile categorization */
const Category = React.lazy(() => import('./Category'));

/** Import map management module - handles module federation import maps */
const ImportMap = React.lazy(() => import('./ImportMap'));

/** Tile management module - handles tile CRUD operations */
const Tile = React.lazy(() => import('./Tile'));

/** FDC3 Declaration management - handles FDC3 interop configurations */
const FDC3Declaration = React.lazy(() => import('./FDC3Declaration'));

/**
 * Admin Routing Component
 *
 * Sets up the route hierarchy for admin sub-modules and initializes
 * the admin controller for handling module-specific navigation.
 *
 * The controller automatically navigates to the specified module path
 * when the component mounts, based on the `module` prop.
 *
 * @param props - Admin module configuration passed from parent
 * @returns The route switch for admin sub-modules
 */
const Routing: React.FC<AdminModuleProps> = (props: AdminModuleProps): ReactElement => {
  // Initialize controller for programmatic navigation based on props.module
  useController(props);

  return (
    <Suspense fallback={<Splash />}>
      <Routes>
        {/* Import Map Management - /importmap path */}
        <Route path="/importmap/*" element={<ImportMap {...props} />}></Route>

        {/* Category Management - /category path */}
        <Route path="/category/*" element={<Category {...props} />}></Route>

        {/* Tile Management - /tile path */}
        <Route path="/tile/*" element={<Tile {...props} />}></Route>

        {/* FDC3 Interop Configuration - /fdc3 path */}
        <Route path="/fdc3/*" element={<FDC3Declaration {...props} />}></Route>
      </Routes>
    </Suspense>
  );
};

export default React.memo(Routing);
