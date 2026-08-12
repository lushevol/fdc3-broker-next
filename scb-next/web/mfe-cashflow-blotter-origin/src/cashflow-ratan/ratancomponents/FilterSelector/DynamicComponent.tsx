import React, { FC, ReactElement, useState, useEffect } from "react";
import { message, Spin } from "antd";
import DatePicker from "../../LazyAntd/DatePicker";
import RangePicker from "../../LazyAntd/RangePicker";
import Input from "../../LazyAntd/Input";
import InputNumber from "../../LazyAntd/InputNumber";
import Select, { Option } from "../../LazyAntd/Select";
import dayjs from "dayjs";

import debounce from "lodash/debounce";
import { queryFetchPortfolio } from "../../ratanutils/http/graphql";

interface CommonProps {
  onChange: (value: any) => void;
  filterValue: CascaderFilter;
  className: string;
  FILTER_FIELDS: any;
}

export const TextInput: FC<CommonProps> = ({
  className,
  filterValue,
  onChange,
}) => {
  const [thisValue, setThisValue] = useState<any>();

  useEffect(() => {
    setThisValue(filterValue.values);
  }, [filterValue]);

  return (
    <Input
      className={className}
      placeholder="Input..."
      size="small"
      value={thisValue}
      onChange={(e) => setThisValue(e.target.value)}
      onBlur={() => onChange(thisValue)}
      data-testid={`textInput${filterValue.field.join(".")}`}
    />
  );
};

export const NumberInput: FC<CommonProps> = ({
  className,
  filterValue,
  onChange,
}) => {
  const [thisValue, setThisValue] = useState(filterValue.values);

  useEffect(() => {
    setThisValue(filterValue.values);
  }, [filterValue]);

  return (
    <InputNumber
      className={className}
      placeholder="Input Number..."
      size="small"
      value={thisValue}
      onChange={(value) => setThisValue(value)}
      onBlur={(_e) => onChange(thisValue.toString())}
      data-testid={`numberInput${filterValue.field.join(".")}`}
    />
  );
};

export const BetweenPicker: FC<CommonProps> = ({
  className,
  filterValue,
  onChange,
}) => {
  const { values } = filterValue;
  const newValue: any = [];

  if (Array.isArray(values)) {
    values.forEach((item: any) => {
      newValue.push(dayjs(item, "YYYY-MM-DD"));
    });
  }

  return (
    <RangePicker
      className={className}
      size="small"
      value={newValue}
      onChange={(_dates, dateStrings) => {
        const data = dateStrings[0] ? dateStrings : null;
        onChange(data);
      }}
    />
  );
};

export const OnlyPicker: FC<CommonProps> = ({
  className,
  filterValue,
  onChange,
}) => {
  const { values } = filterValue;
  const newValue =
    values && !Array.isArray(values) ? dayjs(values, "YYYY-MM-DD") : null;

  return (
    <DatePicker
      className={className}
      size="small"
      value={newValue as any}
      onChange={(_dates, dateStrings) => onChange(dateStrings)}
    />
  );
};

export const Dropdown: FC<CommonProps> = ({
  className,
  filterValue,
  onChange,
  FILTER_FIELDS,
}) => {
  const { field, values } = filterValue;
  const str = field.join(".");
  const myField = FILTER_FIELDS.filter(
    (item: any) => item.indexedTerm === str
  )[0];
  const fieldOptions = myField?.valueList
    ? JSON.parse(myField.valueList.replace(/'/g, '"'))
    : "";
  const isDynamic = myField?.dynamicList;
  const options: ReactElement[] = [];
  const newValue = values || undefined;
  const [dynamicOption, setDynamicOption] = useState<any>();
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    setDynamicView([]);
  }, []);

  if (!isDynamic && Array.isArray(fieldOptions)) {
    fieldOptions.forEach((item: string, index: number) => {
      let label = "";
      switch (item) {
        case "true":
          label = "Yes";
          break;
        case "false":
          label = "No";
          break;
        default:
          label = item;
      }
      options.push(
        <Option key={index} value={item}>
          {label}
        </Option>
      );
    });
  }

  const setDynamicView = (dynamicList: any) => {
    if (dynamicList && dynamicList.length) {
      dynamicList.forEach((item: { Name: string }, index: number) => {
        options.push(
          <Option key={index} value={item.Name}>
            {item.Name}
          </Option>
        );
      });
    } else {
      options.push(
        <Option key="null" value="">
          Select...
        </Option>
      );
    }
    setDynamicOption(options);
  };

  return (
    <Select
      className={className}
      placeholder="Select..."
      showSearch={true}
      value={newValue}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      onSearch={
        isDynamic === true
          ? debounce((searchName: string) => {
              if (searchName.length === 1) {
                message.info("Please input more than two characters !");
              } else if (searchName.length >= 1) {
                setFetching(true);
                queryFetchPortfolio(searchName)
                  .then((res: any) => {
                    if (res.fetchPortfolio && res.fetchPortfolio.length) {
                      setDynamicView(res.fetchPortfolio);
                    } else if (
                      res.fetchPortfolio &&
                      res.fetchPortfolio.length === 0
                    ) {
                      message.info("No data found");
                    }
                  })
                  .finally(() => {
                    setFetching(false);
                  });
              }
            }, 500)
          : undefined
      }
      onChange={onChange}
      data-testid={`singleSelect${filterValue.field.join(".")}`}
    >
      {isDynamic === true ? dynamicOption : options}
    </Select>
  );
};

export const MultiSelect: FC<CommonProps> = ({
  className,
  filterValue,
  onChange,
  FILTER_FIELDS,
}) => {
  const { field, values } = filterValue;
  const str = field.join(".");
  const myField = FILTER_FIELDS.filter(
    (item: any) => item.indexedTerm === str
  )[0];
  const fieldOptions = myField
    ? JSON.parse(myField.valueList.replace(/'/g, '"'))
    : "";
  const options: ReactElement[] = [];
  const newValue = values || undefined;

  if (Array.isArray(fieldOptions)) {
    fieldOptions.forEach((item: string, index: number) => {
      options.push(
        <Option key={index} value={item}>
          {item}
        </Option>
      );
    });
  }

  return (
    <Select
      placeholder="Multi Select..."
      className={className}
      mode="multiple"
      maxTagCount="responsive"
      value={newValue}
      onChange={onChange}
      data-testid={`multiSelect${filterValue.field.join(".")}`}
    >
      {options}
    </Select>
  );
};

const allComponents: any = {
  TextInput,
  NumberInput,
  BetweenPicker,
  OnlyPicker,
  Dropdown,
  MultiSelect,
};

export const DynamicComponent = (props: CommonProps) => {
  const { name } = props.filterValue;

  return allComponents[name](props);
};
