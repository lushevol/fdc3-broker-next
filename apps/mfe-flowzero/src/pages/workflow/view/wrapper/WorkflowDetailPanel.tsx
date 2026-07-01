import { UploadOutlined } from "@ant-design/icons";
import { css, styled } from "@mui/material/styles";
import headIconFrame from "src/images/RequestLogo.png";
import { useWorkflowDesignerContext } from "src/pages/workflow/viewModel/WorkflowDesignerProvider";
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
import {
  Button,
  Form,
  FormInstance,
  Input,
  Modal,
  Select,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  BusinessAreaItem,
  checkDuplicateWorkflow,
  CountryItem,
  findDictionaryByNames,
  getAllCountries,
} from "src/api";
import DarkInput from "src/components/base/DarkInput";
import DarkSelect from "src/components/base/DarkSelect";
const { Title } = Typography;

const iconList = iconsContext
  .keys()
  .map((key: string) => key.replace("./", ""));

const StyleRoot = styled("div")(
  () => css`
    .workflow-detail-panel {
      padding: 24px;
      width: 100%;
      display: flex;
      flex-direction: column;
      .dark & {
        background: #171d24;
      }
    }
    .workflow-detail-form {
      flex: 1;
      display: flex;
      flex-direction: column;
      .dark & {
        .anticon-close {
          color: #9ac7f6;
        }
        .ant-select-selection-overflow {
          .ant-select-selection-item {
            background: #0d0d0d;
          }
        }

        label {
          color: #b2b2b2;
        }
        .ant-input {
          color: #808080;
          background: #171d24 !important;
          border: 1px solid #737373 !important;
        }
        .ant-select-selector {
          color: #808080;
          background: #171d24 !important;
          border: 1px solid #737373 !important;
        }
      }
      .ant-input-data-count {
        .dark & {
          color: #666666 !important;
        }
      }
    }
    .head-icon-row {
      display: flex;
      align-items: center;
      cursor: pointer;
      min-height: 80px;
    }
    .icon-container {
      position: relative;
      width: 55px;
      height: 55px;
      border-radius: 6px;
      padding: 5px;
    }
    .head-icon-frame {
      width: 45px;
      height: 45px;
      z-index: 1;
    }
    .selected-head-icon {
      width: 45px;
      height: 45px;
      z-index: 2;
    }
    .flowzero-iconfont.icon-edit {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 24px;
      height: 24px;
      font-size: 24px;
      color: #fff;
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 3;
      pointer-events: none;
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
      z-index: 2;
      pointer-events: none;
    }
    .icon-container:hover .icon-edit-bg {
      opacity: 1 !important;
    }
    .icon-container:hover .icon-edit {
      display: flex !important;
    }
    .head-icon-info {
      margin-left: 16px;
    }
    .head-icon-title {
      font-weight: 500;
      font-size: 16px;
    }
    .head-icon-desc {
      color: #888;
      font-size: 12px;
      margin-top: 4px;
    }
    .icon-library-modal {
      position: absolute;
      left: 0;
      top: 90px;
      z-index: 10;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      border-radius: 12px;
      padding: 16px 20px 12px 20px;
      min-width: 300px;
      max-width: 344px;
    }
    .icon-library-header {
      position: relative;
      height: 54px;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      display: flex;
    }
    .icon-library-title {
      width: 100%;
      font-weight: 500;
      font-size: 16px;
    }
    .icon-library-divider {
      height: 1px;
      position: absolute;
      left: -20px;
      right: -20px;
      margin: 8px 0;
      top: 36px;
    }
    .icon-library-close {
      position: absolute;
      top: 0;
      right: 0;
      cursor: pointer;
      font-size: 18px;
      color: #888;
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
      border: 1px solid #cccccc;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-sizing: border-box;
      padding: 0;
      .dark & {
        border: 1px solid #737373;
      }
    }
    .icon-library-item.selected {
      border: 2px solid #1890ff;
    }
    .icon-library-img {
      width: 24px;
      height: 24px;
      border-radius: 2px;
    }
    .workflow-detail-desc {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .workflow-detail-desc-textarea {
      flex: 1;
      resize: none;
    }
    .workflow-detail-delete {
      margin-top: auto;
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

const WorkflowDetailPanel: React.FC<{ form: FormInstance }> = ({ form }) => {
  const { workflowDesignerStore: store } = useWorkflowDesignerContext();
  const [iconLibraryVisible, setIconLibraryVisible] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(
    store?.workflowEntity.icon || null
  );
  const [businessAreaOptions, setBusinessAreaOptions] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [countryOptions, setCountryOptions] = useState<
    Array<{ label: JSX.Element; value: string }>
  >([]);

  const handleIconClick = () => {
    setIconLibraryVisible((v) => !v);
  };

  const handleSelectIcon = (icon: string) => {
    setSelectedIcon(icon);
    if (store) {
      store.setWorkflowEntity({ icon });
    }
  };

  const handleFormChange = (changedValues: any, allValues: any) => {
    if (!store) return;
    store.setWorkflowEntity(changedValues);
  };

  useEffect(() => {
    const fetchBusinessAreaOptions = async () => {
      try {
        const response = await findDictionaryByNames(["businessArea"]);
        let dictionaryData: BusinessAreaItem[] = JSON.parse(
          response[0]?.dictionary
        );
        const areaList = (dictionaryData || []).map((item) => ({
          value: item.value,
          label: item.label,
        }));
        setBusinessAreaOptions(areaList);
      } catch (error) {
        console.error("Failed to fetch business area options:", error);
      }
    };

    const fetchCountryOptions = async () => {
      try {
        const response = await getAllCountries();
        const countryList = response.map((country: CountryItem) => {
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
                    {countryName.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <span>{countryName}</span>
              </div>
            ),
          };
        });
        setCountryOptions(countryList);
      } catch (error) {
        console.error("Failed to fetch country options:", error);
      }
    };

    fetchBusinessAreaOptions();
    fetchCountryOptions();
  }, []);

  return (
    <StyleRoot className="h-full overflow-y-auto">
      <div className="workflow-detail-panel border-l-[#ccc] dark:border-l-[#666666] border-l">
        <Form
          form={form}
          layout="vertical"
          className="workflow-detail-form"
          initialValues={{
            name: store?.workflowEntity.name,
            ownerIds: Array.isArray(store?.workflowEntity.ownerIds)
              ? store?.workflowEntity.ownerIds
              : store?.workflowEntity.ownerIds?.split(",").filter(Boolean) ||
                [],
            countryCodes: Array.isArray(store?.workflowEntity.countryCodes)
              ? store?.workflowEntity.countryCodes
              : store?.workflowEntity.countryCodes
                  ?.split(",")
                  .filter(Boolean) || [],
            description: store?.workflowEntity.description,
            headIcon: store?.workflowEntity.icon,
            businessArea: store?.workflowEntity.businessArea,
          }}
          onValuesChange={handleFormChange}
        >
          <Form.Item
            label="Workflow Name"
            name="name"
            rules={[
              { required: true, message: "Please input  workflow name!" },
              {
                pattern: /^[A-Za-z0-9 ]+$/,
                message: "Only letters, numbers and spaces are allowed!",
              },
            ]}
          >
            <Input
              placeholder="Enter workflow name"
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
                    uniqueProcessId: store?.workflowEntity?.uniqueProcessId,
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
          {/* <Form.Item label="SLA" name="sla">
            <Input placeholder="Enter SLA" />
          </Form.Item> */}
          <Form.Item
            label="Owner"
            name="ownerIds"
            rules={[{ required: true, message: "Please input the owner!" }]}
          >
            <DarkSelect
              placeholder="Enter owner"
              maxCount={5}
              mode={"tags"}
              tokenSeparators={[","]}
              options={[]}
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
              placeholder="Business Area"
              options={businessAreaOptions}
            />
          </Form.Item>
          <Form.Item
            label="Country"
            name="countryCodes"
            rules={[
              {
                required: true,
                message: "Please select at least one country!",
              },
            ]}
          >
            <DarkSelect
              placeholder="Enter Country"
              maxCount={5}
              mode={"tags"}
              tokenSeparators={[","]}
              options={countryOptions}
              loading={countryOptions.length === 0}
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
                <span className="flowzero-iconfont icon-edit" />
                <div className="icon-edit-bg" />
              </div>
              <div className="head-icon-info">
                <div className="head-icon-title dark:text-[#F2F2F2]">
                  Choose an Icon
                </div>
                <div className="head-icon-desc">
                  Select an Icon to represent your workflow on the New Request
                  Page.
                </div>
              </div>
            </div>
            {iconLibraryVisible && (
              <div className="icon-library-modal bg-light-container-layer dark:bg-dark-container-layer">
                <div className="icon-library-header">
                  <div className="icon-library-title dark:text-dark-content-title">
                    Choose an Icon
                  </div>
                  <div className="icon-library-divider bg-light-divide-base dark:bg-dark-divide-base" />
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
                          if (store) store.setWorkflowEntity({ icon: "" });
                          // keep modal open when deselecting
                        } else {
                          handleSelectIcon(icon);
                          setIconLibraryVisible(false);
                        }
                      }}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          if (selectedIcon === icon) {
                            setSelectedIcon(null);
                            if (store) store.setWorkflowEntity({ icon: "" });
                          } else {
                            handleSelectIcon(icon);
                            setIconLibraryVisible(false);
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
            className="workflow-detail-desc"
          >
            <Input.TextArea
              rows={4}
              className="workflow-detail-desc-textarea"
              maxLength={500}
              showCount
            />
          </Form.Item>
          {/* <Form.Item className="workflow-detail-delete">
            <Button type="primary" danger block>
              Delete Workflow
            </Button>
          </Form.Item> */}
        </Form>
      </div>
    </StyleRoot>
  );
};

export default WorkflowDetailPanel;
