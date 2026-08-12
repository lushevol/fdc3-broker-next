import { Box, useMediaQuery } from "@mui/material";
import { Button } from "Import/index";
import { FC, useMemo } from "react";
import { BreakPoint } from "src/Cashflow_CN/Main/style";
import {
  UTILIZATION_STATIC_BLOTTER_QUICK_SEARCH_CLEAR_BTN,
  UTILIZATION_STATIC_BLOTTER_QUICK_SEARCH_SEARCH_BTN,
} from "src/Root/analysis/const";
import useMap from "src/Root/common/utils/useMap";
import { ItemsComponent } from "src/Root/import/ratancomponents";

import { useAppDispatch } from "../../store";
import { resetPageNo } from "../../store/pagination.slice";
import { setSearchQuery } from "../../store/search.slice";
import StyledRoot, { classes } from "./common/style";
import UtilizationQuickSearchConfig from "./config";

export const QuickSearch: FC = () => {
  const dispatch = useAppDispatch();
  const [filter, { set, remove, reset }] = useMap<MapType>({});
  const biggerThanLaptop = useMediaQuery(`(min-width:${BreakPoint.Laptop}px)`);
  const labelIncrement = useMemo(
    () => (biggerThanLaptop ? 80 : 0),
    [biggerThanLaptop]
  );

  const formItems = useMemo(() => {
    const doms: JSX.Element[] = [];
    let allIndex = 0;
    UtilizationQuickSearchConfig.quickSearchItems.forEach(
      (item: QuickSearchItemConfig) => {
        doms.push(
          <ItemsComponent
            labelWidth={
              UtilizationQuickSearchConfig.quickSearchLabelWidth +
              labelIncrement
            }
            formWidth={UtilizationQuickSearchConfig.quickSearchFormWidth}
            filter={filter}
            config={item}
            onChange={(key: string, value: string | number) => {
              set(key, value);
            }}
            onRemove={remove}
            key={allIndex}
          />
        );
        allIndex++;
      }
    );

    return doms;
  }, [filter]);

  const onClear = () => {
    reset();
    dispatch(setSearchQuery({}));
  };

  const onSearch = () => {
    const formatForm = Object.fromEntries(
      Object.entries(filter).map(([key, value]) => [
        key,
        value === "" ? undefined : value,
      ])
    );
    dispatch(setSearchQuery(formatForm));
  };

  return (
    <StyledRoot>
      <Box className={classes.root}>
        {formItems}
        <div className="item btn-wrap">
          <Button
            className="query-btn"
            disabled={Object.keys(filter).length === 0}
            size="medium"
            variant="outlined"
            data-testid={UTILIZATION_STATIC_BLOTTER_QUICK_SEARCH_CLEAR_BTN}
            onClick={onClear}
          >
            Clear
          </Button>
          <Button
            className="query-btn"
            disabled={Object.keys(filter).length === 0}
            size="medium"
            htmlType="submit"
            variant="contained"
            data-testid={UTILIZATION_STATIC_BLOTTER_QUICK_SEARCH_SEARCH_BTN}
            onClick={onSearch}
          >
            Search
          </Button>
        </div>
      </Box>
    </StyledRoot>
  );
};
