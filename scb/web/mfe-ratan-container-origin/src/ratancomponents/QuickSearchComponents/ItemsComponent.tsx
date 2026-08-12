import { AutoComplete, AutoCompleteProps, Tag, Tooltip } from "antd";
import cn from "classnames";
import RangePicker from "../../LazyAntd/RangePicker";
import Input from "../../LazyAntd/Input";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Select, { Option } from "../../LazyAntd/Select";
import { FC, memo, ReactElement, useEffect, useMemo, useState } from "react";
import { DynamickFieldLabel, FieldLabel } from "../FieldLabel";
import { getRangepickerValue, setTestId } from "../../ratanutils/utils";
import * as itemsFun from "./itemsFun";
import { SizeType } from "antd/es/config-provider/SizeContext";
import MfeThemeProvider from "../../Root/component/MfeThemeProvider";
import { MessageInstance } from "antd/lib/message/interface";
import Root from "./style";
import { plattenStr } from "../../packages/Analysis/utils";
import { QuickSearchDynamickSelect } from "./QuickSearchDynamickSelect";
import "./style.less";

export const items: MapType = itemsFun;

// Input Component
interface QuickSearchInputProps {
  size?: SizeType;
  value: undefined | string;
  config: QuickSearchItemConfig;
  inSearching?: boolean;
  onChange: (field: string, value: undefined | string) => void;
}
export const QuickSearchInput: FC<QuickSearchInputProps> = memo(
  ({ size, value, config, inSearching, onChange }) => {
    const change = (e) => {
      if (config.commas) {
        onChange(config.field, e.target.value.split(","));
      } else {
        onChange(config.field, e.target.value);
      }
    };

    return (
      <Input
        className={cn(
          {
            "ratan-container-quick-search-control-color":
              typeof inSearching === "boolean",
          },
          { "in-searching": inSearching }
        )}
        size={size}
        value={value}
        allowClear={true}
        placeholder={config.placeholder}
        suffix={
          config.suffix ? (
            <Tooltip title={config.suffix}>
              <InfoOutlinedIcon />
            </Tooltip>
          ) : null
        }
        disabled={config.disabled}
        onChange={change}
        data-testid={`${setTestId(config.label)}Search`}
      />
    );
  }
);

/**
 * validate the input string
 *
 */
export const validateInputString = (inputStr: string): boolean => {
  const validate = /^[a-zA-Z\d][\w\s\.\,\*\&\-]{0,}$/gm.test(inputStr);
  return validate;
};

// Range Picker Component
interface QuickSearchPickerProps {
  size?: SizeType;
  value: string;
  inSearching?: boolean;
  config: QuickSearchItemConfig;
  onChange: (field: string, value: undefined | string) => void;
}
export const QuickSearchPicker: FC<QuickSearchPickerProps> = ({
  size,
  value,
  config,
  inSearching,
  onChange,
}) => {
  return (
    <RangePicker
      size={size}
      className={cn(
        {
          "ratan-container-quick-search-control-color":
            typeof inSearching === "boolean",
        },
        { "in-searching": inSearching }
      )}
      value={getRangepickerValue(value) as any}
      disabled={config.disabled}
      onChange={(_dates: any, dateStrings: any) => {
        const data = dateStrings[0] ? dateStrings : null;
        onChange(config.field, data);
      }}
      data-testid={`${setTestId(config.label)}Search`}
    />
  );
};

// Select Component
interface QuickSearchSelectProps {
  size?: SizeType;
  value: string;
  inSearching?: boolean;
  config: QuickSearchItemConfig;
  onChange: (field: string, value: undefined | string) => void;
}
export const QuickSearchSelect: FC<QuickSearchSelectProps> = ({
  size,
  value,
  config,
  inSearching,
  onChange,
}) => {
  const [searchText, setSearchText] = useState("");
  const optionsView = useMemo(() => {
    const thisOptions: ReactElement[] = [];

    config.valueList?.forEach((item: any, index: number) => {
      if (typeof item === "string") {
        thisOptions.push(
          <Option key={item} value={item}>
            {item}
          </Option>
        );
      } else {
        thisOptions.push(
          <Option key={item.value} value={item.value}>
            {item.label}
          </Option>
        );
      }
    });

    return thisOptions;
  }, []);

  const filterOption = (
    input: string,
    option: { label: string; value: string; children: string }
  ) => {
    setSearchText(input);
    return (
      (option?.children ?? "").toLowerCase().includes(input.toLowerCase()) ||
      (option?.value ?? "").toLowerCase().includes(input.toLowerCase())
    );
  };

  let mode = {};
  if (config.selectMode === "multiple") {
    mode = {
      mode: "multiple",
      maxTagCount: "responsive",
      listHeight: 280,
    };
  } else if (config.selectMode === "tags") {
    mode = {
      mode: "tags",
      maxTagCount: "responsive",
      listHeight: 280,
    };
  }

  return (
    <Select
      className={cn(
        "query-select",
        {
          "ratan-container-quick-search-control-color":
            typeof inSearching === "boolean",
        },
        { "in-searching": inSearching }
      )}
      placeholder={config.placeholder ?? "Select..."}
      showSearch={true}
      dropdownMatchSelectWidth={false}
      size={size}
      value={value}
      allowClear={true}
      disabled={config.disabled}
      filterOption={filterOption}
      filterSort={(optionA) => {
        return searchText
          ? (optionA?.children ?? "")
              .toLowerCase()
              .includes(searchText.toLowerCase())
            ? -1
            : 1
          : 0;
      }}
      onDropdownVisibleChange={(open: boolean) => {
        if (open) setSearchText("");
      }}
      onChange={(data: string) => onChange(config.field, data)}
      data-testid={`${setTestId(config.label)}Search`}
      {...mode}
    >
      {optionsView}
    </Select>
  );
};

// AutoComplete Component
interface QuickSearchAutoCompleteProps {
  size?: SizeType;
  value: string;
  inSearching?: boolean;
  config: QuickSearchItemConfig;
  onChange: (field: string, value: undefined | string) => void;
}
export const filterSort =
  (searchText: string) => (optionA: { label: string; value: string }) => {
    if (!searchText) return 0;
    const label = `${optionA?.label ?? ""}`;
    return label.toLowerCase().includes(searchText.toLowerCase()) ? -1 : 1;
  };
export const autoCompletefilterOption = (input: string, item?: string) => {
  const str = item ?? "";
  if (!str) return true;
  return str.toLowerCase().includes(input.toLowerCase());
};
export const QuickSearchAutoComplete: FC<QuickSearchAutoCompleteProps> = ({
  size,
  value,
  config,
  inSearching,
  onChange,
}) => {
  const [searchText, setSearchText] = useState("");
  const options = useMemo(() => {
    const thisOptions: { label: string; value: string }[] = [];

    config.valueList?.forEach((item: any, index: number) => {
      if (typeof item === "string") {
        thisOptions.push({ label: item, value: item });
      } else if (typeof item === "object" && item.label && item.value) {
        thisOptions.push({ label: item.label, value: item.value });
      }
    });

    return thisOptions;
  }, []);

  const filterOption: AutoCompleteProps["filterOption"] = (input, option) => {
    setSearchText(input);
    return (
      autoCompletefilterOption(input, option?.value as string) ||
      autoCompletefilterOption(input, option?.label as string)
    );
  };

  return (
    <AutoComplete
      className={cn(
        "query-autocomplete",
        {
          "ratan-container-quick-autocomplete-control-color":
            typeof inSearching === "boolean",
        },
        { "in-searching": inSearching }
      )}
      placeholder={config.placeholder ?? "Select..."}
      showSearch
      size={size}
      value={value}
      allowClear
      options={options}
      disabled={config.disabled}
      filterOption={filterOption}
      filterSort={filterSort(searchText)}
      onDropdownVisibleChange={(open: boolean) => {
        if (open) setSearchText("");
      }}
      onChange={(data: string) => onChange(config.field, data)}
      data-testid={`${setTestId(config.label)}AutoComplete`}
    ></AutoComplete>
  );
};

interface QuickSearchManyInOneProps {
  size?: SizeType;
  labelWidth?: number;
  formWidth?: number;
  filter: any;
  inSearchingFields?: string[];
  config: QuickSearchItemConfig;
  onChange: (field: string, value: undefined | string) => void;
  onRemove: (field: string) => void;
  messageApi: MessageInstance;
}
export const QuickSearchManyInOne: FC<QuickSearchManyInOneProps> = ({
  size,
  labelWidth,
  formWidth,
  filter,
  config,
  inSearchingFields,
  onChange,
  onRemove,
  messageApi,
}) => {
  const manyInOne = config.manyInOne ?? [];
  const [thisField, setThisField] = useState<any>(manyInOne[0]);
  const componentConfig = manyInOne.find(
    (item) => item.field === thisField.field && item.label === thisField.label
  ) as ManyInOneConfig;

  useEffect(() => {
    manyInOne.forEach((item) => {
      if (
        filter.hasOwnProperty(item.field) &&
        (item.field !== thisField.field || item.label !== thisField.label)
      ) {
        onRemove(item.field);
      }
    });
  }, [thisField]);

  componentConfig.disableLabel = true;
  return (
    <DynamickFieldLabel
      className="item"
      config={manyInOne}
      active={componentConfig}
      labelWidth={labelWidth}
      formWidth={formWidth}
      onChange={setThisField}
    >
      <ItemsComponent
        size={size}
        filter={filter}
        inSearchingFields={inSearchingFields}
        config={componentConfig}
        onChange={onChange}
        messageApi={messageApi}
      />
    </DynamickFieldLabel>
  );
};

const components: MapType = {
  QuickSearchInput,
  QuickSearchDynamickSelect,
  QuickSearchPicker,
  QuickSearchSelect,
  QuickSearchAutoComplete,
  QuickSearchManyInOne,
};

interface ItemsComponentProps {
  size?: SizeType;
  labelWidth?: number;
  formWidth?: number;
  filter?: any;
  initFields?: any;
  config: QuickSearchItemConfig | ManyInOneConfig;
  onChange: (field: string, value: undefined | string) => void;
  onRemove?: (field: string) => void;
  messageApi?: MessageInstance;
  inSearchingFields?: string[];
}
export default function ItemsComponent({
  size,
  labelWidth,
  formWidth,
  filter,
  config,
  inSearchingFields,
  initFields = {},
  onChange,
  onRemove,
  messageApi,
}: Readonly<ItemsComponentProps>) {
  const ItemDom = components[config.component];
  const value = initFields[config.field]
    ? initFields[config.field]
    : filter[config.field];
  const inSearching = inSearchingFields?.includes(config.field);

  if (config.disableLabel || config.component === "QuickSearchManyInOne") {
    return (
      <ItemDom
        size={size}
        labelWidth={labelWidth}
        formWidth={formWidth}
        value={value}
        filter={filter}
        inSearchingFields={inSearchingFields}
        inSearching={inSearching}
        config={config}
        onChange={onChange}
        onRemove={onRemove}
        messageApi={messageApi}
      />
    );
  }

  return (
    <MfeThemeProvider>
      <Root>
        <FieldLabel
          className={`item kp--${plattenStr(config.label)}`}
          text={config.label}
          labelWidth={labelWidth}
          formWidth={formWidth}
        >
          <ItemDom
            size={size}
            value={value}
            filter={filter}
            config={config}
            inSearching={inSearching}
            onChange={onChange}
            onRemove={onRemove}
            messageApi={messageApi}
          />
        </FieldLabel>
      </Root>
    </MfeThemeProvider>
  );
}
