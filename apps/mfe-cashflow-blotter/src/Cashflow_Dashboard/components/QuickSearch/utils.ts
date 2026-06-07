import { DefaultOptionType } from "antd/es/select";

export const antdSelectSearchFilterOption: (
  inputValue: string,
  option?: DefaultOptionType
) => boolean = (input, option) => {
  return (
    (<string>option?.label ?? "").toLowerCase().includes(input.toLowerCase()) ||
    (<string>option?.value ?? "").toLowerCase().includes(input.toLowerCase())
  );
};
