import styled from "@emotion/styled";
import { Form, message, Select } from "antd";
import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FormResource, getPublishedForms } from "src/api";
import { useWorkflowDesignerContext } from "src/pages/workflow/viewModel/WorkflowDesignerProvider";
import { relForm } from "src/pages/workflow/viewModel/WorkflowDesignerStore";

import { PropertiesPanelProps } from "../config/ILayoutsConfig";

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

const StartEventNodeForm: React.FC<PropertiesPanelProps> = observer(
  ({ nodeData }) => {
    const [form] = Form.useForm();
    const { workflowDesignerStore: store } = useWorkflowDesignerContext();
    const [formOptions, setFormOptions] = useState<FormResource[]>([]);
    const [loading, setLoading] = useState(false);

    const storeForms = store?.workflowEntity?.forms;

    // Derive the bound form ID: prefer nodeData.form, fall back to the store's first form
    const boundFormId = useMemo(
      () => nodeData?.form || storeForms?.[0]?.id || undefined,
      [nodeData?.form, storeForms]
    );

    // Sync form fields whenever nodeData or the derived boundFormId changes
    useEffect(() => {
      form.setFieldsValue({ ...nodeData, form: boundFormId });
    }, [nodeData, boundFormId, form]);

    // Pre-seed options from the store so the name shows before the API returns,
    // then replace with the full published list once it arrives
    useEffect(() => {
      if (storeForms?.length) {
        setFormOptions(storeForms as FormResource[]);
      }

      setLoading(true);
      getPublishedForms({})
        .then((res) => setFormOptions(res || []))
        .catch(() => message.error("Failed to load forms"))
        .finally(() => setLoading(false));
    }, [storeForms]);

    const handleValuesChange = useCallback(
      (changedValues: any, allValues: any) => {
        if (nodeData) {
          Object.assign(nodeData, allValues);
        }
        if (changedValues.form !== undefined && store) {
          const selected = formOptions.find((f) => f.id === changedValues.form);
          store.setWorkflowEntity({
            forms: selected
              ? [{ ...selected, fields: [], workflowVariables: [] } as relForm]
              : [],
          });
        }
      },
      [nodeData, store, formOptions]
    );

    return (
      <FormWrapper>
        <Form form={form} onValuesChange={handleValuesChange}>
          <div>
            <div className="font-bold text-[12px] text-[#0367D2] h-[16px] leading-[16px] mb-[5px]">
              Binding form
            </div>
            <div className="border-b mb-[8px] border-light-divide-base dark:border-dark-divide-base" />
            <div className="block text-700 mb-2 font-medium text-light-content-label-text dark:text-dark-content-label-text">
              Form
            </div>
            <Form.Item name="form">
              <Select
                loading={loading}
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                className="w-full dark:bg-dark-container-layer"
                placeholder="Please select a form"
                allowClear
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) => {
                  if (!option) return false;
                  return String(option.children)
                    .toLowerCase()
                    .includes(input.toLowerCase());
                }}
              >
                {formOptions.map((f) => (
                  <Select.Option key={f.id} value={f.id}>
                    {f.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </Form>
      </FormWrapper>
    );
  }
);

export default StartEventNodeForm;
