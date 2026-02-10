/**
 * App Directory Type Definitions
 *
 * Types for the App Directory service client and data structures.
 * @see data-model.md#L99-L244
 */

/**
 * Complete app definition from App Directory.
 *
 * Extends the FDC3 AppMetadata standard with additional fields for enhanced
 * application discovery and entitlement management. This interface represents
 * the full application record as stored and returned by the App Directory service.
 *
 * @example
 * ```typescript
 * const tradingApp: AppDefinition = {
 *   appId: 'trading-app',
 *   name: 'Trading Application',
 *   version: '2.1.0',
 *   title: 'Pro Trading',
 *   description: 'Advanced trading platform for equities and derivatives',
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
 * };
 * ```
 *
 * @see {@link https://fdc3.finos.org/docs/1.2/app-directory/overview | FDC3 App Directory Specification}
 */
export interface AppDefinition {
  /**
   * REQUIRED: Unique app identifier.
   *
   * This identifier must be unique across all applications in the directory
   * and is used to reference the app in API calls and intent resolution.
   *
   * @example
   * ```typescript
   * appId: 'my-trading-app'
   * ```
   */
  appId: string;

  /**
   * REQUIRED: App name.
   *
   * The canonical name of the application. This may differ from the display title.
   *
   * @example
   * ```typescript
   * name: 'TradingApplication'
   * ```
   */
  name: string;

  /**
   * REQUIRED: App version.
   *
   * Semantic version of the application.
   *
   * @example
   * ```typescript
   * version: '1.2.3'
   * ```
   */
  version: string;

  /**
   * Short title (preferred for display over name).
   *
   * A user-friendly display name that should be used in UI components
   * instead of the `name` field.
   *
   * @example
   * ```typescript
   * title: 'Pro Trading'
   * ```
   */
  title?: string;

  /**
   * App description.
   *
   * Detailed description of the application's purpose and features.
   *
   * @example
   * ```typescript
   * description: 'Advanced trading platform with real-time market data'
   * ```
   */
  description?: string;

  /**
   * App icons.
   *
   * Array of icon definitions in different sizes for responsive UI rendering.
   *
   * @example
   * ```typescript
   * icons: [
   *   { src: 'https://example.com/icon-16.png', size: '16x16', type: 'image/png' },
   *   { src: 'https://example.com/icon-64.png', size: '64x64', type: 'image/png' }
   * ]
   * ```
   */
  icons?: Array<{
    /**
     * Icon URL.
     *
     * Can be absolute URL or relative path from app directory root.
     */
    src: string;

    /**
     * Icon dimensions.
     *
     * Format: "WIDTHxHEIGHT" (e.g., "16x16", "64x64").
     */
    size?: string;

    /**
     * Icon MIME type.
     *
     * Common values: 'image/png', 'image/svg+xml', 'image/jpeg'.
     */
    type?: string;
  }>;

  /**
   * App screenshots.
   *
   * Visual previews of the application for display in app directory listings.
   *
   * @example
   * ```typescript
   * images: [
   *   { src: 'https://example.com/screenshot1.png', size: '800x600' },
   *   { src: 'https://example.com/screenshot2.png', size: '1200x800' }
   * ]
   * ```
   */
  images?: Array<{
    /**
     * Screenshot URL.
     *
     * Can be absolute URL or relative path from app directory root.
     */
    src: string;

    /**
     * Screenshot dimensions.
     *
     * Format: "WIDTHxHEIGHT" (e.g., "800x600").
     */
    size?: string;
  }>;

  /**
   * App categories.
   *
   * Array of category names for filtering and discovery.
   * Common categories include: "Analytics", "Trading", "Communication", "Productivity".
   *
   * @example
   * ```typescript
   * categories: ['Trading', 'Analytics', 'Market Data']
   * ```
   */
  categories?: string[];

  /**
   * Primary language code.
   *
   * ISO 639-1 language code (e.g., "en", "zh", "es").
   *
   * @example
   * ```typescript
   * lang: 'en'
   * ```
   */
  lang?: string;

  /**
   * Localized versions.
   *
   * Alternative language versions of the app with localized names and descriptions.
   *
   * @example
   * ```typescript
   * localizedVersions: [
   *   {
   *     lang: 'zh',
   *     name: '交易应用',
   *     description: '用于股票和衍生品的高级交易平台'
   *   }
   * ]
   * ```
   */
  localizedVersions?: Array<{
    /**
     * Language code.
     *
     * ISO 639-1 language code for this localization.
     */
    lang: string;

    /**
     * Localized app name.
     *
     * App name translated to the target language.
     */
    name: string;

    /**
     * Localized description.
     *
     * App description translated to the target language.
     */
    description?: string;
  }>;

  /**
   * Interoperability configuration.
   *
   * FDC3-standard configuration defining how this app participates in
   * inter-app communication via intents and contexts.
   *
   * @example
   * ```typescript
   * interop: {
   *   intents: {
   *     listensFor: [
   *       {
   *         intent: 'ViewChart',
   *         contexts: ['fdc3.instrument'],
   *         resultType: 'fdc3.chart'
   *       },
   *       {
   *         intent: 'ViewOrders',
   *         contexts: ['fdc3.order']
   *       }
   *     ],
   *     raises: [
   *       {
   *         intent: 'PriceUpdated',
   *         contexts: ['fdc3.instrument']
   *       }
   *     ]
   *   }
   * }
   * ```
   *
   * @see {@link https://fdc3.finos.org/docs/1.2/app-directory/intent-metadata | FDC3 Intent Metadata}
   */
  interop: {
    /**
     * Intent declarations.
     *
     * Defines which intents this app can handle (listen for) and which intents it raises.
     */
    intents?: {
      /**
       * Intents this app handles.
       *
       * Array of intent declarations that this application can receive and process.
       * Used by the App Directory to match apps to intent resolution requests.
       *
       * @example
       * ```typescript
       * listensFor: [
       *   {
       *     intent: 'ViewChart',
       *     contexts: ['fdc3.instrument', 'fdc3.portfolio'],
       *     resultType: 'fdc3.chart'
       *   }
       * ]
       * ```
       */
      listensFor?: Array<{
        /**
         * Intent type name.
         *
         * Standard FDC3 intent name (e.g., 'ViewChart', 'StartCall', 'ViewOrders').
         *
         * @see {@link https://fdc3.finos.org/docs/1.2/api/spec#standard-intents | FDC3 Standard Intents}
         */
        intent: string;

        /**
         * Accepted context types.
         *
         * Array of FDC3 context type URIs that this intent handler can process.
         * If undefined, the intent handler accepts any context type.
         *
         * @example
         * ```typescript
         * contexts: ['fdc3.instrument', 'fdc3.portfolio']
         * ```
         */
        contexts?: string[];

        /**
         * Expected result type.
         *
         * The type of context data that this intent returns upon successful resolution.
         *
         * @example
         * ```typescript
         * resultType: 'fdc3.chart'
         * ```
         */
        resultType?: string;
      }>;

      /**
       * Intents this app raises.
       *
       * Array of intent declarations that this application may broadcast to other apps.
       *
       * @example
       * ```typescript
       * raises: [
       *   {
       *     intent: 'PriceUpdated',
       *     contexts: ['fdc3.instrument']
       *   }
       * ]
       * ```
       */
      raises?: Array<{
        /**
         * Intent type name.
         *
         * Standard or custom intent name that this app broadcasts.
         */
        intent: string;

        /**
         * Context types for raised intents.
         *
         * Array of FDC3 context type URIs that this intent broadcasts with.
         *
         * @example
         * ```typescript
         * contexts: ['fdc3.instrument', 'fdc3.quote']
         * ```
         */
        contexts?: string[];
      }>;
    };
  };

  /**
   * Entitlement constraints.
   *
   * Platform-specific access control rules that determine which users can
   * access and launch this application. The App Directory service uses these
   * constraints to filter apps based on user entitlements.
   *
   * @example
   * ```typescript
   * entitlementConstraints: {
   *   requiredPermissions: ['market_data', 'trading'],
   *   userGroups: ['traders', 'analysts'],
   *   minAccessLevel: 'full'
   * }
   * ```
   *
   * @remarks
   * These constraints are enforced by the App Directory API when returning
   * application lists. Users without the required permissions will not see
   * entitlement-restricted apps in query results.
   */
  entitlementConstraints?: {
    /**
     * Required user permissions.
     *
     * Array of permission identifiers that the user must have to access this app.
     *
     * @example
     * ```typescript
     * requiredPermissions: ['market_data', 'order_execution']
     * ```
     */
    requiredPermissions?: string[];

    /**
     * Authorized user groups.
     *
     * Array of group identifiers that are allowed to access this app.
     * Users must belong to at least one of these groups.
     *
     * @example
     * ```typescript
     * userGroups: ['traders', 'portfolio_managers']
     * ```
     */
    userGroups?: string[];

    /**
     * Minimum access level.
     *
     * Minimum access level required (e.g., 'basic', 'full', 'admin').
     *
     * @example
     * ```typescript
     * minAccessLevel: 'full'
     * ```
     */
    minAccessLevel?: string;
  };
}

/**
 * App Directory client interface.
 *
 * Defines the contract for querying the App Directory service. Both the
 * production HTTP client and the mock service implement this interface,
 * allowing easy switching between production and development modes.
 *
 * @example
 * Production usage with HTTP client:
 * ```typescript
 * const client = new AppDirectoryClientImpl({
 *   baseUrl: 'https://app-directory.example.com',
 *   getAuthToken: () => userToken
 * });
 *
 * const apps = await client.getAllApps();
 * const chartApp = await client.getApp('chart-app');
 * ```
 *
 * @example
 * Development usage with mock service:
 * ```typescript
 * const mockClient = new MockAppDirectoryService();
 * mockClient.registerApp({
 *   appId: 'test-app',
 *   name: 'Test App',
 *   version: '1.0.0',
 *   interop: {}
 * });
 *
 * const apps = await mockClient.getAllApps();
 * ```
 *
 * @see {@link AppDirectoryClientImpl}
 * @see {@link MockAppDirectoryService}
 */
export interface AppDirectoryClient {
  /**
   * Get all apps the current user is entitled to access.
   *
   * Retrieves a list of all applications from the directory, filtered by
   * the user's entitlements. If an auth token is provided, the server
   * will enforce entitlement constraints and only return apps the user
   * is authorized to access.
   *
   * @returns A promise that resolves to an array of app definitions.
   * Returns an empty array if no apps are available or the user has no entitlements.
   *
   * @throws {Error} When the HTTP request fails due to network issues or timeout.
   * @throws {Error} When authentication fails (401) if authToken is invalid.
   * @throws {Error} When the server returns an error (500) or is unavailable.
   *
   * @example
   * ```typescript
   * // Get all entitled applications
   * const client = new AppDirectoryClientImpl({
   *   baseUrl: 'https://app-directory.example.com',
   *   getAuthToken: () => userToken
   * });
   *
   * const apps = await client.getAllApps();
   * console.log(`Found ${apps.length} applications`);
   *
   * // Display app titles
   * apps.forEach(app => {
   *   console.log(app.title || app.name);
   * });
   * ```
   *
   * @example
   * With mock service:
   * ```typescript
   * const mock = new MockAppDirectoryService();
   * mock.registerApp(testApp1);
   * mock.registerApp(testApp2);
   *
   * const apps = await mock.getAllApps();
   * // Returns: [testApp1, testApp2]
   * ```
   */
  getAllApps(): Promise<AppDefinition[]>;

  /**
   * Get app by appId.
   *
   * Retrieves a specific application by its unique identifier. Returns null
   * if the app is not found or if the user is not entitled to access it.
   *
   * @param appId - The unique application identifier.
   *
   * @returns A promise that resolves to the app definition if found and entitled,
   * or null if the app doesn't exist or the user lacks entitlements.
   *
   * @throws {Error} When the HTTP request fails due to network issues or timeout.
   * @throws {Error} When authentication fails (401) if authToken is invalid.
   * @throws {Error} When the server returns an internal error (500).
   *
   * @example
   * ```typescript
   * const client = new AppDirectoryClientImpl({
   *   baseUrl: 'https://app-directory.example.com',
   *   getAuthToken: () => userToken
   * });
   *
   * const app = await client.getApp('trading-app');
   * if (app) {
   *   console.log(`Found: ${app.title || app.name}`);
   *   console.log(`Version: ${app.version}`);
   * } else {
   *   console.log('App not found or not entitled');
   * }
   * ```
   *
   * @example
   * With mock service:
   * ```typescript
   * const mock = new MockAppDirectoryService();
   * mock.registerApp({
   *   appId: 'my-app',
   *   name: 'My App',
   *   version: '1.0.0',
   *   interop: {}
   * });
   *
   * const app = await mock.getApp('my-app');
   * // Returns the registered app definition
   *
   * const missing = await mock.getApp('non-existent');
   * // Returns: null
   * ```
   */
  getApp(appId: string): Promise<AppDefinition | null>;

  /**
   * Find apps that can handle a specific intent.
   *
   * Searches for applications that have declared they can handle the specified
   * intent in their `interop.intents.listensFor` configuration. Results are
   * filtered by user entitlements.
   *
   * @param intent - The FDC3 intent type to search for (e.g., 'ViewChart', 'StartCall').
   *
   * @returns A promise that resolves to an array of app definitions that handle the intent.
   * Returns an empty array if no apps support this intent or the user lacks entitlements.
   *
   * @throws {Error} When the HTTP request fails due to network issues or timeout.
   * @throws {Error} When authentication fails (401) if authToken is invalid.
   * @throws {Error} When the server returns an error (500).
   *
   * @example
   * ```typescript
   * const client = new AppDirectoryClientImpl({
   *   baseUrl: 'https://app-directory.example.com',
   *   getAuthToken: () => userToken
   * });
   *
   * const chartApps = await client.findByIntent('ViewChart');
   * console.log(`Found ${chartApps.length} apps that can ViewChart`);
   *
   * // Filter apps that accept a specific context type
   * const instrumentChartApps = chartApps.filter(app =>
   *   app.interop.intents?.listensFor?.some(l =>
   *     l.intent === 'ViewChart' && l.contexts?.includes('fdc3.instrument')
   *   )
   * );
   * ```
   *
   * @see {@link https://fdc3.finos.org/docs/1.2/api/spec#standard-intents | FDC3 Standard Intents}
   * @see {@link AppDefinition.interop}
   */
  findByIntent(intent: string): Promise<AppDefinition[]>;

  /**
   * Find apps that can handle a specific context type.
   *
   * Searches for applications that have declared they can process the specified
   * context type in their intent handlers. Results are filtered by user entitlements.
   *
   * @param contextType - The FDC3 context type to search for
   * (e.g., 'fdc3.instrument', 'fdc3.portfolio', 'fdc3.contact').
   *
   * @returns A promise that resolves to an array of app definitions that accept the context type.
   * Returns an empty array if no apps support this context or the user lacks entitlements.
   *
   * @throws {Error} When the HTTP request fails due to network issues or timeout.
   * @throws {Error} When authentication fails (401) if authToken is invalid.
   * @throws {Error} When the server returns an error (500).
   *
   * @example
   * ```typescript
   * const client = new AppDirectoryClientImpl({
   *   baseUrl: 'https://app-directory.example.com',
   *   getAuthToken: () => userToken
   * });
   *
   * const instrumentApps = await client.findByContextType('fdc3.instrument');
   * console.log(`Found ${instrumentApps.length} apps that handle instruments`);
   *
   * // Display app names
   * instrumentApps.forEach(app => {
   *   console.log(`${app.title || app.name} can handle fdc3.instrument`);
   * });
   * ```
   *
   * @see {@link https://fdc3.finos.org/docs/1.2/context/spec | FDC3 Context Data Specification}
   */
  findByContextType(contextType: string): Promise<AppDefinition[]>;

  /**
   * Find apps by category.
   *
   * Searches for applications that have been tagged with the specified category.
   * Categories are used to group apps by functional area (e.g., 'Trading', 'Analytics').
   * Results are filtered by user entitlements.
   *
   * @param category - The category name to search for
   * (e.g., 'Analytics', 'Trading', 'Communication', 'Productivity').
   *
   * @returns A promise that resolves to an array of app definitions in the category.
   * Returns an empty array if no apps are in this category or the user lacks entitlements.
   *
   * @throws {Error} When the HTTP request fails due to network issues or timeout.
   * @throws {Error} When authentication fails (401) if authToken is invalid.
   * @throws {Error} When the server returns an error (500).
   *
   * @example
   * ```typescript
   * const client = new AppDirectoryClientImpl({
   *   baseUrl: 'https://app-directory.example.com',
   *   getAuthToken: () => userToken
   * });
   *
   * const analyticsApps = await client.findByCategory('Analytics');
   * console.log(`Found ${analyticsApps.length} analytics apps`);
   *
   * // Display all categories
   * const allApps = await client.getAllApps();
   * const categories = new Set(
   *   allApps.flatMap(app => app.categories || [])
   * );
   * console.log('Available categories:', Array.from(categories));
   * ```
   */
  findByCategory(category: string): Promise<AppDefinition[]>;
}

/**
 * App Directory client configuration.
 *
 * Configuration options for the App Directory HTTP client. These settings
 * control connection behavior, authentication, and request timeout.
 *
 * @example
 * Production configuration with authentication:
 * ```typescript
 * const config: AppDirectoryConfig = {
 *   baseUrl: 'https://app-directory.example.com',
 *   getAuthToken: () => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
 *   timeout: 15000
 * };
 *
 * const client = new AppDirectoryClientImpl(config);
 * ```
 *
 * @example
 * Development configuration without authentication:
 * ```typescript
 * const config: AppDirectoryConfig = {
 *   baseUrl: 'http://localhost:3000',
 *   timeout: 5000
 * };
 *
 * const client = new AppDirectoryClientImpl(config);
 * ```
 *
 * @remarks
 * The `getAuthToken` function should return a JWT or bearer token obtained from your
 * authentication system. The App Directory service uses this token to
 * filter applications based on user entitlements.
 */
export interface AppDirectoryConfig {
  /**
   * Base URL of App Directory service.
   *
   * The root URL of the App Directory API server. The client will append
   * endpoint paths to this base URL. Trailing slashes are automatically removed.
   *
   * @example
   * ```typescript
   * baseUrl: 'https://app-directory.example.com'
   * baseUrl: 'http://localhost:3000'
   * ```
   */
  baseUrl: string;

  /**
   * Function to get auth token for entitlement filtering.
   *
   * Optional function that returns a bearer token for authentication. The function
   * is called before each request. This allows for dynamic token retrieval,
   * handling expiration and refresh automatically.
   *
   * @remarks
   * - The returned token is included in the `Authorization` header as `Bearer {token}`
   * - Access tokens can be synchronous string or asynchronous Promise
   * - If the function returns null/undefined, no auth header is sent
   *
   * @example
   * ```typescript
   * // Static token (legacy style)
   * getAuthToken: () => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
   *
   * // Dynamic token from auth service
   * getAuthToken: async () => await authService.getToken()
   * ```
   */
  getAuthToken?: () => string | Promise<string | null> | null | undefined;

  /**
   * Request timeout in milliseconds.
   *
   * Maximum time to wait for HTTP requests to complete before aborting.
   * If a request times out, an Error is thrown with a descriptive message.
   *
   * @defaultValue 10000 (10 seconds)
   *
   * @example
   * ```typescript
   * timeout: 5000   // 5 seconds (fast networks, local dev)
   * timeout: 15000  // 15 seconds (slower networks)
   * timeout: 30000  // 30 seconds (very slow networks)
   * ```
   *
   * @throws {Error} When a request exceeds the timeout duration.
   * The error message includes the URL that timed out.
   */
  timeout?: number;

  /**
   * Local application definitions for offline/bootstrap support.
   *
   * specific list of applications that are available immediately without
   * requiring a network request. These are merged with remote apps.
   */
  localApps?: AppDefinition[];

  /**
   * App Directory operation mode.
   */
  mode?: AppDirectoryMode;
}

/**
 * App Directory operation mode.
 *
 * Controls how the client retrieves application definitions.
 *
 * - 'remote-only' (default): Fetches from remote API only. Fails on network error.
 * - 'local-only': Uses localApps only. No network requests.
 * - 'local-first': Tries remote API, falls back to localApps on error.
 */
export type AppDirectoryMode = 'remote-only' | 'local-only' | 'local-first';
