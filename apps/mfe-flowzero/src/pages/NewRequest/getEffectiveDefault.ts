import { ComponentType, FormNode } from "src/pages/FormDesigner/types";

export const getEffectiveDefault = (node: FormNode): unknown => {
  const { defaultValue, options } = node.props;
  switch (node.type) {
    case ComponentType.CHECKBOX:
    case ComponentType.MULTI_SELECT:
      if (Array.isArray(defaultValue)) return defaultValue;
      if (typeof defaultValue === "string" && defaultValue)
        return [defaultValue];
      return (
        options?.filter((opt) => opt.default).map((opt) => opt.value) ?? []
      );
    case ComponentType.SELECT:
      if (defaultValue != null && defaultValue !== "")
        return defaultValue as string;
      return options?.find((opt) => opt.default)?.value;
    case ComponentType.RADIO: {
      const isBooleanType = node.props.dataType === "BOOLEAN";
      if (isBooleanType) {
        if (defaultValue === true || defaultValue === "true") return "true";
        if (defaultValue === false || defaultValue === "false") return "false";
        return undefined;
      }
      return (
        (typeof defaultValue === "string" ? defaultValue : undefined) ??
        options?.find((opt) => opt.default)?.value
      );
    }
    default:
      return defaultValue !== undefined && defaultValue !== ""
        ? defaultValue
        : undefined;
  }
};
