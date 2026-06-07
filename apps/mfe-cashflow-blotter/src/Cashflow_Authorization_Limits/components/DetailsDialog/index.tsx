import { Box } from "@mui/material";
import { Form, Input, InputNumber } from "antd";
import { LoadingButton } from "Import/index";
import { FC, useCallback, useEffect, useState } from "react";
import { LimitationActionType } from "src/Cashflow_Authorization_Limits/Main/common/interface";
import {
  AUTHORIZATION_LIMITS_BLOTTER_DETAILS_DIALOG,
  AUTHORIZATION_LIMITS_BLOTTER_DETAILS_DIALOG_SUBMIT_BUTTON,
} from "src/Root/analysis/const";
import { formatePrice } from "src/Root/import/ratanutils";

import { LimitationDetailsDialogProps } from "./interface";
import StyledDialog, { classes } from "./style";

const LABEL_WIDTH = 6;
const CONTENT_WIDTH = 18;
const MAX_AMOUNT = 99999999999;
const MIN_AMOUNT = 0;

const LimitationDetailsDialog: FC<LimitationDetailsDialogProps> = ({
  open,
  data,
  type,
  onClose,
  onSubmit,
}) => {
  const [submiting, setSubmiting] = useState(false);
  const [form] = Form.useForm();
  const handleSubmit = useCallback(async () => {
    const payload = form.getFieldsValue();
    setSubmiting(true);
    await onSubmit(payload);
    setSubmiting(false);
  }, [onSubmit, form]);

  useEffect(() => {
    if (open) {
      form.setFieldsValue(data);
    } else {
      form.resetFields();
    }
  }, [open, data]);

  return (
    <StyledDialog
      title={type}
      open={open}
      onClose={onClose}
      width="400px"
      data-testid={AUTHORIZATION_LIMITS_BLOTTER_DETAILS_DIALOG}
    >
      <Box className={classes.root} sx={{ p: 2 }}>
        <Form
          className={classes.form}
          labelCol={{ span: LABEL_WIDTH }}
          wrapperCol={{ span: CONTENT_WIDTH }}
          form={form}
        >
          <Form.Item
            label="Profile"
            name="profile"
            rules={[{ required: true, message: "Please input profile." }]}
          >
            <Input
              className={classes.formItemContent}
              disabled={type !== LimitationActionType.CREATE}
            />
          </Form.Item>
          <Form.Item
            label="Currency"
            name="currency"
            rules={[{ required: true, message: "Please input currency." }]}
          >
            <Input className={classes.formItemContent} disabled />
          </Form.Item>
          <Form.Item
            label="Limitation"
            name="limitation"
            rules={[{ required: true, message: "Please input limitation." }]}
          >
            <InputNumber
              className={classes.formItemContent}
              disabled={type === LimitationActionType.VIEW}
              formatter={(val) => formatePrice(val ?? "")}
              max={MAX_AMOUNT}
              min={MIN_AMOUNT}
            />
          </Form.Item>
          {type !== LimitationActionType.VIEW && (
            <Form.Item
              wrapperCol={{ offset: LABEL_WIDTH, span: CONTENT_WIDTH }}
            >
              <LoadingButton
                loading={submiting}
                onClick={() => handleSubmit()}
                data-testid={
                  AUTHORIZATION_LIMITS_BLOTTER_DETAILS_DIALOG_SUBMIT_BUTTON
                }
                variant="contained"
              >
                Submit
              </LoadingButton>
            </Form.Item>
          )}
        </Form>
      </Box>
    </StyledDialog>
  );
};

export default LimitationDetailsDialog;
