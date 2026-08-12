import { memo } from "react";
import HistoryIcon from "@mui/icons-material/History";
import { Button, Tooltip } from "@mui/material";
import { FilterRecord } from "../common/types";
import { DEFAULT_CREATING_FILTER_KEY } from "../common/const";

export const FilterInfo = memo(({ filter }: { filter: FilterRecord }) => {
  const { owner, creator, rowKey } = filter || {};
  const historyInfo = `Created by ${owner || creator}`;
  return rowKey !== DEFAULT_CREATING_FILTER_KEY ? (
    <Tooltip title={historyInfo}>
      <Button>
        <HistoryIcon />
      </Button>
    </Tooltip>
  ) : (
    <></>
  );
});
