import { DatePicker, Form } from "antd";
import dayjs from "dayjs";
import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

import {
  AntFormCustomValidate,
  MultiExceptionsFormNames,
} from "../../common/interface";
import { DateFormat } from "../../common/utils";
import { layoutSettingContext } from "../Layout/item";
import { BackValueProps } from "./interface";
import StyledRoot, { classes } from "./style";

const BackValue = forwardRef(
  (
    {
      data,
      labelColSpan,
      wrapperColSpan = 24,
      label,
      formLayout,
      disabled,
    }: BackValueProps,
    ref
  ) => {
    const [form] = Form.useForm();
    const [customValidateStatus, setCustomValidateStatus] = useState<{
      [n: string]: AntFormCustomValidate;
    }>({});
    const layoutSetting = useContext(layoutSettingContext);
    useImperativeHandle(
      ref,
      () => {
        return {
          getForm() {
            return form;
          },
          setValidateStatus(vs: { [field: string]: AntFormCustomValidate }) {
            setCustomValidateStatus(vs);
          },
          clearValidateStatus() {
            setCustomValidateStatus({});
          },
        };
      },
      [form]
    );
    useEffect(() => {
      try {
        form.setFieldValue(
          "swiftPaymentDate",
          data?.swiftPaymentDate ? dayjs(data.swiftPaymentDate) : undefined
        );
      } catch (err) {
        console.error(err);
      }
    }, [data]);
    return (
      <StyledRoot className={classes.root}>
        <Form
          form={form}
          initialValues={data ?? {}}
          name={MultiExceptionsFormNames.BackvalueForm}
          labelCol={{ span: labelColSpan }}
          wrapperCol={{ span: wrapperColSpan }}
          autoComplete="off"
          disabled={layoutSetting.disable || disabled}
          layout={formLayout}
        >
          <Form.Item
            label={label}
            name="swiftPaymentDate"
            rules={[
              {
                required: !layoutSetting.disable,
                message: "Back Value Date is required",
              },
            ]}
            {...customValidateStatus["swiftPaymentDate"]}
          >
            <DatePicker format={DateFormat} placeholder="Back Value Date" />
          </Form.Item>
        </Form>
      </StyledRoot>
    );
  }
);

export default BackValue;
