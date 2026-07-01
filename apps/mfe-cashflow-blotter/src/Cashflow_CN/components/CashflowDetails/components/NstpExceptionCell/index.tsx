import { Popover } from "antd";

export const NstpExceptionCell = ({ value }: { value: string }) => {
  return (
    <Popover content={value} title="Exceptions">
      {value}
    </Popover>
  );
};
