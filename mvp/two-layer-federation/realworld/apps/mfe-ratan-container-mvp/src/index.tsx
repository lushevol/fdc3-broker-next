import { createRoot } from 'react-dom/client';
import { Application } from './application';
import { standaloneCapabilities } from './standalone';

const root = document.getElementById('root');
if (!root) throw new Error('Ratan migration MVP root element is missing');

createRoot(root).render(
  <Application
    instanceId="ratan-migration-standalone"
    basePath="/ratan-migration"
    capabilities={standaloneCapabilities}
  />,
);
