import styled from "@emotion/styled";
import { Form, Input } from "antd";
import cn from "classnames";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import DarkInput from "src/components/base/DarkInput";
import { useFieldDefsFromForm } from "src/pages/workflow/services/conditionUtils";

import { PropertiesPanelProps } from "../config/ILayoutsConfig";
import ConditionGroup, { ConditionGroupValue } from "./ConditionGroup";

const FormWrapper = styled("div")`
  .ant-select-in-form-item {
    height: 32px;
  }
  .ant-select-dropdown {
    .dark & {
      color: #808080 !important;
      background: #171d24 !important;
      border: 1px solid #737373 !important;
    }
  }
`;

const IfNodeForm: React.FC<PropertiesPanelProps> = ({
  nodeData,
  nodeType,
  onNodeDataChange,
}) => {
  const [form] = Form.useForm();
  const [conditionGroupValue, setConditionGroupValue] =
    useState<ConditionGroupValue>(() => ({
      conjunction: nodeData?.conjunction ?? "And",
      conditions: nodeData?.conditions ?? [],
    }));

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(nodeData || {});
    setConditionGroupValue({
      conjunction: nodeData?.conjunction ?? "And",
      conditions: nodeData?.conditions ?? [],
    });
    // Always keep fieldDefs up-to-date on nodeData so BpmnService can resolve
    // field types even when the user doesn't modify conditions before saving.
    if (nodeData) {
      Object.assign(nodeData, { fieldDefs });
    }
  }, [nodeData, form]);

  const handleValuesChange = (_: any, allValues: any) => {
    if (nodeData) {
      Object.assign(nodeData, allValues);
    }
  };

  const handleConditionsChange = (value: ConditionGroupValue) => {
    setConditionGroupValue(value);
    if (nodeData) {
      Object.assign(nodeData, { ...value, fieldDefs });
      onNodeDataChange?.({ ...value, fieldDefs });
    }
  };

  const fieldDefs = useFieldDefsFromForm();
  return (
    <FormWrapper>
      <Form layout="vertical" form={form} onValuesChange={handleValuesChange}>
        <Form.Item
          label={
            <span className="font-medium text-light-content-label-text dark:text-dark-content-label-text">
              Label
            </span>
          }
          name="label"
        >
          <DarkInput maxLength={200} className="h-[32px] " />
        </Form.Item>
      </Form>

      <div className={cn("flex flex-col gap-[12px] mt-[16px]")}>
        <div
          className={cn(
            "flex items-center",
            "border-b border-b-[#cccccc] dark:border-b-[#444] pb-[8px]"
          )}
        >
          <span className="font-bold text-[12px] leading-[16px] text-[#0367D2]">
            Conditions Setting
          </span>
        </div>
        <ConditionGroup
          value={conditionGroupValue}
          onChange={handleConditionsChange}
          fieldDefs={fieldDefs}
        />
      </div>
    </FormWrapper>
  );
};

export default observer(IfNodeForm);
