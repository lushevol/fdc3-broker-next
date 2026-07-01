import { AntDValueSelector } from "@react-querybuilder/antd";
import { OperatorSelectorProps, RuleType } from "react-querybuilder";
import { defaultOperatorsOnValueSourceisField } from "../operators";

interface CustomAntDOperatorSelectorProps extends OperatorSelectorProps {
  rule: RuleType & { enrich?: any; field?: any };
}
export const CustomAntDOperatorSelector = (
  props: CustomAntDOperatorSelectorProps
) => {
  const { schema, options } = props;
  let operators = options;
  if (props.rule?.enrich || typeof props.rule?.field == "object") {
    const resultType =
      props.rule?.enrich?.resultType.toLowerCase() ||
      props.rule?.field?.fn.resultType.toLowerCase();
    operators =
      // @ts-ignore Options will not switch in time when the function changes, switch options manually for the time being
      schema.fields.find((i) => i.inputType === resultType)?.operators ||
      options;
  }
  // const copyField = field as any;
  // const newFieldName = copyField?.value || field;

  // const { funField } = hydrationGenerationObj(newFieldName);
  // const fieldConfig = schema?.fieldMap?.[funField ?? ""] as any;
  // const operators = fieldConfig?.operators || [];

  if (props.rule.valueSource === "field") {
    if (
      !defaultOperatorsOnValueSourceisField.find((i) => i.name === props.value)
    ) {
      props.handleOnChange(defaultOperatorsOnValueSourceisField[0].name);
    }
  }
  return (
    <AntDValueSelector
      {...props}
      options={operators}
      data-testid="custom-operator-selector"
    />
  );
};

CustomAntDOperatorSelector.displayName = "CustomAntDOperatorSelector";
