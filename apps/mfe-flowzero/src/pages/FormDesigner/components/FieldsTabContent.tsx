import {
  BorderOutlined,
  FolderFilled,
  HolderOutlined,
} from "@ant-design/icons";
import { useDraggable } from "@dnd-kit/core";
import { observer } from "mobx-react-lite";
import React, { useMemo } from "react";

import {
  DATA_TYPE_COLOR,
  FIELD_DATATYPE_MAP,
  FIELD_TYPE_MAPPING,
  FieldDataType,
  FieldTypes,
  isFieldDataType,
} from "../../FieldsManagement/fieldType";
import FolderImg from "../images/Folder.png";
import { useDesignerStore } from "../store";
import { ImportedField } from "../types";

interface FieldsTabContentProps {
  keyword: string;
}

const sectionTitleClassName =
  "text-[12px] leading-3 font-bold text-[#737373] tracking-normal mb-4";

const EmptyFields = () => (
  <div className="border border-dashed border-[#CCCCCC] bg-[#F9F9F9] px-5 py-7 flex items-center justify-center text-center min-h-[212px]">
    <div className="max-w-[170px]">
      <div className="flex justify-center">
        <img src={FolderImg} alt="No Fields" className="w-[57px] h-[32px]" />
      </div>
      <div className="mt-4 text-[12px] leading-5 font-bold text-light-content-title">
        No Fields added yet
      </div>
      <p className="text-[12px] leading-5 text-light-content-body">
        Add your first field to start building your form
      </p>
    </div>
  </div>
);

interface FieldRowItemProps {
  field: ImportedField;
}

const FieldRowItem: React.FC<FieldRowItemProps> = ({ field }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-imported-${field.id}`,
    data: {
      type: "sidebar-item",
      componentType: field.componentType,
      label: field.label,
      fieldId: field.id,
    },
  });

  const dtKey = isFieldDataType(field.dataType)
    ? (field.dataType as FieldDataType)
    : null;
  const dtConfig = dtKey ? DATA_TYPE_COLOR[dtKey] : null;
  const dtLabel = dtKey ? FIELD_DATATYPE_MAP[dtKey] : null;
  const ftInfo = FIELD_TYPE_MAPPING[field.uiType as FieldTypes];

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`rounded-lg px-2.5 py-1.5 flex items-center gap-2 cursor-grab active:cursor-grabbing ${
        isDragging ? "bg-[#e6e6e6] opacity-50" : "bg-[#F7F7F7]"
      }`}
    >
      <span className="text-[#1677ff] inline-flex items-center justify-center shrink-0">
        <HolderOutlined style={{ fontSize: 12, color: "#035CBB" }} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center mt-0.5 w-full">
          <div className="flex items-center gap-1">
            {dtConfig && dtLabel && (
              <span className="h-[18px] px-1.5 rounded-full text-[10px] leading-[18px] inline-flex items-center gap-0.5">
                <span
                  className={`flowzero-iconfont ${dtConfig.icon} text-[10px] bg-white w-[20px] h-[20px] border-light-divide-base rounded-[4px] inline-flex items-center justify-center bg-[#f2f2f2] border border-[#ccc]`}
                />
              </span>
            )}
          </div>
          <span className="min-w-0 text-[13px] leading-5 font-medium text-[#1f2f6b] truncate ">
            {field.label}
          </span>
        </div>
      </div>
    </div>
  );
};

export const FieldsTabContent: React.FC<FieldsTabContentProps> = observer(
  ({ keyword }) => {
    const store = useDesignerStore();
    const { importedFields } = store;
    const availableFields = useMemo(
      () => importedFields.filter((f) => !store.getUsedFieldIds().has(f.id)),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [importedFields, store.nodes]
    );

    const filteredFields = useMemo(() => {
      const searchKey = keyword.trim().toLowerCase();
      if (!searchKey) {
        return availableFields;
      }

      return availableFields.filter((field) =>
        field.label.toLowerCase().includes(searchKey)
      );
    }, [availableFields, keyword]);

    return (
      <div>
        <h3 className={sectionTitleClassName}>Content</h3>
        <div className="space-y-2.5">
          {filteredFields.length === 0 ? (
            keyword ? (
              <div className="text-xs text-[#8c8c8c]">No matching fields.</div>
            ) : (
              <EmptyFields />
            )
          ) : (
            filteredFields.map((field) => (
              <FieldRowItem key={field.id} field={field} />
            ))
          )}
        </div>
      </div>
    );
  }
);
