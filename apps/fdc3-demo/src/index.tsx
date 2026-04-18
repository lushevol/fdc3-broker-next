import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AgentProvider } from '@fm/fdc3-agent';
import './styles.css';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <AgentProvider>
      <App />
    </AgentProvider>
  </React.StrictMode>,
);
