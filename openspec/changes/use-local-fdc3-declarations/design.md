# Design: Local FDC3 Declarations

## Architecture

No architecture changes. purely a data source switch in the service layer.

## Data Integration

- Directly import JSON files into `useServices.ts`.
- Ensure JSON structure matches the expected API response interface `FDC3DeclarationData`, `FDC3IntentDefinition`, `FDC3ContextDefinition`.
