import { CloseOutlined } from "@ant-design/icons";
import { Button, Flex, Space } from "antd";
import cn from "classnames";
import { observer } from "mobx-react-lite";
import React from "react";

import { componentDSLs } from "../dsl/components";
import panelBg from "../images/panelBg.png";
import { useDesignerStore } from "../store";
import { ComponentType } from "../types";
import { FormInfoEditor } from "./FormInfoEditor";
import { BindFieldSection } from "./properties/BindFieldSection";
import { BooleanPropertiesSection } from "./properties/BooleanPropertiesSection";
import { ContainerPropertiesSection } from "./properties/ContainerPropertiesSection";
import { ContentSection } from "./properties/ContentSection";
import { DropdownPropertiesSection } from "./properties/DropdownPropertiesSection";
import { SelectOptionsSection } from "./properties/SelectOptionsSection";
import { SwitchPropertiesSection } from "./properties/SwitchPropertiesSection";
import { TabItemHint } from "./properties/TabItemHint";
import { TabsManagementSection } from "./properties/TabsManagementSection";
import { PropChangeFn, StyleChangeFn } from "./properties/types";
import { findNodeById } from "./properties/utils";
import { ValidationSection } from "./properties/ValidationSection";

export const PropertiesPanel: React.FC = observer(() => {
  const {
    nodes,
    selectedNodeId,
    updateNode,
    selectNode,
    addNode,
    removeNode,
    showFormInfoEditor,
  } = useDesignerStore();
  const selectedNode = selectedNodeId
    ? findNodeById(nodes, selectedNodeId)
    : undefined;

  if (!selectedNode) {
    return showFormInfoEditor ? <FormInfoEditor /> : null;
  }

  const handlePropChange: PropChangeFn = (key, value) => {
    updateNode(selectedNode.id, { [key]: value });
  };

  const handleStyleChange: StyleChangeFn = (key, value) => {
    updateNode(selectedNode.id, {
      style: {
        ...selectedNode.props.style,
        [key]: value,
      },
    });
  };

  const isContainer = [
    ComponentType.CONTAINER,
    ComponentType.TAB_ITEM,
    ComponentType.TABS,
  ].includes(selectedNode.type);

  const isTabItem = selectedNode.type === ComponentType.TAB_ITEM;
  const isSwitch = selectedNode.type === ComponentType.SWITCH;
  const isBooleanField =
    selectedNode.type === ComponentType.RADIO &&
    selectedNode.props.dataType === "BOOLEAN";
  const isChoice = [
    ComponentType.SELECT,
    ComponentType.MULTI_SELECT,
    ComponentType.RADIO,
    ComponentType.CHECKBOX,
  ].includes(selectedNode.type);
  const isContainerComponent = selectedNode.type === ComponentType.CONTAINER;
  const isTabs = selectedNode.type === ComponentType.TABS;

  return (
    <div
      className={cn(
        "w-80 bg-white border-l border-slate-200 flex flex-col h-full shadow-xl z-30 relative",
        "[&_.ant-form-item-label>label]:!text-light-content-label-text",
        "[&_.ant-form-item-label>label]:!text-[12px]"
      )}
    >
      <div
        className="h-10 px-3 border-slate-200 bg-no-repeat bg-cover bg-center flex items-center"
        style={{ backgroundImage: `url(${panelBg})` }}
      >
        <Flex justify="space-between" align="center" style={{ width: "100%" }}>
          <div className="h-[40px] leading-[40px] font-medium text-[#595959] text-[14px]">
            {componentDSLs[selectedNode.type]?.displayName}
          </div>
          <Button
            type="text"
            icon={<CloseOutlined style={{ fontSize: 12, color: "#012246" }} />}
            onClick={() => selectNode(null)}
          />
        </Flex>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flowzero-custom-scrollbar">
        <div>
          <Space direction="vertical" size={24} style={{ width: "100%" }}>
            {isTabItem ? (
              <TabItemHint />
            ) : isSwitch ? (
              <>
                <BindFieldSection
                  selectedNode={selectedNode}
                  onPropChange={handlePropChange}
                />
                <SwitchPropertiesSection
                  selectedNode={selectedNode}
                  onPropChange={handlePropChange}
                />
              </>
            ) : isBooleanField ? (
              <>
                <BindFieldSection
                  selectedNode={selectedNode}
                  onPropChange={handlePropChange}
                />
                <BooleanPropertiesSection
                  selectedNode={selectedNode}
                  onPropChange={handlePropChange}
                />
              </>
            ) : isChoice ? (
              <>
                <BindFieldSection
                  selectedNode={selectedNode}
                  onPropChange={handlePropChange}
                />
                <DropdownPropertiesSection
                  selectedNode={selectedNode}
                  onPropChange={handlePropChange}
                  showPlaceholder={[
                    ComponentType.SELECT,
                    ComponentType.MULTI_SELECT,
                  ].includes(selectedNode.type)}
                  isCheckbox={selectedNode.type === ComponentType.CHECKBOX}
                  isMultiSelect={
                    selectedNode.type === ComponentType.MULTI_SELECT
                  }
                />
              </>
            ) : isContainerComponent ? (
              <ContainerPropertiesSection
                selectedNode={selectedNode}
                onPropChange={handlePropChange}
              />
            ) : isTabs ? (
              <TabsManagementSection
                selectedNode={selectedNode}
                updateNode={updateNode}
                addNode={addNode}
                removeNode={removeNode}
              />
            ) : (
              <>
                {!isContainer &&
                  ![ComponentType.TEXT, ComponentType.TITLE].includes(
                    selectedNode.type
                  ) && (
                    <BindFieldSection
                      selectedNode={selectedNode}
                      onPropChange={handlePropChange}
                    />
                  )}

                <ContentSection
                  selectedNode={selectedNode}
                  onPropChange={handlePropChange}
                  onStyleChange={handleStyleChange}
                />

                <SelectOptionsSection
                  selectedNode={selectedNode}
                  onPropChange={handlePropChange}
                  onStyleChange={handleStyleChange}
                />

                <ValidationSection
                  selectedNode={selectedNode}
                  onPropChange={handlePropChange}
                />
              </>
            )}
          </Space>
        </div>
      </div>
    </div>
  );
});
