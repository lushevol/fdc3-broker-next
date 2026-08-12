import { ColumnWidthOutlined } from "@ant-design/icons";
import { Stack, Tooltip } from "@mui/material";
import { Button } from "Import/index";
import { FC, memo } from "react";
import { useSelector } from "react-redux";
import { GROUP_BLOTTER_RESIZE_BTN } from "src/Root/analysis/const";

import { GroupBlotterRootState } from "../../Main/store/interface";
import StyledRoot, { classes } from "./common/style";
import { ExportFile } from "./ExportFile";
import { GridFooterLoadNextBtn } from "./LoadNext";
import { useGridFilterChanged } from "./useGridFilterChanged";

const GridFooter: FC = memo(() => {
  const { totalHits } = useSelector(
    (state: GroupBlotterRootState) => state.groupBlotter.blotterPagination
  );
  const { api } = useSelector(
    (state: GroupBlotterRootState) => state.groupBlotter.blotterGridEvent
  );

  const { displayRowsCount } = useGridFilterChanged();

  return (
    <StyledRoot className={classes.root} data-testid="cashflow-export-file">
      <Stack className={classes.results} direction="row" alignItems="center">
        <span className={classes.label}>Results</span>
        <span
          className={classes.totalHits}
          data-testid="gird-footer-total-hits"
        >
          <Tooltip title="Current Loaded Records Count" placement="top">
            <span>{displayRowsCount}</span>
          </Tooltip>
          /
          <Tooltip title="Total Hit Records Count" placement="top">
            <span>{totalHits}</span>
          </Tooltip>
        </span>
        <GridFooterLoadNextBtn />
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
          data-testid={GROUP_BLOTTER_RESIZE_BTN}
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
