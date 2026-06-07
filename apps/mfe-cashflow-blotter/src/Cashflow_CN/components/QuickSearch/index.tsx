import { Box, useMediaQuery } from "@mui/material";
import { message } from "antd";
import { Button } from "Import/index";
import { ItemsComponent } from "Import/ratancomponents";
import {
  formatMultiInputValue,
  getBusinessFieldsFromCache,
  getOperator,
} from "Import/ratanutils";
import { FC, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ratanConfig from "src/Cashflow_CN/Main/config/ratanConfig";
import { BreakPoint } from "src/Cashflow_CN/Main/style";
import { isQueryVDRangeThan1Month } from "src/Cashflow_CN/Main/utils/query-checker";
import { useBatchCollect, useRTT } from "src/Root/analysis";
import {
  CASHFLOW_BLOTTER_QUICK_SEARCH_CLEAR_BTN,
  CASHFLOW_BLOTTER_QUICK_SEARCH_SEARCH_BTN,
  QUICK_SEARCH_FIELDS,
  RTT_QUERY_DATA_IN_QUICK_SEARCH,
} from "src/Root/analysis/const";
import { featureScopedEnabled } from "src/Root/common/utils/featureFlagController";
import { legacyFilters2Query } from "src/Root/common/utils/query";
import useMap from "src/Root/common/utils/useMap";
import { handleMultiFieldsQuery } from "src/Root/import/ratanutils";

import { queryCashflowList } from "../../Main/store/actions";
import { canProceedQuickSearchFilter } from "../../Main/utils/filterGuard";
import { AmountItem } from "./AmountItem";
import StyledRoot, { classes } from "./common/style";

const QuickSearch: FC = () => {
  const [disabled, setDisabled] = useState(true);
  const [filter, { set, remove, reset }] = useMap<MapType>({});
  const [amountResult, setAmountResult] = useState({ isOk: true, msg: null });
  const switchSearch = useSelector((state: any) => state.switchSearch);
  const initParams = useSelector((state: any) => state.initParams);
  const [messageApi, messageContextHolder] = message.useMessage();
  const dispatch = useDispatch<any>();
  const biggerThanLaptop = useMediaQuery(`(min-width:${BreakPoint.Laptop}px)`);
  const labelIncrement = useMemo(
    () => (biggerThanLaptop ? 80 : 0),
    [biggerThanLaptop]
  );
  const [initFields, setInitFields] = useState({});
  const [clearAmount, setClearAmount] = useState(false);
  const [quickSearchConfig, setQuickSearchConfig] = useState(
    ratanConfig.cashflow.quickSearchItemsCN
  );
  const { startTracking } = useBatchCollect();
  const { startTracking: startTrackingRTT } = useRTT();

  /**
   * Get dynamic value list for Cashflow State from cache
   */
  useEffect(() => {
    getBusinessFieldsFromCache("cashflowCN").then((res) => {
      const field = res?.cashflowAndTradeFields?.find(
        (item: any) => item.indexedTerm === "Cashflow.Cashflow_State"
      );
      let newValueList = field?.valueList ?? [];
      if (typeof newValueList === "string") {
        try {
          const fixed = newValueList.trim().replace(/'/g, '"');
          const parsed = JSON.parse(fixed);
          if (Array.isArray(parsed)) {
            newValueList = parsed.map((v: string) => ({ label: v, value: v }));
          }
        } catch {
          newValueList = [];
        }
      }
      const newConfig = quickSearchConfig.map((item) =>
        item.field === "Cashflow.Cashflow_State"
          ? { ...item, valueList: newValueList }
          : item
      );
      setQuickSearchConfig(newConfig);
    });
  }, []);

  useEffect(() => {
    const _initFilelds = {};
    if (initParams?.cashflowId) {
      _initFilelds["Cashflow.Cashflow_Id"] = initParams.cashflowId;
    }
    setInitFields(_initFilelds);
  }, [initParams]);

  const formItems = useMemo(() => {
    const doms: JSX.Element[] = [];
    let allIndex = 0;
    quickSearchConfig.forEach((item: QuickSearchItemConfig) => {
      if (!item.disabled) {
        doms.push(
          <ItemsComponent
            labelWidth={
              ratanConfig.cashflow.quickSearchLabelWidth + labelIncrement
            }
            formWidth={ratanConfig.cashflow.quickSearchFormWidth}
            filter={filter}
            initFields={initFields}
            config={item}
            onChange={(key: string, value: string | number) => {
              if (initFields[key]) {
                const newFields = { ...initFields };
                delete newFields[key];
                setInitFields(newFields);
              }
              set(key, value);
            }}
            onRemove={remove}
            key={`${allIndex}_${item.field}_${
              Array.isArray(item.valueList) ? item.valueList.length : 0
            }`}
            messageApi={messageApi}
          />
        );
        allIndex++;
      }
    });

    return doms;
  }, [
    filter,
    labelIncrement,
    initFields,
    messageApi,
    JSON.stringify(quickSearchConfig),
  ]);

  const clearFilters = (isSwitch?: boolean) => {
    reset();
    setDisabled(true);
    setInitFields({});
    !isSwitch && dispatch(queryCashflowList({}));
    if (switchSearch === "advancedSearch") {
      setClearAmount(true);
    } else if (isSwitch) {
      setClearAmount(false);
    } else {
      setClearAmount(true);
    }
  };

  const setFilterFields = () => {
    const newFields: Filter[] = [];
    for (const key in filter) {
      let value: any = filter[key];
      if (key === "Cashflow.Cashflow_Id") {
        value = formatMultiInputValue(value as string);
      }
      const isArray = Array.isArray(value);
      if (key === "PRODUCT_TAXONOMY" && isArray) {
        value = (value as string[]).map((item) =>
          item.includes("/_/")
            ? item
            : `Instrument_Common.ISDA_Taxonomy/_/${item}`
        );
      }

      if ((isArray && value[0]) || (!isArray && value)) {
        newFields.push({
          field: key,
          operator: getOperator(value),
          values: value,
        });
      }
    }

    if (Array.isArray(amountResult.msg)) {
      return [...newFields, ...(amountResult.msg as any)];
    }

    return newFields;
  };

  const search = () => {
    if (amountResult.isOk) {
      const newFields = handleMultiFieldsQuery(setFilterFields());
      const newFilters = legacyFilters2Query(newFields);
      const { valid, message } = canProceedQuickSearchFilter(newFilters);

      if (!valid) {
        message && messageApi.warning(message);
        return;
      }

      if (
        featureScopedEnabled("VD_Default_Query") &&
        isQueryVDRangeThan1Month(newFilters)
      ) {
        messageApi.error(
          "The date range cannot be more than 1 month in quick search."
        );
        return;
      }
      setDisabled(true);
      setClearAmount(false);
      const { completeTracking, abortTracking } = startTrackingRTT();
      dispatch(
        queryCashflowList({
          filters: newFilters,
          searchName: "searchSection",
          callback: (isSuccess: boolean) => {
            if (isSuccess) {
              messageApi.success("Search success!");
              try {
                completeTracking({ name: RTT_QUERY_DATA_IN_QUICK_SEARCH });
                const allFields = newFields.map((i) => i.field) as string[];
                const complete = startTracking(QUICK_SEARCH_FIELDS);
                complete(allFields);
              } catch (error) {
                abortTracking();
                console.error(error);
              }
            } else {
              abortTracking();
            }
            setDisabled(false);
          },
        })
      );
    } else {
      messageApi.error(amountResult.msg);
    }
  };

  useEffect(() => {
    if (switchSearch !== "searchSection" && switchSearch !== "init") {
      clearFilters(true);
    }
  }, [switchSearch]);

  useEffect(() => {
    let thisEnable = true;

    for (const field in filter) {
      if (
        (Array.isArray(filter[field]) && filter[field].length) ||
        (!Array.isArray(filter[field]) && filter[field])
      ) {
        thisEnable = false;
        break;
      }
    }

    if (amountResult.msg) {
      thisEnable = false;
    }

    setDisabled(thisEnable);
  }, [filter, amountResult]);

  return (
    <StyledRoot>
      {messageContextHolder}
      <Box className={classes.root}>
        {formItems}
        <AmountItem
          labelWidth={
            ratanConfig.cashflow.quickSearchLabelWidth + labelIncrement
          }
          filter={filter}
          onResult={(result) => setAmountResult(result)}
          isClear={clearAmount}
        />

        <div className="item btn-wrap">
          <Button
            className="query-btn kp--clear"
            onClick={(e) => clearFilters(false)}
            disabled={switchSearch !== "searchSection"}
            data-testid={CASHFLOW_BLOTTER_QUICK_SEARCH_CLEAR_BTN}
            variant="outlined"
            size="medium"
          >
            Clear Filters
          </Button>
          <Button
            className="query-btn kp--search"
            onClick={search}
            disabled={disabled}
            data-testid={CASHFLOW_BLOTTER_QUICK_SEARCH_SEARCH_BTN}
            variant="contained"
            size="medium"
          >
            Search
          </Button>
        </div>
      </Box>
    </StyledRoot>
  );
};

export default QuickSearch;
