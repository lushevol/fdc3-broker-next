import { Form, Select } from "antd";
import { observer } from "mobx-react-lite";
import React, { useMemo } from "react";

import { useDesignerStore } from "../../store";
import { ComponentType, ImportedField } from "../../types";
import { SectionCard } from "./SectionCard";
import { SectionProps } from "./types";

const COMPONENT_COMPATIBLE_DATATYPES: Partial<Record<ComponentType, string[]>> =
  {
    [ComponentType.INPUT]: ["STRING"],
    [ComponentType.TEXTAREA]: ["STRING"],
    [ComponentType.TEXT]: ["STRING"],
    [ComponentType.TITLE]: ["STRING"],
    [ComponentType.RADIO]: ["STRING", "BOOLEAN"],
    [ComponentType.INPUT_NUMBER]: ["STRING", "NUMBER"],
    [ComponentType.DATE_PICKER]: ["STRING", "DATE"],
    [ComponentType.TIME_PICKER]: ["STRING", "DATETIME"],
    [ComponentType.SWITCH]: ["STRING", "BOOLEAN"],
    [ComponentType.CHECKBOX]: ["ARRAY"],
    [ComponentType.SELECT]: ["STRING"],
    [ComponentType.MULTI_SELECT]: ["ARRAY"],
  };

type BindFieldSectionProps = Pick<
  SectionProps,
  "selectedNode" | "onPropChange"
>;

export const BindFieldSection: React.FC<BindFieldSectionProps> = observer(
  ({ selectedNode }) => {
    const fieldLocked = !!selectedNode.props.fieldLocked;
    const store = useDesignerStore();
    const { importedFields } = store;
    const options = useMemo(
      () => {
        const usedFieldIds = store.getUsedFieldIds();
        const compatibleDataTypes =
          COMPONENT_COMPATIBLE_DATATYPES[selectedNode.type];

        return importedFields
          .filter((f) => {
            if (usedFieldIds.has(f.id) && f.id !== selectedNode.props.bindField)
              return false;
            if (
              compatibleDataTypes &&
              !compatibleDataTypes.includes(f.dataType.toUpperCase())
            )
              return false;
            return true;
          })
          .map((f) => ({ label: f.label, value: f.id }));
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [
        importedFields,
        store.nodes,
        selectedNode.props.bindField,
        selectedNode.type,
      ]
    );

    const handleChange = (fieldId: string | undefined) => {
      if (!fieldId) {
        store.updateNode(selectedNode.id, {
          bindField: undefined,
        });
        return;
      }

      const field: ImportedField | undefined = importedFields.find(
        (f) => f.id === fieldId
      );
      if (!field) return;

      // Sync label, defaultValue and options from the field as initial values.
      // User can continue editing them freely without affecting the field definition.
      const propsToSync: Record<string, unknown> = {
        bindField: field.id,
        indexedTerm: field.indexedTerm,
        label: field.label,
        dataType: field.dataType,
      };

      if (field.defaultValue !== undefined) {
        propsToSync.defaultValue = field.defaultValue;
      }

      // Populate options for select / checkbox / radio from field metadata
      if (field.metadata?.length) {
        propsToSync.options = field.metadata.map((m) => ({
          id: m.id,
          label: m.label,
          value: m.value,
          default: m.default,
        }));
      }

      store.updateNode(selectedNode.id, propsToSync);
    };

    return (
      <SectionCard
        title="Bind Field"
        className="space-y-2"
        titleClassName="h-5 leading-5 text-light-content-label-text font-medium border-none"
      >
        <Form layout="vertical">
          <Form.Item style={{ marginBottom: 0 }}>
            <Select
              showSearch
              placeholder="Select Field"
              value={selectedNode.props.bindField || undefined}
              options={options}
              onChange={handleChange}
              filterOption={(input, option) =>
                String(option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              allowClear
              disabled={fieldLocked}
            />
          </Form.Item>
        </Form>
      </SectionCard>
    );
  }
);
