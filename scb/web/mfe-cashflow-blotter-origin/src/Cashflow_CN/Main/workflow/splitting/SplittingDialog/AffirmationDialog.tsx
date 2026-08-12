import { DatePicker, Form, FormInstance, Input } from "antd";
import { LoadingButton } from "Import/index";
import { MuiDialog } from "Import/ratancomponents";
import { FC } from "react";

const INPUT_WIDTH = "200px";

interface AffirmationDialogProps {
  open: boolean;
  onClose: () => void;
  form: FormInstance;
  loading: boolean;
  onSubmit: () => void;
}

export const AffirmationDialog: FC<AffirmationDialogProps> = ({
  open,
  onClose,
  form,
  loading,
  onSubmit,
}) => (
  <MuiDialog
    open={open}
    onClose={onClose}
    title="Update Affirmation"
    width="400px"
    height="280px"
    enableResize
    inside
    actions={
      <LoadingButton
        className="btn"
        variant="contained"
        size="medium"
        onClick={onSubmit}
        data-testid="CASHFLOW_BLOTTER_SPLITTING_DIALOG_NET_SUBMIT_BTN"
        loading={loading}
      >
        Submit
      </LoadingButton>
    }
  >
    <div
      className="update-affirmation-status"
      data-testid="update-affirmation-status"
    >
      <Form
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 14 }}
        form={form}
        autoComplete="off"
      >
        <Form.Item
          name="affirmedBy"
          label="Affirmed with (Name)"
          rules={[{ required: true, message: "Please enter your name." }]}
        >
          <Input style={{ width: INPUT_WIDTH }} data-testid="affirmedName" />
        </Form.Item>
        <Form.Item
          name="phone_email"
          label="Email ID/Phone No."
          rules={[
            {
              required: true,
              message: "Please enter a valid email or phone number.",
            },
          ]}
        >
          <Input style={{ width: INPUT_WIDTH }} data-testid="affirmedEmail" />
        </Form.Item>
        <Form.Item
          name="affirmedAt"
          label="Date Time"
          rules={[{ required: true, message: "Please select date time" }]}
        >
          <DatePicker showTime data-testid="affirmedAt" />
        </Form.Item>
      </Form>
    </div>
  </MuiDialog>
);
