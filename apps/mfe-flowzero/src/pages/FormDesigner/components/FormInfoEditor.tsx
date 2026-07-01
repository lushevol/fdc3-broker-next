import { CloseOutlined } from "@ant-design/icons";
import { Button, Flex, Form, Input } from "antd";
import cn from "classnames";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { checkFormName } from "src/api/form/Form";

import panelBg from "../images/panelBg.png";
import { useDesignerStore } from "../store";

export const FormInfoEditor: React.FC = observer(() => {
  const store = useDesignerStore();
  const { selectNode } = store;
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      name: store.currentForm?.name ?? "",
      description: store.currentForm?.description ?? "",
    });
  }, [store.currentForm?.id]);

  const handleValuesChange = (
    _: unknown,
    allValues: { name: string; description?: string }
  ) => {
    store.updateCurrentFormInfo(allValues.name, allValues.description);
  };

  return (
    <div
      className={cn(
        "w-80 bg-white border-l border-slate-200 flex flex-col h-full shadow-xl z-30 relative",
        "[&_.ant-form-item-label>label]:!text-light-content-label-text",
        "[&_.ant-form-item-label>label]:!text-[12px]"
      )}
    >
      {/* Header */}
      <div
        className="h-10 px-3 border-slate-200 bg-no-repeat bg-cover bg-center flex items-center"
        style={{ backgroundImage: `url(${panelBg})` }}
      >
        <Flex justify="space-between" align="center" style={{ width: "100%" }}>
          <div className="h-[40px] leading-[40px] font-medium text-[#595959] text-[14px]">
            Form Info
          </div>
          <Button
            type="text"
            icon={<CloseOutlined style={{ fontSize: 12, color: "#012246" }} />}
            onClick={() => selectNode(null)}
          />
        </Flex>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-6 flowzero-custom-scrollbar">
        <Form form={form} layout="vertical" onValuesChange={handleValuesChange}>
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
                      id: store.currentForm?.id || "",
                    });
                    if (!available) {
                      return Promise.reject("Form name already exists!");
                    }
                    return Promise.resolve();
                  } catch {
                    return Promise.reject("Failed to validate form name");
                  }
                },
              },
            ]}
          >
            <Input className="dark:bg-dark-container-layer" maxLength={200} />
          </Form.Item>

          <Form.Item
            label={
              <span>
                Description
                <span className="ml-1 text-light-placeholder-text dark:text-dark-placeholder-text text-sm">
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
              maxLength={500}
              showCount
              style={{ height: 130 }}
            />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
});
