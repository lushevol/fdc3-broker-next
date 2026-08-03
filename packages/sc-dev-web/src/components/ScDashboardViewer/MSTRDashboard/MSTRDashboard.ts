import { css, html, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';

type MstrLoadingState = 'idle' | 'loading' | 'loaded' | 'error';

type MstrEmbedMethod = 'library' | 'report' | 'dossier' | 'iframe' | 'auto';

type MstrEmbedInstance = {
  registerEventHandler?: (event: string, handler: (data: any) => void) => void;
  destroy?: () => void;
  refresh?: () => void;
  getCurrentLibraryContent?: () => Promise<any>;
  getFilterList?: () => Promise<any>;
  setLibraryFilter?: (filterId: string, value: string) => Promise<void>;
  search?: (searchText: string) => Promise<void>;
  getCurrentPageInfo?: () => Promise<any>;
  goToPage?: (pageKey: string) => Promise<void>;
  getFilterDetails?: () => Promise<any>;
  applyFilter?: (filterConfig: Record<string, unknown>) => Promise<void>;
};

export class ScMSTRDashboard extends LitElement {
  @property({ type: String, attribute: 'subscription-id' })
    subscriptionId = '';

  @property({ type: String })
    server = '';

  @property({ type: String, attribute: 'project-id' })
    projectId = '';

  @property({ type: String })
    port = '';

  @property({ type: String, attribute: 'server-host' })
    serverHost = '';

  @property({ type: String, attribute: 'project-name' })
    projectName = '';

  @property({ type: String, attribute: 'identity-token' })
    identityToken = '';

  @property({ attribute: false })
    getLoginToken?: () => Promise<string> | string;

  @property({ type: String })
    width: string | number = '100%';

  @property({ type: String })
    height: string | number = '100vh';

  @property({ type: Boolean, attribute: 'enable-navigation' })
    enableNavigation = false;

  @property({ type: Boolean, attribute: 'disable-navigation-bar' })
    disableNavigationBar = false;

  @property({ type: Boolean, attribute: 'show-title' })
    showTitle = false;

  @property({ type: Boolean, attribute: 'show-filter-summary' })
    showFilterSummary = false;

  @property({ type: Boolean, attribute: 'disable-responsive' })
    disableResponsive = false;

  @property({ type: Boolean, attribute: 'hide-account' })
    hideAccount = false;

  @property({ type: Boolean, attribute: 'show-share' })
    showShare = false;

  @property({ type: Boolean, attribute: 'show-notifications' })
    showNotifications = false;

  @property({ type: Boolean, attribute: 'show-search' })
    showSearch = false;

  @property({ type: Boolean, attribute: 'show-filter' })
    showFilter = false;

  @property({ type: Boolean, attribute: 'show-reset' })
    showReset = false;

  @property({ type: Boolean, attribute: 'show-toc' })
    showToc = false;

  @property({ type: Boolean, attribute: 'disable-auto-retry' })
    disableAutoRetry = false;

  @property({ type: Number, attribute: 'max-retries' })
    maxRetries = 3;

  @property({ type: String, attribute: 'embed-mode' })
    embedMode: MstrEmbedMethod = 'auto';

  @property({ type: Boolean, attribute: 'disable-fallback' })
    disableFallback = false;

  @property({ type: String, attribute: 'instance-id' })
    instanceId = '';

  @property({ type: Number, attribute: 'load-timeout' })
    loadTimeout = 30000;

  @property({ type: Boolean, attribute: 'debug' })
    debug = false;

  @property({ type: String, attribute: 'library-content-type' })
    libraryContentType = 'all';

  @property({ type: String, attribute: 'library-view-mode' })
    libraryViewMode = 'grid';

  @property({ type: Boolean, attribute: 'hide-header' })
    hideHeader = false;

  @property({ type: Boolean, attribute: 'hide-path' })
    hidePath = false;

  @property({ type: Boolean, attribute: 'hide-dock-top' })
    hideDockTop = false;

  @property({ type: Boolean, attribute: 'hide-dock-left' })
    hideDockLeft = false;

  @property({ type: Boolean, attribute: 'hide-footer' })
    hideFooter = false;

  @state()
  private _loadingState: MstrLoadingState = 'idle';

  @state()
  private _errorMessage = '';

  @state()
  private _retryCount = 0;

  private _embedInstance: MstrEmbedInstance | null = null;

  static styles = css`
    :host {
      display: block;
      position: relative;
      --mstr-border-color: var(--sc-color-neutral-200, #e0e0e0);
      --mstr-border-radius: 4px;
      --mstr-border-width: 1px;
      --mstr-background: var(--sc-color-background-primary, #ffffff);
      --mstr-loading-background: var(--sc-color-background-primary, #ffffff);
      --mstr-error-color: var(--sc-color-danger-500, #d32f2f);
      --mstr-loading-text-color: var(--sc-color-text-secondary, #666666);
      --mstr-error-text-color: var(--sc-color-text-primary, #333333);
    }

    .sc-dashboard-viewer-mstr-container {
      border: var(--mstr-border-width) solid var(--mstr-border-color);
      border-radius: var(--mstr-border-radius);
      overflow: hidden;
      background: var(--mstr-background);
    }

    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2.5rem 1.25rem;
      background: var(--mstr-loading-background);
      z-index: 10;
    }

    .loading-text {
      margin-top: 1rem;
      color: var(--mstr-loading-text-color);
      font-size: 0.875rem;
    }

    .retry-info {
      margin-top: 0.5rem;
      font-size: 0.75rem;
      color: var(--sc-color-neutral-400, #999999);
    }

    .error-container {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2.5rem 1.25rem;
      text-align: center;
      background: var(--mstr-loading-background);
      z-index: 10;
    }

    .error-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      color: var(--mstr-error-color);
    }

    .error-message {
      font-size: 1rem;
      margin-bottom: 1.25rem;
      color: var(--mstr-error-text-color);
    }

    iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this._log('Component connected');
    this.setAttribute('data-mstr-state', 'initializing');
    this._validateProperties();
    this.loadMicroStrategySDK();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._log('Component disconnected');
    this._cleanup();
  }

  private _log(...args: unknown[]) {
    if (this.debug) {
      // eslint-disable-next-line no-console
      console.log('[ScMSTRDashboard]', ...args);
    }
  }

  private _isSessionError(error: any) {
    return (
      error?.message?.includes('session') ||
      error?.message?.includes('unregister') ||
      error?.message?.includes('auth')
    );
  }

  private _handleEmbedSuccess(instance: MstrEmbedInstance, method: string) {
    this._embedInstance = instance;
    this._loadingState = 'loaded';
    this.setAttribute('data-mstr-state', 'loaded');
    this.setAttribute('data-mstr-method', method);
    this._log(`Successfully embedded using ${method} method`);

    if (instance && typeof instance.registerEventHandler === 'function') {
      this._registerEventHandlers(instance, method);
    }

    this._dispatchEvent('sc-dashboard-viewer-mstr-loaded', {
      method,
      instance,
      timestamp: Date.now(),
    });
  }

  private _registerEventHandlers(instance: MstrEmbedInstance, method: string) {
    instance.registerEventHandler?.('onError', error => {
      this._log('onError event:', error);
      this._dispatchEvent('sc-dashboard-viewer-mstr-runtime-error', { error });
      this._handleError(`Runtime error: ${error?.message || 'Unknown error'}`);
    });

    if (method === 'library') {
      instance.registerEventHandler?.('onSearch', data => {
        this._log('onSearch event:', data);
        this._dispatchEvent('sc-dashboard-viewer-mstr-search', { data });
      });

      instance.registerEventHandler?.('onFilter', data => {
        this._log('onFilter event:', data);
        this._dispatchEvent('sc-dashboard-viewer-mstr-filter', { data });
      });

      instance.registerEventHandler?.('onOpenObject', data => {
        this._log('onOpenObject event:', data);
        this._dispatchEvent('sc-dashboard-viewer-mstr-open-object', { data });
      });
    }

    if (method === 'report') {
      instance.registerEventHandler?.('onPageChange', data => {
        this._log('onPageChange event:', data);
        this._dispatchEvent('sc-dashboard-viewer-mstr-page-change', { data });
      });

      instance.registerEventHandler?.('onFilterChange', data => {
        this._log('onFilterChange event:', data);
        this._dispatchEvent('sc-dashboard-viewer-mstr-filter-change', { data });
      });
    }

    if (method === 'dossier') {
      instance.registerEventHandler?.('onPageSwitch', data => {
        this._log('onPageSwitch event:', data);
        this._dispatchEvent('sc-dashboard-viewer-mstr-page-switch', { data });
      });

      instance.registerEventHandler?.('onFilterUpdate', data => {
        this._log('onFilterUpdate event:', data);
        this._dispatchEvent('sc-dashboard-viewer-mstr-filter-update', { data });
      });
    }
  }

  private _normalizeSize(value?: string | number) {
    if (value === undefined || value === null || value === '') {
      return '';
    }

    if (typeof value === 'number') {
      return `${value}px`;
    }

    if (/^\d+$/.test(value)) {
      return `${value}px`;
    }

    return value;
  }

  private _getContainerStyle() {
    return {
      width: this._normalizeSize(this.width),
      height: this._normalizeSize(this.height),
    };
  }

  private _clearContainer(container: HTMLElement) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }

  private _resolveIdentityTokenProvider() {
    if (typeof this.getLoginToken === 'function') {
      return async () => this.getLoginToken?.();
    }

    if (this.identityToken) {
      return async () => this.identityToken;
    }

    return null;
  }

  private _buildCustomAuthConfig(mstr: any) {
    const tokenProvider = this._resolveIdentityTokenProvider();

    if (!tokenProvider) {
      return {};
    }

    const customAuthenticationType =
      mstr?.enums?.CustomAuthenticationType?.IDENTITY_TOKEN ?? 'IDENTITY_TOKEN';

    return {
      enableCustomAuthentication: true,
      customAuthenticationType,
      getLoginToken: async () => {
        const token = await tokenProvider();
        if (!token) {
          throw new Error('Identity token not available');
        }
        return token;
      },
    };
  }

  private _validateProperties() {
    const required = ['server', 'subscriptionId'] as const;
    const missing = required.filter(prop => !this[prop]);

    if (missing.length > 0) {
      this._handleError(`Missing required properties: ${missing.join(', ')}`);
      return false;
    }

    if (this.server && !this._isValidServerUrl(this.server)) {
      this._handleError('Invalid server URL format');
      return false;
    }

    if (this.subscriptionId && !/^[A-Za-z0-9]+$/.test(this.subscriptionId)) {
      this._handleError('Invalid subscription ID format');
      return false;
    }

    if (this.projectId && !/^[A-Za-z0-9]+$/.test(this.projectId)) {
      this._handleError('Invalid project ID format');
      return false;
    }

    const validModes: MstrEmbedMethod[] = ['auto', 'library', 'report', 'dossier', 'iframe'];
    if (!validModes.includes(this.embedMode)) {
      this._handleError(`Invalid embed mode. Must be one of: ${validModes.join(', ')}`);
      return false;
    }

    return true;
  }

  private _isValidServerUrl(url: string) {
    const pattern =
      /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*(:[0-9]{1,5})?$/;
    return pattern.test(url);
  }

  private _cleanup() {
    if (this._embedInstance && typeof this._embedInstance.destroy === 'function') {
      try {
        this._embedInstance.destroy();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn('Error destroying MSTR embed instance:', error);
      }
    }
    this._embedInstance = null;
  }

  loadMicroStrategySDK() {
    if (!this._validateProperties()) return;

    this._loadingState = 'loading';
    this.setAttribute('data-mstr-state', 'loading');
    this._log('Loading MicroStrategy SDK...');

    const existingScript = (window as any).microstrategy ? document.getElementById('sc-dashboard-viewer-mstr-embedding-sdk') : null;

    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'sc-dashboard-viewer-mstr-embedding-sdk';
      script.src = `https://${this.server}/MicroStrategyLibrary/javascript/embeddinglib.js`;

      script.onload = () => {
        setTimeout(() => this.initializeMSTRReport(), 100);
      };

      script.onerror = () => {
        this.updateComplete.then(() => {
          const container = this.shadowRoot?.getElementById('sc-dashboard-viewer-mstr-report-container');
          if (container) {
            this.fallbackToIframe(container);
          }
        });
      };

      document.head.appendChild(script);
    } else {
      setTimeout(() => this.initializeMSTRReport(), 100);
    }
  }

  initializeMSTRReport() {
    this.updateComplete
      .then(() => {
        const container = this.shadowRoot?.getElementById('sc-dashboard-viewer-mstr-report-container');

        if (!container) {
          this._handleError('Container element not found');
          return;
        }

        const mstr = (window as any).microstrategy;
        if (!mstr) {
          this._handleError('MicroStrategy SDK not available');
          this.fallbackToIframe(container);
          return;
        }

        const libraryUrl = `https://${this.server}/MicroStrategyLibrary`;
        this._checkSessionAndEmbed(container, libraryUrl);
      })
      .catch(error => {
        this._handleError(`Initialization error: ${error.message}`);
      });
  }

  private _checkSessionAndEmbed(container: HTMLElement, libraryUrl: string) {
    try {
      const mstr = (window as any).microstrategy;
      const hasValidSDK = mstr && (mstr.embeddingContexts || mstr.dossier);

      if (!hasValidSDK) {
        this.fallbackToIframe(container);
        return;
      }
    } catch (error) {
      this.fallbackToIframe(container);
      return;
    }

    switch (this.embedMode) {
    case 'library':
      this._embedLibrary(container, libraryUrl);
      break;
    case 'report':
      this._embedReport(container, libraryUrl);
      break;
    case 'dossier':
      this._embedDossier(container, libraryUrl);
      break;
    case 'iframe':
      this.fallbackToIframe(container);
      break;
    case 'auto':
    default:
      this._autoEmbed(container, libraryUrl);
    }
  }

  private _cleanContainerForRetry() {
    return new Promise(resolve => setTimeout(resolve, 100));
  }

  private _autoEmbed(container: HTMLElement, libraryUrl: string) {
    const mstr = (window as any).microstrategy;
    if (mstr?.embeddingContexts?.embedLibraryPage) {
      this._embedLibrary(container, libraryUrl);
    } else if (mstr?.embeddingContexts?.embedReportPage) {
      this._embedReport(container, libraryUrl);
    } else if (mstr?.dossier?.create) {
      this._embedDossier(container, libraryUrl);
    } else {
      this.fallbackToIframe(container);
    }
  }

  private _embedLibrary(container: HTMLElement, libraryUrl: string) {
    const mstr = (window as any).microstrategy;
    if (!mstr?.embeddingContexts?.embedLibraryPage) {
      if (this.disableFallback) {
        this._handleError('Library Page API not available');
        return;
      }
      this._embedReport(container, libraryUrl);
      return;
    }

    this._loadingState = 'loaded';

    const customUi = this._buildCustomUiConfig();
    const authConfig = this._buildCustomAuthConfig(mstr);
    const config = {
      serverUrl: libraryUrl,
      placeholder: container,
      customUi,
      objectId: this.subscriptionId,
      projectId: this.projectId,
      ...(this.instanceId && { instanceId: this.instanceId }),
      ...authConfig,
    };

    mstr.embeddingContexts
      .embedLibraryPage(config)
      .then((instance: MstrEmbedInstance) => this._handleEmbedSuccess(instance, 'library'))
      .catch((error: any) => {
        this._loadingState = 'loading';
        if (this.disableFallback) {
          this._handleError(`Library embedding failed: ${error.message}`);
          return;
        }
        if (this._isSessionError(error)) {
          this.fallbackToIframe(container);
          return;
        }
        this._cleanContainerForRetry().then(() => {
          this._embedReport(container, libraryUrl);
        });
      });
  }

  private _embedReport(container: HTMLElement, libraryUrl: string) {
    const mstr = (window as any).microstrategy;
    if (!mstr?.embeddingContexts?.embedReportPage) {
      if (this.disableFallback) {
        this._handleError('Report Page API not available');
        return;
      }
      this._embedDossier(container, libraryUrl);
      return;
    }

    this._loadingState = 'loaded';

    const customUi = this._buildCustomUiConfig();
    const authConfig = this._buildCustomAuthConfig(mstr);
    const config = {
      serverUrl: libraryUrl,
      placeholder: container,
      objectId: this.subscriptionId,
      projectId: this.projectId,
      customUi,
      containerStyle: this._getContainerStyle(),
      showTitle: this.showTitle,
      showFilterSummary: this.showFilterSummary,
      enableResponsive: !this.disableResponsive,
      ...(this.instanceId && { instanceId: this.instanceId }),
      ...authConfig,
    };

    mstr.embeddingContexts
      .embedReportPage(config)
      .then((instance: MstrEmbedInstance) => this._handleEmbedSuccess(instance, 'report'))
      .catch((error: any) => {
        this._loadingState = 'loading';
        if (this.disableFallback) {
          this._handleError(`Report embedding failed: ${error.message}`);
          return;
        }
        if (this._isSessionError(error)) {
          this.fallbackToIframe(container);
          return;
        }
        this._cleanContainerForRetry().then(() => {
          this._embedDossier(container, libraryUrl);
        });
      });
  }

  private _embedDossier(container: HTMLElement, libraryUrl: string) {
    const mstr = (window as any).microstrategy;
    if (!mstr?.dossier?.create) {
      if (this.disableFallback) {
        this._handleError('Dossier API not available');
        return;
      }
      this.fallbackToIframe(container);
      return;
    }

    this._loadingState = 'loaded';

    const customUi = this._buildCustomUiConfig();
    const authConfig = this._buildCustomAuthConfig(mstr);
    const dossierUrl = `${libraryUrl}/app/${this.projectId}/${this.subscriptionId}`;
    const config = {
      url: dossierUrl,
      placeholder: container,
      customUi,
      containerHeight: this._normalizeSize(this.height),
      containerWidth: this._normalizeSize(this.width),
      enableResponsive: !this.disableResponsive,
      navigationBar: { enabled: this.enableNavigation },
      toolbar: { enabled: this.enableNavigation },
      ...(this.instanceId && { instanceId: this.instanceId }),
      ...authConfig,
    };

    mstr.dossier
      .create(config)
      .then((instance: MstrEmbedInstance) => this._handleEmbedSuccess(instance, 'dossier'))
      .catch((error: any) => {
        this._loadingState = 'loading';
        if (this.disableFallback) {
          this._handleError(`Dossier embedding failed: ${error?.message || 'Unknown error'}`);
          return;
        }
        this.fallbackToIframe(container);
      });
  }

  private _buildCustomUiConfig() {
    const hasAnyNavFeature =
      !this.hideAccount ||
      this.showShare ||
      this.showFilter ||
      this.showReset ||
      this.showSearch ||
      this.showNotifications ||
      this.showToc ||
      this.enableNavigation;

    return {
      reportConsumption: {
        navigationBar: {
          enabled: !this.disableNavigationBar && hasAnyNavFeature,
          gotoLibrary: this.enableNavigation,
          pageBy: this.enableNavigation,
          reset: this.enableNavigation ? true : this.showReset,
          reExecute: this.enableNavigation,
          filter: this.enableNavigation ? true : this.showFilter,
          share: { enabled: this.enableNavigation ? true : this.showShare },
          account: { enabled: !this.hideAccount },
          reprompt: this.enableNavigation,
        },
      },
      library: {
        navigationBar: {
          enabled: !this.disableNavigationBar,
          sortAndFilter: this.enableNavigation,
          title: this.enableNavigation,
          searchBar: this.enableNavigation ? true : this.showSearch,
          createNew: { enabled: false },
          notifications: this.enableNavigation ? true : this.showNotifications,
          multiSelect: { enabled: false },
          account: { enabled: !this.hideAccount },
        },
        sideBar: {
          enabled: this.enableNavigation,
          show: false,
        },
      },
      dossierConsumption: {
        navigationBar: {
          enabled: !this.disableNavigationBar && hasAnyNavFeature,
          gotoLibrary: false,
          title: false,
          toc: this.enableNavigation ? true : this.showToc,
          reset: this.enableNavigation ? true : this.showReset,
          reprompt: false,
          share: this.enableNavigation ? true : this.showShare,
          comment: this.enableNavigation,
          notification: this.enableNavigation ? true : this.showNotifications,
          filter: this.enableNavigation ? true : this.showFilter,
          options: this.enableNavigation,
          search: this.enableNavigation ? true : this.showSearch,
          bookmark: this.enableNavigation,
          undoRedo: this.enableNavigation,
          edit: false,
          dockedToc: { isOpen: false, isDocked: false },
        },
      },
      dossierAuthoring: {
        toolbar: {
          tableOfContents: { visible: false },
          undo: { visible: false },
          redo: { visible: false },
          refresh: { visible: false },
          pauseDataRetrieval: { visible: false },
          dividerLeft: { visible: false },
          addData: { visible: false },
          addChapter: { visible: false },
          addPage: { visible: false },
          insertVisualization: { visible: false },
          insertFilter: { visible: false },
          insertText: { visible: false },
          insertImage: { visible: false },
          insertHtml: { visible: false },
          insertShape: { visible: false },
          insertPanelStack: { visible: false },
          insertInfoWindow: { visible: false },
          save: { visible: false },
          dividerRight: { visible: false },
          more: { visible: false },
          freeformLayout: { visible: false },
          nlp: { visible: false },
          responsiveViewEditor: { visible: false },
          responsivePreview: { visible: false },
        },
        menubar: {
          library: { visible: false },
        },
      },
    };
  }

  fallbackToIframe(container: HTMLElement) {
    if (this.disableFallback) {
      this._handleError('All embedding methods failed and fallback is disabled');
      return;
    }

    this._loadingState = 'loaded';

    this.updateComplete.then(() => {
      const serverParam = this.serverHost || this.server.split(':')[0];
      const projectParam = encodeURIComponent(this.projectName || this.projectId);

      const hiddenSections = [];
      if (this.hideHeader) hiddenSections.push('header');
      if (this.hidePath) hiddenSections.push('path');
      if (this.hideDockTop) hiddenSections.push('dockTop');
      if (this.hideDockLeft) hiddenSections.push('dockLeft');
      if (this.hideFooter) hiddenSections.push('footer');
      const hiddenSectionsParam = hiddenSections.length > 0
        ? `&hiddensections=${hiddenSections.join(',')}`
        : '';

      const iframe = document.createElement('iframe');
      iframe.width = `${this._normalizeSize(this.width)}`;
      iframe.height = `${this._normalizeSize(this.height)}`;
      iframe.src = `https://${this.server}/MicroStrategy/servlet/mstrWeb?evt=3186&src=mstrWeb.3186&subscriptionID=${this.subscriptionId}&Server=${serverParam}&Project=${projectParam}&Port=${this.port}&share=1${hiddenSectionsParam}`;
      iframe.title = 'MicroStrategy Report';
      iframe.setAttribute('role', 'application');
      iframe.setAttribute('aria-label', 'MicroStrategy Report Viewer');
      iframe.setAttribute('allow', 'fullscreen');
      iframe.style.border = 'none';
      iframe.style.width = '100%';
      iframe.style.height = '100%';

      this._clearContainer(container);
      container.appendChild(iframe);

      this._dispatchEvent('sc-dashboard-viewer-mstr-fallback', { method: 'iframe' });
    });
  }

  private _handleError(message: string) {
    this._loadingState = 'error';
    this._errorMessage = message;
    this.setAttribute('data-mstr-state', 'error');
    this._log('Error:', message);
    this._dispatchEvent('sc-dashboard-viewer-mstr-error', {
      message,
      timestamp: Date.now(),
    });
  }

  private _dispatchEvent(eventName: string, detail: Record<string, unknown> = {}) {
    this.dispatchEvent(
      new CustomEvent(eventName, {
        detail,
        bubbles: true,
        composed: true,
      })
    );
  }


  retry() {
    this._retryCount = 0;
    this._loadingState = 'idle';
    this._errorMessage = '';
    this._cleanup();
    this.loadMicroStrategySDK();
  }

  getState() {
    return {
      loadingState: this._loadingState,
      errorMessage: this._errorMessage,
      retryCount: this._retryCount,
      hasInstance: !!this._embedInstance,
      embedMode: this.embedMode,
    };
  }

  reload() {
    if (this._embedInstance && typeof this._embedInstance.refresh === 'function') {
      this._embedInstance.refresh();
    } else {
      this.retry();
    }
  }

  getInstance() {
    return this._embedInstance;
  }

  isReady() {
    return this._loadingState === 'loaded' && !!this._embedInstance;
  }

  async getLibraryContent() {
    if (!this._embedInstance || !this._embedInstance.getCurrentLibraryContent) {
      throw new Error('Library content API not available. Ensure embedMode is "library".');
    }
    return this._embedInstance.getCurrentLibraryContent();
  }

  async getLibraryFilters() {
    if (!this._embedInstance || !this._embedInstance.getFilterList) {
      throw new Error('Filter API not available. Ensure embedMode is "library".');
    }
    return this._embedInstance.getFilterList();
  }

  async setLibraryFilter(filterId: string, value: string) {
    if (!this._embedInstance || !this._embedInstance.setLibraryFilter) {
      throw new Error('Filter API not available. Ensure embedMode is "library".');
    }
    return this._embedInstance.setLibraryFilter(filterId, value);
  }

  async searchLibrary(searchText: string) {
    if (!this._embedInstance || !this._embedInstance.search) {
      throw new Error('Search API not available. Ensure embedMode is "library".');
    }
    return this._embedInstance.search(searchText);
  }

  async getCurrentPageInfo() {
    if (!this._embedInstance || !this._embedInstance.getCurrentPageInfo) {
      throw new Error('Page info API not available.');
    }
    return this._embedInstance.getCurrentPageInfo();
  }

  async goToPage(pageKey: string) {
    if (!this._embedInstance || !this._embedInstance.goToPage) {
      throw new Error('Navigation API not available. Ensure embedMode is "dossier".');
    }
    return this._embedInstance.goToPage(pageKey);
  }

  async getFilterDetails() {
    if (!this._embedInstance || !this._embedInstance.getFilterDetails) {
      throw new Error('Filter details API not available.');
    }
    return this._embedInstance.getFilterDetails();
  }

  async applyFilter(filterConfig: Record<string, unknown>) {
    if (!this._embedInstance || !this._embedInstance.applyFilter) {
      throw new Error('Apply filter API not available.');
    }
    return this._embedInstance.applyFilter(filterConfig);
  }

  private _renderContent() {
    return html`
      <div
        id="sc-dashboard-viewer-mstr-report-container"
        part="content"
        style="width: 100%; height: 100%; position: relative;"
      >
        ${this._loadingState === 'loading'
    ? html`<div class="loading-overlay">
              <sc-spinner type="page" size="lg"></sc-spinner>
              <div class="loading-text">Loading MicroStrategy Report...</div>
              ${this._retryCount > 0
    ? html`<div class="retry-info">Retry ${this._retryCount}/${this.maxRetries}</div>`
    : ''}
            </div>`
    : ''}
        ${this._loadingState === 'error'
    ? html`<div class="error-container">
              <div class="error-icon">!</div>
              <div class="error-message">${this._errorMessage || 'Failed to load report'}</div>
              <sc-button
                type="primary"
                size="md"
                width="auto"
                @click=${() => this.retry()}
              >
                Retry
              </sc-button>
            </div>`
    : ''}
      </div>
    `;
  }

  render() {
    return html`
      <div
        part="container"
        class="sc-dashboard-viewer-mstr-container"
        role="region"
        aria-label="MicroStrategy Report Viewer"
        aria-busy="${this._loadingState === 'loading'}"
        style="width: ${this._normalizeSize(this.width)}; height: ${this._normalizeSize(this.height)};"
      >
        ${this._renderContent()}
      </div>
    `;
  }
}
