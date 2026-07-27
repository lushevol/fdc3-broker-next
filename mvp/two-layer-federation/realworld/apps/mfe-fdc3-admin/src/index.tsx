import { createRoot } from 'react-dom/client';
import { Application } from './application';
import { standaloneCapabilities } from './standalone';

const root = document.getElementById('root');
if (!root) throw new Error('FDC3 admin root element is missing');
createRoot(root).render(<Application instanceId="fdc3-admin-standalone" basePath="/fdc3-admin" capabilities={standaloneCapabilities} />);
