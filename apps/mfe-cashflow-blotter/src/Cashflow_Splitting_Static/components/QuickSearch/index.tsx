import { Box, useMediaQuery } from "@mui/material";
import { message } from "antd";
import { Button } from "Import/index";
import { ItemsComponent } from "Import/ratancomponents";
import { FC, useEffect, useMemo, useState } from "react";
import { BreakPoint } from "src/Cashflow_CN/Main/style";
import splittingConfig from "src/Cashflow_Splitting_Static/Main/config/ratanConfig";
import { useAppDispatch } from "src/Cashflow_Splitting_Static/store";
import { setSearchQuery } from "src/Cashflow_Splitting_Static/store/search.slice";
import {
  AUTO_SPLIT_STATIC_BLOTTER_QUICK_SEARCH_CLEAR_BTN,
  AUTO_SPLIT_STATIC_BLOTTER_QUICK_SEARCH_SEARCH_BTN,
} from "src/Root/analysis/const";
import useMap from "src/Root/common/utils/useMap";

import StyledRoot, { classes } from "./common/style";

export const QuickSearch: FC = () => {
  const dispatch = useAppDispatch();
  const [disabled, setDisabled] = useState(true);
  const [disableClear, setDisableClear] = useState(true);
  const [filter, { set, remove, reset }] = useMap<MapType>({});
  const [initFields, setInitFields] = useState({});
  const [messageApi, messageContextHolder] = message.useMessage();
  const biggerThanLaptop = useMediaQuery(`(min-width:${BreakPoint.Laptop}px)`);
  const labelIncrement = useMemo(
    () => (biggerThanLaptop ? 80 : 0),
    [biggerThanLaptop]
  );

  const formItems = useMemo(() => {
    const doms: JSX.Element[] = [];
    let allIndex = 0;
    splittingConfig.cashflow.quickSearchItemsSplitting.forEach(
      (item: QuickSearchItemConfig) => {
        if (!item.disabled) {
          doms.push(
            <ItemsComponent
              labelWidth={
                splittingConfig.cashflow.quickSearchLabelWidth + labelIncrement
              }
              formWidth={splittingConfig.cashflow.quickSearchFormWidth}
              filter={filter}
              initFields={initFields}
              config={item}
              onChange={(key: string, value: string | number) => {
                if (initFields[key]) {
                  const newFields = { ...initFields };
                  delete newFields[key];
                  setInitFields(newFields);
                } else {
                  setInitFields({
                    ...initFields,
                    [key]: value,
                  });
                }
                set(key, value);
              }}
              onRemove={remove}
              key={allIndex}
              messageApi={messageApi}
            />
          );
          allIndex++;
        }
      }
    );

    return doms;
  }, [filter, initFields, messageApi]);

  /**
   * This effect monitors changes to the filter object.
   * If any field in the filter has a value (non-empty or non-empty array),
   * it enables the action buttons (Search/Clear) by setting disabled to false.
   * If all fields are empty, it disables the buttons.
   */

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
    setDisabled(thisEnable);
  }, [filter]);

  const clearSearchCriterias = () => {
    reset();
    setDisabled(true);
    setDisableClear(true);

    setInitFields({});
    dispatch(setSearchQuery({}));
  };

  const onQuery = () => {
    setDisableClear(false);
    dispatch(setSearchQuery(filter));
  };
  return (
    <StyledRoot>
      <Box className={classes.root}>
        {messageContextHolder}
        {formItems}
        <div className="item btn-wrap">
          <Button
            className="query-btn kp--clear"
            onClick={(_e) => clearSearchCriterias()}
            variant="outlined"
            data-testid={AUTO_SPLIT_STATIC_BLOTTER_QUICK_SEARCH_CLEAR_BTN}
            size="medium"
            disabled={disableClear}
          >
            Clear
          </Button>
          <Button
            className="query-btn kp--search"
            onClick={(_e) => onQuery()}
            htmlType="submit"
            variant="contained"
            data-testid={AUTO_SPLIT_STATIC_BLOTTER_QUICK_SEARCH_SEARCH_BTN}
            size="medium"
            disabled={disabled}
          >
            Search
          </Button>
        </div>
      </Box>
    </StyledRoot>
  );
};
