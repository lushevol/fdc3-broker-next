import React from 'react';
import ReactDOMClient from 'react-dom/client';
import App from './App';
import { readStandaloneAppearance } from './new-styles/appearance';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Base host root element is missing');
const appearance = readStandaloneAppearance(window.location.search);

ReactDOMClient.createRoot(rootElement).render(
  <React.StrictMode>
    <App version="1.0.0" {...appearance} />
  </React.StrictMode>,
);
