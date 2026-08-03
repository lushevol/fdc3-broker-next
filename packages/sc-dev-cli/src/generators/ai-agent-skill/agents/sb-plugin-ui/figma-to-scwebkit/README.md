# figma-to-scwebkit Agent

Converts Figma designs into SC WebKit component code through a guided 4-step workflow.

## Overview

This agent automates the full pipeline from Figma design to production-ready SC WebKit UI components — including component mapping, code generation, API integration, and form validation.

## Steps

| Step | Agent | Description |
|------|-------|-------------|
| 1 | [SB Mapping Context Setup](./step-1-sb-mapping-context-setup.agent) | Builds and maintains `components-map.json` from SC WebKit Storybook examples |
| 2 | [Figma to SC WebKit](./step-2-figma-to-sc-webkit.agent) | Analyzes Figma designs and generates SC WebKit TypeScript/Lit component code |
| 3 | [Integrate API](./step-3-integrate-api.agent) | Creates API services, mock data, and data bindings for SC WebKit components |
| 4 | [Implement UI Validation](./step-4-implement-ui-validation.agent) | Adds form validation with regex patterns, length constraints, and custom rules |

## Resources

- [components-map.json](./resources/components-map.json) — Figma description to SC WebKit component mappings
- [Figma Analysis Instructions](./rules/figma-analysis-instructions)
- [Framework Guidelines](./rules/framework-guidelines)
- [Coding Standards](./rules/coding-standards)

## Typical Workflow

1. Run **Step 1** once (or when SC WebKit is updated) to generate/refresh `components-map.json`
2. Run **Step 2** with a Figma URL or file ID to generate the component code
3. Run **Step 3** to wire up API calls and mock data
4. Run **Step 4** to implement form validation on the generated fields
