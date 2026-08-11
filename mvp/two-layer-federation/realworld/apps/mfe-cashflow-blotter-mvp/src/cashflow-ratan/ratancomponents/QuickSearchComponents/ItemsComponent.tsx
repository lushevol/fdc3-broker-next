import { AutoComplete, AutoCompleteProps, Tag, Tooltip } from "antd";
import cn from "classnames";
import RangePicker from "../../LazyAntd/RangePicker";
import Input from "../../LazyAntd/Input";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Select, { Option } from "../../LazyAntd/Select";
import debounce from "lodash/debounce";
import {
  FC,
  memo,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DynamickFieldLabel, FieldLabel } from "../FieldLabel";
import { getRangepickerValue, setTestId } from "../../ratanutils/utils";
import * as itemsFun from "./itemsFun";
import { SizeType } from "antd/es/config-provider/SizeContext";
import MfeThemeProvider from "../../Root/component/MfeThemeProvider";
import { MessageInstance } from "antd/lib/message/interface";
import { escapeRegExp } from "lodash";
import Root from "./style";
import {
  getNextRenderList,
  getNotFoundContent,
  getRemarkElement,
  getSelectCompMode,
} from "./common/settingsHandlers";
import { getEnable } from "../../ratanutils/componentEnabling";
import { plattenStr } from "../../packages/Analysis/utils";
import "./style.less";

const items: MapType = itemsFun;

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

// Dynamick Select Component
interface QuickSearchDynamickSelectProps {
  size?: SizeType;
  value: string;
  inSearching?: boolean;
  config: QuickSearchItemConfig;
  onChange: (field: string, value: undefined | string) => void;
  messageApi: MessageInstance;
}
/**
 * validate the input string
 *
 */
const validateInputString = (inputStr: string): boolean => {
  const validate = /^[a-zA-Z\d][\w\s\.\,\*\&\-]{0,}$/gm.test(inputStr);
  return validate;
};
export const QuickSearchDynamickSelect: FC<QuickSearchDynamickSelectProps> =
  memo(({ size, value, config, inSearching, onChange, messageApi }) => {
    const [fetching, setFetching] = useState(false);
    const [searchName, setSearchName] = useState("");
    const [renderFetching, setRenderFetching] = useState<any>([]);
    const [selected, setSelected] = useState<any>([]);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
      setRenderFetching([]);
      setSelected([]);
    }, [config]);

    const options = useMemo(() => {
      const thisOptions: ReactElement[] = [];
      if (renderFetching.length != 0) {
        renderFetching.forEach((item: any, index: number) => {
          let label = item.label;
          if (getEnable("QuickSearchDynamickSelect_Search_Highlight")) {
            label = item.label
              .split(new RegExp(`(${escapeRegExp(searchName)})`, "gi"))
              .map((str: string) => getRemarkElement(str, searchName));
          }

          thisOptions.push(
            <Option key={`${item.value}_${label}`} value={item.value}>
              {label}
            </Option>
          );
        });
      }

      return thisOptions;
    }, [renderFetching, searchName]);

    const mode = getSelectCompMode(config);

    const searchCallback = useCallback(
      (result) => {
        if (fetching) {
          if (searchName != "") {
            const nextList = getNextRenderList(result, selected);
            setRenderFetching(nextList);
          } else {
            resetRenderFetching();
          }
          setFetching(false);
        }
        if (searchName == "") {
          setFetching(false);
          resetRenderFetching();
        }
      },
      [fetching, searchName]
    );

    useEffect(() => {
      if (searchName != "") {
        items[config.searchFun as string](
          searchName,
          config.searchField,
          searchCallback,
          messageApi,
          config.label
        );
      } else {
        searchCallback([]);
      }
    }, [searchName]);

    const debouceSearchHandler = debounce(
      (searchName) => {
        if (searchName.length > 1 && !validateInputString(searchName)) {
          setSearchText("");
          setSearchName("");
          setFetching(false);
          messageApi.warning("Wrong Input: Please input valid string");
          return null;
        }
        setSearchName(searchName);
        if (searchName == "") {
          setFetching(false);
        } else {
          setFetching(true);
        }
      },
      300,
      { trailing: true }
    );

    const updateSearch = useCallback((searchName) => {
      setSearchText(searchName);
      debouceSearchHandler(searchName);
    }, []);

    const resetRenderFetching = useCallback(() => {
      setRenderFetching([...selected]);
    }, [selected]);

    const tagRanderHandler = useCallback(
      (props) => {
        const { value, closable, onClose } = props;
        const item = selected.find((item) => item.value == value);
        if (!item) {
          return null;
        }
        let label = item.label;
        if (label.length >= 36) {
          label = label.substring(0, 32) + " ...";
        }
        const onPreventMouseDown = (event) => {
          event.preventDefault();
          event.stopPropagation();
        };
        return (
          <Tag
            onMouseDown={onPreventMouseDown}
            closable={closable}
            onClose={onClose}
            style={{
              marginInlineEnd: 4,
            }}
          >
            {label}
          </Tag>
        );
      },
      [selected]
    );

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
        placeholder={config.placeholder ?? "Search Options"}
        showSearch={true}
        notFoundContent={getNotFoundContent(fetching)}
        dropdownMatchSelectWidth={false}
        filterOption={false}
        size={size}
        disabled={config.disabled}
        tagRender={tagRanderHandler}
        value={value}
        allowClear={true}
        onSelect={(value) => {
          const item = renderFetching.find((item) => item.value == value);
          const newItem = [...selected];
          if (item && !newItem.includes(item)) {
            newItem.push(item);
            setSelected(newItem);
          }
        }}
        onClear={() => {
          setFetching(false);
          setSelected([]);
          setRenderFetching([]);
        }}
        onDeselect={(value) => {
          const nextState = [...selected];
          const idx = nextState.findIndex((item) => item.value == value);
          nextState.splice(idx, 1);
          setSelected(nextState);
        }}
        onBlur={() => {
          setFetching(false);
          setSearchName("");
          setSearchText("");
          const nextRender: any[] = [];
          renderFetching.forEach((item) => {
            const { value } = item;
            const findItem = selected.find((item) => item.value == value);
            if (findItem) {
              nextRender.push(findItem);
            }
          });
          setRenderFetching(nextRender);
        }}
        onSearch={updateSearch}
        searchValue={searchText}
        onChange={(data: string) => {
          onChange(config.field, data);
        }}
        data-testid={`${setTestId(config.label)}Search`}
        {...mode}
      >
        {options}
      </Select>
    );
  });

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
