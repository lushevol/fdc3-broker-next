/**
 * @fileoverview Main Application Entry Point
 *
 * This file defines the root App component that serves as the entry point
 * for the base microfrontend application. It sets up the essential provider
 * hierarchy that wraps the entire application.
 *
 * @module App
 */

import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import type React from 'react';
import type { ReactElement } from 'react';
import Provider from './hooks/provider';
import { PortalExperience } from './new-layout';

/**
 * Root Application Component
 *
 * Sets up the application's provider hierarchy in the following order:
 * 1. LocalizationProvider - Provides date/time localization using Day.js adapter
 * 2. Provider - Application-wide state provider with root version info
 * 3. ThemeProvider - Material-UI theme configuration
 * 4. FDC3Integration - Financial Desktop Connectivity integration for inter-app communication
 * 5. Routing - Application routing configuration
 *
 * @param props - Component properties passed from the microfrontend loader
 * @param props.version - The version string of the root application
 * @returns The fully wrapped application component tree
 *
 * @example
 * // Typically mounted by single-spa or rendered directly
 * <App version="1.0.0" />
 */
const App: React.FC = (props: Record<string, unknown>): ReactElement => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Provider data={{ rootVersion: props.version as string }}>
      <PortalExperience {...props} />
    </Provider>
  </LocalizationProvider>
);

export default App;
