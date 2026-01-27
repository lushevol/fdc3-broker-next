/**
 * Mock App Directory Service
 *
 * In-memory App Directory implementation for development and testing.
 * @see research.md#L490-L515
 */

import type { AppDefinition, AppDirectoryClient } from './types';

/**
 * Mock App Directory Service.
 *
 * In-memory implementation of the {@link AppDirectoryClient} interface for
 * development and testing purposes. This class provides the same API as the
 * production HTTP client but operates entirely in memory without network calls.
 *
 * The mock service is particularly useful for:
 * - Unit testing without network dependencies
 * - Development when the App Directory server is unavailable
 * - Integration testing with predictable data
 * - Fast iteration during development
 * - Demonstrating App Directory functionality
 *
 * @example
 * Creating a mock service and registering apps:
 * ```typescript
 * const mockService = new MockAppDirectoryService();
 *
 * mockService.registerApp({
 *   appId: 'trading-app',
 *   name: 'Trading Application',
 *   version: '1.0.0',
 *   title: 'Pro Trading',
 *   categories: ['Trading', 'Analytics'],
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
 * const apps = await mockService.getAllApps();
 * console.log(apps); // [trading-app definition]
 * ```
 *
 * @example
 * Using in tests:
 * ```typescript
 * describe('App Directory Integration', () => {
 *   let mockService: MockAppDirectoryService;
 *
 *   beforeEach(() => {
 *     mockService = new MockAppDirectoryService();
 *     mockService.registerApp(testApp1);
 *     mockService.registerApp(testApp2);
 *   });
 *
 *   afterEach(() => {
 *     mockService.clear();
 *   });
 *
 *   it('should find apps by intent', async () => {
 *     const apps = await mockService.findByIntent('ViewChart');
 *     expect(apps).toHaveLength(1);
 *   });
 * });
 * ```
 *
 * @example
 * Replacing the HTTP client in development:
 * ```typescript
 * // Use environment variable to switch between mock and real client
 * const client = process.env.USE_MOCK_APP_DIRECTORY
 *   ? new MockAppDirectoryService()
 *   : new AppDirectoryClientImpl({
 *       baseUrl: 'https://app-directory.example.com',
 *       getAuthToken: () => userToken
 *     });
 * ```
 *
 * @remarks
 * - All operations are synchronous internally but return promises for API compatibility
 * - No entitlement filtering is performed (all registered apps are visible)
 * - No network latency or failures
 * - Perfect for unit tests and local development
 * - Can be serialized/deserialized for test snapshots
 *
 * @see {@link AppDirectoryClientImpl} for the production HTTP client.
 * @see {@link AppDirectoryClient} for the interface both classes implement.
 */
export class MockAppDirectoryService implements AppDirectoryClient {
  /**
   * In-memory storage of registered applications.
   *
   * Uses a Map for O(1) lookups by appId. The appId serves as the key
   * and the complete AppDefinition serves as the value.
   *
   * @private
   * @internal
   */
  private apps = new Map<string, AppDefinition>();

  /**
   * Register an app.
   *
   * Adds an application to the mock directory. If an app with the same
   * appId already exists, it will be replaced with the new definition.
   *
   * This is a synchronous method (not async) unlike the query methods,
   * making it convenient to use in test setup.
   *
   * @param app - The complete app definition to register.
   * Must include at least appId, name, version, and interop fields.
   *
   * @throws {TypeError} If app is null or undefined.
   * @throws {TypeError} If app.appId is not a valid string.
   *
   * @example
   * ```typescript
   * const mockService = new MockAppDirectoryService();
   *
   * mockService.registerApp({
   *   appId: 'chart-app',
   *   name: 'Chart Application',
   *   version: '2.1.0',
   *   title: 'Advanced Charts',
   *   description: 'Real-time charting and visualization',
   *   categories: ['Analytics', 'Visualization'],
   *   interop: {
   *     intents: {
   *       listensFor: [
   *         {
   *           intent: 'ViewChart',
   *           contexts: ['fdc3.instrument', 'fdc3.portfolio'],
   *           resultType: 'fdc3.chart'
   *         }
   *       ],
   *       raises: [
   *         {
   *           intent: 'ChartUpdated',
   *           contexts: ['fdc3.chart']
   *         }
   *       ]
   *     }
   *   }
   * });
   * ```
   *
   * @example
   * Updating an existing app:
   * ```typescript
   * // Register initial version
   * mockService.registerApp({
   *   appId: 'my-app',
   *   name: 'My App',
   *   version: '1.0.0',
   *   interop: {}
   * });
   *
   * // Update with new version
   * mockService.registerApp({
   *   appId: 'my-app',
   *   name: 'My App',
   *   version: '2.0.0',
   *   title: 'My App (Enhanced)',
   *   interop: {}
   * });
   * ```
   *
   * @example
   * In test setup:
   * ```typescript
   * beforeEach(() => {
   *   mockService.registerApp(testApps.trading);
   *   mockService.registerApp(testApps.charting);
   *   mockService.registerApp(testApps.communication);
   * });
   *
   * afterEach(() => {
   *   mockService.clear();
   * });
   * ```
   *
   * @remarks
   * - Duplicate appId values will overwrite existing apps
   * - No validation is performed on the app definition structure
   * - This method is synchronous (returns void, not Promise<void>)
   * - Can be called multiple times to build up the mock directory
   */
  registerApp(app: AppDefinition): void {
    this.apps.set(app.appId, app);
  }

  /**
   * Unregister an app.
   *
   * Removes an application from the mock directory. If the app doesn't
   * exist, this method does nothing (no error is thrown).
   *
   * This is a synchronous method (not async) for convenient test cleanup.
   *
   * @param appId - The unique identifier of the app to remove.
   *
   * @example
   * ```typescript
   * const mockService = new MockAppDirectoryService();
   * mockService.registerApp(testApp);
   *
   * console.log(await mockService.getAllApps().length); // 1
   *
   * mockService.unregisterApp(testApp.appId);
   * console.log(await mockService.getAllApps().length); // 0
   * ```
   *
   * @example
   * Conditional removal:
   * ```typescript
   * if (shouldRemoveApp) {
   *   mockService.unregisterApp('temporary-app');
   * }
   * ```
   *
   * @example
   * In test teardown:
   * ```typescript
   * afterEach(() => {
   *   mockService.unregisterApp('test-app');
   * });
   * ```
   *
   * @remarks
   * - Safe to call even if the appId doesn't exist (no-op)
   * - This method is synchronous (returns void, not Promise<void>)
   * - Useful for selective cleanup in tests
   * - Consider using `clear()` to remove all apps at once
   *
   * @see {@link clear} to remove all registered apps.
   */
  unregisterApp(appId: string): void {
    this.apps.delete(appId);
  }

  /**
   * Clear all registered apps.
   *
   * Removes all applications from the mock directory, resetting it to
   * an empty state. This is particularly useful in test teardown to
   * ensure test isolation.
   *
   * This is a synchronous method (not async) for convenience.
   *
   * @example
   * ```typescript
   * const mockService = new MockAppDirectoryService();
   *
   * // Register multiple apps
   * mockService.registerApp(app1);
   * mockService.registerApp(app2);
   * mockService.registerApp(app3);
   *
   * console.log(await mockService.getAllApps().length); // 3
   *
   * // Reset to empty state
   * mockService.clear();
   * console.log(await mockService.getAllApps().length); // 0
   * ```
   *
   * @example
   * In test lifecycle:
   * ```typescript
   * describe('App Directory Tests', () => {
   *   const mockService = new MockAppDirectoryService();
   *
   *   beforeEach(() => {
   *     // Setup test data
   *     mockService.registerApp(testApp);
   *   });
   *
   *   afterEach(() => {
   *     // Ensure clean state
   *     mockService.clear();
   *   });
   *
   *   it('should query apps correctly', async () => {
   *     const apps = await mockService.getAllApps();
   *     expect(apps).toHaveLength(1);
   *   });
   * });
   * ```
   *
   * @remarks
   * - This method is synchronous (returns void, not Promise<void>)
   * - Safe to call multiple times (idempotent)
   * - All apps are removed; no selective deletion
   * - Use in afterEach() to prevent test pollution
   */
  clear(): void {
    this.apps.clear();
  }

  /**
   * Get all apps.
   *
   * Returns all applications currently registered in the mock directory.
   * Unlike the production client, this does not perform any entitlement
   * filtering - all registered apps are returned.
   *
   * @returns A promise that resolves to an array of all registered app definitions.
   * Returns an empty array if no apps have been registered.
   *
   * @example
   * ```typescript
   * const mockService = new MockAppDirectoryService();
   *
   * mockService.registerApp(tradingApp);
   * mockService.registerApp(chartingApp);
   * mockService.registerApp(commApp);
   *
   * const allApps = await mockService.getAllApps();
   * console.log(`Total apps: ${allApps.length}`); // Total apps: 3
   *
   * allApps.forEach(app => {
   *   console.log(`- ${app.title || app.name}`);
   * });
   * ```
   *
   * @example
   * In tests:
   * ```typescript
   * it('should return all registered apps', async () => {
   *   mockService.registerApp(app1);
   *   mockService.registerApp(app2);
   *
   *   const apps = await mockService.getAllApps();
   *
   *   expect(apps).toHaveLength(2);
   *   expect(apps).toContainEqual(app1);
   *   expect(apps).toContainEqual(app2);
   * });
   * ```
   *
   * @remarks
   * - Returns apps in insertion order (Map iteration order)
   * - No entitlement filtering is applied
   * - Returns empty array if no apps are registered
   * - Async method to match the AppDirectoryClient interface
   * - Returns a shallow copy of the stored apps (changes to returned array don't affect the mock)
   */
  async getAllApps(): Promise<AppDefinition[]> {
    return Array.from(this.apps.values());
  }

  /**
   * Get app by ID.
   *
   * Retrieves a specific application by its unique identifier.
   * Returns null if the app is not found (no error is thrown).
   *
   * @param appId - The unique identifier of the app to retrieve.
   *
   * @returns A promise that resolves to the app definition if found,
   * or null if the app doesn't exist in the mock directory.
   *
   * @example
   * ```typescript
   * const mockService = new MockAppDirectoryService();
   *
   * mockService.registerApp({
   *   appId: 'trading-app',
   *   name: 'Trading App',
   *   version: '1.0.0',
   *   interop: {}
   * });
   *
   * const app = await mockService.getApp('trading-app');
   * if (app) {
   *   console.log(`Found: ${app.name}`);
   * }
   *
   * const missing = await mockService.getApp('non-existent');
   * console.log(missing); // null
   * ```
   *
   * @example
   * Null-safe usage:
   * ```typescript
   * const app = await mockService.getApp('my-app');
   *
   * // Use optional chaining to safely access properties
   * const title = app?.title || app?.name || 'Unknown';
   * const intents = app?.interop?.intents?.listensFor || [];
   * ```
   *
   * @example
   * In tests:
   * ```typescript
   * it('should return app by ID', async () => {
   *   mockService.registerApp(testApp);
   *
   *   const found = await mockService.getApp(testApp.appId);
   *   expect(found).toEqual(testApp);
   *
   *   const notFound = await mockService.getApp('missing');
   *   expect(notFound).toBeNull();
   * });
   * ```
   *
   * @remarks
   * - No entitlement filtering is applied
   * - Case-sensitive appId matching
   * - Returns null instead of throwing for missing apps
   * - Async method to match the AppDirectoryClient interface
   */
  async getApp(appId: string): Promise<AppDefinition | null> {
    return this.apps.get(appId) || null;
  }

  /**
   * Find apps that handle a specific intent.
   *
   * Searches for applications that have declared they can handle the
   * specified intent in their `interop.intents.listensFor` configuration.
   *
   * @param intent - The FDC3 intent type to search for
   * (e.g., 'ViewChart', 'StartCall', 'ViewOrders').
   *
   * @returns A promise that resolves to an array of app definitions that
   * have the intent in their listensFor array. Returns an empty array if
   * no apps support this intent.
   *
   * @example
   * ```typescript
   * const mockService = new MockAppDirectoryService();
   *
   * mockService.registerApp({
   *   appId: 'chart-app',
   *   name: 'Chart App',
   *   version: '1.0.0',
   *   interop: {
   *     intents: {
   *       listensFor: [
   *         { intent: 'ViewChart', contexts: ['fdc3.instrument'] },
   *         { intent: 'ViewQuote', contexts: ['fdc3.instrument'] }
   *       ]
   *     }
   *   }
   * });
   *
   * const chartApps = await mockService.findByIntent('ViewChart');
   * console.log(chartApps.length); // 1
   * console.log(chartApps[0].name); // 'Chart App'
   * ```
   *
   * @example
   * Multiple apps with same intent:
   * ```typescript
   * mockService.registerApp(chartApp1);  // Both support ViewChart
   * mockService.registerApp(chartApp2);  // Both support ViewChart
   * mockService.registerApp(tradingApp); // Different intents
   *
   * const chartApps = await mockService.findByIntent('ViewChart');
   * expect(chartApps).toHaveLength(2);
   * ```
   *
   * @example
   * In tests:
   * ```typescript
   * it('should find apps by intent', async () => {
   *   mockService.registerApp({
   *     appId: 'test-app',
   *     name: 'Test',
   *     version: '1.0.0',
   *     interop: {
   *       intents: {
   *         listensFor: [
   *           { intent: 'ViewChart', contexts: ['fdc3.instrument'] }
   *         ]
   *       }
   *     }
   *   });
   *
   *   const apps = await mockService.findByIntent('ViewChart');
   *   expect(apps).toHaveLength(1);
   *   expect(apps[0].appId).toBe('test-app');
   * });
   * ```
   *
   * @remarks
   * - Case-sensitive intent matching
   * - Searches only in `listensFor`, not `raises`
   * - No filtering by context type (returns all apps with the intent)
   * - No entitlement filtering
   * - Returns apps in insertion order
   *
   * @see {@link findByContextType} to find apps by context type instead.
   */
  async findByIntent(intent: string): Promise<AppDefinition[]> {
    return Array.from(this.apps.values()).filter((app) =>
      app.interop?.intents?.listensFor?.some((l) => l.intent === intent),
    );
  }

  /**
   * Find apps that can handle a specific context type.
   *
   * Searches for applications that have declared they can process the
   * specified context type in any of their intent handlers.
   *
   * @param contextType - The FDC3 context type to search for
   * (e.g., 'fdc3.instrument', 'fdc3.portfolio', 'fdc3.contact').
   *
   * @returns A promise that resolves to an array of app definitions that
   * have the context type in their intent handler contexts. Returns an
   * empty array if no apps support this context.
   *
   * @example
   * ```typescript
   * const mockService = new MockAppDirectoryService();
   *
   * mockService.registerApp({
   *   appId: 'chart-app',
   *   name: 'Chart App',
   *   version: '1.0.0',
   *   interop: {
   *     intents: {
   *       listensFor: [
   *         { intent: 'ViewChart', contexts: ['fdc3.instrument', 'fdc3.portfolio'] }
   *       ]
   *     }
   *   }
   * });
   *
   * const instrumentApps = await mockService.findByContextType('fdc3.instrument');
   * console.log(instrumentApps.length); // 1
   *
   * const contactApps = await mockService.findByContextType('fdc3.contact');
   * console.log(contactApps.length); // 0
   * ```
   *
   * @example
   * Apps with multiple context types:
   * ```typescript
   * mockService.registerApp({
   *   appId: 'multi-context-app',
   *   name: 'Multi Context',
   *   version: '1.0.0',
   *   interop: {
   *     intents: {
   *       listensFor: [
   *         { intent: 'ViewChart', contexts: ['fdc3.instrument'] },
   *         { intent: 'ViewChart', contexts: ['fdc3.portfolio'] }
   *       ]
   *     }
   *   }
   * });
   *
   * // Finds app because it handles fdc3.portfolio
   * const apps = await mockService.findByContextType('fdc3.portfolio');
   * expect(apps).toHaveLength(1);
   * ```
   *
   * @example
   * In tests:
   * ```typescript
   * it('should find apps by context type', async () => {
   *   mockService.registerApp(instrumentApp);
   *   mockService.registerApp(portfolioApp);
   *   mockService.registerApp(contactApp);
   *
   *   const instrumentApps = await mockService.findByContextType('fdc3.instrument');
   *   expect(instrumentApps).toHaveLength(1);
   *   expect(instrumentApps[0].appId).toBe(instrumentApp.appId);
   * });
   * ```
   *
   * @remarks
   * - Case-sensitive context type matching
   * - Searches all intents in `listensFor`
   * - Matches if the context type appears in any intent's contexts array
   * - If an intent has no contexts (undefined), it's not considered a match
   * - No entitlement filtering
   *
   * @see {@link findByIntent} to find apps by intent instead.
   */
  async findByContextType(contextType: string): Promise<AppDefinition[]> {
    return Array.from(this.apps.values()).filter((app) =>
      app.interop?.intents?.listensFor?.some((l) => l.contexts?.includes(contextType)),
    );
  }

  /**
   * Find apps by category.
   *
   * Searches for applications that have been tagged with the specified
   * category in their metadata.
   *
   * @param category - The category name to search for
   * (e.g., 'Analytics', 'Trading', 'Communication', 'Productivity').
   *
   * @returns A promise that resolves to an array of app definitions that
   * have the specified category. Returns an empty array if no apps are
   * in this category.
   *
   * @example
   * ```typescript
   * const mockService = new MockAppDirectoryService();
   *
   * mockService.registerApp({
   *   appId: 'analytics-app',
   *   name: 'Analytics App',
   *   version: '1.0.0',
   *   categories: ['Analytics', 'Data'],
   *   interop: {}
   * });
   *
   * mockService.registerApp({
   *   appId: 'trading-app',
   *   name: 'Trading App',
   *   version: '1.0.0',
   *   categories: ['Trading', 'Execution'],
   *   interop: {}
   * });
   *
   * const analyticsApps = await mockService.findByCategory('Analytics');
   * console.log(analyticsApps.length); // 1
   * console.log(analyticsApps[0].name); // 'Analytics App'
   *
   * const tradingApps = await mockService.findByCategory('Trading');
   * console.log(tradingApps.length); // 1
   * ```
   *
   * @example
   * Apps with multiple categories:
   * ```typescript
   * mockService.registerApp({
   *   appId: 'multi-category-app',
   *   name: 'Multi Category',
   *   version: '1.0.0',
   *   categories: ['Analytics', 'Trading', 'Market Data'],
   *   interop: {}
   * });
   *
   * // Found in all three categories
   * const analytics = await mockService.findByCategory('Analytics');
   * const trading = await mockService.findByCategory('Trading');
   * const marketData = await mockService.findByCategory('Market Data');
   *
   * expect(analytics).toHaveLength(1);
   * expect(trading).toHaveLength(1);
   * expect(marketData).toHaveLength(1);
   * ```
   *
   * @example
   * In tests:
   * ```typescript
   * it('should find apps by category', async () => {
   *   mockService.registerApp({
   *     appId: 'test-app',
   *     name: 'Test',
   *     version: '1.0.0',
   *     categories: ['Analytics', 'Data Science'],
   *     interop: {}
   *   });
   *
   *   const analyticsApps = await mockService.findByCategory('Analytics');
   *   expect(analyticsApps).toHaveLength(1);
   *
   *   const tradingApps = await mockService.findByCategory('Trading');
   *   expect(tradingApps).toHaveLength(0);
   * });
   * ```
   *
   * @remarks
   * - Case-sensitive category matching
   * - Apps can have multiple categories
   * - If an app has no categories (undefined), it won't match any category search
   * - No entitlement filtering
   * - Returns apps in insertion order
   */
  async findByCategory(category: string): Promise<AppDefinition[]> {
    return Array.from(this.apps.values()).filter((app) => app.categories?.includes(category));
  }
}

/**
 * Singleton instance of the Mock App Directory Service.
 *
 * A pre-configured instance of MockAppDirectoryService for convenient import
 * and use in tests or development. This singleton can be shared across
 * multiple test files or modules without creating additional instances.
 *
 * @example
 * Direct import and usage:
 * ```typescript
 * import { mockAppDirectory } from '@fm/fdc3-app-directory';
 *
 * // Register apps directly
 * mockAppDirectory.registerApp({
 *   appId: 'test-app',
 *   name: 'Test App',
 *   version: '1.0.0',
 *   interop: {}
 * });
 *
 * // Query apps
 * const apps = await mockAppDirectory.getAllApps();
 * ```
 *
 * @example
 * In test setup files:
 * ```typescript
 * // setup.ts
 * import { mockAppDirectory } from '@fm/fdc3-app-directory';
 * import { testApps } from './fixtures';
 *
 * beforeAll(() => {
 *   // Register all test fixtures
 *   Object.values(testApps).forEach(app => {
 *     mockAppDirectory.registerApp(app);
 *   });
 * });
 *
 * afterAll(() => {
 *   // Clean up
 *   mockAppDirectory.clear();
 * });
 * ```
 *
 * @example
 * In React components for development:
 * ```typescript
 * import { mockAppDirectory } from '@fm/fdc3-app-directory';
 * import { useEffect, useState } from 'react';
 *
 * function AppDirectory() {
 *   const [apps, setApps] = useState([]);
 *
 *   useEffect(() => {
 *     if (process.env.NODE_ENV === 'development') {
 *       mockAppDirectory.registerApp(devApp);
 *       mockAppDirectory.getAllApps().then(setApps);
 *     }
 *   }, []);
 *
 *   // Render apps in your component
 *   return React.createElement('div', null, apps);
 * }
 * ```
 *
 * @remarks
 * - The same instance is shared across all imports
 * - Be careful with shared state in tests - use clear() in afterEach
 * - Useful for global test fixtures and development setups
 * - Consider creating fresh instances for isolated test suites
 *
 * @see {@link MockAppDirectoryService} for the class implementation.
 */
export const mockAppDirectory = new MockAppDirectoryService();
