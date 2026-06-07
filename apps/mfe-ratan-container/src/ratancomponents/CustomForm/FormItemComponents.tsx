import React, { FC } from "react";
import { Form, Divider, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import cn from "classnames";

import { CheckboxItem } from "./item/CheckboxItem";
import { InputItem } from "./item/InputItem";
import { SelectItem } from "./item/SelectItem";
import { ButtonItem } from "./item/ButtonItem";
import { TimePickerItem } from "./item/TimePickerItem";
import { InputNumberItem } from "./item/InputNumberItem";
import { ValidateStatus } from "antd/es/form/FormItem";
import { MessageInstance } from "antd/es/message/interface";
import { DatePickerItem } from "./item/DatePickerItem";
import { plattenStr } from "../../packages/Analysis/utils";

const { Item } = Form;

const allComponents: any = {
  InputItem,
  SelectItem,
  CheckboxItem,
  TimePickerItem,
  InputNumberItem,
  DatePickerItem,
};

const DynamicComponent = (props: any) => {
  const { componentType = "InputItem" } = props;
  return allComponents[componentType](props);
};

export interface CustomFormConfigProps {
  field: string;
  label: string;
  componentType?: string;
  hasDivider?: boolean;
  title?: string;
  options?: {
    label: string;
    value: string | boolean;
  }[];
  hasBr?: boolean;
  placeholder?: any;
  onSearch?: Function;
  onChange?: any;
  onClick?: any;
  buttonText?: string;
  tooltipText?: string;
  isRequired?: boolean;
  disabled?: boolean;
  notSubmit?: boolean;
  hidden?: boolean;
  itemRules?: any[];
  defaultValue?: any;
  validationRules?: any;
  disabledDate?: Function;
}

interface NewItemProps extends CustomFormConfigProps {
  error: any;
  rules?: any;
  configs: CustomFormConfigProps[];
  data?: any;
  update: Function;
  form: any;
  help: string;
  validateStatus: ValidateStatus;
  hasFeedback: boolean;
  messageApi?: MessageInstance;
  disabledDate?: Function;
}

export const NewItem: FC<NewItemProps> = (params) => {
  const {
    title,
    field,
    label,
    isRequired,
    error,
    rules,
    hasBr,
    hasDivider,
    hidden,
    help,
    validateStatus,
    hasFeedback,
  } = params;
  const prop: any = {};
  const className = cn({
    "has-btn": !!params.buttonText,
    [`kp--${plattenStr(label)}`]: true,
  });
  return (
    <>
      {title && <div className="custom-form-classify">{title}</div>}
      <Item
        className={className}
        label={label}
        name={field}
        hidden={hidden}
        {...prop}
        validateTrigger="onSubmit"
        rules={[
          { required: isRequired, message: "value can not be empty" },
          ({ _getFieldValue }: any) => ({
            validator(_rule: any, _value: any) {
              if (error[field]) {
                return Promise.reject(error[field]);
              }
              return Promise.resolve();
            },
          }),
          ...rules,
        ]}
        help={help}
        validateStatus={validateStatus}
        hasFeedback={hasFeedback}
        extra={
          !!params.tooltipText && (
            <Tooltip title={params.tooltipText}>
              <InfoCircleOutlined />
            </Tooltip>
          )
        }
        data-testid={"form-item-component"}
      >
        {DynamicComponent(params)}
      </Item>
      {!!params.buttonText && <ButtonItem {...params} />}
      {hasBr && <div style={{ width: "100%" }}></div>}
      {hasDivider && <Divider className="custom-form-line" />}
    </>
  );
};
