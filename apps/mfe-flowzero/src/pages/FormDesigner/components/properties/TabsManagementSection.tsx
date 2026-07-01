import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Form, Input, Radio, Select, Typography } from "antd";
import React, { useMemo } from "react";

import { ComponentType, FormNode } from "../../types";
import { SectionCard } from "./SectionCard";
import { AddNodeFn, RemoveNodeFn, UpdateNodeFn } from "./types";

interface TabsManagementSectionProps {
  selectedNode: FormNode;
  updateNode: UpdateNodeFn;
  addNode: AddNodeFn;
  removeNode: RemoveNodeFn;
}

export const TabsManagementSection: React.FC<TabsManagementSectionProps> = ({
  selectedNode,
  updateNode,
  addNode,
  removeNode,
}) => {
  const tabs = selectedNode.children;

  const defaultTabId = useMemo(() => {
    if (tabs.length === 0) {
      return undefined;
    }

    const savedDefault = selectedNode.props.defaultTabId;
    if (savedDefault && tabs.some((tab) => tab.id === savedDefault)) {
      return savedDefault;
    }

    return tabs[0].id;
  }, [tabs, selectedNode.props.defaultTabId]);

  const defaultViewOptions = tabs.map((tab) => ({
    label: tab.props.label || "Untitled Tab",
    value: tab.id,
  }));

  const handleLabelChange = (tabId: string, label: string) => {
    updateNode(tabId, { label });
  };

  const handleLabelBlur = (tabId: string, label: string) => {
    if (!label.trim()) {
      updateNode(tabId, { label: "Untitled Tab" });
    }
  };

  const handleAddTab = () => {
    addNode(ComponentType.TAB_ITEM, selectedNode.id);
  };

  const handleRemoveTab = (tabId: string) => {
    if (tabs.length <= 1) {
      return;
    }

    const fallbackDefaultTabId = tabs.find((tab) => tab.id !== tabId)?.id;

    if (defaultTabId === tabId) {
      updateNode(selectedNode.id, { defaultTabId: fallbackDefaultTabId });
    }

    removeNode(tabId);
  };

  return (
    <div className="space-y-4">
      <Form layout="vertical">
        <Form.Item label="Default View" style={{ marginBottom: 0 }}>
          <Select
            placeholder="Select View"
            options={defaultViewOptions}
            value={defaultTabId}
            onChange={(value) =>
              updateNode(selectedNode.id, { defaultTabId: value })
            }
          />
        </Form.Item>
      </Form>

      <SectionCard title="Tab Component Control">
        <div>
          <Flex
            justify="space-between"
            align="center"
            style={{ marginBottom: 8 }}
          >
            <Typography.Text>Views</Typography.Text>
            <Button
              type="text"
              icon={<PlusOutlined style={{ fontSize: 14 }} />}
              onClick={handleAddTab}
            />
          </Flex>

          <div className="bg-white">
            {tabs.map((tab, index) => (
              <div
                key={tab.id}
                className="flex items-center gap-2 px-2 py-1.5"
                style={
                  index < tabs.length - 1
                    ? { borderBottom: "1px solid #e2e8f0" }
                    : undefined
                }
              >
                <Radio
                  checked={defaultTabId === tab.id}
                  onChange={() =>
                    updateNode(selectedNode.id, { defaultTabId: tab.id })
                  }
                />
                <Input
                  bordered={false}
                  value={tab.props.label ?? ""}
                  placeholder="Untitled Tab"
                  onChange={(event) =>
                    handleLabelChange(tab.id, event.target.value)
                  }
                  onBlur={(event) =>
                    handleLabelBlur(tab.id, event.target.value)
                  }
                />
                <Button
                  type="text"
                  icon={<DeleteOutlined style={{ fontSize: 14 }} />}
                  disabled={tabs.length <= 1}
                  onClick={() => handleRemoveTab(tab.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </SectionCard>
    </div>
  );
};
