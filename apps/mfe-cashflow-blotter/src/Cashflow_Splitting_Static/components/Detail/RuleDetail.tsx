import {
  AutoComplete,
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Space,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { trimObject } from "src/Cashflow_CN/components/CashflowDetails/MultiExceptions/common/utils";
import { useMutationActionApi } from "src/Cashflow_Splitting_Static/hooks/useActionApi";
import {
  SplittingRuleMutation,
  StaticRuleRow,
} from "src/Cashflow_Splitting_Static/services/api.type";
import {
  closeDialog,
  DetailMode,
} from "src/Cashflow_Splitting_Static/store/detail.slice";
import {
  resetPageNo,
  updateRowDataAfterMutation,
} from "src/Cashflow_Splitting_Static/store/pagination.slice";
import { get_AUTO_SPLIT_STATIC_BLOTTER_AUDIT_BTN } from "src/Root/analysis/const";
import { plattenStr } from "src/Root/analysis/utils";

import { ActionType } from "../../state/types";
import { useAppDispatch, useAppSelector } from "../../store";
import { useDetailsFormItems } from "./useDetailsFormItems";

export const RuleDetail = () => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm<StaticRuleRow | SplittingRuleMutation>();
  const { detailData, actions, mode } = useAppSelector((state) => state.detail);
  const [submitting, setSubmitting] = useState(false);
  const { mutation } = useMutationActionApi();
  const { validateAmount, validateLimitation, currencyOptions } =
    useDetailsFormItems(form);
  const [messageApi, messageContextHolder] = message.useMessage();
  const thresholdData = Form.useWatch("threshold", form);
  const limitationData = Form.useWatch("limitation", form);
  const amountData = Form.useWatch("amount", form);

  const handleSubmit = async (action: ActionType) => {
    try {
      setSubmitting(true);
      await form.validateFields();
      const formData = form.getFieldsValue();
      trimObject(formData);

      if (!formData?.nostroAgent || formData?.nostroAgent === "") {
        formData.nostroAgent = "ALL";
      }

      if (!formData?.entityFmId || formData?.entityFmId === "") {
        formData.entityFmId = "ALL";
      }

      const res = await mutation(action, formData as StaticRuleRow);
      if (res.status === 200) {
        messageApi.success(res.errorMessage);
        if (formData.hasOwnProperty("id")) {
          dispatch(updateRowDataAfterMutation(formData as StaticRuleRow));
        } else {
          dispatch(resetPageNo());
        }
        dispatch(closeDialog());
      } else {
        messageApi.error(res.errorMessage);
      }
    } catch (error) {
      console.log(error);
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
  }, [actions]);

  const processedDetailData = useMemo(() => {
    const newDetail = {
      ...detailData,
      nostroAgent:
        detailData?.nostroAgent === "ALL" ? "" : detailData?.nostroAgent,
      entityFmId:
        detailData?.entityFmId === "ALL" ? "" : detailData?.entityFmId,
    };
    return newDetail;
  }, [detailData]);

  useEffect(() => {
    if (amountData !== undefined && amountData !== null && amountData !== "") {
      form.validateFields(["amount"]);
    }
  }, [thresholdData, limitationData, amountData]);

  return (
    <Form
      form={form}
      labelCol={{ style: { width: 200 } }}
      wrapperCol={{ style: { width: 100 } }}
      data-testid="rule-detail"
      initialValues={processedDetailData}
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
      <Form.Item label="Booking Entity FMID" name="entityFmId">
        <Input
          allowClear
          disabled={formDisabled}
          data-testid={"entityFmIdInput"}
        />
      </Form.Item>
      <Form.Item label="Booking Entity FM CODE" name="entityFmCode">
        <Input allowClear disabled={formDisabled} />
      </Form.Item>
      <Form.Item
        label="Nostro Agent"
        name="nostroAgent"
        rules={[
          {
            validator: (_, value) => {
              if (
                value === undefined ||
                value === null ||
                value === "" ||
                /^.{8}$/.test(value) ||
                /^.{11}$/.test(value)
              ) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error("Nostro Agent must be 8 or 11 characters")
              );
            },
          },
        ]}
      >
        <Input
          allowClear
          disabled={formDisabled}
          data-testid={"nostroAgentInput"}
        />
      </Form.Item>
      <Form.Item
        label="Currency"
        name="currency"
        rules={[{ required: true, message: "Please select currency" }]}
      >
        <AutoComplete
          allowClear
          disabled={formDisabled}
          options={currencyOptions}
          filterOption={false}
        />
      </Form.Item>
      <Form.Item
        label="Threshold"
        name="threshold"
        rules={[{ required: true, message: "Please type Threshold" }]}
      >
        <InputNumber
          disabled={formDisabled}
          style={{ width: "100%" }}
          min={0}
          step={1}
          stringMode
        />
      </Form.Item>
      <Form.Item
        label="Amount"
        name="amount"
        rules={[
          { required: true, message: "Please type Amount" },
          { validator: validateAmount },
        ]}
      >
        <InputNumber
          disabled={formDisabled}
          style={{ width: "100%" }}
          min={0}
          step={1}
        />
      </Form.Item>
      <Form.Item
        label="Limitation"
        name="limitation"
        rules={[
          { required: true, message: "Please type Limitation" },
          { validator: validateLimitation },
        ]}
      >
        <InputNumber
          disabled={formDisabled}
          style={{ width: "100%" }}
          min={0}
          step={1}
        />
      </Form.Item>
      <Space style={{ width: "100%", justifyContent: "right" }}>
        {actions.map((a, index) => (
          <Popconfirm
            key={`${a.action}_${index}`}
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
              data-testid={get_AUTO_SPLIT_STATIC_BLOTTER_AUDIT_BTN(
                plattenStr(a.action)
              )}
              {...a}
            >
              {a.action}
            </Button>
          </Popconfirm>
        ))}
      </Space>
      {messageContextHolder}
    </Form>
  );
};
