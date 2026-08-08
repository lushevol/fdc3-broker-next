import { AntDActionElement, AntDValueSelector } from "@react-querybuilder/antd";
import {
  Controls,
  QueryBuilderProps,
  TranslationsFull,
  defaultTranslations,
} from "react-querybuilder";
import { CustomAntDOperatorSelector } from "../ControlElements/CustomAntDOperatorSelector";
import {
  PlusCircleOutlined,
  FolderAddOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { Typography } from "antd";

const translations: TranslationsFull = {
  ...defaultTranslations,
  addRule: {
    ...defaultTranslations.addRule,
    // @ts-ignore
    label: (
      <div>
        <PlusCircleOutlined />
        &nbsp;&nbsp;<Typography.Text>Add Rule</Typography.Text>
      </div>
    ),
    title: "Add Rule",
  },
  addGroup: {
    ...defaultTranslations.addGroup,
    // @ts-ignore
    label: (
      <div>
        <FolderAddOutlined />
        &nbsp;&nbsp;<Typography.Text>Add Group</Typography.Text>
      </div>
    ),
    title: "Add Group",
  },
  removeRule: {
    ...defaultTranslations.removeRule,
    // @ts-ignore
    label: <MinusCircleOutlined />,
  },
  removeGroup: {
    ...defaultTranslations.removeGroup,
    // @ts-ignore
    label: <MinusCircleOutlined />,
  },
};

export const getModePropsOfDroolsRule = ({
  FieldSelector,
  ValueEditor,
}: {
  FieldSelector: Controls["fieldSelector"];
  ValueEditor: Controls["valueEditor"];
}): QueryBuilderProps => {
  return {
    controlClassnames: { queryBuilder: "queryBuilder-branches" },
    controlElements: {
      addRuleAction: (props) => (
        <AntDActionElement {...props} type="primary" ghost />
      ),
      addGroupAction: (props) => (
        <AntDActionElement {...props} type="primary" ghost />
      ),
      removeRuleAction: (props) => (
        <AntDActionElement {...props} danger type="text" />
      ),
      removeGroupAction: (props) => (
        <AntDActionElement {...props} danger type="text" />
      ),
      combinatorSelector: (props) => (
        <AntDValueSelector
          {...props}
          disabled={props.disabled || props.level === 0}
        />
      ),
      operatorSelector: CustomAntDOperatorSelector,
      valueSourceSelector: (props) => <AntDValueSelector {...props} />,
      fieldSelector: FieldSelector,
      valueEditor: ValueEditor,
    },
    translations: translations,
  };
};
