export type PrimitiveValue = string | number | boolean | null | undefined;
export type SimpleObject = {
  [k: string]: PrimitiveValue | SimpleObject;
};
export type SimpleArray = PrimitiveValue[] | SimpleObject[];
