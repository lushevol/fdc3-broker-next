import { NewItem } from "../CustomForm/FormItemComponents";
import { getIsRequired, getRules } from "../CustomForm/item/ItemsUtils";
import { Row, Col, Divider } from "antd";
import { ChildGroupProps, RowConfigProps } from "./interface";

const FormItemsBuilderGroup = ({
  enable,
  editable,
  error,
  isRequiredObj,
  newFormConfig,
  customValidateStatus,
  messageApi,
  customRules,
  rulesObj,
  data,
  form,
  onUpdate,
}) => {
  const renderRow = (row: RowConfigProps, rowIdx: number) => {
    if (!row.itemConfig) return null;
    return (
      <Row gutter={16} key={rowIdx} style={{ marginBottom: 8 }}>
        {row.itemConfig.map((item, idx) => (
          <Col
            key={item.field || idx}
            span={item.col ?? 8}
            xs={24}
            sm={24}
            md={item.col ?? 8}
            lg={item.col ?? 8}
            xl={item.col ?? 8}
          >
            <NewItem
              key={item.field}
              isRequired={
                getIsRequired(isRequiredObj[item.field]) || item.isRequired
              }
              disabled={
                !editable ||
                enable.submiting ||
                !!item.disabled ||
                enable.ruleError
              }
              error={error}
              rules={[
                ...customRules,
                ...getRules(
                  rulesObj[item.field] || [],
                  isRequiredObj[item.field]
                ),
                ...(item.itemRules || []),
              ]}
              configs={newFormConfig}
              data={data}
              update={onUpdate}
              form={form}
              {...item}
              {...customValidateStatus[item.field]}
              messageApi={messageApi}
            />
          </Col>
        ))}
      </Row>
    );
  };

  const renderChildGroup = (childGroup: ChildGroupProps, idx: number) => {
    const hasTitle = !!childGroup.title;
    return (
      <>
        {hasTitle && (
          <div className="form-child-group-title">
            <div className="form-child-group-title-text">
              {childGroup.title}
            </div>
          </div>
        )}
        <div
          className={`form-child-group${hasTitle ? " has-title" : ""}`}
          key={childGroup.title || idx}
        >
          {childGroup.row.map((row, rowIdx) => renderRow(row, rowIdx))}
        </div>
      </>
    );
  };

  return (
    <>
      {newFormConfig.map((group, groupIdx) => (
        <div className="form-group-box" key={group.title || groupIdx}>
          {group.title && (
            <Divider
              className="custom-form-group-line"
              orientation="left"
              style={{ margin: "2px 0" }}
            >
              {group.title}
            </Divider>
          )}
          {group.row &&
            group.row.map((row, rowIdx) => {
              if (row.childGroup) {
                return row.childGroup.map((cg, cgIdx) =>
                  renderChildGroup(cg, cgIdx)
                );
              }
              return renderRow(row, rowIdx);
            })}
          {group.childGroup &&
            group.childGroup.map((cg, cgIdx) => renderChildGroup(cg, cgIdx))}
        </div>
      ))}
    </>
  );
};

export default FormItemsBuilderGroup;
