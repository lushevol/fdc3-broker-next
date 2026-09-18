import React, { ReactElement } from "react";
import { Button, ErrorFallback } from "ratan-design-origin";
import useController from "./common/useController";
import { classes } from "./common/style";
import { ErrorState } from "../../hooks/model/root";
import { getHostName } from "../../utils/common";

const Fallback: React.FC<ErrorState> = (props: ErrorState): ReactElement => {
  const { emailSupport } = useController(props);

  return (
    <ErrorFallback className={classes.root} data-testid="FallbackError__page-id"
      title="There is a problem in this Tile."
      description={emailSupport ? "Please click the button below to send the Error detail to the Application Support Team." : undefined}
      action={emailSupport ? <Button
                size="medium"
                variant="outlined"
                color="info"
                href={`mailto:${emailSupport}?subject=Error in ${getHostName()}&body=${
                  props.error?.stack
                }`}
              >
                Contact PSS
              </Button> : undefined}
    />
  );
};

export default React.memo(Fallback);
