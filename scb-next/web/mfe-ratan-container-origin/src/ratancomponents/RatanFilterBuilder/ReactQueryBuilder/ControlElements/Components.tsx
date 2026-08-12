import type { Field } from "react-querybuilder";
import {
  RatanFieldCascaderOption,
  RuleFunctionConfig,
} from "../../RatanOne/type";
import cascaderBuilder from "../../RatanOne/utils/cascaderBuilder";
import { CustomAntDFieldSelector } from "./CustomAntDFieldSelector";
import { CustomAntDValueEditor } from "./CustomAntDValueEditor";
import { QueryBuilderSelectorType } from "../types";

export const NullComponent = () => null;

export const CustomValueEditor = (props) => (
  <CustomAntDValueEditor {...props} />
);

export const generateFieldsCascaderOptions = (
  fields: Field[],
  disableFields: string[] = []
) =>
  cascaderBuilder(
    fields.map((i) => ({
      ...i.config,
      disabled: disableFields.includes(i.name),
    }))
  );

export const generateFieldSelector =
  (
    fieldsCascaderOptions: RatanFieldCascaderOption[],
    enableFn?: boolean,
    functionConfig?: RuleFunctionConfig[],
    type?: QueryBuilderSelectorType,
    disableValueDateTypeFn?: boolean
  ) =>
  (props) =>
    (
      <CustomAntDFieldSelector
        {...props}
        options={fieldsCascaderOptions}
        enableFn={enableFn}
        functionConfig={functionConfig}
        type={type}
        disableValueDateTypeFn={disableValueDateTypeFn}
      />
    );
