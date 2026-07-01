import { Button, Form, Input, Popconfirm, Space } from "antd";
import { useMemo, useState } from "react";
import { useMutationActionApi } from "src/Cashflow_BIC_Netting_Static_Table/hooks/useActionApi";
import {
  BicNettingRuleMutation,
  BicNettingRuleRow,
} from "src/Cashflow_BIC_Netting_Static_Table/services/api.type";
import {
  closeDialog,
  DetailMode,
} from "src/Cashflow_BIC_Netting_Static_Table/store/detail.slice";
import { trimObject } from "src/Cashflow_CN/components/CashflowDetails/MultiExceptions/common/utils";
import { get_BIC_NETTING_STATIC_BLOTTER_AUDIT_BTN } from "src/Root/analysis/const";
import { plattenStr } from "src/Root/analysis/utils";

import { ActionType } from "../../state/types";
import { useAppDispatch, useAppSelector } from "../../store";

export const RuleDetail = () => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm<BicNettingRuleRow | BicNettingRuleMutation>();
  const { detailData, actions, mode } = useAppSelector((state) => state.detail);
  const [submitting, setSubmitting] = useState(false);
  const { mutation } = useMutationActionApi();

  const handleSubmit = async (action: ActionType) => {
    try {
      setSubmitting(true);
      await form.validateFields();
      const formData = form.getFieldsValue();
      trimObject(formData);
      await mutation(action, formData as BicNettingRuleRow);
      dispatch(closeDialog());
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  const formDisabled = useMemo(() => {
    return (
      actions.some((a) => a.disabled) ||
      !actions.some((a) =>
        [ActionType.Create, ActionType.Update].includes(a.action)
      )
    );
  }, []);

  return (
    <Form
      form={form}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      data-testid="rule-detail"
      initialValues={detailData}
    >
      {mode === DetailMode.Edit && (
        <>
          <Form.Item label="ID" name="id">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Created At" name="createdAt">
            <Input disabled />
          </Form.Item>
        </>
      )}
      <Form.Item label="Family" name="family">
        <Input allowClear disabled={formDisabled} />
      </Form.Item>
      <Form.Item
        label="Entity FMID"
        name="entityFmId"
        rules={[{ required: true, message: "please type entity fmid" }]}
      >
        <Input allowClear disabled={formDisabled} />
      </Form.Item>
      <Form.Item label="Group" name="group">
        <Input allowClear disabled={formDisabled} />
      </Form.Item>
      <Form.Item label="Type" name="type">
        <Input allowClear disabled={formDisabled} />
      </Form.Item>
      <Form.Item label="Typology" name="typology">
        <Input allowClear disabled={formDisabled} />
      </Form.Item>
      <Form.Item label="Strategy" name="strategy">
        <Input allowClear disabled={formDisabled} />
      </Form.Item>
      <Form.Item
        label="Beneficiary BIC"
        name="beneficiaryBic"
        rules={[
          { required: true, message: "please type beneficiary bic" },
          { max: 11, message: "Bic code must be up to 11 characters" },
        ]}
      >
        <Input allowClear disabled={formDisabled} />
      </Form.Item>
      <Form.Item
        style={{ marginBottom: 0 }}
        wrapperCol={{ span: 18, offset: 6 }}
      >
        <Space>
          {actions.map((a) => (
            <Popconfirm
              key={a.action}
              title={a.action}
              description={`Are you sure to ${a.action} this rule ?`}
              disabled={a.disabled || submitting}
              onConfirm={() => handleSubmit(a.action)}
              okText="Yes"
              cancelText="Dismiss"
            >
              <Button
                key={a.action}
                loading={submitting}
                data-testid={get_BIC_NETTING_STATIC_BLOTTER_AUDIT_BTN(
                  plattenStr(a.action)
                )}
                {...a}
              >
                {a.action}
              </Button>
            </Popconfirm>
          ))}
        </Space>
      </Form.Item>
    </Form>
  );
};
