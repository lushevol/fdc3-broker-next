import { Stack, Tooltip } from "@mui/material";
import React, { FC, memo } from "react";

import { useAppSelector } from "../../store";
import { AuditEntry } from "../Audit/Entry";
import { CreateEntry } from "../Create";
import { ExportFileEntry } from "../Export";
import StyledRoot, { classes } from "./common/style";

const GridFooter: FC = memo(() => {
  const { rowData } = useAppSelector((state) => state.pagination);
  const { totalHits } = useAppSelector((state) => state.pagination);

  return (
    <StyledRoot className={classes.root} data-testid="utilization-gridFooter">
      <Stack className={classes.results} direction="row" alignItems="center">
        <span className={classes.label}>Results</span>
        <span
          className={classes.totalHits}
          data-testid="gird-footer-total-hits"
        >
          <Tooltip title="Current Loaded Records Count" placement="top">
            <span>{rowData?.length || 0}</span>
          </Tooltip>
          /
          <Tooltip title="Total Hit Records Count" placement="top">
            <span>{totalHits}</span>
          </Tooltip>
        </span>
      </Stack>
      <Stack
        className={classes.btns}
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        spacing={1}
      >
        <CreateEntry />
        <AuditEntry />
        <ExportFileEntry />
      </Stack>
    </StyledRoot>
  );
});

export default GridFooter;
