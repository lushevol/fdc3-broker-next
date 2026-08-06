import { createRoot, type Root } from 'react-dom/client';
import { PlaygroundApp } from './playground-app.js';
import { resetDocumentMode } from './theme.js';

export interface PlaygroundMountOptions {
  readonly initialRoute?: string;
}

const roots = new WeakMap<Element, Root>();

export function mountPlayground(element: Element, options: PlaygroundMountOptions = {}) {
  if (roots.has(element)) throw new Error('Playground is already mounted in this element.');
  if (options.initialRoute) window.location.hash = options.initialRoute;
  const root = createRoot(element);
  roots.set(element, root);
  root.render(<PlaygroundApp />);
}

export function unmountPlayground(element: Element) {
  const root = roots.get(element);
  if (!root) return;
  root.unmount();
  roots.delete(element);
  resetDocumentMode();
  document.querySelectorAll('[data-ratan-component="DialogOverlay"]').forEach((overlay) => overlay.remove());
}
