import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import {
  Autocomplete,
  Box,
  IconButton,
  MenuItem,
  TextField,
} from "@mui/material";
import { message } from "antd";
import cn from "classnames";
import { getBusinessFieldsFromCache, getOperator } from "Import/ratanutils";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BookingEntityNameIdOptions } from "src/Cashflow_CN/Main/config/ratanConfig/local/BookingEntity";
import { RootState } from "src/Cashflow_CN/Main/store/interface";
import { queryAllExceptionCodes } from "src/Cashflow_CN/services";
import { useBatchCollect } from "src/Root/analysis";
import {
  CASHFLOW_BLOTTER_QUICK_FILTER_CLEAR_ALL_BTN,
  get_CASHFLOW_BLOTTER_QUICK_FILTER_OPTION_BTN,
  QUICK_FILTER_FIELDS,
} from "src/Root/analysis/const";
import {
  convertRuleGroup2LegacyFilters,
  legacyFilters2Query,
} from "src/Root/common/utils/query";
import { handleMultiFieldsQuery } from "src/Root/import/ratanutils";

import { cashflowCustomFields } from "../../Main/config/fieldsConfig";
import { generate_STATIC_QUICK_FILTER_OPTIONS } from "../../Main/config/UIconfig";
import { queryCashflowList } from "../../Main/store/actions";
import Root, { classes } from "./style";

const filterFields = {
  dateHorizon: { field: "Cashflow.Payment_Date", label: "Value Date Horizon" },
  taxonomy: {
    field: "Instrument_Common.ISDA_Taxonomy",
    label: "Product Taxonomy",
  },
  isStpRatan: { field: "Cashflow.Is_STP_RATAN", label: "Is STP Ratan" },
  cashflowStatus: { field: "Cashflow.Cashflow_State", label: "Cashflow State" },
  bookingEntity: {
    field: "Entity.Booking_Entity_SCI_FMID",
    label: "Booking Entity",
  },
  nstpException: {
    field: "Cashflow.NSTP_Exception",
    label: "NSTP Exception",
    operator: "MATCH",
  },
  cashflowSubStatus: {
    field: "Cashflow.Cashflow_Sub_State",
    label: "Cashflow Sub State",
  },
  cashflowSubStatusType: {
    field: "Cashflow.Cashflow_Sub_State_Type",
    label: "Cashflow Sub State Type",
  },
  settlementMethod: {
    field: "Settlement_Method",
    label: "Settlement Method",
  },
  bicNet: {
    field: "Entity.Counterparty_SCI_BIC_Net_Flag",
    label: "Bic Net Flag",
  },
};

// this options should be the same as Quick Search / Product Taxonomy
const productTaxonomyMap = {
  "Simple Cashflow (SCF)": {
    field: "Instrument_Common.Primary_Asset_Class",
    operator: "EQ",
    values: "Cash",
  },
  "InterestRate:IRSwap": {
    field: "Instrument_Common.ISDA_Taxonomy",
    operator: "IN",
    values: [
      "InterestRate:IRSwap:FixedFloat",
      "InterestRate:IRSwap:FloatFloat",
      "InterestRate:IRSwap:OIS",
    ],
  },
  "InterestRate:CrossCurrency": {
    field: "Instrument_Common.ISDA_Taxonomy",
    operator: "IN",
    values: [
      "InterestRate:CrossCurrency:Basis",
      "InterestRate:CrossCurrency:FixedFloat",
      "InterestRate:CrossCurrency:FixedFixed",
      "InterestRate:LoanDeposit",
    ],
  },
};

const isTaxonomyApplied = (filter) => {
  return (
    filter[filterFields.taxonomy.field]?.value ||
    filter[productTaxonomyMap["Simple Cashflow (SCF)"].field]?.value
  );
};

const hasFilterValue = (isArray: boolean, value: any) => {
  return isArray ? value[0] : value;
};

export const setFilterFields = (
  { field, value, label, operator }: any,
  quickFilters: Filter[]
) => {
  const isArray = Array.isArray(value);
  let newFields: Filter[] = quickFilters.filter(
    (item: any) => item.field !== field
  );
  if (field === filterFields.taxonomy.field) {
    newFields = newFields.filter(
      (item: any) =>
        item.field !== productTaxonomyMap["Simple Cashflow (SCF)"].field
    );
    const res = new Map<string, string[]>();
    if (!isArray) value = [value];
    value.forEach((option) => {
      if (option) {
        const realFilter = productTaxonomyMap[option];
        if (realFilter) {
          res.set(
            realFilter.field,
            (res.get(realFilter.field) ?? []).concat(realFilter.values)
          );
        } else {
          res.set(field, (res.get(field) ?? []).concat(value));
        }
      }
    });
    res.forEach((v, k) => {
      newFields.push({
        field: k,
        operator: "IN",
        values: v,
        label,
      });
    });
    return newFields;
  }

  if (hasFilterValue(isArray, value)) {
    newFields.push({
      field,
      operator: operator ?? getOperator(value),
      values: value,
      label,
    });
  }

  return newFields;
};

export function highlight(value) {
  if (value) return classes.highlight;
  return "";
}

const QuickFilters: FC = () => {
  const quickFilters = useSelector((state: RootState) => state.quickFilters);
  const dispatch = useDispatch<any>();
  const [options, setOptions] = useState<SelectOptionMapType>({});
  const [messageApi, messageContextHolder] = message.useMessage();
  const { startTracking } = useBatchCollect();
  const [selectedOptions, setSelectedOptions] = useState({});

  const filter = useMemo(() => {
    const newFilter: any = {};
    convertRuleGroup2LegacyFilters(quickFilters).forEach(
      (item: any, index: number) => {
        newFilter[item.field] = {
          value: item.values,
          order: index + 1,
        };
        let newLabel = null;
        if (item.field === filterFields.dateHorizon.field) {
          const optionsArr =
            generate_STATIC_QUICK_FILTER_OPTIONS()["dateHorizon"];
          const value = optionsArr.find(
            (exp: { value: any }) =>
              JSON.stringify(exp.value) === JSON.stringify(item.values)
          );
          newLabel = value?.name || null;
          setSelectedOptions((opts) => {
            return {
              ...opts,
              [item.field]: {
                label: newLabel,
              },
            };
          });
        } else if (item.field === filterFields.cashflowSubStatus.field) {
          newLabel = item.values || null;
          setSelectedOptions((opts) => {
            return {
              ...opts,
              [item.field]: {
                label: newLabel,
              },
            };
          });
        }
      }
    );
    return newFilter;
  }, [quickFilters]);

  const showClearAll = useMemo(() => {
    return Object.keys(filter).length > 1;
  }, [filter]);

  const clearAll = useCallback(() => {
    const newFields = convertRuleGroup2LegacyFilters(quickFilters).reduce<
      Filter[]
    >((res, cur) => {
      const { field, label } = cur;
      return setFilterFields({ field, value: "", label }, res);
    }, []);

    setSelectedOptions({});
    dispatch(
      queryCashflowList({
        filters: legacyFilters2Query(newFields),
        searchName: "quickFilter",
        callback: (isSuccess: boolean) => {
          if (isSuccess) {
            messageApi.success("Clear quick filters success!");
          }
        },
      })
    );
  }, [quickFilters]);

  const getDateHorizonOption = useCallback((key: string) => {
    const thisOptions: SelectOptionData[] = [];
    const optionsArr = generate_STATIC_QUICK_FILTER_OPTIONS()[key];
    if (optionsArr) {
      optionsArr.forEach((item) => {
        const keyValue = item.name;
        thisOptions.push({
          key: keyValue,
          value: item.value,
          label: item.name,
          testId: get_CASHFLOW_BLOTTER_QUICK_FILTER_OPTION_BTN(key, item.name),
          className:
            "kp--" +
            get_CASHFLOW_BLOTTER_QUICK_FILTER_OPTION_BTN(key, item.name),
        });
      });
    }
    return thisOptions;
  }, []);

  const setFilter = (
    {
      field,
      label,
      operator,
    }: { field: string; label: string; operator?: string },
    value: any
  ) => {
    const newFields = handleMultiFieldsQuery(
      setFilterFields(
        { field, value, label, operator },
        convertRuleGroup2LegacyFilters(quickFilters)
      )
    );

    dispatch(
      queryCashflowList({
        filters: legacyFilters2Query(newFields),
        searchName: "quickFilter",
        callback: (isSuccess: boolean) => {
          if (isSuccess) {
            messageApi.success("Search success!");
            try {
              const fields = newFields.map((i) => i.field);
              const complete = startTracking(QUICK_FILTER_FIELDS);
              complete(fields.slice().sort((a, b) => a.localeCompare(b)));
            } catch (error) {}
          }
        },
      })
    );
  };

  const setIsStpRatanLabel = (value: string) => {
    switch (value) {
      case "true":
        return "Yes";
      case "false":
        return "No";
      default:
        return value;
    }
  };

  useEffect(() => {
    getBusinessFieldsFromCache("cashflowCN", cashflowCustomFields).then(
      (res: any) => {
        const { cashflowAndTradeFields } = res;
        const optionsList: SelectOptionMapType = {};
        cashflowAndTradeFields.forEach((item: any) => {
          if (item.indexedTerm === filterFields.bookingEntity.field) {
            optionsList[item.indexedTerm] = BookingEntityNameIdOptions.map(
              (option) => {
                return {
                  key: `${option.label}_${option.value}`,
                  value: option.value,
                  label: option.label,
                  id: get_CASHFLOW_BLOTTER_QUICK_FILTER_OPTION_BTN(
                    item.indexedTerm,
                    option.label
                  ),
                };
              }
            );
          } else if (
            (["dropdown", "multiSelectDropdown"].includes(item.displayStyle) &&
              item.valueList) ||
            item.indexedTerm === "Entity.Counterparty_SCI_BIC_Net_Flag"
          ) {
            let values: string[] = [];
            if (item.indexedTerm === "Entity.Counterparty_SCI_BIC_Net_Flag")
              values = ["Y", "N"];
            else values = JSON.parse(item.valueList.replace(/'/g, '"'));
            optionsList[item.indexedTerm] = values.map((subItem: string) => {
              const label = setIsStpRatanLabel(subItem);
              return {
                key: `${item.indexedTerm}_${label}`,
                value: subItem,
                label: label,
                testId: get_CASHFLOW_BLOTTER_QUICK_FILTER_OPTION_BTN(
                  item.indexedTerm,
                  label
                ),
                className:
                  "kp--" +
                  get_CASHFLOW_BLOTTER_QUICK_FILTER_OPTION_BTN(
                    item.indexedTerm,
                    label
                  ),
              };
            });
          }
        });
        setOptions((opts) => ({ ...opts, ...optionsList }));
      }
    );

    const setNstpExceptionField = (exceptionCodeList) => {
      return [
        ...exceptionCodeList.map((i) => ({
          key: `${filterFields.nstpException.field}_${i.label}`,
          value: i.value,
          label: i.label,
          testId: get_CASHFLOW_BLOTTER_QUICK_FILTER_OPTION_BTN(
            filterFields.nstpException.field,
            i.label
          ),
        })),
      ];
    };
    queryAllExceptionCodes().then((exceptionCodeList) => {
      setOptions((opts) => {
        if (Array.isArray(exceptionCodeList)) {
          return {
            ...opts,
            [filterFields.nstpException.field]:
              setNstpExceptionField(exceptionCodeList),
          };
        }
        return opts;
      });
    });
  }, []);

  return (
    <Root className={classes.root}>
      {messageContextHolder}
      <div className={classes.dropdowns}>
        {showClearAll ? (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              aria-label="clear"
              onClick={clearAll}
              color="warning"
              title="clear all"
              data-testid={CASHFLOW_BLOTTER_QUICK_FILTER_CLEAR_ALL_BTN}
            >
              <HighlightOffIcon />
            </IconButton>
          </Box>
        ) : (
          <></>
        )}
        <Autocomplete
          className={cn(
            classes.dropdownItem,
            {
              "is-order": filter[filterFields.dateHorizon.field]?.order < 10,
            },
            highlight(filter[filterFields.dateHorizon.field]?.value)
          )}
          sx={{
            order: filter[filterFields.dateHorizon.field]?.order || 10,
          }}
          size="small"
          openOnFocus={true}
          data-testid="quickFilterDays"
          disabled={!filterFields.dateHorizon}
          value={selectedOptions[filterFields.dateHorizon.field] || null}
          onChange={(_e, item) => {
            setSelectedOptions((opts) => {
              return {
                ...opts,
                [filterFields.dateHorizon.field]: item || null,
              };
            });
            setFilter(filterFields.dateHorizon, item?.value);
          }}
          options={getDateHorizonOption("dateHorizon")}
          getOptionLabel={(option) => option.label}
          renderOption={(props, option) => (
            <MenuItem
              key={option.key}
              value={option.value}
              data-testid={option.testId}
              {...props}
            >
              {option.label}
            </MenuItem>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label={filterFields.dateHorizon.label}
            ></TextField>
          )}
          ListboxProps={{
            style: {
              maxHeight: 250,
              overflow: "auto",
            },
          }}
        />
        <Autocomplete
          className={cn(
            classes.dropdownItem,
            {
              "is-order": filter[filterFields.taxonomy.field]?.order < 10,
            },
            highlight(isTaxonomyApplied(filter))
          )}
          sx={{
            order: filter[filterFields.taxonomy.field]?.order || 10,
          }}
          componentsProps={{
            popper: {
              style: {
                width: "fit-content",
                minWidth: 190,
              },
            },
          }}
          size="small"
          openOnFocus={true}
          data-testid="quickFilterTaxonomy"
          disabled={!filterFields.taxonomy}
          value={selectedOptions[filterFields.taxonomy.field] || null}
          onChange={(_e, item) => {
            setSelectedOptions((opts) => {
              return {
                ...opts,
                [filterFields.taxonomy.field]: item || null,
              };
            });
            setFilter(filterFields.taxonomy, item?.value);
          }}
          options={options[filterFields.taxonomy.field]}
          getOptionLabel={(option) => option.label}
          renderOption={(props, option) => (
            <MenuItem
              key={option.key}
              value={option.value}
              data-testid={option.testId}
              {...props}
            >
              {option.label}
            </MenuItem>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label={filterFields.taxonomy.label}
            ></TextField>
          )}
          ListboxProps={{
            style: {
              maxHeight: 250,
              overflow: "auto",
            },
          }}
        />
        <Autocomplete
          multiple
          limitTags={1}
          className={cn(
            classes.dropdownItem,
            {
              "is-order": filter[filterFields.nstpException.field]?.order < 10,
            },
            highlight(filter[filterFields.nstpException.field]?.value)
          )}
          sx={{
            order: filter[filterFields.nstpException.field]?.order || 10,
            "& .MuiInputBase-root": {
              maxHeight: 39,
              flexWrap: "nowrap",
              overflow: "hidden",
            },
          }}
          componentsProps={{
            popper: {
              style: {
                width: "fit-content",
                minWidth: 190,
              },
            },
          }}
          size="small"
          openOnFocus={true}
          data-testid="quickFilterNstpException"
          disabled={!filterFields.nstpException}
          disableCloseOnSelect
          value={selectedOptions[filterFields.nstpException.field] || []}
          onChange={(_e, item) => {
            setSelectedOptions((opts) => {
              return {
                ...opts,
                [filterFields.nstpException.field]: item || [],
              };
            });
            setFilter(
              filterFields.nstpException,
              item.map((i) => i.value).join("|")
            );
          }}
          options={options[filterFields.nstpException.field] ?? []}
          getOptionLabel={(option) => option.label}
          renderOption={(props, option) => (
            <MenuItem
              key={option.key}
              value={option.value}
              data-testid={option.testId}
              {...props}
            >
              {option.label}
            </MenuItem>
          )}
          renderInput={(params) => (
            <TextField {...params} label={filterFields.nstpException.label} />
          )}
          ListboxProps={{
            style: {
              maxHeight: 264,
              overflow: "auto",
            },
          }}
        />
        <Autocomplete
          className={cn(
            classes.dropdownItem,
            {
              "is-order": filter[filterFields.bookingEntity.field]?.order < 10,
            },
            highlight(filter[filterFields.bookingEntity.field]?.value)
          )}
          sx={{
            order: filter[filterFields.bookingEntity.field]?.order || 10,
          }}
          componentsProps={{
            popper: {
              style: {
                width: "fit-content",
                minWidth: 190,
              },
            },
          }}
          size="small"
          openOnFocus={true}
          data-testid="quickFilterBookingEntity"
          disabled={!filterFields.bookingEntity}
          value={selectedOptions[filterFields.bookingEntity.field] || null}
          onChange={(_e, item) => {
            setSelectedOptions((opts) => {
              return {
                ...opts,
                [filterFields.bookingEntity.field]: item || null,
              };
            });
            setFilter(filterFields.bookingEntity, item?.value);
          }}
          options={options[filterFields.bookingEntity.field]}
          getOptionLabel={(option) => option.label}
          renderOption={(props, option) => (
            <MenuItem
              key={option.key}
              value={option.value}
              data-testid={option.testId}
              {...props}
            >
              {option.label}
            </MenuItem>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label={filterFields.bookingEntity.label}
            ></TextField>
          )}
          ListboxProps={{
            style: {
              maxHeight: 250,
              overflow: "auto",
            },
          }}
        />
        <Autocomplete
          multiple
          limitTags={1}
          className={cn(
            classes.dropdownItem,
            {
              "is-order": filter[filterFields.cashflowStatus.field]?.order < 10,
            },
            highlight(filter[filterFields.cashflowStatus.field]?.value)
          )}
          sx={{
            order: filter[filterFields.cashflowStatus.field]?.order || 10,
            "& .MuiInputBase-root": {
              maxHeight: 39,
              flexWrap: "nowrap",
              overflow: "hidden",
            },
          }}
          size="small"
          openOnFocus={true}
          data-testid="quickFilterCashflowStatus"
          disabled={!filterFields.cashflowStatus}
          disableCloseOnSelect
          value={selectedOptions[filterFields.cashflowStatus.field] || []}
          onChange={(_e, item) => {
            setSelectedOptions((opts) => {
              return {
                ...opts,
                [filterFields.cashflowStatus.field]: item || [],
              };
            });
            setFilter(
              filterFields.cashflowStatus,
              item.map((i) => i.value)
            );
          }}
          options={options[filterFields.cashflowStatus.field] ?? []}
          getOptionLabel={(option) => option.label}
          renderOption={(props, option) => (
            <MenuItem
              key={option.key}
              value={option.value}
              data-testid={option.testId}
              {...props}
            >
              {option.label}
            </MenuItem>
          )}
          renderInput={(params) => (
            <TextField {...params} label={filterFields.cashflowStatus.label} />
          )}
          ListboxProps={{
            style: {
              maxHeight: 250,
              overflow: "auto",
            },
          }}
          componentsProps={{
            popper: {
              style: {
                width: "fit-content",
                minWidth: 190,
              },
            },
          }}
        />
        <Autocomplete
          className={cn(
            classes.dropdownItem,
            {
              "is-order":
                filter[filterFields.cashflowSubStatus.field]?.order < 10,
            },
            highlight(filter[filterFields.cashflowSubStatus.field]?.value)
          )}
          sx={{
            order: filter[filterFields.cashflowSubStatus.field]?.order || 10,
          }}
          size="small"
          openOnFocus={true}
          data-testid="quickFilterSubStatus"
          disabled={!filterFields.cashflowSubStatus}
          value={selectedOptions[filterFields.cashflowSubStatus.field] || null}
          onChange={(_e, item) => {
            setSelectedOptions((opts) => {
              return {
                ...opts,
                [filterFields.cashflowSubStatus.field]: item || null,
              };
            });
            setFilter(filterFields.cashflowSubStatus, item?.value);
          }}
          options={options[filterFields.cashflowSubStatus.field]}
          renderOption={(props, option) => (
            <MenuItem
              key={option.key}
              value={option.value}
              data-testid={option.testId}
              {...props}
            >
              {option.label}
            </MenuItem>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label={filterFields.cashflowSubStatus.label}
            ></TextField>
          )}
          ListboxProps={{
            style: {
              maxHeight: 250,
              overflow: "auto",
            },
          }}
        />
        <Autocomplete
          className={cn(
            classes.dropdownItem,
            {
              "is-order":
                filter[filterFields.cashflowSubStatusType.field]?.order < 10,
            },
            highlight(filter[filterFields.cashflowSubStatusType.field]?.value)
          )}
          sx={{
            order:
              filter[filterFields.cashflowSubStatusType.field]?.order || 10,
          }}
          size="small"
          openOnFocus={true}
          data-testid="quickFilterSubStatusType"
          disabled={!filterFields.cashflowSubStatusType}
          value={
            selectedOptions[filterFields.cashflowSubStatusType.field] || null
          }
          onChange={(_e, item) => {
            setSelectedOptions((opts) => {
              return {
                ...opts,
                [filterFields.cashflowSubStatusType.field]: item || null,
              };
            });
            setFilter(filterFields.cashflowSubStatusType, item?.value);
          }}
          options={options[filterFields.cashflowSubStatusType.field]}
          renderOption={(props, option) => (
            <MenuItem
              key={option.key}
              value={option.value}
              data-testid={option.testId}
              {...props}
            >
              {option.label}
            </MenuItem>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label={filterFields.cashflowSubStatusType.label}
            ></TextField>
          )}
          ListboxProps={{
            style: {
              maxHeight: 250,
              overflow: "auto",
            },
          }}
          componentsProps={{
            popper: {
              style: {
                width: "fit-content",
                minWidth: 190,
              },
            },
          }}
        />
        <Autocomplete
          className={cn(
            classes.dropdownItem,
            {
              "is-order":
                filter[filterFields.settlementMethod.field]?.order < 10,
            },
            highlight(filter[filterFields.settlementMethod.field]?.value)
          )}
          sx={{
            order: filter[filterFields.settlementMethod.field]?.order || 10,
          }}
          size="small"
          openOnFocus={true}
          data-testid="quickFilterSettlementMethod"
          disabled={!filterFields.settlementMethod}
          value={selectedOptions[filterFields.settlementMethod.field] || null}
          onChange={(_e, item) => {
            setSelectedOptions((opts) => {
              return {
                ...opts,
                [filterFields.settlementMethod.field]: item || null,
              };
            });
            setFilter(filterFields.settlementMethod, item?.value);
          }}
          options={options[filterFields.settlementMethod.field]}
          renderOption={(props, option) => (
            <MenuItem
              key={option.key}
              value={option.value}
              data-testid={option.testId}
              {...props}
            >
              {option.label}
            </MenuItem>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label={filterFields.settlementMethod.label}
            ></TextField>
          )}
          ListboxProps={{
            style: {
              maxHeight: 250,
              overflow: "auto",
            },
          }}
        />
        <Autocomplete
          className={cn(
            classes.dropdownItem,
            {
              "is-order": filter[filterFields.bicNet.field]?.order < 10,
            },
            highlight(filter[filterFields.bicNet.field]?.value)
          )}
          sx={{
            order: filter[filterFields.bicNet.field]?.order || 10,
          }}
          size="small"
          openOnFocus={true}
          data-testid="quickFilterBicNet"
          disabled={!filterFields.bicNet}
          value={selectedOptions[filterFields.bicNet.field] || null}
          onChange={(_e, item) => {
            setSelectedOptions((opts) => {
              return {
                ...opts,
                [filterFields.bicNet.field]: item || null,
              };
            });
            setFilter(filterFields.bicNet, item?.value);
          }}
          options={options[filterFields.bicNet.field]}
          renderOption={(props, option) => (
            <MenuItem
              key={option.key}
              value={option.value}
              data-testid={option.testId}
              {...props}
            >
              {option.label}
            </MenuItem>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label={filterFields.bicNet.label}
            ></TextField>
          )}
          ListboxProps={{
            style: {
              maxHeight: 250,
              overflow: "auto",
            },
          }}
        />
      </div>
    </Root>
  );
};

export default QuickFilters;
