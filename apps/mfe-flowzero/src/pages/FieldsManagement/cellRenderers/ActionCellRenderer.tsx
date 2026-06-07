import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { ICellRendererParams } from "ag-grid-community";
import { Button, Dropdown } from "antd";
import { FieldEntity } from "src/api";

interface ActionCellRendererParams extends ICellRendererParams {
  gridContainerRef: React.RefObject<HTMLDivElement>;
  onEdit: (data: FieldEntity) => void;
  onDisable: (data: FieldEntity) => void;
  onEnable: (data: FieldEntity) => void;
  onDelete: (data: FieldEntity) => void;
}

const ActionCellRenderer: React.FC<ActionCellRendererParams> = (params) => {
  const isActive = params.data?.status === "ACTIVE";
  const isDisabled = params.data?.status === "DISABLED";
  const { gridContainerRef, onEdit, onDisable, onEnable, onDelete } = params;

  // Define menu items based on status
  const menuItems = [];
  const editMenuItem = {
    key: "edit",
    label: (
      <div className="flex items-center gap-2 ">
        <span className="dark:text-dark-input-text">
          <EditOutlined />
        </span>
        <span className="dark:text-dark-link-primary-default">Edit</span>
      </div>
    ),
    onClick: () => onEdit(params.data),
  };

  const disableMenuItem = {
    key: "disable",
    label: (
      <div className="flex items-center gap-2">
        <span className="text-orange-500">
          <CloseOutlined />
        </span>
        <span className="dark:text-dark-link-primary-default">Disable</span>
      </div>
    ),
    onClick: () => onDisable(params.data),
  };
  const enableMenuItem = {
    key: "enable",
    label: (
      <div className="flex items-center gap-2">
        <span className="text-green-500">
          <SettingOutlined />
        </span>
        <span className="dark:text-dark-link-primary-default">Enable</span>
      </div>
    ),
    onClick: () => onEnable(params.data),
  };
  const deleteMenuItem = {
    key: "delete",
    label: (
      <div className="flex items-center gap-2">
        <span className="text-red-500">
          <DeleteOutlined />
        </span>
        <span className="dark:text-dark-link-primary-default">Delete</span>
      </div>
    ),
    onClick: () => onDelete(params.data),
  };

  if (isActive) {
    // Active fields: Edit, Disable, Delete
    const isReferred =
      params.data?.formNames !== undefined && params.data.formNames.length > 0;

    menuItems.push(editMenuItem);
    if (!isReferred) {
      menuItems.push(disableMenuItem, deleteMenuItem);
    }
  } else if (isDisabled) {
    // Disabled fields: Enable, Delete
    menuItems.push(enableMenuItem, deleteMenuItem);
  }

  return (
    <div className="flex justify-center items-center h-full ">
      <Dropdown
        overlayClassName="bg-light-container-layer dark:bg-dark-container-layer dark:[&_.ant-dropdown-menu]:bg-dark-container-layer"
        menu={{
          items: menuItems,
        }}
        trigger={["click"]}
        getPopupContainer={(triggerNode) => {
          return gridContainerRef.current ?? triggerNode;
        }}
      >
        <Button
          type="text"
          icon={<MoreOutlined />}
          size="small"
          className="hover:text-[red] text-[#595959] dark:text-[#A6A6A6]"
        />
      </Dropdown>
    </div>
  );
};

export default ActionCellRenderer;
