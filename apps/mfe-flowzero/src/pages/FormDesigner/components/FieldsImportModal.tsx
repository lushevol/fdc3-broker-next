import {
  CloseOutlined,
  ExclamationCircleFilled,
  SearchOutlined,
} from "@ant-design/icons";
import {
  App,
  Button,
  Checkbox,
  Input,
  Modal,
  Pagination,
  Spin,
  Switch,
} from "antd";
import cn from "classnames";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FieldEntity, getFieldslList } from "src/api";

import {
  DATA_TYPE_COLOR,
  FIELD_DATATYPE_MAP,
  FIELD_TYPE_MAPPING,
  FieldDataType,
  FieldTypes,
  isFieldDataType,
} from "../../FieldsManagement/fieldType";
import { ComponentType, ImportedField } from "../types";

export type { ImportedField };

const PAGE_SIZE = 100;

export const UI_TYPE_TO_COMPONENT: Record<string, ComponentType> = {
  INPUT: ComponentType.INPUT,
  TEXT_AREA: ComponentType.TEXTAREA,
  RADIO: ComponentType.RADIO,
  CHECKBOX: ComponentType.CHECKBOX,
  SINGLE_CHOICE_DROPDOWN: ComponentType.SELECT,
  MULTIPLE_CHOICE_DROPDOWN: ComponentType.MULTI_SELECT,
  SWITCH: ComponentType.SWITCH,
  INPUT_NUMBER: ComponentType.INPUT_NUMBER,
  DATE_PICKER: ComponentType.DATE_PICKER,
  TIME_PICKER: ComponentType.TIME_PICKER,
};

export const toImportedField = (entity: FieldEntity): ImportedField => ({
  id: entity.id,
  indexedTerm: entity.indexedTerm,
  label: entity.label,
  componentType: UI_TYPE_TO_COMPONENT[entity.uiType] ?? ComponentType.INPUT,
  dataType: entity.dataType,
  uiType: entity.uiType,
  defaultValue: entity.defaultValue,
  metadata: entity.metadata,
});

const SELECTED_VISIBLE_LIMIT = 5;

interface FieldsImportModalProps {
  open: boolean;
  onClose: () => void;
  onImport?: (fields: ImportedField[]) => void;
  initialImportedFields?: ImportedField[];
}

const FieldsImportModalInner: React.FC<FieldsImportModalProps> = ({
  open,
  onClose,
  onImport,
  initialImportedFields,
}) => {
  const { modal, message } = App.useApp();
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldList, setFieldList] = useState<FieldEntity[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [selectedMap, setSelectedMap] = useState<Map<string, ImportedField>>(
    new Map()
  );
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchFields = useCallback(
    async (currentPage: number, label: string) => {
      setLoading(true);
      try {
        const res = await getFieldslList({
          page: currentPage,
          size: PAGE_SIZE,
          label: label || undefined,
          status: "ACTIVE",
        });
        setFieldList((res.data as FieldEntity[]) ?? []);
        setTotalElements(res.totalElements ?? 0);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!open) return;
    // clear any pending debounce when modal opens to avoid stale fetches
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    const map = new Map<string, ImportedField>();
    (initialImportedFields ?? []).forEach((f) => map.set(f.id, f));
    setSelectedMap(map);
    setKeyword("");
    setPage(0);
    fetchFields(0, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // cleanup pending debounce on unmount to avoid updating state after unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, []);

  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(0);
      fetchFields(0, value);
    }, 300);
  };

  const handlePageChange = (newPage: number) => {
    const zeroPage = newPage - 1;
    setPage(zeroPage);
    fetchFields(zeroPage, keyword);
  };

  const allVisibleSelected =
    fieldList.length > 0 && fieldList.every((item) => selectedMap.has(item.id));

  const toggleSelectAllVisible = (checked: boolean) => {
    setSelectedMap((prev) => {
      const next = new Map(prev);
      if (checked) {
        fieldList.forEach((item) => next.set(item.id, toImportedField(item)));
      } else {
        fieldList.forEach((item) => next.delete(item.id));
      }
      return next;
    });
  };

  const handleToggleField = (entity: FieldEntity, checked: boolean) => {
    setSelectedMap((prev) => {
      const next = new Map(prev);
      if (checked) {
        next.set(entity.id, toImportedField(entity));
      } else {
        next.delete(entity.id);
      }
      return next;
    });
  };

  const handleImport = () => {
    modal.confirm({
      title: "Attention Message",
      icon: <ExclamationCircleFilled style={{ color: "#0473EA" }} />,
      content: `Please confirm to import the selected fields.`,
      okText: "Import",
      cancelText: "Cancel",
      onOk: () => {
        onImport?.(Array.from(selectedMap.values()));
        onClose();
        message.success(
          `${selectedMap.size} field${
            selectedMap.size === 1 ? "" : "s"
          } import successfully`
        );
      },
    });
  };

  const handleRemoveSelected = (id: string) => {
    setSelectedMap((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  };

  const selectedArray = Array.from(selectedMap.values());

  return (
    <Modal
      title={
        <span className="text-[18px] leading-[59px] font-Medium">
          Fields Import
        </span>
      }
      open={open}
      onCancel={onClose}
      width={680}
      footer={null}
      closeIcon={<CloseOutlined style={{ fontSize: 22 }} />}
      styles={{
        content: { padding: 0, overflow: "hidden" },
        header: {
          height: 59,
          lineHeight: "59px",
          padding: "0 24px",
          marginBottom: 0,
        },
        body: { padding: 0 },
      }}
    >
      <div className="border-b border-[#ccc] mb-[16px]"></div>
      <div
        className="overflow-y-auto flowzero-custom-scrollbar px-[24px] pb-[32px]"
        style={{ maxHeight: "467px" }}
      >
        <div className="flex items-center justify-between text-[14px] leading-5 text-[#595959]">
          <div>
            Selected Fields -{" "}
            <span className="text-[#1677ff]">{selectedMap.size}</span>
          </div>
          <button
            type="button"
            className="text-[#003a8c]"
            onClick={() => setSelectedMap(new Map())}
          >
            Clear All
          </button>
        </div>

        <div
          className={cn(
            "mt-3 min-h-[42px] rounded-[10px] px-4 py-2 text-[14px] leading-5",
            selectedArray.length > 0
              ? "bg-transparent border border-transparent text-[#0b2b45]"
              : "border border-dashed border-[#d9d9d9] bg-[#fafafa] text-[#8c8c8c] flex items-center justify-center"
          )}
        >
          {selectedArray.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              {(() => {
                const visible = selectedArray.slice(0, SELECTED_VISIBLE_LIMIT);
                const hidden = selectedArray.slice(SELECTED_VISIBLE_LIMIT);
                return (
                  <>
                    {visible.map((f) => (
                      <span
                        key={f.id}
                        className={cn(
                          "inline-flex items-center h-[22px] gap-2 px-3",
                          "bg-[#f2f2f2] border border-[#ccc] rounded-[6px]",
                          "text-[#00172E] text-[13px] font-[400]",
                          "max-w-[360px]"
                        )}
                      >
                        <span className="truncate block max-w-[220px]">
                          {f.label}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSelected(f.id)}
                          className="ml-2 text-[#00172E] text-[13px] font-medium opacity-90 hover:opacity-100"
                          aria-label={`remove-${f.label}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}

                    {hidden.length > 0 && (
                      <span
                        className={cn(
                          "inline-flex items-center h-[22px] gap-2 px-3",
                          "bg-[#f2f2f2] border border-[#ccc] rounded-[6px]",
                          "text-[#00172E] text-[13px] font-[400]"
                        )}
                      >
                        +{hidden.length}
                      </span>
                    )}
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              Nothing is selected
            </div>
          )}
        </div>

        <div className="mt-5 text-[14px] leading-5 text-[#595959]">Search</div>
        <Input
          className="mt-2  !rounded-full"
          placeholder="Please enter a field name to search"
          value={keyword}
          onChange={(e) => handleKeywordChange(e.target.value)}
          suffix={
            keyword ? (
              <CloseOutlined
                style={{ color: "#8c8c8c", fontSize: 14, cursor: "pointer" }}
                onClick={() => handleKeywordChange("")}
              />
            ) : (
              <SearchOutlined style={{ color: "#1677ff", fontSize: 20 }} />
            )
          }
        />

        <div className="mt-5 border-t border-[#d9d9d9] pt-4">
          <div className="flex items-center justify-between">
            <div className="text-[15px] leading-6 font-medium text-[#434343]">
              Total {totalElements} available fields in the field library
            </div>
            {/* <div className="flex items-center gap-3">
              <span className="text-[14px] text-[#434343]">Select all</span>
              <Switch
                checked={allVisibleSelected}
                onChange={toggleSelectAllVisible}
              />
            </div> */}
          </div>

          <Spin spinning={loading}>
            <div className="mt-4 max-h-[300px]  space-y-3 pr-1 min-h-[100px]">
              {fieldList.map((fieldItem) => {
                const checked = selectedMap.has(fieldItem.id);
                const dtKey = isFieldDataType(fieldItem.dataType)
                  ? (fieldItem.dataType as FieldDataType)
                  : null;
                const dtConfig = dtKey ? DATA_TYPE_COLOR[dtKey] : null;
                const dtLabel = dtKey ? FIELD_DATATYPE_MAP[dtKey] : null;
                const ftInfo =
                  FIELD_TYPE_MAPPING[fieldItem.uiType as FieldTypes];

                return (
                  <div
                    key={fieldItem.id}
                    className="rounded-lg bg-[#fafafa] px-4 h-[52px] flex items-center justify-between"
                  >
                    <label className="flex items-center gap-3 text-[14px] leading-5 text-[#434343] cursor-pointer">
                      <Checkbox
                        checked={checked}
                        onChange={(e) =>
                          handleToggleField(fieldItem, e.target.checked)
                        }
                      />
                      <span>{fieldItem.label}</span>
                    </label>

                    <div className="flex items-center gap-2">
                      {dtConfig && dtLabel && (
                        <span
                          className={cn(
                            "h-7 px-3 rounded-full text-[13px] leading-7 inline-flex items-center gap-1"
                          )}
                          style={{
                            background: dtConfig.bg,
                            color: dtConfig.color,
                          }}
                        >
                          <span
                            className={`flowzero-iconfont ${dtConfig.icon} text-[12px]`}
                          />
                          {dtLabel}
                        </span>
                      )}
                      {ftInfo && (
                        <span className="h-7 px-3 rounded-full bg-[#b5ecf5] text-[#0a7b93] text-[13px] leading-7 inline-flex items-center gap-1">
                          <span
                            className={`flowzero-iconfont ${ftInfo.icon} text-[12px]`}
                          />
                          {ftInfo.label}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Spin>

          {totalElements > PAGE_SIZE && (
            <div className="mt-3 flex justify-end">
              <Pagination
                current={page + 1}
                pageSize={PAGE_SIZE}
                total={totalElements}
                onChange={handlePageChange}
                showSizeChanger={false}
                size="small"
              />
            </div>
          )}
        </div>
      </div>
      <div className="border-b border-[#ccc]"></div>
      <div className="flex items-center justify-between h-16 px-[24px]">
        <span className="text-[14px] leading-5 text-[#8c8c8c]">
          {selectedMap.size} fields selected
        </span>
        <div className="flex items-center gap-3">
          <Button
            size="large"
            shape="round"
            className="!h-9 !px-7 !text-[14px] !leading-5 !font-semibold !text-[#434343]"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            size="large"
            shape="round"
            className="!h-9 !px-8 !text-[14px] !leading-5 !font-semibold"
            onClick={handleImport}
          >
            Import
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export const FieldsImportModal: React.FC<FieldsImportModalProps> = (props) => (
  <App>
    <FieldsImportModalInner {...props} />
  </App>
);
