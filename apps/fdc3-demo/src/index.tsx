import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { setBroker } from '@fm/fdc3-agent';
import { Broker } from '@fm/fdc3-broker';
import './styles.css';

const broker = new Broker({
  userChannelIds: ['red', 'green', 'blue', 'orange', 'yellow', 'cyan', 'magenta', 'purple'],
  enableDebug: true,
  callbacks: {
    onTileOpen: async (appId, _context) => {
      console.log('[Demo] Tile opened:', appId);
      return { appId };
    },
    onLoginStatusCheck: async () => true,
    onValidateEntitlements: async (_appId, _action) => true,
  },
});

setBroker(broker);

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
