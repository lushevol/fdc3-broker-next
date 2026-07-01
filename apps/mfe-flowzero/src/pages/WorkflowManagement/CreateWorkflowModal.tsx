// @ts-nocheck
// TODO: remove ts-nocheck
import { css, styled } from "@mui/material/styles";
import { Button, Form, Input, message, Modal, Select } from "antd";
import React, { useEffect } from "react";
import {
  checkDuplicateWorkflow,
  createWorkflow,
  findDictionaryByNames,
  getAllCountries,
} from "src/api/index";
import DarkSelect from "src/components/base/DarkSelect";
import headIconFrame from "src/images/RequestLogo.png";
import {
  CommonUtil,
  ReactRouterDom,
  useContainerDispatcher,
} from "src/Root/import";
import { getUser } from "src/util/authenticator";

import { startNode } from "./bpmnTemplate.ts";
const iconsContext = require.context(
  "src/images/workflow_detail_icon",
  false,
  /\.png$/
);
const iconMap: Record<string, string> = {};
iconsContext.keys().forEach((key: string) => {
  const fileName = key.replace("./", "");
  iconMap[fileName] = iconsContext(key);
});
const iconList = iconsContext
  .keys()
  .map((key: string) => key.replace("./", ""));

const grayColor = "#666666";
const darkBgColor = "#262626";

const { useNavigate } = ReactRouterDom;
interface CreateWorkflowModalProps {
  visible: boolean;
  onCancel: () => void;
  onNext: (values: any) => void;
}

const StyleRoot = styled("div")(
  () => css`
    .create-workflow {
      border-radius: 6px;
      .ant-modal-content {
        padding-top: 0;
        padding-bottom: 0;
        padding-left: 0;
        padding-right: 0;
        .dark & {
          background: ${darkBgColor}!important;
          .anticon-close {
            color: #9ac7f6;
          }
          .ant-select-selection-overflow {
            .ant-select-selection-item {
              background: #0d0d0d;
            }
          }
        }
      }
      .ant-modal-close-x {
        color: #9ac7f6;
      }
      .ant-modal-title {
        height: 59px;
        line-height: 59px;
        .dark & {
          color: #f2f2f2;
          background: ${darkBgColor}!important;
        }
      }
      .ant-modal-header {
        height: 59px;
        margin-bottom: 0;
        margin-left: 24px;
        margin-right: 24px;
        .dark & {
          background: #262626 !important;
        }
      }
      .ant-select-selector {
        .dark & {
          color: ${grayColor};
          background: ${darkBgColor}!important;
          border-color: ${grayColor}!important;
        }
      }

      .ant-select-selection-placeholder {
        color: ${grayColor}!important;
      }
      .country-select-dropdown {
        .dark & {
          color: ${grayColor}!important;
          background: ${darkBgColor}!important;
        }

        .ant-select-item-option-selected {
          .dark & {
            //  background:${grayColor}!important;
          }
        }

        .ant-select-item-option-content {
          .dark & {
            color: ${grayColor}!important;
          }
        }
      }
      .ant-modal-body {
        .dark & {
          background: ${darkBgColor}!important;
        }
        .ant-form-item-label > label {
          .dark & {
            color: #b2b2b2;
          }
        }
        input {
          .dark & {
            border-color: ${grayColor};
            color: ${grayColor}!important;
          }
        }
        .ant-input-affix-wrapper {
          .dark & {
            border-color: ${grayColor};
            color: ${grayColor}!important;
          }
        }
      }
      .ant-input-data-count {
        .dark & {
          color: ${grayColor}!important;
        }
      }
      .head-icon-row {
        display: flex;
        align-items: center;
        cursor: pointer;
        min-height: 55px;
      }
      .icon-container {
        position: relative;
        width: 55px;
        height: 55px;
        border-radius: 6px;
        padding: 5px;
        flex-shrink: 0;
      }
      .head-icon-frame,
      .selected-head-icon {
        width: 45px;
        height: 45px;
      }
      .icon-edit-bg {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 45px;
        height: 45px;
        background: #33333380;
        border-radius: 6px;
        opacity: 0;
        pointer-events: none;
      }
      .icon-container:hover .icon-edit-bg {
        opacity: 1 !important;
      }
      .head-icon-info {
        margin-left: 16px;
      }
      .head-icon-title {
        font-weight: 500;
        font-size: 14px;
      }
      .head-icon-desc {
        color: #888;
        font-size: 12px;
        margin-top: 4px;
      }
      .icon-library-inline {
        background: #fff;
        border-radius: 8px;
        border: 1px solid #eee;
        padding: 12px 16px;
        margin-top: 8px;
        .dark & {
          background: ${darkBgColor};
          border-color: ${grayColor};
        }
      }
      .icon-library-header-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 8px;
        border-bottom: 1px solid #ccc;
        .dark & {
          border-bottom: 1px solid #666;
        }
        margin-bottom: 12px;
      }
      .icon-library-title {
        font-weight: 500;
        font-size: 14px;
      }
      .icon-library-close {
        cursor: pointer;
        font-size: 16px;
        color: #888;
        &:hover {
          color: #333;
        }
      }
      .icon-library-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 12px;
        justify-items: center;
        align-items: center;
      }
      .icon-library-item {
        width: 32px;
        height: 32px;
        border: 1px solid #ccc;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-sizing: border-box;
        .dark & {
          border: 1px solid #737373;
        }
        &.selected {
          border: 2px solid #1890ff;
        }
        &:hover {
          border-color: #0473ea;
        }
      }
      .icon-library-img {
        width: 24px;
        height: 24px;
      }
      .icon-library-popup {
        position: fixed;
        z-index: 1050;
        border-radius: 8px;
        padding: 12px 16px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
        min-width: 300px;
      }
    }
  `
);
// Flag mapping for country options
const flagMap: Record<string, string> = {
  China: require("src/images/flag/China.svg"),
  "United Kingdom": require("src/images/flag/UK.svg"),
  Singapore: require("src/images/flag/Singapore.svg"),
  "United States": require("src/images/flag/United States.svg"),
  Thailand: require("src/images/flag/Thailand.svg"),
};

export const CreateWorkflowModal: React.FC<CreateWorkflowModalProps> = ({
  visible,
  onCancel,
  onNext,
}) => {
  const [form] = Form.useForm();
  const [countries, setCountries] = React.useState([]);
  const [businessAreas, setBusinessAreas] = React.useState([]);
  const { id } = getUser();
  const { addWorkspace } = useContainerDispatcher();
  const { uuidv4 } = CommonUtil;
  const navigate = useNavigate();
  const [iconLibraryVisible, setIconLibraryVisible] = React.useState(false);
  const [selectedIcon, setSelectedIcon] = React.useState<string | null>(null);

  const handleIconClick = () => {
    setIconLibraryVisible((v) => !v);
  };

  const handleSelectIcon = (icon: string) => {
    setSelectedIcon(icon);
    setIconLibraryVisible(false);
  };

  useEffect(() => {
    if (visible) {
      getAllCountries()
        .then((res) => {
          const countryOptions = res.map((country) => {
            const countryName = country.shortName;
            const flagSrc = flagMap[countryName] || null;
            return {
              value: countryName,
              label: (
                <div className="flex items-center gap-2">
                  {flagSrc ? (
                    <img
                      src={flagSrc}
                      alt={countryName}
                      className="w-5 h-5 rounded object-cover"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px] font-medium">
                      {countryName}
                    </div>
                  )}
                  <span>{countryName}</span>
                </div>
              ),
            };
          });
          setCountries(countryOptions);
        })
        .catch((err) => {
          console.error("Failed to fetch countries:", err);
          message.error("Failed to load countries.");
        });

      findDictionaryByNames(["businessArea"])
        .then((res) => {
          let dictionaryData = JSON.parse(res[0]?.dictionary);
          const areaList = (dictionaryData || []).map((item) => ({
            value: item.value,
            label: item.label || item.name,
          }));
          setBusinessAreas(areaList);
        })
        .catch((err) => {
          console.error("Failed to fetch business areas:", err);
          message.error("Failed to load business areas.");
        });
    }
    return () => form.resetFields();
  }, [visible]);

  const toDetail = (res) => {
    let workflowDetail = encodeURIComponent(JSON.stringify(res));
    navigate(
      `/flowzero/workflow-management/NewWorkflow/?workflowDetail=${workflowDetail}&from=create`
    );
  };
  const handleNext = () => {
    form
      .validateFields()
      .then((values) => {
        createWorkflow({
          name: values.name,
          version: "",
          countryCodes: Array.isArray(values.countryCode)
            ? values.countryCode.join(",")
            : values.countryCode,
          createdBy: id,
          description: values.description,
          businessArea: values.businessArea,
          icon: selectedIcon || "",
          content: startNode,
        })
          .then((res) => {
            message.success("Create Successfully");
            onNext(values);
            toDetail(res);
          })
          .catch((err) => {
            const errorMsg =
              err?.response?.data || "Failed to create workflow.";
            // message.error(errorMsg);
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
        title="Create Workflow"
        open={visible}
        onCancel={onCancel}
        footer={null}
        width={611}
        styles={{ body: { background: "#fff" } }}
        className="create-workflow bg-light-container-layer dark:bg-dark-container-layer"
        centered
        maskClosable={false}
        getContainer={false}
      >
        <div className="border-b border-[#ccc] dark:border-[#666]  mb-[16px] "></div>
        <Form form={form} layout="vertical">
          <div
            className="overflow-y-auto pb-[32px] px-[24px]"
            style={{ maxHeight: "436px" }}
          >
            <Form.Item
              label="Workflow Name"
              name="name"
              rules={[
                { required: true, message: "Please input workflow name!" },
                {
                  pattern: /^[A-Za-z0-9 ]+$/,
                  message: "Only letters, numbers and spaces are allowed!",
                },
              ]}
            >
              <Input
                className="dark:bg-dark-container-layer "
                placeholder=""
                onBlur={async (e) => {
                  const rawValue = e.target.value;
                  const trimmedValue = rawValue.trim();
                  const fieldError = form.getFieldError("name");
                  if (rawValue !== trimmedValue) {
                    form.setFieldsValue({ name: trimmedValue });
                    form.validateFields(["name"]).catch(() => {});
                    handleFormChange(
                      { name: trimmedValue },
                      form.getFieldsValue()
                    );
                  }
                  if (!trimmedValue || (fieldError && fieldError.length > 0))
                    return;
                  try {
                    const isDuplicate = !(await checkDuplicateWorkflow({
                      name: trimmedValue,
                    }));
                    if (isDuplicate) {
                      form.setFields([
                        {
                          name: "name",
                          errors: ["Workflow name already exists!"],
                        },
                      ]);
                    }
                  } catch (err) {
                    // Optionally handle error
                  }
                }}
                maxLength={200}
              />
            </Form.Item>
            <Form.Item
              label="Business Area"
              name="businessArea"
              rules={[
                { required: true, message: "Please select a business area!" },
              ]}
            >
              <DarkSelect
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                className="dark:bg-dark-container-layer"
                placeholder="Select business area"
                options={businessAreas}
                loading={businessAreas.length === 0}
              />
            </Form.Item>
            <Form.Item
              label="Country"
              name="countryCode"
              rules={[
                {
                  required: true,
                  message: "Please select at least one country!",
                },
              ]}
            >
              <DarkSelect
                mode="multiple"
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                className="dark:bg-dark-container-layer"
                placeholder="Select countries"
                dropdownClassName="country-select-dropdown"
                options={countries}
                loading={countries.length === 0}
              />
            </Form.Item>
            <Form.Item label="Icon" name="headIcon">
              <div
                className="head-icon-row"
                onClick={handleIconClick}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleIconClick();
                }}
              >
                <div
                  className="icon-container"
                  style={{
                    position: "relative",
                    border: iconLibraryVisible ? "1px solid #035CBB" : "none",
                  }}
                >
                  {!selectedIcon && (
                    <img
                      src={headIconFrame}
                      alt="Head Icon Frame"
                      className="head-icon-frame"
                    />
                  )}
                  {selectedIcon && (
                    <img
                      src={iconMap[selectedIcon]}
                      alt="Selected Icon"
                      className="selected-head-icon"
                    />
                  )}
                  <div className="icon-edit-bg" />

                  {iconLibraryVisible && (
                    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                    <div
                      className="icon-library-popup bg-light-container-layer dark:bg-dark-container-layer"
                      style={{ position: "absolute", top: "60px", left: "0px" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="icon-library-header-row">
                        <div className="icon-library-title dark:text-dark-content-title">
                          Choose an Icon
                        </div>
                        <div
                          className="icon-library-close"
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            setIconLibraryVisible(false);
                          }}
                          onKeyPress={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              setIconLibraryVisible(false);
                            }
                          }}
                        >
                          &#10005;
                        </div>
                      </div>
                      <div className="icon-library-grid">
                        {iconList.map((icon) => (
                          <div
                            key={icon}
                            className={`icon-library-item${
                              selectedIcon === icon ? " selected" : ""
                            }`}
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (selectedIcon === icon) {
                                setSelectedIcon(null);
                              } else {
                                handleSelectIcon(icon);
                              }
                            }}
                            onKeyPress={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                if (selectedIcon === icon) {
                                  setSelectedIcon(null);
                                } else {
                                  handleSelectIcon(icon);
                                }
                              }
                            }}
                          >
                            <img
                              src={iconMap[icon]}
                              alt={icon}
                              className="icon-library-img"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="head-icon-info">
                  <div className="head-icon-title  dark:text-[#F2F2F2]">
                    Choose an Icon
                  </div>
                  <div className="head-icon-desc">
                    Select an Icon to represent your workflow on the New Request
                    Page.
                  </div>
                </div>
              </div>
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
              rules={[{ message: "Please input description!" }]}
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
          <div className="border-b border-[#ccc] dark:border-[#666]"></div>
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
              Next Step
            </Button>
          </div>
        </Form>
      </Modal>
    </StyleRoot>
  );
};
