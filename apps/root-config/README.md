# @fm/root-config

## Overview

`@fm/root-config` is the **core orchestration application** for the Single-SPA microfrontend architecture. It is responsible for:

- Serving the main HTML entry point (`index.ejs`).
- Configuring the root layout (`microfrontend-layout.html`).
- Registering and loading other microfrontend applications.

## Key Features

- **Application Registration**: Maps URLs to specific microfrontend applications.
- **Layout Management**: Defines where each application renders on the page.
- **Shared Dependencies**: Manages shared imports like `react` and `react-dom` via SystemJS.
