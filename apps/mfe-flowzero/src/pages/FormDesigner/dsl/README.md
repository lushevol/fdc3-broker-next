# FormCraft DSL

This folder contains the Domain Specific Language (DSL) used by the form builder.

- Component DSL lives in `dsl/components/*.ts` and is aggregated by `dsl/components/index.ts`.
- DSL types are in `dsl/types.ts`.
- The full form-level DSL and helper utilities are in `dsl/form.ts`.

## Component DSL shape

```ts
interface ComponentDSLDefinition {
  type: ComponentType; // unique key
  displayName: string; // human readable label
  version: string; // semantic component DSL version
  category: "layout" | "form-control" | "display";
  description: string; // docs for designers
  defaultProps: ComponentProps; // used when instantiating nodes
  props: ComponentPropDSL[]; // DSL description of supported props
  children?: {
    // optional child constraints
    allow: ComponentType[];
    description?: string;
    min?: number;
    max?: number;
  };
}
```

Each component file exports a `*DSL` object with its defaults and prop schema.

## Form DSL shape

```ts
interface FormDSLDocument {
  version: "1.0.0";
  metadata?: { name?: string; description?: string };
  nodes: FormNode[]; // tree of components
}
```

Use `createFormDocument(nodes, metadata)` to export the current form as a DSL document, and `validateFormDocument(doc)` to ensure it matches the component specs.
