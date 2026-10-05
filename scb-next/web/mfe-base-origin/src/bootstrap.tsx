import React from 'react';
import ReactDOMClient from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Base host root element is missing');
const appearanceParams = new URLSearchParams(window.location.search);
const newStyles = appearanceParams.get('new-styles') === 'true';
const loginAppearance = appearanceParams.get('login-theme') === 'dark' ? 'dark' : 'light';

ReactDOMClient.createRoot(rootElement).render(
  <React.StrictMode>
    <App version="1.0.0" newStyles={newStyles} loginAppearance={loginAppearance} />
  </React.StrictMode>,
);
