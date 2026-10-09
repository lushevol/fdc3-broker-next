import { readFileSync } from 'fs';
import path from 'path';
import {
  createInitialAppearance,
  readStandaloneAppearance,
  resolveFederatedAppearance,
  resolvePortalAppearance,
} from './new-styles/appearance';
import { isLocalStylingConsole } from './new-styles/styling-console/settings';

jest.mock('./hooks/provider', () => ({ useContext: jest.fn() }));

interface CopyManifest {
  rootNamespaces: Record<string, string>;
  rootLifecycleExports: string[];
}
const manifest: CopyManifest = JSON.parse(
  readFileSync(path.resolve(__dirname, '../docs/ORIGIN_COPY_MANIFEST.json'), 'utf8'),
);

describe('adapted Base appearance contract', () => {
  it('starts the copied application in WebKit without overwriting an explicit Legacy request', () => {
    expect(createInitialAppearance({ version: 'root-version' })).toEqual({
      rootVersion: 'root-version',
      newStyles: true,
      loginAppearance: undefined,
    });
    expect(createInitialAppearance({ newStyles: false, loginAppearance: 'dark' })).toEqual({
      rootVersion: undefined,
      newStyles: false,
      loginAppearance: 'dark',
    });
  });

  it('uses the new layout by default and permits an explicit standalone Legacy URL', () => {
    expect(readStandaloneAppearance('').newStyles).toBe(true);
    expect(readStandaloneAppearance('?new-styles=false').newStyles).toBe(false);
    expect(readStandaloneAppearance('?new-styles=true&login-theme=dark')).toEqual({
      newStyles: true,
      loginAppearance: 'dark',
    });
    expect(resolvePortalAppearance(true)).toBe('prototype');
    expect(resolvePortalAppearance(false)).toBe('legacy');
    expect(resolvePortalAppearance(false, '?new-layout=true')).toBe('layout-preview');
  });

  it.each([
    ['light', true, { mode: 'light', designGeneration: 'webkit' }],
    ['dark', true, { mode: 'dark', designGeneration: 'webkit' }],
    ['light', false, { mode: 'light', designGeneration: 'legacy' }],
    ['dark', false, { mode: 'dark', designGeneration: 'legacy' }],
  ])('keeps mode %s independent of newStyles=%s', (theme, newStyles, appearance) => {
    expect(resolveFederatedAppearance({ theme, newStyles })).toEqual(appearance);
  });

  it.each(['localhost', '127.0.0.1', '::1', '[::1]'])('enables development controls on %s only in development', (hostname) => {
    expect(isLocalStylingConsole(true, hostname)).toBe(true);
    expect(isLocalStylingConsole(false, hostname)).toBe(false);
  });

  it.each(['portal.example.com', '192.168.1.10', 'localhost.example.com'])('hides development controls on %s', (hostname) => {
    expect(isLocalStylingConsole(true, hostname)).toBe(false);
    expect(isLocalStylingConsole(false, hostname)).toBe(false);
  });
});

describe('copied public Base root contract', () => {
  const mockRender = jest.fn();
  const mockCreateRoot = jest.fn(() => ({ render: mockRender }));
  const lifecycle = { bootstrap: jest.fn(), mount: jest.fn(), unmount: jest.fn() };
  const mockSingleSpaReact = jest.fn((_configuration: unknown) => lifecycle);
  const containerProperty = Object.getOwnPropertyDescriptor(window, 'single_spa_container_id');

  function loadRoot(container?: Element) {
    jest.resetModules();
    Object.defineProperty(window, 'single_spa_container_id', {
      configurable: true,
      value: container,
    });
    jest.doMock('./App', () => ({ __esModule: true, default: () => null }));
    jest.doMock('react-dom/client', () => ({
      __esModule: true,
      default: { createRoot: mockCreateRoot },
    }));
    jest.doMock('single-spa-react', () => ({ __esModule: true, default: mockSingleSpaReact }));
    const currentRoot = readFileSync(path.resolve(__dirname, './root.tsx'), 'utf8');
    const currentNamespaces = Object.fromEntries(
      [...currentRoot.matchAll(/export\s+\*\s+as\s+(\w+)\s+from\s+["']([^"']+)["']/g)]
        .map((match) => [match[1], match[2]]),
    );
    for (const [name, source] of Object.entries(currentNamespaces)) {
      const target = source.startsWith('.') ? path.resolve(__dirname, source) : source;
      jest.doMock(target, () => ({ contractNamespace: name }));
    }
    return require('./root') as {
      bootstrap: typeof lifecycle.bootstrap;
      unmount: typeof lifecycle.unmount;
      mount: typeof lifecycle.mount;
      MountComponent: (props: Record<string, unknown>) => Promise<void>;
      render: (element: Element, props: Record<string, unknown>) => void;
      check: (element: Element | undefined, props: Record<string, unknown>) => void;
      [name: string]: unknown;
    };
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    if (containerProperty) Object.defineProperty(window, 'single_spa_container_id', containerProperty);
    else Reflect.deleteProperty(window, 'single_spa_container_id');
    jest.resetModules();
  });

  it('retains every original namespace through the root entry point', () => {
    const root = loadRoot();
    for (const name of Object.keys(manifest.rootNamespaces)) {
      expect(root[name]).toEqual(expect.objectContaining({ contractNamespace: name }));
    }
    for (const name of manifest.rootLifecycleExports) expect(typeof root[name]).toBe('function');
  });

  it('preserves Single-SPA bootstrap, mount, and unmount when no custom root is supplied', () => {
    const root = loadRoot();
    expect(root.bootstrap).toBe(lifecycle.bootstrap);
    expect(root.mount).toBe(lifecycle.mount);
    expect(root.unmount).toBe(lifecycle.unmount);
    expect(mockSingleSpaReact).toHaveBeenCalledWith(expect.objectContaining({
      rootComponent: expect.any(Function),
      errorBoundary: expect.any(Function),
    }));
  });

  it('preserves the custom-root mount promise and passes host props to App', async () => {
    const container = document.createElement('div');
    const root = loadRoot(container);
    const props = { version: 'host-build', newStyles: true, loginAppearance: 'dark' };
    expect(root.mount).toBe(root.MountComponent);
    await root.MountComponent(props);
    expect(mockCreateRoot).toHaveBeenCalledWith(container);
    expect(mockRender).toHaveBeenCalledWith(expect.objectContaining({ props }));
    root.check(undefined, props);
    expect(mockCreateRoot).toHaveBeenCalledTimes(1);
  });
});
