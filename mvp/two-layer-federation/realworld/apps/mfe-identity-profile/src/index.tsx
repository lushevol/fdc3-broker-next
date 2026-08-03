import { createRoot } from 'react-dom/client';
import { Application } from './application';
import { standaloneCapabilities } from './standalone';

const root = document.getElementById('root');
if (!root) throw new Error('Identity profile root element is missing');

createRoot(root).render(
  <Application
    instanceId="identity-profile-standalone"
    basePath="/identity-profile"
    capabilities={standaloneCapabilities}
  />,
);
