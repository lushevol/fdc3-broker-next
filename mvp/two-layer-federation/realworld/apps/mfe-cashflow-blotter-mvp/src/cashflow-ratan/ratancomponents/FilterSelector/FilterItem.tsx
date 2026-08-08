import React, { FC, ReactElement, useEffect, useMemo, useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Cascader } from "antd";
import Select, { Option } from "../../LazyAntd/Select";
import IconButton from "@mui/material/IconButton";
import { DynamicComponent } from "./DynamicComponent";
import {
  OPERATORS,
  getOperatorOptions,
  GetOperatorOptionsType,
  OPERATORS_CN,
} from "./operatorConfig";
import Root from "./common/style/FilterItem";

interface FilterItemProps {
  CASCADER_OPTIONS: any;
  FILTER_FIELDS: any;
  filterValue: CascaderFilter;
  index: number;
  onChange: Function;
  onRemove: Function;
  isCashflowSettlementCN?: boolean;
}

export const filterArr = (arr1, arr2) => {
  let arr: any = [];
  if (arr1?.children && arr2?.children) {
    arr = [...arr1.children, ...arr2.children];
  } else if (arr1?.children) {
    arr = [...arr1.children];
  } else if (arr2?.children) {
    arr = [...arr2.children];
  }
  return arr;
};

export const FilterItem: FC<FilterItemProps> = ({
  CASCADER_OPTIONS,
  FILTER_FIELDS,
  filterValue,
  index,
  onChange,
  onRemove,
  isCashflowSettlementCN,
}) => {
  const [thisCascaderOptions, setThisCascaderOptions] = useState();
  const { field, operator } = filterValue;
  const str = field.join(".");
  const myField = FILTER_FIELDS.filter(
    (item: any) => item.indexedTerm === str
  )[0];

  const operatorType = myField ? myField.displayStyle : "";
  const operatorOptions = getOperatorOptions(
    operatorType,
    isCashflowSettlementCN
  );

  useEffect(() => {
    setDisabled();
    return () => {
      removeDisabled();
    };
  }, []);

  const optionView = useMemo(() => {
    const views: ReactElement[] = [];

    if (Array.isArray(operatorOptions)) {
      operatorOptions.forEach((item: GetOperatorOptionsType, idx: number) => {
        views.push(
          <Option key={idx} value={item.value}>
            {item.label}
          </Option>
        );
      });
    }

    return views;
  }, [operatorOptions]);

  const setTargetDisabled = (target, bool: boolean) => {
    if (target) {
      target.disabled = bool;
    }
  };

  /**
   * @Comment shoudld convert next foreach to recursion
   */

  const filter = (data) => (item: any) => {
    return item.indexedTerm === data.join(".");
  };
  const getArr = () => {
    const arr1 = CASCADER_OPTIONS.filter((item: any) => {
      return item.value === "TRADEDETAIL";
    })[0];
    const arr2 = CASCADER_OPTIONS.filter((item: any) => {
      return item.value === "CASHFLOWDETAIL";
    })[0];
    return filterArr(arr1, arr2);
  };
  const case1 = (value) => {
    const result = getArr().filter(filter(field));
    if (result && result?.length) {
      setTargetDisabled(result[0], value);
    }
  };
  const case2 = (value) => {
    CASCADER_OPTIONS.forEach((item1: any) => {
      const target = item1.children?.filter(filter(field))[0];
      setTargetDisabled(target, value);
    });
  };
  const case3 = (value) => {
    CASCADER_OPTIONS.forEach((item1: any) => {
      item1.children?.forEach((item2: any) => {
        const target = item2.children?.filter(filter(field))[0];
        setTargetDisabled(target, value);
      });
    });
  };
  const case4 = (value) => {
    CASCADER_OPTIONS.forEach((item1: any) => {
      item1.children?.forEach((item2: any) => {
        item2.children?.forEach((item3: any) => {
          const target = item3.children?.filter(filter(field))[0];
          setTargetDisabled(target, value);
        });
      });
    });
  };
  const case5 = (value) => {
    CASCADER_OPTIONS.forEach((item1: any) => {
      item1.children?.forEach((item2: any) => {
        item2.children?.forEach((item3: any) => {
          item3.children?.forEach((item4: any) => {
            const target = item4.children?.filter(filter(field))[0];
            setTargetDisabled(target, value);
          });
        });
      });
    });
  };
  const setStatus = (value) => {
    switch (field.length) {
      case 1:
        case1(value);
        break;
      case 2:
        case2(value);
        break;
      case 3:
        case3(value);
        break;
      case 4:
        case4(value);
        break;
      case 5:
        case5(value);
        break;
    }
    setThisCascaderOptions(CASCADER_OPTIONS);
  };
  const setDisabled = () => {
    setStatus(true);
  };

  const removeDisabled = () => {
    setStatus(false);
  };

  const setValue = (value: any[]) => {
    if (value[0] === "TRADEDETAIL" || value[0] === "CASHFLOWDETAIL") {
      value.shift();
    }
    const valueStr = value.join(".");
    if (valueStr) {
      removeDisabled();
      const findField = FILTER_FIELDS.filter(
        (item: any) => item.indexedTerm === valueStr
      )[0];
      const { operators, displayStyle } = findField;

      if (displayStyle && operators) {
        const filterValueChange = {
          field: value,
          operator: operators,
          values: "",
          name: (isCashflowSettlementCN ? OPERATORS_CN : OPERATORS)[
            displayStyle
          ][operators].name,
        };
        onChange(filterValueChange, index);
      }
    }
  };

  const removeFilter = () => {
    removeDisabled();
    onRemove(index);
  };

  const refactorField = (fieldData: any) => {
    const newField = [...fieldData];

    if (newField.length === 1) {
      const target = FILTER_FIELDS.filter((item: any) => {
        return item.indexedTerm === newField[0];
      })[0];
      if (target?.context?.includes("TRANSACTION_DATA")) {
        newField.unshift("TRADEDETAIL");
      } else {
        newField.unshift("CASHFLOWDETAIL");
      }
      return newField;
    } else {
      return newField;
    }
  };

  return (
    <Root>
      <div className="filter-item">
        <Cascader
          options={thisCascaderOptions}
          placeholder="-- Add Filter --"
          expandTrigger="hover"
          allowClear={false}
          showSearch={true}
          className="cascader"
          value={refactorField(field)}
          onChange={setValue}
          data-testid={`fieldCascader${filterValue.field.join(".")}`}
        />
        <Select
          className="select"
          value={operator}
          data-testid={`operatorSelect${filterValue.field.join(".")}`}
          onChange={(value: string) => {
            onChange(
              {
                operator: value,
                values: "",
                name:
                  operatorType &&
                  (isCashflowSettlementCN ? OPERATORS_CN : OPERATORS)[
                    operatorType
                  ][value].name,
              },
              index
            );
          }}
        >
          {optionView}
        </Select>
        <DynamicComponent
          className="dynamic-component"
          filterValue={filterValue}
          FILTER_FIELDS={FILTER_FIELDS}
          onChange={(value) => {
            onChange(
              {
                values: value,
              },
              index
            );
          }}
        />
        <IconButton
          aria-label="delete"
          size="small"
          data-testid={`removeItemBtn${filterValue.field.join(".")}`}
          onClick={removeFilter}
        >
          <DeleteOutlineIcon />
        </IconButton>
      </div>
    </Root>
  );
};
