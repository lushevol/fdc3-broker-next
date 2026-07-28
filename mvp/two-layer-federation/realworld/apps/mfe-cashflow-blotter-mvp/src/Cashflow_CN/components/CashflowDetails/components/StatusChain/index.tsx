import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import { Tooltip } from "@mui/material";
import { CSSProperties } from "react";

import StyledRoot, { classes } from "./style";

interface StatusChainProps {
  statusChain: string[];
  statusConfig: {
    [n: string]: {
      label: string;
      tooltip: string;
    };
  };
  style?: CSSProperties;
}

export const StatusChain = ({
  statusChain,
  statusConfig,
  style,
}: StatusChainProps) => {
  return (
    <StyledRoot className={classes.root} style={style}>
      {statusChain.map((s) => (
        <div className={classes.item} key={s}>
          <Tooltip title={statusConfig[s]?.tooltip}>
            <span>{s}</span>
          </Tooltip>
          <div className={classes.operator}>
            <DoubleArrowIcon />
          </div>
        </div>
      ))}
    </StyledRoot>
  );
};
