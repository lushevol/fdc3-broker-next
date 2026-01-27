# Architecture: @fm/root-config

## Tech Stack

- **Framework**: Single-SPA
- **Library**: `single-spa-layout`
- **Build Tool**: Webpack 5
- **Language**: TypeScript

## Key Files

- `src/index.ejs`: The HTML template. It likely includes the import map (SystemJS) for modules.
- `src/microfrontend-layout.html`: Defines the DOM structure and which apps are active on which routes.
- `src/root.ts`: Entry script that parses the layout and starts the Single-SPA engine.

## Responsibilities

1. **Bootstrap**: Loads the import maps and shared libraries.
2. **Mount**: Registers applications using `registerApplication`.
3. **Route**: Handles URL changes and activates the corresponding apps.
