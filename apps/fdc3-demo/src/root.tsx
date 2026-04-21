import React from 'react';
import ReactDOMClient from 'react-dom/client';
import singleSpaReact from 'single-spa-react';
import App from './App';

const lifecycles = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: App,
  errorBoundary(err) {
    return <span>{err.message}</span>;
  },
});

export const { bootstrap, mount, unmount } = lifecycles;

export default App;
