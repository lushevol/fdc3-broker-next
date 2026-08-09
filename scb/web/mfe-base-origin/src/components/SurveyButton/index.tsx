import React, { ReactElement } from "react";
import RateReviewIcon from "@mui/icons-material/RateReview";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Root, { classes, PREFIX } from "./common/style";
import { SurveyButtonProps } from "./common/interface";

const Avatar: React.FC<SurveyButtonProps> = (
  props: SurveyButtonProps
): ReactElement => {
  return (
    <Root className={classes.root} data-testid={`${PREFIX}`}>
      <Tooltip title="Share Feedback">
        <IconButton
          onClick={props.openPopUp}
          data-testid={`${PREFIX}_IconButton`}
          sx={{ p: 0 }}
          size="large"
        >
          <RateReviewIcon />
        </IconButton>
      </Tooltip>
    </Root>
  );
};

export default React.memo(Avatar);
