/**
 * @fm/fdc3-app-directory
 *
 * App Directory client for FDC3 applications.
 *
 * @description
 * This package provides a TypeScript client for querying FDC3 App Directory services.
 * It includes both a production HTTP client and a mock service for development and testing.
 *
 * @packageDocumentation
 *
 * @example
 * Production usage with HTTP client:
 * ```typescript
 * import { AppDirectoryClientImpl } from '@fm/fdc3-app-directory';
 *
 * const client = new AppDirectoryClientImpl({
 *   baseUrl: 'https://app-directory.example.com',
 *   getAuthToken: () => userAuthToken,
 *   timeout: 15000
 * });
 *
 * // Get all entitled applications
 * const apps = await client.getAllApps();
 *
 * // Find apps by intent
 * const chartApps = await client.findByIntent('ViewChart');
 *
 * // Find apps by context type
 * const instrumentApps = await client.findByContextType('fdc3.instrument');
 *
 * // Find apps by category
 * const tradingApps = await client.findByCategory('Trading');
 * ```
 *
 * @example
 * Development usage with mock service:
 * ```typescript
 * import { MockAppDirectoryService } from '@fm/fdc3-app-directory';
 *
 * const mockService = new MockAppDirectoryService();
 *
 * // Register test apps
 * mockService.registerApp({
 *   appId: 'test-app',
 *   name: 'Test Application',
 *   version: '1.0.0',
 *   title: 'Test App',
 *   categories: ['Testing'],
 *   interop: {
 *     intents: {
 *       listensFor: [
 *         {
 *           intent: 'ViewChart',
 *           contexts: ['fdc3.instrument']
 *         }
 *       ]
 *     }
 *   }
 * });
 *
 * // Query apps
 * const apps = await mockService.getAllApps();
 * ```
 *
 * @example
 * Using the singleton mock instance:
 * ```typescript
 * import { mockAppDirectory } from '@fm/fdc3-app-directory';
 *
 * // Register apps globally
 * mockAppDirectory.registerApp(testApp);
 *
 * // Use in tests
 * const apps = await mockAppDirectory.findByIntent('ViewChart');
 *
 * // Clean up
 * mockAppDirectory.clear();
 * ```
 *
 * @remarks
 * - The HTTP client uses the Fetch API (available in modern browsers and Node.js 18+)
 * - All query methods return Promises for async operations
 * - The mock service implements the same interface as the HTTP client
 * - Entitlement filtering is applied server-side when using authentication
 * - 404 errors in getApp() return null instead of throwing
 *
 * @see {@link https://fdc3.finos.org/docs/1.2/app-directory/overview | FDC3 App Directory Specification}
 */

// Export client
export { AppDirectoryClientImpl } from './client';
// Export mock service
export { MockAppDirectoryService, mockAppDirectory } from './mock';
// Re-export AppDirectoryClient interface explicitly for better d.ts generation
export type { AppDirectoryClient } from './types';
// Export all types
export * from './types';
