import { ColumnWidthOutlined } from "@ant-design/icons";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Box, IconButton, Stack, Tooltip } from "@mui/material";
import { Button } from "Import/index";
import { FC, memo, useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import { AgGridFilterContext } from "src/Cashflow_CN/Main/App";
import { RootState } from "src/Cashflow_CN/Main/store/interface";
import {
  CASHFLOW_BLOTTER_CLEAR_AGGRID_FILTER_BTN,
  CASHFLOW_BLOTTER_RESIZE_BTN,
} from "src/Root/analysis/const";
import { FilterTags } from "src/Root/import/ratancomponents";

import StyledRoot, { classes } from "./common/style";
import { ExportFile } from "./ExportFile";
import { LoadNextButton } from "./load-next";
import ResultAlert from "./ResultAlert";

const GridFooter: FC = memo(() => {
  const { totalHits } = useSelector(
    (state: RootState) => state.cashflowListPagination
  );
  const { api } = useSelector((state: RootState) => state.cashflowGridEvent);
  const { aggridTags, removeAggridTag, clearAggridTags } =
    useContext(AgGridFilterContext);

  const displayCashflowRows = api?.getDisplayedRowCount() ?? 0;

  const showClearAllFilters = useMemo(() => {
    return Object.keys(aggridTags).length > 1;
  }, [aggridTags]);

  return (
    <StyledRoot className={classes.root} data-testid="cashflow-export-file">
      <Stack className={classes.results} direction="row" alignItems="center">
        <span className={classes.label}>Results</span>
        <span
          className={classes.totalHits}
          data-testid="gird-footer-total-hits"
        >
          <Tooltip title="Current Displayed Cashflow Count" placement="top">
            <span>{displayCashflowRows}</span>
          </Tooltip>
          /
          <Tooltip title="Total Hit Cashflow Count" placement="top">
            <span>{totalHits}</span>
          </Tooltip>
        </span>
        <LoadNextButton />
        <ResultAlert />
        <FilterTags aggridTags={aggridTags} removeAggridTag={removeAggridTag} />
        {showClearAllFilters ? (
          <Box sx={{ display: "flex", alignItem: "center" }}>
            <IconButton
              aria-label="clear"
              onClick={clearAggridTags}
              color="warning"
              title="clear all"
              data-testid={CASHFLOW_BLOTTER_CLEAR_AGGRID_FILTER_BTN}
            >
              <HighlightOffIcon />
            </IconButton>
          </Box>
        ) : (
          <></>
        )}
      </Stack>
      <Stack
        className={classes.btns}
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        spacing={2}
      >
        <Button
          onClick={() => api?.autoSizeAllColumns()}
          startIcon={<ColumnWidthOutlined style={{ fontSize: "14px" }} />}
          data-testid={CASHFLOW_BLOTTER_RESIZE_BTN}
          variant="outlined"
          size="medium"
        >
          Resize
        </Button>
        <ExportFile />
      </Stack>
    </StyledRoot>
  );
});

export default GridFooter;
