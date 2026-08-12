import { CustomFormConfigProps, NewItem } from "./FormItemComponents";
import { getIsRequired, getRules } from "./item/ItemsUtils";

const FormItemsBuilder = ({
  enable,
  editable,
  error,
  isRequiredObj,
  newFormConfig,
  customValidateStatus,
  messageApi,
  customRules,
  rulesObj,
  data,
  form,
  onUpdate,
}) =>
  newFormConfig.map((item: CustomFormConfigProps) => {
    const isRequired =
      getIsRequired(isRequiredObj[item.field]) || item.isRequired;
    const itemRules = item.itemRules || [];
    return (
      <NewItem
        key={item.field}
        isRequired={isRequired}
        disabled={
          !editable || enable.submiting || !!item.disabled || enable.ruleError
        }
        error={error}
        rules={[
          ...customRules,
          ...getRules(rulesObj[item.field] || [], isRequiredObj[item.field]),
          ...itemRules,
        ]}
        configs={newFormConfig}
        data={data}
        update={onUpdate}
        form={form}
        {...item}
        {...customValidateStatus[item.field]}
        messageApi={messageApi}
      />
    );
  });
export default FormItemsBuilder;
