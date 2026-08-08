import { Typography } from "antd";
import { FieldSelectorProps, Option } from "react-querybuilder";

export const CustomFieldLabel = (props: FieldSelectorProps) => {
  const { schema, className, value } = props;
  const field = (schema.fields as Option<string>[]).find(
    (f) => f.name === value
  );
  return (
    <Typography.Text className={className} data-testid="custom-field-label">
      <Typography.Text>{field?.label || value}</Typography.Text>
    </Typography.Text>
  );
};

CustomFieldLabel.displayName = "CustomFieldLabel";
