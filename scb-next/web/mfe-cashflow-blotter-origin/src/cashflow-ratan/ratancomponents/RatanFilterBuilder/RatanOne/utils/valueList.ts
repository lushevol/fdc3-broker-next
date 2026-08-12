import { DefaultOptionType } from "antd/es/select";
import { RatanFieldType, ValueList } from "../type";

type AntDOption = DefaultOptionType;

export const defaultPureBooleanOptions = [
  {
    label: "true",
    title: "true",
    name: true,
    value: true,
  },
  {
    label: "false",
    title: "false",
    name: false,
    value: false,
  },
];

const isValueList = (opt: any[] | string): opt is ValueList[] => {
  return (
    Array.isArray(opt) &&
    opt.every((p) => {
      return (
        Object.prototype.hasOwnProperty.call(p, "label") &&
        Object.prototype.hasOwnProperty.call(p, "title") &&
        Object.prototype.hasOwnProperty.call(p, "value") &&
        Object.prototype.hasOwnProperty.call(p, "name")
      );
    })
  );
};

const isAntDOptions = (opt: any[] | string): opt is AntDOption[] => {
  return (
    Array.isArray(opt) &&
    opt.every((p) => {
      return (
        Object.prototype.hasOwnProperty.call(p, "label") &&
        Object.prototype.hasOwnProperty.call(p, "value")
      );
    })
  );
};

const antDOptions2ValueList = (opts: AntDOption[]): ValueList[] => {
  return opts.map((i) => ({
    ...i,
    title: i.label,
    name: i.value!,
    value: i.value!,
  }));
};

export const parseValueList = (
  rawOptions: string | ValueList[] | AntDOption[],
  dataType: RatanFieldType = "text"
): ValueList[] => {
  try {
    if (typeof rawOptions === "string" && rawOptions) {
      if (/^\[.*\]$/.test(rawOptions)) {
        return optionsPrettier(JSON.parse(rawOptions.replace(/'/g, '"')));
      } else {
        return optionsPrettier(rawOptions.split(","));
      }
    } else if (dataType === "boolean" && rawOptions.length === 0) {
      return defaultPureBooleanOptions;
    } else if (isValueList(rawOptions)) {
      return rawOptions;
    } else if (isAntDOptions(rawOptions)) {
      return antDOptions2ValueList(rawOptions);
    }
  } catch (error) {
    console.error(error);
  }
  return [];
};

export const optionsPrettier = (options: any[]) => {
  if (Array.isArray(options)) {
    return options.map((i) => {
      if (typeof i === "string")
        return {
          label: i,
          title: i,
          value: i,
          name: i,
        };
      else return i;
    });
  }
  return options;
};
