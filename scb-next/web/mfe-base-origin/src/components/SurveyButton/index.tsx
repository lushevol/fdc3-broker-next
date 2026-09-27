import React, { ReactElement } from "react";
import { RateReview as RateReviewIcon } from "ratan-design-origin/icons";
import { IconButton, Tooltip } from "ratan-design-origin/primitives";
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
