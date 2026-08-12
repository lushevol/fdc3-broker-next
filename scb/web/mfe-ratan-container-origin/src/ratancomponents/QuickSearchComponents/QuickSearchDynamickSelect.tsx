import { Tag } from "antd";
import cn from "classnames";
import ContentCopy from "@mui/icons-material/ContentCopy";
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
import { setTestId } from "../../ratanutils/utils";
import { SizeType } from "antd/es/config-provider/SizeContext";
import { MessageInstance } from "antd/lib/message/interface";
import { escapeRegExp } from "lodash";
import {
  getNextRenderList,
  getNotFoundContent,
  getRemarkElement,
  getSelectCompMode,
} from "./common/settingsHandlers";
import { getEnable } from "../../ratanutils/componentEnabling";
import { items, validateInputString } from "./ItemsComponent";
import { OptionContent } from "./QuickSearchDynamickSelectStyles";

// Dynamick Select Component
interface QuickSearchDynamickSelectProps {
  size?: SizeType;
  value: string;
  inSearching?: boolean;
  config: QuickSearchItemConfig;
  onChange: (field: string, value: undefined | string) => void;
  messageApi: MessageInstance;
}

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

    const handleCopy = (e: React.MouseEvent, value: string) => {
      e.stopPropagation();
      navigator.clipboard.writeText(value);
      messageApi.success(`${value} copy succeeded`);
    };

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
              <OptionContent>
                <span>{label}</span>
                {config.copyOption ? (
                  <ContentCopy
                    className="ratan-container-quick-search-option-copy"
                    onClick={(e) => handleCopy(e, item.value)}
                  />
                ) : null}
              </OptionContent>
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
