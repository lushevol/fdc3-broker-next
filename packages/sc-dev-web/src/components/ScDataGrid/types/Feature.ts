export type Feature<Name extends string> = {
  [key in
    | `update${Capitalize<Name>}`
    | `get${Capitalize<Name>}Options`]: key extends `update${Capitalize<Name>}`
    ? () => void
    : key extends `get${Capitalize<Name>}Options`
    ? () => Record<string, any>
    : never;
};
