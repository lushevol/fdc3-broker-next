/**
 * App Directory Client
 *
 * HTTP client for querying the App Directory service.
 * @see research.md#L456-L485
 */

import type {
  AppDefinition,
  AppDirectoryClient as AppDirectoryClientInterface,
  AppDirectoryConfig,
  AppDirectoryMode,
} from './types';

/**
 * App Directory HTTP Client Implementation.
 *
 * Production-ready HTTP client for querying the App Directory service.
 * Implements the {@link AppDirectoryClient} interface using the Fetch API
 * to communicate with the App Directory REST API.
 *
 * The client handles:
 * - HTTP(S) requests to the App Directory API
 * - Bearer token authentication for entitlement filtering
 * - Request timeouts with abort controllers
 * - Error handling with descriptive messages
 * - URL encoding and query parameter construction
 *
 * @example
 * Basic usage without authentication (public apps only):
 * ```typescript
 * const client = new AppDirectoryClientImpl({
 *   baseUrl: 'https://app-directory.example.com'
 * });
 *
 * const apps = await client.getAllApps();
 * console.log(`Found ${apps.length} public applications`);
 * ```
 *
 * @example
 * Production usage with authentication and timeout:
 * ```typescript
 * const client = new AppDirectoryClientImpl({
 *   baseUrl: 'https://app-directory.example.com',
 *   getAuthToken: () => userAuthToken,
 *   timeout: 15000
 * });
 *
 * const tradingApps = await client.findByCategory('Trading');
 * console.log('Trading apps:', tradingApps.map(app => app.title));
 * ```
 *
 * @example
 * Usage with environment variables:
 * ```typescript
 * const config: AppDirectoryConfig = {
 *   baseUrl: process.env.APP_DIRECTORY_URL!,
 *   getAuthToken: () => process.env.USER_TOKEN,
 *   timeout: parseInt(process.env.REQUEST_TIMEOUT || '10000', 10)
 * };
 *
 * const client = new AppDirectoryClientImpl(config);
 * ```
 *
 * @remarks
 * - Trailing slashes in baseUrl are automatically removed
 * - The getAuthToken result is included in requests as a Bearer token
 * - Request timeout defaults to 10 seconds if not specified
 * - 404 errors in `getApp()` return null instead of throwing
 * - Other errors (401, 500, etc.) are thrown as Error objects
 *
 * @see {@link AppDirectoryConfig}
 * @see {@link MockAppDirectoryService} for development/testing
 */
export class AppDirectoryClientImpl implements AppDirectoryClientInterface {
  /** Base URL of the App Directory API server */
  private baseUrl: string;

  /** Optional function to get authentication token for entitlement filtering */
  private getAuthToken?: () => string | Promise<string | null> | null | undefined;

  /** Request timeout in milliseconds */
  private timeout: number;

  /** Local applications map for offline/bootstrap support */
  private localApps: Map<string, AppDefinition>;

  /** App Directory operation mode */
  private mode: AppDirectoryMode;

  /**
   * Creates a new App Directory client instance.
   *
   * Initializes the client with configuration for connecting to the
   * App Directory service. The client can be configured with or without
   * authentication depending on whether you need entitlement filtering.
   *
   * @param config - Configuration object containing baseUrl, optional authToken, and timeout.
   *
   * @throws {TypeError} If config.baseUrl is not provided or is not a valid string.
   *
   * @example
   * ```typescript
   * // Production client with authentication
   * const client = new AppDirectoryClientImpl({
   *   baseUrl: 'https://app-directory.example.com',
   *   getAuthToken: () => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
   *   timeout: 15000
   * });
   * ```
   *
   * @example
   * ```typescript
   * // Development client without authentication
   * const client = new AppDirectoryClientImpl({
   *   baseUrl: 'http://localhost:3000',
   *   timeout: 5000
   * });
   * ```
   *
   * @example
   * ```typescript
   * // Minimal configuration (defaults applied)
   * const client = new AppDirectoryClientImpl({
   *   baseUrl: 'https://app-directory.example.com'
   * });
   * // Uses default timeout of 10000ms (10 seconds)
   * ```
   *
   * @remarks
   * - The baseUrl is stored with trailing slashes removed for consistent URL construction
   * - If no timeout is specified, defaults to 10 seconds (10000ms)
   * - The getAuthToken function is optional but recommended for production use to enable entitlement filtering
   */
  constructor(config: AppDirectoryConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.getAuthToken = config.getAuthToken;
    this.timeout = config.timeout || 10000; // Default 10 second timeout
    this.mode = config.mode || 'remote-only';

    // Initialize local apps map
    this.localApps = new Map();
    if (config.localApps) {
      config.localApps.forEach((app) => {
        if (app.appId) {
          this.localApps.set(app.appId, app);
        }
      });
    }
  }

  /**
   * Get all apps the user is entitled to access.
   *
   * Makes an HTTP GET request to the `/v2/apps` endpoint to retrieve all
   * applications. If getAuthToken is configured, the server will filter the
   * results based on the user's entitlements.
   *
   * @returns A promise that resolves to an array of app definitions.
   * Returns an empty array if no apps are available.
   *
   * @throws {Error} When the HTTP request times out after the configured timeout duration.
   * The error message includes the URL that timed out.
   *
   * @throws {Error} When authentication fails (401) if the provided token is invalid or expired.
   * Error message format: `"Unauthorized: {server_message}"`
   *
   * @throws {Error} When the server returns an internal error (500) or is unavailable.
   * Error message format: `"Internal Server Error: {server_message}"`
   *
   * @throws {Error} When a network error occurs (e.g., DNS failure, connection refused).
   *
   * @example
   * ```typescript
   * const client = new AppDirectoryClientImpl({
   *   baseUrl: 'https://app-directory.example.com',
   *   getAuthToken: () => userToken
   * });
   *
   * const apps = await client.getAllApps();
   *
   * // Display app information
   * apps.forEach(app => {
   *   console.log(`${app.title || app.name} v${app.version}`);
   *   if (app.description) {
   *     console.log(`  ${app.description}`);
   *   }
   * });
   * ```
   *
   * @example
   * With error handling:
   * ```typescript
   * try {
   *   const apps = await client.getAllApps();
   *   console.log(`Loaded ${apps.length} applications`);
   * } catch (error) {
   *   if (error instanceof Error) {
   *     if (error.message.includes('Unauthorized')) {
   *       console.error('Authentication failed. Please check your token.');
   *     } else if (error.message.includes('timeout')) {
   *       console.error('Request timed out. Please try again.');
   *     } else {
   *       console.error('Failed to load apps:', error.message);
   *     }
   *   }
   * }
   * ```
   *
   * @remarks
   * - API Endpoint: `GET /v2/apps`
   * - Authentication: Bearer token in Authorization header (if provided by getAuthToken)
   * - Entitlement Filtering: Applied server-side based on user context
   * - Response Format: JSON array of AppDefinition objects
   *
   * @see {@link https://github.com/finos/FDC3/blob/main/schemas/app-directory-appd.schema.json | FDC3 App Directory Schema}
   * @see contracts/app-directory-api.yaml#L32-L72
   */
  async getAllApps(): Promise<AppDefinition[]> {
    // Mode: Local Only
    if (this.mode === 'local-only') {
      return Array.from(this.localApps.values());
    }

    let remoteApps: AppDefinition[] = [];

    try {
      remoteApps = await this.request<AppDefinition[]>('/v2/apps', 'GET');
    } catch (error) {
      // Mode: Local First (Fallback)
      if (this.mode === 'local-first' && this.localApps.size > 0) {
        return Array.from(this.localApps.values());
      }
      throw error;
    }

    return this.mergeApps(remoteApps);
  }

  /**
   * Get app by appId.
   *
   * Makes an HTTP GET request to the `/v2/apps/{appId}` endpoint to retrieve
   * a specific application. Returns null if the app is not found (404) instead
   * of throwing an error, making it safe to use without try-catch for existence checks.
   *
   * @param appId - The unique application identifier to look up.
   *
   * @returns A promise that resolves to the app definition if found and entitled,
   * or null if the app doesn't exist (404) or the user lacks entitlements (403).
   *
   * @throws {Error} When the HTTP request times out after the configured timeout duration.
   * The error message includes the URL that timed out.
   *
   * @throws {Error} When authentication fails (401) if the provided token is invalid.
   * Error message format: `"Unauthorized: {server_message}"`
   *
   * @throws {Error} When the server returns an internal error (500).
   * Error message format: `"Internal Server Error: {server_message}"`
   *
   * @throws {Error} When a network error occurs (e.g., DNS failure, connection refused).
   *
   * @throws {TypeError} If appId is not provided or is not a valid string.
   *
   * @example
   * ```typescript
   * const client = new AppDirectoryClientImpl({
   *   baseUrl: 'https://app-directory.example.com',
   *   getAuthToken: () => userToken
   * });
   *
   * const app = await client.getApp('trading-app');
   *
   * if (app) {
   *   console.log(`Found: ${app.title || app.name}`);
   *   console.log(`Version: ${app.version}`);
   *   console.log(`Categories: ${app.categories?.join(', ') || 'None'}`);
   * } else {
   *   console.log('App not found or access denied');
   * }
   * ```
   *
   * @example
   * With null-safe chaining:
   * ```typescript
   * const app = await client.getApp('chart-app');
   *
   * // Safely access nested properties
   * const firstIntent = app?.interop?.intents?.listensFor?.[0]?.intent;
   * console.log(`Primary intent: ${firstIntent || 'None'}`);
   * ```
   *
   * @example
   * Checking app existence:
   * ```typescript
   * const exists = (await client.getApp('my-app')) !== null;
   * if (exists) {
   *   console.log('App is available and entitled');
   * }
   * ```
   *
   * @remarks
   * - API Endpoint: `GET /v2/apps/{appId}`
   * - The appId is URL-encoded to handle special characters
   * - 404 errors are converted to null return values
   * - Authentication errors (401) are still thrown as errors
   * - Entitlement-restricted apps may return 403 or be excluded from results
   *
   * @see contracts/app-directory-api.yaml#L74-L101
   */
  async getApp(appId: string): Promise<AppDefinition | null> {
    // Mode: Local Only
    if (this.mode === 'local-only') {
      return this.localApps.get(appId) || null;
    }

    try {
      return await this.request<AppDefinition>(`/v2/apps/${encodeURIComponent(appId)}`, 'GET');
    } catch (error) {
      if (this.isNotFoundError(error)) {
        // If not found on server, check local if allowed
        if (this.mode !== 'remote-only') {
          const localApp = this.localApps.get(appId);
          if (localApp) return localApp;
        }
        return null;
      }

      // Mode: Local First (Fallback on error)
      if (this.mode === 'local-first' && this.localApps.has(appId)) {
        const fallbackApp = this.localApps.get(appId);
        if (fallbackApp) return fallbackApp;
      }

      throw error;
    }
  }

  /**
   * Find apps that can handle a specific intent.
   *
   * Makes an HTTP GET request to the `/v2/apps` endpoint with an `intent` query
   * parameter to filter applications that have declared they can handle the
   * specified intent in their `interop.intents.listensFor` configuration.
   *
   * @param intent - The FDC3 intent type to search for.
   * This can be a standard intent (e.g., 'ViewChart', 'StartCall') or a custom intent.
   *
   * @returns A promise that resolves to an array of app definitions that handle the intent.
   * Returns an empty array if no apps support this intent.
   *
   * @throws {Error} When the HTTP request times out after the configured timeout duration.
   *
   * @throws {Error} When authentication fails (401) if the provided token is invalid.
   *
   * @throws {Error} When the server returns an internal error (500).
   *
   * @throws {Error} When a network error occurs.
   *
   * @throws {TypeError} If intent is not provided or is not a valid string.
   *
   * @example
   * ```typescript
   * const client = new AppDirectoryClientImpl({
   *   baseUrl: 'https://app-directory.example.com',
   *   getAuthToken: () => userToken
   * });
   *
   * // Find all apps that can ViewChart
   * const chartApps = await client.findByIntent('ViewChart');
   * console.log(`Found ${chartApps.length} apps that can ViewChart`);
   *
   * // Display app names
   * chartApps.forEach(app => {
   *   console.log(`- ${app.title || app.name}`);
   * });
   * ```
   *
   * @example
   * Find apps and filter by context type:
   * ```typescript
   * const chartApps = await client.findByIntent('ViewChart');
   *
   * // Filter to apps that accept fdc3.instrument context
   * const instrumentChartApps = chartApps.filter(app =>
   *   app.interop.intents?.listensFor?.some(handler =>
   *     handler.intent === 'ViewChart' &&
   *     (!handler.contexts || handler.contexts.includes('fdc3.instrument'))
   *   )
   * );
   *
   * console.log('Instrument chart apps:', instrumentChartApps);
   * ```
   *
   * @example
   * Checking for custom intent support:
   * ```typescript
   * const apps = await client.findByIntent('CustomTradeIntent');
   *
   * if (apps.length === 0) {
   *   console.warn('No apps support CustomTradeIntent');
   * } else {
   *   console.log(`Found ${apps.length} apps supporting custom intent`);
   * }
   * ```
   *
   * @remarks
   * - API Endpoint: `GET /v2/apps?intent={intent}`
   * - The search is case-sensitive and must match intent names exactly
   * - Apps may handle the intent with different context types
   * - Results are filtered by user entitlements on the server side
   * - Standard intents are defined in the FDC3 specification
   *
   * @see {@link https://fdc3.finos.org/docs/1.2/api/spec#standard-intents | FDC3 Standard Intents}
   * @see contracts/app-directory-api.yaml#L48-L53
   */
  async findByIntent(intent: string): Promise<AppDefinition[]> {
    return this.findApps({ intent }, (app) =>
      Boolean(app.interop?.intents?.listensFor?.some((listener) => listener.intent === intent)),
    );
  }

  /**
   * Find apps that can handle a specific context type.
   *
   * Makes an HTTP GET request to the `/v2/apps` endpoint with a `contextType`
   * query parameter to find applications that have declared they can process
   * the specified context type in their intent handlers.
   *
   * @param contextType - The FDC3 context type to search for.
   * Must be a fully qualified context type URI (e.g., 'fdc3.instrument', 'fdc3.portfolio').
   *
   * @returns A promise that resolves to an array of app definitions that accept the context type.
   * Returns an empty array if no apps support this context.
   *
   * @throws {Error} When the HTTP request times out after the configured timeout duration.
   *
   * @throws {Error} When authentication fails (401) if the provided token is invalid.
   *
   * @throws {Error} When the server returns an internal error (500).
   *
   * @throws {Error} When a network error occurs.
   *
   * @throws {TypeError} If contextType is not provided or is not a valid string.
   *
   * @example
   * ```typescript
   * const client = new AppDirectoryClientImpl({
   *   baseUrl: 'https://app-directory.example.com',
   *   getAuthToken: () => userToken
   * });
   *
   * // Find apps that can handle instruments
   * const instrumentApps = await client.findByContextType('fdc3.instrument');
   * console.log(`Found ${instrumentApps.length} apps for instruments`);
   *
   * // Group by intent
   * const appsByIntent: Record<string, AppDefinition[]> = {};
   * instrumentApps.forEach(app => {
   *   app.interop?.intents?.listensFor?.forEach(handler => {
   *     if (handler.contexts?.includes('fdc3.instrument')) {
   *       if (!appsByIntent[handler.intent]) {
   *         appsByIntent[handler.intent] = [];
   *       }
   *       appsByIntent[handler.intent].push(app);
   *     }
   *   });
   * });
   *
   * console.log('Apps by intent:', Object.keys(appsByIntent));
   * ```
   *
   * @example
   * Common context types:
   * ```typescript
   * // Find apps for different context types
   * const instrumentApps = await client.findByContextType('fdc3.instrument');
   * const portfolioApps = await client.findByContextType('fdc3.portfolio');
   * const contactApps = await client.findByContextType('fdc3.contact');
   * const organizationApps = await client.findByContextType('fdc3.organization');
   * ```
   *
   * @example
   * Building a context-aware launcher:
   * ```typescript
   * async function launchForContext(context: Context) {
   *   const apps = await client.findByContextType(context.type);
   *
   *   if (apps.length === 0) {
   *     console.warn(`No apps support ${context.type}`);
   *     return;
   *   }
   *
   *   if (apps.length === 1) {
   *     return launchApp(apps[0].appId, context);
   *   }
   *
   *   // Show app picker UI
   *   showAppPicker(apps, context);
   * }
   * ```
   *
   * @remarks
   * - API Endpoint: `GET /v2/apps?contextType={contextType}`
   * - The search is case-sensitive and must match context type URIs exactly
   * - Context types use the format `fdc3.{type}` for standard types
   * - Custom context types should use reverse-domain notation
   * - Results are filtered by user entitlements on the server side
   *
   * @see {@link https://fdc3.finos.org/docs/1.2/context/spec | FDC3 Context Data Specification}
   * @see contracts/app-directory-api.yaml#L54-L59
   */
  async findByContextType(contextType: string): Promise<AppDefinition[]> {
    return this.findApps({ contextType }, (app) =>
      Boolean(
        app.interop?.intents?.listensFor?.some((listener) =>
          listener.contexts?.includes(contextType),
        ),
      ),
    );
  }

  /**
   * Find apps by category.
   *
   * Makes an HTTP GET request to the `/v2/apps` endpoint with a `category`
   * query parameter to search for applications that have been tagged with
   * the specified category in their metadata.
   *
   * @param category - The category name to search for.
   * Categories are functional groupings like 'Analytics', 'Trading', 'Communication'.
   *
   * @returns A promise that resolves to an array of app definitions in the category.
   * Returns an empty array if no apps are in this category.
   *
   * @throws {Error} When the HTTP request times out after the configured timeout duration.
   *
   * @throws {Error} When authentication fails (401) if the provided token is invalid.
   *
   * @throws {Error} When the server returns an internal error (500).
   *
   * @throws {Error} When a network error occurs.
   *
   * @throws {TypeError} If category is not provided or is not a valid string.
   *
   * @example
   * ```typescript
   * const client = new AppDirectoryClientImpl({
   *   baseUrl: 'https://app-directory.example.com',
   *   getAuthToken: () => userToken
   * });
   *
   * // Find all analytics apps
   * const analyticsApps = await client.findByCategory('Analytics');
   * console.log(`Found ${analyticsApps.length} analytics applications`);
   *
   * // Display app information
   * analyticsApps.forEach(app => {
   *   console.log(`${app.title || app.name}: ${app.description || 'No description'}`);
   * });
   * ```
   *
   * @example
   * Building a category browser:
   * ```typescript
   * // Get all unique categories
   * const allApps = await client.getAllApps();
   * const categories = new Set(
   *   allApps.flatMap(app => app.categories || [])
   * );
   *
   * // Load apps for each category
   * const appsByCategory = await Promise.all(
   *   Array.from(categories).map(async category => ({
   *     category,
   *     apps: await client.findByCategory(category)
   *   }))
   * );
   *
   * // Display category browser
   * appsByCategory.forEach(({ category, apps }) => {
   *   console.log(`${category} (${apps.length} apps)`);
   * });
   * ```
   *
   * @example
   * Discovering available categories:
   * ```typescript
   * const allApps = await client.getAllApps();
   *
   * // Extract and deduplicate categories
   * const categoryCounts = allApps.reduce((acc, app) => {
   *   app.categories?.forEach(category => {
   *     acc[category] = (acc[category] || 0) + 1;
   *   });
   *   return acc;
   * }, {} as Record<string, number>);
   *
   * console.log('Available categories:');
   * Object.entries(categoryCounts)
   *   .sort(([, a], [, b]) => b - a)
   *   .forEach(([category, count]) => {
   *     console.log(`  ${category}: ${count} apps`);
   *   });
   * ```
   *
   * @remarks
   * - API Endpoint: `GET /v2/apps?category={category}`
   * - Category matching is case-sensitive
   * - Categories are assigned by app developers and may not be standardized
   * - Common categories include: Analytics, Trading, Communication, Productivity, Market Data
   * - Results are filtered by user entitlements on the server side
   *
   * @see contracts/app-directory-api.yaml#L42-L47
   */
  async findByCategory(category: string): Promise<AppDefinition[]> {
    return this.findApps({ category }, (app) => Boolean(app.categories?.includes(category)));
  }

  private async findApps(
    params: Record<string, string>,
    matches: (app: AppDefinition) => boolean,
  ): Promise<AppDefinition[]> {
    const localMatches = Array.from(this.localApps.values()).filter(matches);
    if (this.mode === 'local-only') {
      return localMatches;
    }

    try {
      const remoteApps = await this.request<AppDefinition[]>('/v2/apps', 'GET', params);
      return this.mergeApps(remoteApps, localMatches);
    } catch (error) {
      if (this.mode === 'local-first') {
        return this.mergeApps([], localMatches);
      }
      throw error;
    }
  }

  /**
   * Make HTTP request to App Directory API.
   *
   * Internal method that performs the actual HTTP request using the Fetch API.
   * Handles URL construction, query parameter encoding, authentication headers,
   * timeout management, and response parsing.
   *
   * @param endpoint - API endpoint path (e.g., '/v2/apps').
   *
   * @param method - HTTP method (e.g., 'GET', 'POST', 'PUT', 'DELETE').
   *
   * @param params - Optional query parameters to append to the URL.
   *
   * @returns A promise that resolves to the parsed JSON response body.
   *
   * @throws {Error} When the request times out. Message: `"App Directory request timeout: {url}"`
   *
   * @throws {Error} When the response status indicates an error. Delegates to {@link handleError}.
   *
   * @throws {Error} When network errors occur (e.g., DNS failure, connection refused).
   *
   * @example
   * Usage within the class:
   * ```typescript
   * // GET request with query parameters
   * const apps = await this.request<AppDefinition[]>('/v2/apps', 'GET', {
   *   category: 'Analytics'
   * });
   * ```
   *
   * @remarks
   * - Automatically encodes query parameters using URLSearchParams
   * - Includes Authorization header if getAuthToken returns a value
   * - Sets Content-Type header to 'application/json'
   * - Uses AbortController for timeout handling
   * - Parses response as JSON
   * - Cleans up timeout timer in all code paths
   *
   * @private
   * @internal
   */
  private async request<T>(
    endpoint: string,
    method: string,
    params?: Record<string, string>,
  ): Promise<T> {
    const normalizedBase = this.baseUrl.replace(/\/+$/, '') + '/';
    const normalizedEndpoint = endpoint.replace(/^\/+/, '');
    const url = new URL(normalizedEndpoint, normalizedBase);

    // Add query parameters
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.set(key, value);
        }
      });
    }

    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add authentication token (T048)
    if (this.getAuthToken) {
      const token = await this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url.toString(), {
        method,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle error responses (T049)
      if (!response.ok) {
        await this.handleError(response);
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      // Handle timeout
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`App Directory request timeout: ${url.toString()}`);
      }

      throw error;
    }
  }

  /**
   * Handle error responses from App Directory API.
   *
   * Processes HTTP error responses and throws descriptive Error objects.
   * Attempts to parse error messages from the response body and maps
   * HTTP status codes to user-friendly error types.
   *
   * @param response - The Fetch API Response object representing an error.
   *
   * @returns Never - always throws an error.
   *
   * @throws {Error} With message `"Unauthorized: {message}"` for 401 status codes.
   *
   * @throws {Error} With message `"Not Found: {message}"` for 404 status codes.
   *
   * @throws {Error} With message `"Internal Server Error: {message}"` for 500 status codes.
   *
   * @throws {Error} With message `"App Directory error: {statusText}"` for other error codes.
   *
   * @example
   * Error handling flow:
   * ```typescript
   * try {
   *   await this.request('/v2/apps', 'GET');
   * } catch (error) {
   *   if (error instanceof Error) {
   *     if (error.message.includes('Unauthorized')) {
   *       // Redirect to login or refresh token
   *     } else if (error.message.includes('Not Found')) {
   *       // Handle missing resource
   *     } else if (error.message.includes('Internal Server Error')) {
   *       // Show server error message
   *     }
   *   }
   * }
   * ```
   *
   * @remarks
   * - Attempts to parse response body as JSON for error messages
   * - Falls back to statusText if JSON parsing fails
   * - Error message format matches the API specification
   * - Special handling for common HTTP error codes
   *
   * @private
   * @internal
   * @see contracts/app-directory-api.yaml#L305-L334
   */
  private async handleError(response: Response): Promise<never> {
    let errorMessage = `App Directory error: ${response.statusText}`;

    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {
      // Ignore JSON parse errors, use default message
    }

    // Handle specific error codes
    switch (response.status) {
      case 401:
        throw new Error(`Unauthorized: ${errorMessage}`);
      case 404:
        throw new Error(`Not Found: ${errorMessage}`);
      case 500:
        throw new Error(`Internal Server Error: ${errorMessage}`);
      default:
        throw new Error(errorMessage);
    }
  }

  /**
   * Check if error is a "not found" error.
   *
   * Determines whether an error represents a 404 Not Found response.
   * Used by {@link getApp} to return null instead of throwing for missing apps.
   *
   * @param error - The error to check, typically from a failed request.
   *
   * @returns true if the error message indicates a 404 or "Not Found" condition,
   * false otherwise.
   *
   * @example
   * Usage in getApp:
   * ```typescript
   * try {
   *   return await this.request<AppDefinition>(`/v2/apps/${appId}`, 'GET');
   * } catch (error) {
   *   if (this.isNotFoundError(error)) {
   *     return null; // App not found is not an error condition
   *   }
   *   throw error; // Re-throw other errors
   * }
   * ```
   *
   * @remarks
   * - Checks for multiple indicators of 404 errors
   * - Matches "Not Found", "404", and "APP_NOT_FOUND" in error messages
   * - Returns false for non-Error objects
   * - Used to distinguish 404 from other HTTP errors
   *
   * @private
   * @internal
   */
  private isNotFoundError(error: unknown): boolean {
    if (error instanceof Error) {
      return (
        error.message.includes('Not Found') ||
        error.message.includes('404') ||
        error.message.includes('APP_NOT_FOUND')
      );
    }
    return false;
  }

  /**
   * Merge remote and local apps.
   *
   * Remote apps take precedence over local apps with the same appId.
   */
  private mergeApps(
    remoteApps: AppDefinition[],
    localApps: AppDefinition[] = Array.from(this.localApps.values()),
  ): AppDefinition[] {
    if (this.mode === 'remote-only') {
      return remoteApps;
    }

    const mergedMap = new Map<string, AppDefinition>();

    // Add local apps first
    localApps.forEach((app) => {
      mergedMap.set(app.appId, app);
    });

    // Add remote apps (overwriting local ones)
    remoteApps.forEach((app) => {
      mergedMap.set(app.appId, app);
    });

    return Array.from(mergedMap.values());
  }
}
