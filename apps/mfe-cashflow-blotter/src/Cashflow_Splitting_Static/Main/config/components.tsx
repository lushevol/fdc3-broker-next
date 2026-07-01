import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Box, Tooltip } from "@mui/material";
import { FC } from "react";
import { Time } from "src/Root/import";
import { HandleHoliday, SimpleAmount } from "src/Root/import/ratancomponents";

export const WrapHoliday: FC = (props) => {
  return <HandleHoliday {...props} isAccurateToDay={true} />;
};

export const WrapTime: FC = (props) => {
  return <Time {...props} isAccurateToDay={true} />;
};

const style = {
  marginTop: "6px",
};
export const PreviewCustomType: FC<any> = (props) => {
  const { Result, tipError } = props.data || {};
  if (Result === "error")
    return (
      <Box sx={style}>
        <Tooltip title={"Error: " + tipError}>
          <CancelIcon color="error" />
        </Tooltip>
      </Box>
    );
  else if (Result === "success")
    return (
      <Box sx={style}>
        <CheckCircleIcon color="success" />
      </Box>
    );
  return <></>;
};

export const AmountType: FC<any> = (props) => {
  return (
    <SimpleAmount value={props.value} formatOptions={{ trimMantissa: true }} />
  );
};
