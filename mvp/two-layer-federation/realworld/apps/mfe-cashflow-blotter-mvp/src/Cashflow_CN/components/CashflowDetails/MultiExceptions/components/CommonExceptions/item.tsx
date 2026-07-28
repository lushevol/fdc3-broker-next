import ErrorIcon from "@mui/icons-material/Error";
import { Chip, ChipTypeMap, Tooltip } from "@mui/material";
import { FC } from "react";

import { ExceptionCategory } from "../../common/interface";
import { CommonException } from "./interface";

export const getChipProps = (props: CommonException) => {
  const { Exception_Category } = props;

  const isHighRiskOrBlocker =
    Exception_Category === ExceptionCategory.HIGH_RISK_NSTP ||
    Exception_Category === ExceptionCategory.HARD_BLOCKER;

  let chipProps: ChipTypeMap["props"] = {
    color: "warning",
  };

  if (isHighRiskOrBlocker) {
    chipProps = {
      icon: <ErrorIcon />,
      color: "error",
    };
  }
  return chipProps;
};

const item: FC<CommonException> = (props) => {
  const { Exception_Code, Description } = props;
  const chipProps = getChipProps(props);

  return (
    <Tooltip title={Description} placement="top">
      <Chip label={Exception_Code} size="small" {...chipProps} />
    </Tooltip>
  );
};

export default item;
