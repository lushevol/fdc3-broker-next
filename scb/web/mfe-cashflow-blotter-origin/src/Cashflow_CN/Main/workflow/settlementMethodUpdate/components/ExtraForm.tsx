import { Form, Input } from "antd";
import { forwardRef, useImperativeHandle, useRef } from "react";

import { ExtraFormRef, ExtraFormSubmitFormDataType } from "../type";

type ExtraFormProps = {
  disabled?: boolean;
};

export const ExtraForm = forwardRef<ExtraFormRef, ExtraFormProps>(
  ({ disabled }, ref) => {
    const [form] = Form.useForm();
    const domRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(
      ref,
      () => {
        return {
          submit() {
            try {
              const res: ExtraFormSubmitFormDataType = {
                comment: "",
              };
              const formData = form.getFieldsValue();
              res.comment = formData.comment;
              return res;
            } catch (error) {
              domRef.current?.scrollIntoView();
              console.error(error);
              throw error;
            }
          },
        };
      },
      []
    );

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          rowGap: "10px",
        }}
        ref={domRef}
        data-testid="extra-form"
      >
        <Form form={form} layout="vertical" disabled={disabled}>
          <Form.Item name="comment">
            <Input.TextArea
              className="add-comment-area"
              rows={2}
              placeholder="Please type in comment."
            />
          </Form.Item>
        </Form>
      </div>
    );
  }
);

ExtraForm.displayName = "ExtraForm";
