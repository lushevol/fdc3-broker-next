import { css, styled } from "@mui/material/styles";
import { Button, Form, Input, message, Modal } from "antd";
import cn from "classnames";
import React, { useEffect } from "react";
import type { FormResource } from "src/api";
import { checkFormName } from "src/api/form/Form";
import { createForm, updateForm } from "src/api/index";
import { ReactRouterDom } from "src/Root/import";

const { useNavigate } = ReactRouterDom;
interface CreateFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onNext: (values: any) => void;
  editingForm?: FormResource | null;
}

const StyleRoot = styled("div")(
  () => css`
    .create-form {
      .ant-modal-close-x {
        color: #9ac7f6;
      }
      .ant-modal-title {
        height: 59px;
        line-height: 59px;
        .dark & {
          color: #f2f2f2;
        }
      }
      .ant-modal-header {
        height: 59px;
        margin-bottom: 0;
        margin-left: 24px;
        margin-right: 24px;
      }
    }
  `
);

export const CreateFormModal: React.FC<CreateFormModalProps> = ({
  visible,
  onCancel,
  onNext,
  editingForm,
}) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (!visible) {
      form.resetFields();
      return;
    }

    if (editingForm) {
      form.setFieldsValue({
        name: editingForm.name,
        description: editingForm.description,
      });
      return;
    }

    form.resetFields();
  }, [editingForm, form, visible]);

  const handleNext = () => {
    form
      .validateFields()
      .then((values) => {
        const apiCall = editingForm
          ? updateForm({
              id: editingForm.id,
              name: values.name,
              description: values.description,
            })
          : createForm({
              name: values.name,
              description: values.description,
            });

        apiCall
          .then((res) => {
            message.success(
              editingForm ? "Update Successfully" : "Create Successfully"
            );
            onNext(values);

            if (!editingForm) {
              navigate(
                `/flowzero/form-management/form-designer/?workflowDetail=${encodeURIComponent(
                  JSON.stringify(res)
                )}&from=create`
              );
            }
          })
          .catch((err) => {
            const errorMsg =
              err?.response?.data ||
              (editingForm
                ? "Failed to update form."
                : "Failed to create form.");
            console.error(errorMsg);
          });
      })
      .catch((err) => {
        if (err && err.errorFields) {
          console.error("Validation Failed:", err.errorFields);
        }
      });
  };

  return (
    <StyleRoot>
      <Modal
        title={editingForm ? "Edit Form" : "Create Form"}
        open={visible}
        onCancel={onCancel}
        footer={null}
        width={611}
        className={cn(
          "create-form p-0 rounded-[6px] [&_.ant-modal-content]:p-0 bg-light-container-layer dark:bg-dark-container-layer",
          "[&_.ant-modal-content]:dark:bg-dark-container-layer",
          "[&_.ant-modal-header]:dark:bg-dark-container-layer",
          "[&_.ant-modal-content_.ant-modal-body]:dark:bg-dark-container-layer",
          "[&_.ant-form-item-label>label]:dark:text-dark-content-label-text",
          "[&_.ant-modal-body_input]:dark:border-dark-divide-base [&_.ant-modal-body_input]:dark:text-dark-divide-base [&_.ant-modal-body_.ant-input-affix-wrapper]:dark:border-dark-divide-base [&_.ant-modal-body_.ant-input-affix-wrapper]:dark:text-dark-divide-base",
          "[&_.ant-input-data-count]:dark:text-dark-divide-base"
        )}
        centered
        maskClosable={false}
        getContainer={false}
      >
        <div className="border-b border-light-divide-base dark:border-dark-divide-base  mb-[16px] "></div>
        <Form form={form} layout="vertical">
          <div className="overflow-y-auto pb-[32px] px-[24px]">
            <Form.Item
              label="Form Name"
              name="name"
              rules={[
                { required: true, message: "Please input form name!" },
                {
                  pattern: /^[A-Za-z0-9 ()]{1,200}$/i,
                  message:
                    "Only letters, numbers, spaces, and parentheses () are allowed! Maximum 200 characters allowed.",
                },
                {
                  async validator(_, value) {
                    if (!value) return Promise.resolve();
                    try {
                      const available = await checkFormName({
                        name: value,
                        id: editingForm?.id || "",
                      });
                      if (!available) {
                        return Promise.reject("Form name already exists!");
                      }
                      return Promise.resolve();
                    } catch (e) {
                      return Promise.reject("Failed to validate form name");
                    }
                  },
                },
              ]}
            >
              <Input
                className="dark:bg-dark-container-layer"
                placeholder=""
                maxLength={200}
              />
            </Form.Item>
            <Form.Item
              label={
                <span>
                  Description
                  <span
                    className={
                      "ml-1 text-light-placeholder-text dark:text-dark-placeholder-text text-sm"
                    }
                  >
                    (Optional)
                  </span>
                </span>
              }
              name="description"
              rules={[
                {
                  max: 500,
                  message: "Maximum 500 characters allowed.",
                },
              ]}
            >
              <Input.TextArea
                className="dark:bg-dark-container-layer"
                placeholder=""
                maxLength={500}
                showCount
                style={{ height: 130 }}
              />
            </Form.Item>
          </div>
          <div className="border-b border-light-divide-base dark:border-dark-divide-base"></div>
          <div className="flex justify-end items-center h-16 px-[24px]">
            <Button
              onClick={onCancel}
              className="mr-2 rounded-full text-[#00172E] dark:bg-dark-container-layer dark:text-[#9AC7F6]"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleNext}
              className="rounded-full text-[#FFF] bg-[#0473EA]"
            >
              {editingForm ? "Save" : "Next Step"}
            </Button>
          </div>
        </Form>
      </Modal>
    </StyleRoot>
  );
};
