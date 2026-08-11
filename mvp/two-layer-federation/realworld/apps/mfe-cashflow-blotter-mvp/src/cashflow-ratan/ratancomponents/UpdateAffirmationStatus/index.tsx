import React, { FC, useState, useEffect } from "react";
import { Form } from "antd";
import TimePicker from "../../LazyAntd/TimePicker";
import DatePicker from "../../LazyAntd/DatePicker";
import Input from "../../LazyAntd/Input";
import { Button, LoadingButton } from "../../Root/import";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

import { FieldLabel } from "../FieldLabel";
import { MuiDialog } from "../Dialog/indexMuiV1";
import { styled, css } from "@mui/material";

const StyledMuiDialog = styled(MuiDialog)(
  () => css`
    .update-affirmation-status {
      padding-top: 10px;
      .update-affirmation-info {
        display: flex;
        padding-bottom: 10px;
        color: var(--theme-color-btn-disabled-font);
        .label {
          padding-right: 3px;
          width: 200px;
          // font-size: 11px;
          text-align: right;
        }
        .value {
          width: 200px;
          word-wrap: break-word;
        }
      }
      .item {
        margin-bottom: 15px;
      }
      .ant-form-item {
        margin-bottom: 15px;
        .ant-form-item-label {
          width: 200px;
        }
        .operation-btn {
          text-align: right;
          .submit {
            margin-right: 60px;
          }
          .cancel {
            margin-right: 10px;
          }
        }
      }
    }
  `
);

interface UpdateAffirmationStatusProps {
  isOpenAffirmation: boolean;
  onCloseFunction: Function;
  selectedInfo?: any;
  gridEvent: any;
  submit: Function;
}

const INPUT_WIDTH = "200px";
export const UpdateAffirmationStatus: FC<UpdateAffirmationStatusProps> = ({
  isOpenAffirmation,
  onCloseFunction,
  selectedInfo,
  submit,
  gridEvent,
}) => {
  const dateFormat = "YYYY/MM/DD";
  const dateUTCFormat = "YYYY-MM-DD";
  const timeFormat = "HH:mm";

  const [form] = Form.useForm();

  const [date, setDate] = useState<any>();
  const [time, setTime] = useState<any>();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpenAffirmation) {
      resetInput();
      setLoading(false);
    }
  }, [isOpenAffirmation]);

  const resetInput = () => {
    form.resetFields();

    setDate(dayjs().utc().format(dateUTCFormat));
    setTime(dayjs().utc().format(timeFormat));
  };

  const submitForm = async () => {
    setLoading(true);
    try {
      await form.validateFields();
      submit(form, date, time).finally(() => {
        setLoading(false);
      });
    } catch (_e) {
      setLoading(false);
    }
  };

  const onClose = () => {
    if (!isLoading) {
      resetInput();
      gridEvent.api.deselectAll();
      onCloseFunction();
    }
  };

  return (
    <>
      <StyledMuiDialog
        title="Update Affirmation Status"
        open={isOpenAffirmation}
        destoryWhenHidden={!isOpenAffirmation}
        onClose={onClose}
        testId="closeUpdateAffirmationStatus"
        data-testid="update-affirmation-status"
        width="550px"
        height="330px"
      >
        <div
          className="update-affirmation-status"
          data-testid="update-affirmation-status"
        >
          <div className="update-affirmation-info">
            <span className="label">{selectedInfo?.label}</span>
            <span className="value">{selectedInfo?.values}</span>
          </div>
          <Form form={form}>
            <Form.Item
              name="name"
              label="Affirmed with (Name)"
              rules={[
                {
                  required: true,
                  message: "Please enter your name.",
                },
              ]}
            >
              <Input
                style={{ width: INPUT_WIDTH }}
                data-testid="affirmedName"
              />
            </Form.Item>

            <Form.Item
              name="emailOrPhone"
              label="Email ID/Phone No."
              rules={[
                {
                  required: true,
                  message: "Please enter a valid email or phone number.",
                },
              ]}
            >
              <Input
                style={{ width: INPUT_WIDTH }}
                data-testid="affirmedEmail"
              />
            </Form.Item>

            <FieldLabel text="Date:" className="item" labelWidth="200px">
              <DatePicker
                defaultValue={dayjs().utc()}
                format={dateFormat}
                style={{ width: INPUT_WIDTH }}
                onChange={(dates, _dateStrings) => {
                  setDate(dates.format(dateUTCFormat));
                }}
              />
            </FieldLabel>

            <FieldLabel text="Time:" className="item" labelWidth="200px">
              <TimePicker
                defaultValue={dayjs().utc()}
                format={timeFormat}
                style={{ width: INPUT_WIDTH }}
                onChange={(_time, timeString) => {
                  setTime(timeString);
                }}
              />
            </FieldLabel>

            <Form.Item>
              <div className="operation-btn">
                <Button
                  className="cancel"
                  data-testid="update-affirmation-status-cancel"
                  onClick={onClose}
                  disabled={isLoading}
                  color="primary"
                  variant="outlined"
                >
                  Cancel
                </Button>
                <LoadingButton
                  className="submit"
                  data-testid="update-affirmation-status-submit"
                  disabled={isLoading}
                  loading={isLoading}
                  color="primary"
                  variant="contained"
                  onClick={submitForm}
                >
                  Submit
                </LoadingButton>
              </div>
            </Form.Item>
          </Form>
        </div>
      </StyledMuiDialog>
    </>
  );
};
