import { createRoot } from 'react-dom/client';
import { Application } from './application';
import { standaloneCapabilities } from './standalone';

const root = document.getElementById('root');
if (!root) throw new Error('Cashflow CN root element is missing');

createRoot(root).render(
  <Application
    instanceId="cashflow-blotter-standalone"
    basePath="/cashflow-blotter"
    capabilities={standaloneCapabilities}
  />,
);
