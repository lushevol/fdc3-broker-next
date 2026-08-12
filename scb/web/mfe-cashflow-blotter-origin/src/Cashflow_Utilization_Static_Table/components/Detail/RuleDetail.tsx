import { Button, Form, Input, message, Popconfirm, Select, Space } from "antd";
import { useMemo, useState } from "react";
import { trimObject } from "src/Cashflow_CN/components/CashflowDetails/MultiExceptions/common/utils";
import { BookingEntityNameIdOptions } from "src/Cashflow_CN/Main/config/ratanConfig/local/BookingEntity";
import { queryCounterPartyDetails_CN } from "src/Cashflow_CN/services/graphql";
import { get_UTILIZATION_STATIC_BLOTTER_AUDIT_BTN } from "src/Root/analysis/const";
import { plattenStr } from "src/Root/analysis/utils";

import { useMutationActionApi } from "../../hooks/useActionApi";
import {
  UtilizationRuleMutation,
  UtilizationRuleRow,
} from "../../services/api.type";
import { ActionType } from "../../state/types";
import { useAppDispatch, useAppSelector } from "../../store";
import { closeDialog, DetailMode } from "../../store/detail.slice";
import {
  resetPageNo,
  updateRowDataAfterMutation,
} from "../../store/pagination.slice";

export const RuleDetail = () => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm<UtilizationRuleRow | UtilizationRuleMutation>();
  const { detailData, actions, mode } = useAppSelector((state) => state.detail);
  const [submitting, setSubmitting] = useState(false);
  const { mutation } = useMutationActionApi();
  const [messageApi, MessageContext] = message.useMessage();

  const handleSubmit = async (action: ActionType) => {
    try {
      setSubmitting(true);
      await form.validateFields();
      const formData = form.getFieldsValue();
      trimObject(formData);
      await mutation(action, formData as UtilizationRuleRow);
      if (formData.hasOwnProperty("id")) {
        dispatch(updateRowDataAfterMutation(formData as UtilizationRuleRow));
      } else {
        dispatch(resetPageNo());
      }
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

  const handleSelectEntityFMID = (fmId: string) => {
    const entity = BookingEntityNameIdOptions.find(
      (option) => option.value === fmId
    );
    form.setFieldValue("entityFmCode", entity?.label ?? "");
  };

  const handleSelectEntityFMCode = (fmCode: string) => {
    const entity = BookingEntityNameIdOptions.find(
      (option) => option.label === fmCode
    );
    form.setFieldValue("entityFmId", entity?.value ?? "");
  };

  const handleCounterpartyFinishInput = async () => {
    const counterpartyFmId = form.getFieldValue("counterpartyFmId");
    if (counterpartyFmId) {
      const { fmEntity } = await queryCounterPartyDetails_CN(
        counterpartyFmId.trim()
      );

      if (fmEntity.fmAccount?.fmCode) {
        form.setFieldValue("counterpartyFmCode", fmEntity.fmAccount?.fmCode);
      } else {
        messageApi.warning(
          `Cannot find Counterparty FMCode by ${counterpartyFmId} searched from system`
        );
        form.setFieldValue("counterpartyFmCode", "");
      }
    }
  };

  return (
    <>
      {MessageContext}
      <Form
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
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
        <Form.Item
          label="Counterparty FMID"
          name="counterpartyFmId"
          rules={[{ required: true, message: "please type counterparty fmid" }]}
        >
          <Input
            allowClear
            disabled={formDisabled}
            data-testid={"counterpartyFmIdInput"}
            onPressEnter={handleCounterpartyFinishInput}
          />
        </Form.Item>
        <Form.Item
          label="Counterparty FMCode"
          name="counterpartyFmCode"
          rules={[
            { required: true, message: "please type counterparty fmcode" },
          ]}
        >
          <Input allowClear disabled={formDisabled} />
        </Form.Item>
        <Form.Item
          label="Entity FMID"
          name="entityFmId"
          rules={[{ required: true, message: "please type entity fmid" }]}
        >
          <Select
            allowClear
            disabled={formDisabled}
            onSelect={handleSelectEntityFMID}
            options={BookingEntityNameIdOptions.map((option) => ({
              label: option.value,
              value: option.value,
            }))}
            data-testid={"entityFmIdSelect"}
            showSearch
          />
        </Form.Item>
        <Form.Item
          label="Entity FMCode"
          name="entityFmCode"
          rules={[{ required: true, message: "please type entity fmcode" }]}
        >
          <Select
            allowClear
            disabled={formDisabled}
            onSelect={handleSelectEntityFMCode}
            options={BookingEntityNameIdOptions.map((option) => ({
              label: option.label,
              value: option.label,
            }))}
            showSearch
          />
        </Form.Item>
        <Form.Item
          label="Auto Util"
          name="autoUtil"
          rules={[{ required: true, message: "please type auto util" }]}
        >
          <Select
            disabled={formDisabled}
            options={[
              { label: "YES", value: "YES" },
              { label: "NO", value: "NO" },
            ]}
          />
        </Form.Item>
        <Form.Item
          style={{ marginBottom: 0, textAlign: "center" }}
          wrapperCol={{ span: 24 }}
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
                  data-testid={get_UTILIZATION_STATIC_BLOTTER_AUDIT_BTN(
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
    </>
  );
};
