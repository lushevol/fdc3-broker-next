import { html } from 'lit';
import { fixture } from '@open-wc/testing';
import sinon from 'sinon';
import { ScDashboardViewer } from '../../../src/components/ScDashboardViewer/ScDashboardViewer.js';
import { ScMSTRDashboard } from '../../../src/components/ScDashboardViewer/MSTRDashboard/MSTRDashboard.js';
import '../../../elements/sc-dashboard-viewer.js';

const server = 'mstrdev-stg.51287.app.standardchartered.com:9013';
const subscriptionId = 'E788C3007C4B6C485BDB27B217F14541';
const projectId = 'B19DEDCC11D4E0EFC000EB9495D0F44F';
const port = '34952';
const libraryUrl = `https://${server}/MicroStrategyLibrary`;

const createAppendChildStub = (triggerError = false) => {
  const appendChild = document.head.appendChild.bind(document.head);
  return sinon.stub(document.head, 'appendChild').callsFake(node => {
    appendChild(node);
    if (triggerError && node instanceof HTMLScriptElement) {
      node.onerror?.(new Event('error'));
    }
    return node;
  });
};

const createDashboard = async (config: Record<string, unknown> = {}) => {
  const appendChildStub = createAppendChildStub(false);
  const loadStub = sinon.stub(ScMSTRDashboard.prototype, 'loadMicroStrategySDK').callsFake(() => {});

  const scDashboardViewer = await fixture<ScDashboardViewer>(html`
    <sc-dashboard-viewer type="mstr" .config=${{
    'subscription-id': subscriptionId,
    server,
    'project-id': projectId,
    port,
    width: '100%',
    height: '500px',
    ...config,
  }}></sc-dashboard-viewer>
  `);

  appendChildStub.restore();
  loadStub.restore();

  const scMstrDashboard = scDashboardViewer.shadowRoot?.querySelector(
    'sc-mstr-dashboard'
  ) as ScMSTRDashboard;

  scMstrDashboard.loadMicroStrategySDK = () => {};

  await scMstrDashboard.updateComplete;

  return scMstrDashboard;
};

describe('ScMSTRDashboard', () => {
  it('renders via ScDashboardViewer', async () => {
    const appendChildStub = createAppendChildStub(false);

    const scDashboardViewer = await fixture<ScDashboardViewer>(html`
      <sc-dashboard-viewer type="mstr" .config=${{
    'subscription-id': subscriptionId,
    server,
    'project-id': projectId,
    port,
    width: '100%',
    height: '500px',
  }}></sc-dashboard-viewer>
    `);

    appendChildStub.restore();

    const scriptElement = document.querySelector('#sc-dashboard-viewer-mstr-embedding-sdk') as HTMLScriptElement;
    expect(scriptElement).not.toBeNull();

    const scMstrDashboard = scDashboardViewer.shadowRoot?.querySelector('sc-mstr-dashboard');
    expect(scMstrDashboard).not.toBeNull();
  });

  it('creates iframe fallback with expected params', async () => {
    const appendChildStub = createAppendChildStub();

    const scDashboardViewer = await fixture<ScDashboardViewer>(html`
      <sc-dashboard-viewer type="mstr" .config=${{
    'subscription-id': subscriptionId,
    server,
    'project-id': projectId,
    port,
    width: '100%',
    height: '500px',
  }}></sc-dashboard-viewer>
    `);

    appendChildStub.restore();

    const scMstrDashboard = scDashboardViewer.shadowRoot?.querySelector(
      'sc-mstr-dashboard'
    ) as ScMSTRDashboard;
    expect(scMstrDashboard).not.toBeNull();

    await scMstrDashboard.updateComplete;

    const container = scMstrDashboard.shadowRoot?.getElementById(
      'sc-dashboard-viewer-mstr-report-container'
    ) as HTMLElement;

    scMstrDashboard.fallbackToIframe(container);

    await scMstrDashboard.updateComplete;
    await new Promise(resolve => setTimeout(resolve, 0));

    const iframe = container.querySelector('iframe') as HTMLIFrameElement;
    expect(iframe).not.toBeNull();
    expect(iframe?.getAttribute('src')).toContain(`subscriptionID=${subscriptionId}`);
    expect(iframe?.getAttribute('src')).toContain(`Server=${server.split(':')[0]}`);
    expect(iframe?.getAttribute('src')).not.toContain('hiddensections=');
    expect(iframe?.getAttribute('title')).toBe('MicroStrategy Report');
    expect(iframe?.getAttribute('role')).toBe('application');
    expect(iframe?.getAttribute('aria-label')).toBe('MicroStrategy Report Viewer');
    expect(iframe?.getAttribute('allow')).toBe('fullscreen');
  });

  it('adds hidden sections when hide flags are set', async () => {
    const scMstrDashboard = await createDashboard({
      'hide-header': true,
      'hide-footer': true,
    });

    const container = scMstrDashboard.shadowRoot?.getElementById(
      'sc-dashboard-viewer-mstr-report-container'
    ) as HTMLElement;

    scMstrDashboard.fallbackToIframe(container);

    await scMstrDashboard.updateComplete;
    await new Promise(resolve => setTimeout(resolve, 0));

    const iframe = container.querySelector('iframe') as HTMLIFrameElement;
    expect(iframe).not.toBeNull();
    const src = iframe?.getAttribute('src') || '';
    expect(src).toContain('hiddensections=');
    expect(src).toContain('header');
    expect(src).toContain('footer');
  });

  it('disables navigation bar when flag is set', async () => {
    const embedReportPage = sinon.stub().resolves({});
    const originalMstr = (window as any).microstrategy;

    (window as any).microstrategy = {
      embeddingContexts: { embedReportPage },
    };

    const scMstrDashboard = await createDashboard({
      'disable-navigation-bar': true,
      'enable-navigation': true,
    });

    const container = scMstrDashboard.shadowRoot?.getElementById(
      'sc-dashboard-viewer-mstr-report-container'
    ) as HTMLElement;

    await (scMstrDashboard as any)._embedReport(container, libraryUrl);

    const config = embedReportPage.firstCall?.args?.[0];
    expect(config).toBeTruthy();
    expect(config.customUi.reportConsumption.navigationBar.enabled).toBe(false);
    expect(config.customUi.library.navigationBar.enabled).toBe(false);

    (window as any).microstrategy = originalMstr;
  });

  it('respects hide-account when building custom UI', async () => {
    const embedReportPage = sinon.stub().resolves({});
    const originalMstr = (window as any).microstrategy;

    (window as any).microstrategy = {
      embeddingContexts: { embedReportPage },
    };

    const scMstrDashboard = await createDashboard({
      'hide-account': true,
    });

    const container = scMstrDashboard.shadowRoot?.getElementById(
      'sc-dashboard-viewer-mstr-report-container'
    ) as HTMLElement;

    await (scMstrDashboard as any)._embedReport(container, libraryUrl);

    const config = embedReportPage.firstCall?.args?.[0];
    expect(config).toBeTruthy();
    expect(config.customUi.reportConsumption.navigationBar.account.enabled).toBe(false);
    expect(config.customUi.library.navigationBar.account.enabled).toBe(false);

    (window as any).microstrategy = originalMstr;
  });

  it('sets enableResponsive to false when disable-responsive is true', async () => {
    const embedReportPage = sinon.stub().resolves({});
    const originalMstr = (window as any).microstrategy;

    (window as any).microstrategy = {
      embeddingContexts: { embedReportPage },
    };

    const scMstrDashboard = await createDashboard({
      'disable-responsive': true,
    });

    const container = scMstrDashboard.shadowRoot?.getElementById(
      'sc-dashboard-viewer-mstr-report-container'
    ) as HTMLElement;

    await (scMstrDashboard as any)._embedReport(container, libraryUrl);

    const config = embedReportPage.firstCall?.args?.[0];
    expect(config).toBeTruthy();
    expect(config.enableResponsive).toBe(false);

    (window as any).microstrategy = originalMstr;
  });

  it('builds custom auth config from identity token', async () => {
    const scMstrDashboard = await createDashboard({
      'identity-token': 'token-123',
    });

    const config = (scMstrDashboard as any)._buildCustomAuthConfig({
      enums: { CustomAuthenticationType: { IDENTITY_TOKEN: 'IDENTITY_TOKEN' } },
    });

    expect(config.enableCustomAuthentication).toBe(true);
    expect(config.customAuthenticationType).toBe('IDENTITY_TOKEN');
    await expect(config.getLoginToken()).resolves.toBe('token-123');

    await scMstrDashboard.updateComplete;
  });

  it('prefers getLoginToken over identity-token and throws when empty', async () => {
    const scMstrDashboard = await createDashboard();
    scMstrDashboard.getLoginToken = () => '';

    const config = (scMstrDashboard as any)._buildCustomAuthConfig({});
    await expect(config.getLoginToken()).rejects.toThrow('Identity token not available');

    await scMstrDashboard.updateComplete;
  });

  it('normalizes size values', async () => {
    const scMstrDashboard = await createDashboard();

    expect((scMstrDashboard as any)._normalizeSize(120)).toBe('120px');
    expect((scMstrDashboard as any)._normalizeSize('300')).toBe('300px');
    expect((scMstrDashboard as any)._normalizeSize('40%')).toBe('40%');
    expect((scMstrDashboard as any)._normalizeSize('')).toBe('');
  });

  it('reload calls refresh when available, otherwise retry', async () => {
    const scMstrDashboard = await createDashboard();
    const refresh = sinon.spy();
    (scMstrDashboard as any)._embedInstance = { refresh };

    scMstrDashboard.reload();
    await scMstrDashboard.updateComplete;
    expect(refresh.calledOnce).toBe(true);

    const retrySpy = sinon.spy(scMstrDashboard, 'retry');
    (scMstrDashboard as any)._embedInstance = null;
    scMstrDashboard.reload();
    await scMstrDashboard.updateComplete;
    expect(retrySpy.calledOnce).toBe(true);

    retrySpy.restore();
  });

  it('exposes state and instance helpers', async () => {
    const scMstrDashboard = await createDashboard();
    const instance = { refresh: () => {} };
    (scMstrDashboard as any)._embedInstance = instance;
    (scMstrDashboard as any)._loadingState = 'loaded';

    expect(scMstrDashboard.getInstance()).toBe(instance);
    expect(scMstrDashboard.isReady()).toBe(true);
    const state = scMstrDashboard.getState();
    expect(state.embedMode).toBe(scMstrDashboard.embedMode);
    expect(state.hasInstance).toBe(true);
  });

  it('throws for library APIs when embed instance is missing', async () => {
    const scMstrDashboard = await createDashboard();

    await expect(scMstrDashboard.getLibraryContent()).rejects.toThrow(
      'Library content API not available. Ensure embedMode is "library".'
    );
    await expect(scMstrDashboard.getLibraryFilters()).rejects.toThrow(
      'Filter API not available. Ensure embedMode is "library".'
    );
    await expect(scMstrDashboard.setLibraryFilter('id', 'value')).rejects.toThrow(
      'Filter API not available. Ensure embedMode is "library".'
    );
    await expect(scMstrDashboard.searchLibrary('term')).rejects.toThrow(
      'Search API not available. Ensure embedMode is "library".'
    );
    await expect(scMstrDashboard.getCurrentPageInfo()).rejects.toThrow('Page info API not available.');
    await expect(scMstrDashboard.goToPage('page')).rejects.toThrow(
      'Navigation API not available. Ensure embedMode is "dossier".'
    );
    await expect(scMstrDashboard.getFilterDetails()).rejects.toThrow('Filter details API not available.');
    await expect(scMstrDashboard.applyFilter({})).rejects.toThrow('Apply filter API not available.');
  });

  it('exposes library APIs when embed instance provides them', async () => {
    const scMstrDashboard = await createDashboard();
    const instance = {
      getCurrentLibraryContent: sinon.stub().resolves('content'),
      getFilterList: sinon.stub().resolves('filters'),
      setLibraryFilter: sinon.stub().resolves(),
      search: sinon.stub().resolves(),
      getCurrentPageInfo: sinon.stub().resolves('page'),
      goToPage: sinon.stub().resolves(),
      getFilterDetails: sinon.stub().resolves('details'),
      applyFilter: sinon.stub().resolves(),
    };

    (scMstrDashboard as any)._embedInstance = instance;

    await expect(scMstrDashboard.getLibraryContent()).resolves.toBe('content');
    await expect(scMstrDashboard.getLibraryFilters()).resolves.toBe('filters');
    await expect(scMstrDashboard.setLibraryFilter('id', 'value')).resolves.toBeUndefined();
    await expect(scMstrDashboard.searchLibrary('term')).resolves.toBeUndefined();
    await expect(scMstrDashboard.getCurrentPageInfo()).resolves.toBe('page');
    await expect(scMstrDashboard.goToPage('page')).resolves.toBeUndefined();
    await expect(scMstrDashboard.getFilterDetails()).resolves.toBe('details');
    await expect(scMstrDashboard.applyFilter({})).resolves.toBeUndefined();
  });

  it('cleans up and handles destroy errors', async () => {
    const scMstrDashboard = await createDashboard();
    const destroy = sinon.stub().throws(new Error('boom'));
    (scMstrDashboard as any)._embedInstance = { destroy };

    expect(() => (scMstrDashboard as any)._cleanup()).not.toThrow();
    expect((scMstrDashboard as any)._embedInstance).toBeNull();
  });

  it('renders loading and error states', async () => {
    const scMstrDashboard = await createDashboard();

    (scMstrDashboard as any)._loadingState = 'loading';
    (scMstrDashboard as any)._retryCount = 2;
    await scMstrDashboard.requestUpdate();
    await scMstrDashboard.updateComplete;

    const loadingOverlay = scMstrDashboard.shadowRoot?.querySelector('.loading-overlay');
    expect(loadingOverlay).not.toBeNull();
    const retryInfo = scMstrDashboard.shadowRoot?.querySelector('.retry-info');
    expect(retryInfo).not.toBeNull();

    (scMstrDashboard as any)._loadingState = 'error';
    (scMstrDashboard as any)._errorMessage = 'Failure';
    await scMstrDashboard.requestUpdate();
    await scMstrDashboard.updateComplete;

    const errorContainer = scMstrDashboard.shadowRoot?.querySelector('.error-container');
    expect(errorContainer).not.toBeNull();
    expect(errorContainer?.textContent).toContain('Failure');

    const retrySpy = sinon.spy(scMstrDashboard, 'retry');
    const retryButton = scMstrDashboard.shadowRoot?.querySelector('sc-button');
    retryButton?.dispatchEvent(new Event('click'));
    await scMstrDashboard.updateComplete;
    expect(retrySpy.calledOnce).toBe(true);
    retrySpy.restore();
  });

  it('validates required properties and input formats', async () => {
    const scMstrDashboard = await createDashboard();

    scMstrDashboard.server = '';
    scMstrDashboard.subscriptionId = '';
    expect((scMstrDashboard as any)._validateProperties()).toBe(false);

    scMstrDashboard.server = 'http://bad-url';
    scMstrDashboard.subscriptionId = subscriptionId;
    expect((scMstrDashboard as any)._validateProperties()).toBe(false);

    scMstrDashboard.server = server;
    scMstrDashboard.subscriptionId = 'BAD-ID';
    expect((scMstrDashboard as any)._validateProperties()).toBe(false);

    scMstrDashboard.subscriptionId = subscriptionId;
    scMstrDashboard.projectId = 'BAD-ID';
    expect((scMstrDashboard as any)._validateProperties()).toBe(false);

    scMstrDashboard.projectId = projectId;
    scMstrDashboard.embedMode = 'bad' as any;
    expect((scMstrDashboard as any)._validateProperties()).toBe(false);

    await scMstrDashboard.updateComplete;
  });

  it('detects session errors', async () => {
    const scMstrDashboard = await createDashboard();

    expect((scMstrDashboard as any)._isSessionError({ message: 'session expired' })).toBe(true);
    expect((scMstrDashboard as any)._isSessionError({ message: 'auth failed' })).toBe(true);
    expect((scMstrDashboard as any)._isSessionError({ message: 'other error' })).toBe(false);
  });

  it('auto embed selects available API', async () => {
    const scMstrDashboard = await createDashboard();
    const container = scMstrDashboard.shadowRoot?.getElementById(
      'sc-dashboard-viewer-mstr-report-container'
    ) as HTMLElement;
    const originalMstr = (window as any).microstrategy;

    const librarySpy = sinon.stub(scMstrDashboard as any, '_embedLibrary');
    const reportSpy = sinon.stub(scMstrDashboard as any, '_embedReport');
    const dossierSpy = sinon.stub(scMstrDashboard as any, '_embedDossier');
    const fallbackSpy = sinon.stub(scMstrDashboard, 'fallbackToIframe');

    (window as any).microstrategy = { embeddingContexts: { embedLibraryPage: () => {} } };
    (scMstrDashboard as any)._autoEmbed(container, libraryUrl);
    expect(librarySpy.calledOnce).toBe(true);

    librarySpy.resetHistory();
    (window as any).microstrategy = { embeddingContexts: { embedReportPage: () => {} } };
    (scMstrDashboard as any)._autoEmbed(container, libraryUrl);
    expect(reportSpy.calledOnce).toBe(true);

    reportSpy.resetHistory();
    (window as any).microstrategy = { dossier: { create: () => {} } };
    (scMstrDashboard as any)._autoEmbed(container, libraryUrl);
    expect(dossierSpy.calledOnce).toBe(true);

    dossierSpy.resetHistory();
    (window as any).microstrategy = {};
    (scMstrDashboard as any)._autoEmbed(container, libraryUrl);
    expect(fallbackSpy.calledOnce).toBe(true);

    (window as any).microstrategy = originalMstr;

    librarySpy.restore();
    reportSpy.restore();
    dossierSpy.restore();
    fallbackSpy.restore();
  });

  it('falls back when SDK is missing or invalid', async () => {
    const scMstrDashboard = await createDashboard();
    const container = scMstrDashboard.shadowRoot?.getElementById(
      'sc-dashboard-viewer-mstr-report-container'
    ) as HTMLElement;
    const fallbackSpy = sinon.spy(scMstrDashboard, 'fallbackToIframe');
    const originalMstr = (window as any).microstrategy;

    (window as any).microstrategy = null;
    (scMstrDashboard as any)._checkSessionAndEmbed(container, libraryUrl);
    expect(fallbackSpy.calledOnce).toBe(true);

    fallbackSpy.resetHistory();
    Object.defineProperty(window, 'microstrategy', {
      get() {
        throw new Error('boom');
      },
      configurable: true,
    });
    (scMstrDashboard as any)._checkSessionAndEmbed(container, libraryUrl);
    expect(fallbackSpy.calledOnce).toBe(true);

    Object.defineProperty(window, 'microstrategy', {
      value: originalMstr,
      writable: true,
      configurable: true,
    });

    fallbackSpy.restore();
  });

  it('handles embed API availability and errors', async () => {
    const scMstrDashboard = await createDashboard();
    const container = scMstrDashboard.shadowRoot?.getElementById(
      'sc-dashboard-viewer-mstr-report-container'
    ) as HTMLElement;

    const handleErrorSpy = sinon.spy(scMstrDashboard as any, '_handleError');
    const originalMstr = (window as any).microstrategy;
    const embedReportSpy = sinon.spy(scMstrDashboard as any, '_embedReport');
    const embedDossierSpy = sinon.spy(scMstrDashboard as any, '_embedDossier');
    const fallbackSpy = sinon.stub(scMstrDashboard, 'fallbackToIframe').callsFake(() => {});
    const retryStub = sinon.stub(scMstrDashboard as any, '_cleanContainerForRetry').resolves();

    scMstrDashboard.disableFallback = true;
    (window as any).microstrategy = { embeddingContexts: {} };
    (scMstrDashboard as any)._embedLibrary(container, libraryUrl);
    expect(handleErrorSpy.calledWith('Library Page API not available')).toBe(true);

    scMstrDashboard.disableFallback = false;
    (scMstrDashboard as any)._embedLibrary(container, libraryUrl);
    expect(embedReportSpy.calledOnce).toBe(true);

    const embedLibraryPage = sinon.stub().rejects(new Error('session expired'));
    (window as any).microstrategy = { embeddingContexts: { embedLibraryPage } };
    await (scMstrDashboard as any)._embedLibrary(container, libraryUrl);
    await embedLibraryPage.firstCall?.returnValue?.catch(() => {});
    await new Promise(resolve => setTimeout(resolve, 0));

    embedLibraryPage.resetBehavior();
    embedLibraryPage.rejects({ message: 'other error' });
    fallbackSpy.resetHistory();
    await (scMstrDashboard as any)._embedLibrary(container, libraryUrl);
    await embedLibraryPage.firstCall?.returnValue?.catch(() => {});
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(embedReportSpy.calledTwice).toBe(true);

    scMstrDashboard.disableFallback = true;
    (window as any).microstrategy = { embeddingContexts: {} };
    (scMstrDashboard as any)._embedReport(container, libraryUrl);
    expect(handleErrorSpy.calledWith('Report Page API not available')).toBe(true);

    const embedReportPage = sinon.stub().rejects(new Error('session expired'));
    (window as any).microstrategy = { embeddingContexts: { embedReportPage } };
    await (scMstrDashboard as any)._embedReport(container, libraryUrl);
    await embedReportPage.firstCall?.returnValue?.catch(() => {});
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(embedReportPage.calledOnce).toBe(true);

    embedReportPage.resetBehavior();
    embedReportPage.rejects({ message: 'other error' });
    await (scMstrDashboard as any)._embedReport(container, libraryUrl);
    await embedReportPage.firstCall?.returnValue?.catch(() => {});
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(embedDossierSpy.calledTwice).toBe(true);

    scMstrDashboard.disableFallback = true;
    (window as any).microstrategy = { dossier: {} };
    (scMstrDashboard as any)._embedDossier(container, libraryUrl);
    expect(handleErrorSpy.calledWith('Dossier API not available')).toBe(true);

    scMstrDashboard.disableFallback = false;
    (scMstrDashboard as any)._embedDossier(container, libraryUrl);
    expect(fallbackSpy.called).toBe(true);

    (window as any).microstrategy = originalMstr;

    retryStub.restore();
    handleErrorSpy.restore();
    embedReportSpy.restore();
    embedDossierSpy.restore();
    fallbackSpy.restore();

    await scMstrDashboard.updateComplete;
  });

  it('registers event handlers and dispatches events', async () => {
    const scMstrDashboard = await createDashboard({ debug: true });
    const handlers: Record<string, (data: any) => void> = {};
    const instance = {
      registerEventHandler: (event: string, handler: (data: any) => void) => {
        handlers[event] = handler;
      },
    };
    const dispatchSpy = sinon.spy(scMstrDashboard as any, '_dispatchEvent');

    (scMstrDashboard as any)._handleEmbedSuccess(instance, 'library');
    await scMstrDashboard.updateComplete;
    handlers.onSearch?.({ q: 'x' });
    handlers.onFilter?.({ id: 1 });
    handlers.onOpenObject?.({ id: 2 });
    handlers.onError?.({ message: 'runtime' });
    await scMstrDashboard.updateComplete;

    expect(dispatchSpy.calledWith('sc-dashboard-viewer-mstr-search')).toBe(true);
    expect(dispatchSpy.calledWith('sc-dashboard-viewer-mstr-filter')).toBe(true);
    expect(dispatchSpy.calledWith('sc-dashboard-viewer-mstr-open-object')).toBe(true);
    expect(dispatchSpy.calledWith('sc-dashboard-viewer-mstr-runtime-error')).toBe(true);

    (scMstrDashboard as any)._handleEmbedSuccess(instance, 'report');
    await scMstrDashboard.updateComplete;
    handlers.onPageChange?.({});
    handlers.onFilterChange?.({});
    await scMstrDashboard.updateComplete;
    expect(dispatchSpy.calledWith('sc-dashboard-viewer-mstr-page-change')).toBe(true);
    expect(dispatchSpy.calledWith('sc-dashboard-viewer-mstr-filter-change')).toBe(true);

    (scMstrDashboard as any)._handleEmbedSuccess(instance, 'dossier');
    await scMstrDashboard.updateComplete;
    handlers.onPageSwitch?.({});
    handlers.onFilterUpdate?.({});
    await scMstrDashboard.updateComplete;
    expect(dispatchSpy.calledWith('sc-dashboard-viewer-mstr-page-switch')).toBe(true);
    expect(dispatchSpy.calledWith('sc-dashboard-viewer-mstr-filter-update')).toBe(true);

    dispatchSpy.restore();
  });

  it('returns empty auth config when no token provider exists', async () => {
    const scMstrDashboard = await createDashboard();
    scMstrDashboard.identityToken = '';
    scMstrDashboard.getLoginToken = undefined;

    const config = (scMstrDashboard as any)._buildCustomAuthConfig({});
    expect(Object.keys(config).length).toBe(0);

    await scMstrDashboard.updateComplete;
  });
});
