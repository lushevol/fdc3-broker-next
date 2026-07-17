import { createRoot } from 'react-dom/client';
import type { PlatformCapabilities } from '@fm/platform-contracts-poc';
import { Application } from './application';

const capabilities: PlatformCapabilities = {
  navigation: {
    navigate(path) {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    },
  },
  notifications: { show: (message) => window.alert(message) },
  telemetry: { track: (event, data) => console.info(event, data) },
  workspace: { closeCurrent: () => console.info('close workspace') },
};

const root = document.getElementById('root');
if (!root) throw new Error('Cashflow preview root element is missing');
createRoot(root).render(
  <Application instanceId="cashflow-preview" basePath="/cashflow" capabilities={capabilities} />,
);
