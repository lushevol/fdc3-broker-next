import { adoptTileStyles, TILE_WORKSPACE_TAG, registerTileWorkspace } from './tileWorkspace';

describe('tile workspace custom element', () => {
  it('creates a separate open Shadow Root for every Tile instance', () => {
    registerTileWorkspace();
    registerTileWorkspace();
    const first = document.createElement(TILE_WORKSPACE_TAG);
    const second = document.createElement(TILE_WORKSPACE_TAG);
    expect(first.shadowRoot).not.toBeNull();
    expect(second.shadowRoot).not.toBeNull();
    expect(first.shadowRoot).not.toBe(second.shadowRoot);
  });

  it('adopts extracted stylesheets into one Tile root and removes leaked Host links', () => {
    const workspace = document.createElement(TILE_WORKSPACE_TAG);
    const leaked = document.createElement('link');
    leaked.rel = 'stylesheet';
    leaked.href = 'http://tiles.test/cashflow.css';
    document.head.append(leaked);
    const release = adoptTileStyles(workspace.shadowRoot as ShadowRoot, [leaked.href, leaked.href]);
    expect(document.head.querySelector('[href="http://tiles.test/cashflow.css"]')).toBeNull();
    expect(workspace.shadowRoot?.querySelectorAll('link[data-tile-style="true"]')).toHaveLength(1);
    release();
    expect(workspace.shadowRoot?.querySelector('link')).toBeNull();
  });
});
