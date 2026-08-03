import { DatePicker, Form, Input } from "antd";
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
  FormRef,
  MultiExceptionsFormNames,
} from "../../common/interface";
import { DateFormat, TimeFormat } from "../../common/dateFormats";
import { layoutSettingContext } from "../Layout/item";
import { AffirmationProps } from "./interface";
import StyledRoot, { classes } from "./style";

const DateTimeFormat = `${DateFormat} ${TimeFormat}`;

const Affirmation = forwardRef<FormRef, AffirmationProps>(
  (
    { data, labelColSpan = 10, wrapperColSpan = 12, formLayout, disabled },
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
        form.setFieldValue("affirmedBy", data ? data.Affirmed_By : "");
        form.setFieldValue("phone_email", data ? data.Phone_Email : "");
        form.setFieldValue(
          "affirmedAt",
          data?.Affirmed_At ? dayjs(data.Affirmed_At) : undefined
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
          name={MultiExceptionsFormNames.AffirmationForm}
          labelCol={{ span: labelColSpan }}
          wrapperCol={{ span: wrapperColSpan }}
          autoComplete="off"
          disabled={layoutSetting.disable || disabled}
          layout={formLayout}
        >
          <Form.Item
            label="Affirmed with"
            name="affirmedBy"
            rules={[
              {
                required: !layoutSetting.disable,
                message: "Affirmed by is required",
              },
              {
                whitespace: true,
                message: "Affirmed by cannot be empty or only whitespace",
              },
            ]}
            {...customValidateStatus["affirmedBy"]}
          >
            <Input placeholder="name" />
          </Form.Item>
          <Form.Item
            label="Email ID/Phone No."
            name="phone_email"
            rules={[
              {
                required: !layoutSetting.disable,
                message: "Contact is required",
              },
              {
                whitespace: true,
                message: "Affirmed by cannot be empty or only whitespace",
              },
            ]}
            {...customValidateStatus["phone_email"]}
          >
            <Input placeholder="contact info" />
          </Form.Item>
          <Form.Item
            label="Date Time"
            name="affirmedAt"
            rules={[
              {
                required: !layoutSetting.disable,
                message: "Affirmed Time is required",
              },
            ]}
            {...customValidateStatus["affirmedAt"]}
          >
            <DatePicker
              format={DateTimeFormat}
              showTime
              placeholder="date time"
            />
          </Form.Item>
        </Form>
      </StyledRoot>
    );
  }
);

export default Affirmation;
