export const TILE_WORKSPACE_TAG = 'tile-workspace';

export class TileWorkspaceElement extends HTMLElement {
  readonly tileRoot: ShadowRoot;

  constructor() {
    super();
    this.tileRoot = this.attachShadow({ mode: 'open' });
  }
}

export function adoptTileStyles(root: ShadowRoot, styleUrls: string[]): () => void {
  const canonicalUrls = new Set(styleUrls.map((url) => new URL(url, document.baseURI).href));
  document.head.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]').forEach((link) => {
    if (canonicalUrls.has(link.href)) link.remove();
  });
  const links = [...canonicalUrls].map((href) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.dataset.tileStyle = 'true';
    root.append(link);
    return link;
  });
  return () => links.forEach((link) => link.remove());
}

export function registerTileWorkspace(): void {
  if (!customElements.get(TILE_WORKSPACE_TAG)) {
    customElements.define(TILE_WORKSPACE_TAG, TileWorkspaceElement);
  }
}
