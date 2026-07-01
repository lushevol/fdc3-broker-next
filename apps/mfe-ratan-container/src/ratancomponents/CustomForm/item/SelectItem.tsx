import React, { FC, useState } from "react";
import { Spin } from "antd";
import Select from "../../../LazyAntd/Select";
import debounce from "lodash/debounce";
export const SelectItem: FC<any> = ({
  disabled,
  options,
  field,
  onSearch,
  onChange,
  placeholder = "Select...",
  configs,
  data,
  update,
  form,
  messageApi,
  ...rest
}: any) => {
  const [newOptions, setNewOptions] = useState(options);
  const [fetching, setFetching] = useState(false);

  const onChangeFun = async (value: string) => {
    if (typeof onChange === "function") {
      const newConfigs = await onChange(value, configs, form, data);
      if (Array.isArray(newConfigs)) {
        update(newConfigs);
      }
    }
  };

  if (typeof onSearch === "function") {
    const onSearchFun = (value: string) => {
      setFetching(true);
      const config = configs.find((item: any) => item.field === field);
      onSearch(value, config, messageApi)
        .then((opts: any) => {
          setNewOptions(opts);
        })
        /**
         * @Auth Tech errot will be catched by errorBoudry
         */
        //.catch((error: any) => messageApi && messageApi.error(error.message))
        .finally(() => setFetching(false));
    };
    return (
      <Select
        disabled={disabled}
        data-testid={field}
        placeholder={placeholder}
        options={newOptions}
        onSearch={debounce(onSearchFun, 300)}
        showSearch={true}
        onChange={onChangeFun}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        dropdownMatchSelectWidth={false}
        {...rest}
      />
    );
  }

  return (
    <Select
      disabled={disabled}
      data-testid={field}
      placeholder={placeholder}
      options={options}
      onChange={onChangeFun}
      dropdownMatchSelectWidth={false}
      allowClear={true}
      {...rest}
    />
  );
};
