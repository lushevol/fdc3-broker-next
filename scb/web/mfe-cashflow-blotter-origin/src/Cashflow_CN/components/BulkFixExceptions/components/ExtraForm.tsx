import { Form, Input } from "antd";
import { forwardRef, useImperativeHandle, useRef } from "react";

import Affirmation from "../../CashflowDetails/MultiExceptions/components/Affirmation";
import BackValue from "../../CashflowDetails/MultiExceptions/components/BackValue";
import {
  ExtraFormRef,
  ExtraFormSubmitFormDataType,
  useAffirmationAction,
  useBackValueDateAction,
} from "../hooks/useBulkExtraForm";

type ExtraFormProps = {
  showAffirmationForm: boolean;
  showBackValueDateForm: boolean;
  disabled?: boolean;
  visible?: boolean;
};

export const ExtraForm = forwardRef<ExtraFormRef, ExtraFormProps>(
  (
    { showAffirmationForm, showBackValueDateForm, disabled, visible = true },
    ref
  ) => {
    const [form] = Form.useForm();
    const domRef = useRef<HTMLDivElement>(null);
    const { affirmRef, submitAffirmationForm, validateAffirmationForm } =
      useAffirmationAction();
    const {
      backValueDateRef,
      submitBackValueDateForm,
      validateBackValueDateForm,
    } = useBackValueDateAction();
    useImperativeHandle(
      ref,
      () => {
        return {
          async submit() {
            try {
              const res: ExtraFormSubmitFormDataType = {
                comment: {
                  comment: "",
                },
              };
              if (showAffirmationForm) {
                const affirmFormData = await submitAffirmationForm();
                res.affirmation = affirmFormData;
              }
              if (showBackValueDateForm) {
                const backValueDateFormData = await submitBackValueDateForm();
                res.back_value = backValueDateFormData;
              }
              const formData = form.getFieldsValue();
              res.comment.comment = formData.comment;
              return res;
            } catch (error) {
              domRef.current?.scrollIntoView();
              console.error(error);
              throw error;
            }
          },
          async validate() {
            if (showAffirmationForm) {
              await validateAffirmationForm();
            }
            if (showBackValueDateForm) {
              await validateBackValueDateForm();
            }
            await form.validateFields();
            return true;
          },
        };
      },
      [showAffirmationForm, showBackValueDateForm]
    );
    return (
      <div
        style={{
          display: visible ? "flex" : "none",
          flexDirection: "column",
          rowGap: "10px",
        }}
        ref={domRef}
        data-testid="extra-form"
      >
        {showAffirmationForm ? (
          <Affirmation
            ref={affirmRef}
            data={null}
            labelColSpan={10}
            wrapperColSpan={14}
            disabled={disabled}
            formLayout="inline"
          />
        ) : (
          <></>
        )}
        {showBackValueDateForm ? (
          <BackValue
            ref={backValueDateRef}
            data={null}
            label="Back Value Date"
            labelColSpan={10}
            wrapperColSpan={14}
            disabled={disabled}
            formLayout="inline"
          />
        ) : (
          <></>
        )}
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
