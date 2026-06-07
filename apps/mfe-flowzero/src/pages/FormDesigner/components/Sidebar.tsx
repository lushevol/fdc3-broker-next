import {
  CloseCircleFilled,
  CloseOutlined,
  CodeSandboxOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import React, { useMemo, useState } from "react";

import { componentDSLs } from "../dsl/components";
import checkboxIcon from "../images/FormComponent/Checkbox.png";
import containerIcon from "../images/FormComponent/Container.png";
import datePickerIcon from "../images/FormComponent/DatePicker.png";
import dropdownIcon from "../images/FormComponent/Dropdown.png";
import inputBoxIcon from "../images/FormComponent/InputBox.png";
import inputNumberIcon from "../images/FormComponent/InputNumber.png";
import radioIcon from "../images/FormComponent/Radio.png";
import switchIcon from "../images/FormComponent/Switch.png";
import tabIcon from "../images/FormComponent/Tab.png";
import textIcon from "../images/FormComponent/Text.png";
import textAreaIcon from "../images/FormComponent/TextArea.png";
import timePickerIcon from "../images/FormComponent/TimePicker.png";
import titleIcon from "../images/FormComponent/Title.png";
import panelBg from "../images/panelBg.png";
import { useDesignerStore } from "../store";
import { ComponentType } from "../types";
import { FieldsImportModal } from "./FieldsImportModal";
import { FieldsTabContent } from "./FieldsTabContent";
import { SidebarItem } from "./SidebarItem";

const sectionTitleClassName =
  "text-[12px] leading-4 font-bold text-[#737373] tracking-normal mb-4";
const itemImageClassName = "w-[36px] h-[36px]";
type SidebarTab = "elements" | "fields";

type SidebarPaletteType =
  | ComponentType.CONTAINER
  | ComponentType.TEXT
  | ComponentType.TITLE
  | ComponentType.TABS
  | ComponentType.INPUT
  | ComponentType.INPUT_NUMBER
  | ComponentType.DATE_PICKER
  | ComponentType.TIME_PICKER
  | ComponentType.TEXTAREA
  | ComponentType.SELECT
  | ComponentType.MULTI_SELECT
  | ComponentType.CHECKBOX
  | ComponentType.RADIO
  | ComponentType.SWITCH;

interface SidebarPaletteItem {
  id: string;
  type: SidebarPaletteType;
  label: string;
  icon: React.ReactNode;
}

const layoutItems: SidebarPaletteItem[] = [
  {
    id: "layout-container",
    type: ComponentType.CONTAINER,
    label: componentDSLs[ComponentType.CONTAINER].displayName,
    icon: (
      <img
        src={containerIcon}
        alt="Container"
        className={itemImageClassName}
        draggable={false}
      />
    ),
  },
  {
    id: "layout-text",
    type: ComponentType.TEXT,
    label: componentDSLs[ComponentType.TEXT].displayName,
    icon: (
      <img
        src={textIcon}
        alt="Text"
        className={itemImageClassName}
        draggable={false}
      />
    ),
  },
  {
    id: "layout-title",
    type: ComponentType.TITLE,
    label: componentDSLs[ComponentType.TITLE].displayName,
    icon: (
      <img
        src={titleIcon}
        alt="Title"
        className={itemImageClassName}
        draggable={false}
      />
    ),
  },
  {
    id: "layout-tabs",
    type: ComponentType.TABS,
    label: componentDSLs[ComponentType.TABS].displayName,
    icon: (
      <img
        src={tabIcon}
        alt="Tab"
        className={itemImageClassName}
        draggable={false}
      />
    ),
  },
];

const formControlItems: SidebarPaletteItem[] = [
  {
    id: "control-input-box",
    type: ComponentType.INPUT,
    label: componentDSLs[ComponentType.INPUT].displayName,
    icon: (
      <img
        src={inputBoxIcon}
        alt="Input Box"
        className={itemImageClassName}
        draggable={false}
      />
    ),
  },
  {
    id: "control-number-input",
    type: ComponentType.INPUT_NUMBER,
    label: componentDSLs[ComponentType.INPUT_NUMBER].displayName,
    icon: (
      <img
        src={inputNumberIcon}
        alt="Number Input"
        className={itemImageClassName}
        draggable={false}
      />
    ),
  },
  {
    id: "control-switch",
    type: ComponentType.SWITCH,
    label: componentDSLs[ComponentType.SWITCH].displayName,
    icon: (
      <img
        src={switchIcon}
        alt="Switch"
        className={itemImageClassName}
        draggable={false}
      />
    ),
  },
  {
    id: "control-radio",
    type: ComponentType.RADIO,
    label: componentDSLs[ComponentType.RADIO].displayName,
    icon: (
      <img
        src={radioIcon}
        alt="Radio"
        className={itemImageClassName}
        draggable={false}
      />
    ),
  },
  {
    id: "control-checkbox",
    type: ComponentType.CHECKBOX,
    label: componentDSLs[ComponentType.CHECKBOX].displayName,
    icon: (
      <img
        src={checkboxIcon}
        alt="Checkbox"
        className={itemImageClassName}
        draggable={false}
      />
    ),
  },
  {
    id: "control-text-area",
    type: ComponentType.TEXTAREA,
    label: componentDSLs[ComponentType.TEXTAREA].displayName,
    icon: (
      <img
        src={textAreaIcon}
        alt="Text Area"
        className={itemImageClassName}
        draggable={false}
      />
    ),
  },
  {
    id: "control-date-picker",
    type: ComponentType.DATE_PICKER,
    label: componentDSLs[ComponentType.DATE_PICKER].displayName,
    icon: (
      <img
        src={datePickerIcon}
        alt="Date Picker"
        className={itemImageClassName}
        draggable={false}
      />
    ),
  },
  {
    id: "control-time-picker",
    type: ComponentType.TIME_PICKER,
    label: componentDSLs[ComponentType.TIME_PICKER].displayName,
    icon: (
      <img
        src={timePickerIcon}
        alt="Time Picker"
        className={itemImageClassName}
        draggable={false}
      />
    ),
  },
  {
    id: "control-dropdown",
    type: ComponentType.SELECT,
    label: componentDSLs[ComponentType.SELECT].displayName,
    icon: (
      <img
        src={dropdownIcon}
        alt="Dropdown"
        className={itemImageClassName}
        draggable={false}
      />
    ),
  },
  {
    id: "control-multi-dropdown",
    type: ComponentType.MULTI_SELECT,
    label: componentDSLs[ComponentType.MULTI_SELECT].displayName,
    icon: (
      <img
        src={dropdownIcon}
        alt="Dropdown"
        className={itemImageClassName}
        draggable={false}
      />
    ),
  },
];

const sidebarSections: Array<{
  title: string;
  gridClassName: string;
  items: SidebarPaletteItem[];
}> = [
  {
    title: "Layout",
    gridClassName: "grid grid-cols-3 gap-3",
    items: layoutItems,
  },
  {
    title: "Form Control",
    gridClassName: "grid grid-cols-3 gap-3",
    items: formControlItems,
  },
];

export const Sidebar: React.FC = observer(() => {
  const store = useDesignerStore();
  const [activeTab, setActiveTab] = useState<SidebarTab>("elements");
  const [keyword, setKeyword] = useState("");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const filteredSidebarSections = useMemo(() => {
    const searchKey = keyword.trim().toLowerCase();

    if (!searchKey) {
      return sidebarSections;
    }

    return sidebarSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) =>
          item.label.toLowerCase().includes(searchKey)
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [keyword]);

  return (
    <div className="flex h-full overflow-hidden bg-white">
      <div className="flex w-[56px] shrink-0 flex-col items-center border-r border-slate-200 bg-white py-3">
        <button
          type="button"
          onClick={() => {
            if (!isPanelOpen) {
              setActiveTab("elements");
              setIsPanelOpen(true);
              return;
            }

            if (activeTab !== "elements") {
              setActiveTab("elements");
              return;
            }

            setIsPanelOpen(false);
          }}
          aria-label={
            isPanelOpen ? "Collapse elements panel" : "Open elements panel"
          }
          className={`mt-1 inline-flex h-10 w-10 items-center justify-center rounded-xl text-[18px] transition-all ${
            isPanelOpen
              ? "bg-[#e6f4ff] text-[#434343]"
              : "bg-transparent text-[#434343] hover:bg-slate-50"
          }`}
        >
          <span className="flowzero-iconfont icon-cube-3D"></span>
        </button>
      </div>

      <div
        className={`flex h-full min-w-0 flex-col overflow-hidden bg-white transition-[width,opacity,border-color] duration-200 ${
          isPanelOpen
            ? "w-[228px] border-r border-slate-200 opacity-100"
            : "w-0 border-r-0 opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="border-b border-slate-200 bg-center bg-cover bg-no-repeat p-4"
          style={{ backgroundImage: `url(${panelBg})` }}
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("elements")}
              className={`text-[14px] leading-5 transition-colors ${
                activeTab === "elements"
                  ? "font-semibold text-[#4d4d4d]"
                  : "font-medium text-[#737373]"
              }`}
            >
              Elements
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("fields")}
              className={`text-[14px] leading-5 transition-colors ${
                activeTab === "fields"
                  ? "font-semibold text-[#4d4d4d]"
                  : "font-medium text-[#737373]"
              }`}
            >
              Fields
            </button>
            <button
              type="button"
              onClick={() => setIsPanelOpen(false)}
              aria-label="Close sidebar panel"
              className="ml-auto inline-flex h-5 w-5 items-center justify-center rounded-full text-[#012246] "
            >
              <CloseOutlined style={{ fontSize: 12 }} />
            </button>
          </div>
          <div className="mt-2 flex min-w-0 items-center gap-2">
            <div className="flex h-8 min-w-0 flex-1 items-center gap-2 rounded-full border border-[#cccccc] bg-white px-3">
              <input
                type="text"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder={
                  activeTab === "fields"
                    ? "Search the fields"
                    : "Search the elements"
                }
                className="h-full min-w-0 flex-1 bg-transparent text-xs text-[#4d4d4d] outline-none placeholder:text-[#b2b2b2]"
              />
              {keyword ? (
                <CloseCircleFilled
                  style={{ fontSize: 16, color: "#bfbfbf", cursor: "pointer" }}
                  onClick={() => setKeyword("")}
                />
              ) : (
                <SearchOutlined style={{ fontSize: 16, color: "#4d4d4d" }} />
              )}
            </div>
            {activeTab === "fields" && (
              <button
                type="button"
                onClick={() => setIsImportModalOpen(true)}
                aria-label="Import fields"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#d9d9d9] bg-[#f5f5f5] text-[#595959] hover:border-[#1677ff] hover:text-[#1677ff]"
              >
                <span
                  className="flowzero-iconfont icon-arrow-upload"
                  style={{ fontSize: 16 }}
                />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-4 flowzero-custom-scrollbar">
          {activeTab === "elements" ? (
            filteredSidebarSections.map((section) => (
              <div key={section.title}>
                <h3 className={sectionTitleClassName}>{section.title}</h3>
                <div className={section.gridClassName}>
                  {section.items.map((item) => (
                    <SidebarItem
                      key={item.id}
                      dragId={`sidebar-${item.id}`}
                      type={item.type}
                      label={item.label}
                      icon={item.icon}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <FieldsTabContent keyword={keyword} />
          )}
        </div>
      </div>

      <FieldsImportModal
        open={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        initialImportedFields={store.importedFields}
        onImport={(fields) => store.setImportedFields(fields)}
      />
    </div>
  );
});
