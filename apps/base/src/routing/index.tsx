/**
 * @fileoverview Main Application Routing
 *
 * Handles the top-level routing for the application, including:
 * - Authentication state checking (logged in vs login screen)
 * - Loading states during initialization
 * - Global error message display via Snackbar
 *
 * @module routing
 */

import React, { type ReactElement, Suspense } from 'react';
import PageLoader from '../components/Loader/PageLoader';
import Snackbar from '../components/Snackbar';
import Splash from '../components/Splash';
// import useFDC3 from "../hooks/fdc3/useFDC3";
import Login from '../pages/Login';
import Root, { classes, PREFIX } from './common/style';
import useController from './common/useController';

/**
 * Lazy-loaded Home component for authenticated users.
 * Loaded on demand to improve initial bundle size.
 */
const Home = React.lazy(() => import('../pages/Home'));

/**
 * Determines which component to render based on authentication state.
 *
 * @param token - The user's authentication token
 * @param entities - The user's entity permissions
 * @returns Home component if authenticated, Login component otherwise
 */
export const RoutingComponent = (token, entities) => (token && entities ? <Home /> : <Login />);

/**
 * Main Routing Component
 *
 * Serves as the primary router for the application. Handles:
 * - Initial loading state while app initializes
 * - Conditional rendering of Home or Login based on auth state
 * - Global loading overlay when store.isLoading is true
 * - Global error messages via Snackbar component
 *
 * @returns The main application router with loading and error handling
 *
 * @example
 * // Used as the main content area in App.tsx
 * <Routing />
 */
const Routing: React.FC = (_props): ReactElement => {
  // Hook for FDC3 integration (currently disabled)
  // useFDC3();

  // Get application store and handlers from controller
  const { store, handleCloseErrorMessage, isReady } = useController();

  // Show page loader while app initializes
  if (!isReady) {
    return (
      <Root className={classes.root} data-testid={`${PREFIX}`}>
        <PageLoader />
      </Root>
    );
  }

  return (
    <Root className={classes.root} data-testid={`${PREFIX}`}>
      {/* Main content with lazy-loaded routes */}
      <Suspense fallback={<Splash />}>{RoutingComponent(store.token, store.entities)}</Suspense>

      {/* Global loading overlay */}
      {store.isLoading && <PageLoader />}

      {/* Global error message snackbar */}
      {store.errorMsg && (
        <Snackbar
          open={!!store.errorMsg}
          onClose={handleCloseErrorMessage}
          message={store?.errorMsg}
          variant="standard"
          severity="error"
        />
      )}
    </Root>
  );
};

export default Routing;
