import React, { ReactElement } from "react";
import useController from "./common/useController";
import Root, { classes, PREFIX } from "./common/style";
import { LoaderProps } from "./common/type";

const outerCircle = `M20,35c-8.271,0-15-6.729-15-15S11.729,5,20,5s15,6.729,15,15S28.271,35,20,35z M20,5.203
                    C11.841,5.203,5.203,11.841,5.203,20c0,8.159,6.638,14.797,14.797,14.797S34.797,28.159,34.797,20C34.797,11.841,28.159,5.203,20,5.203z`;
const innerCircle = `M20,33.125c-7.237,0-13.125-5.888-13.125-13.125S12.763,6.875,20,6.875S33.125,12.763,33.125,
                    20S27.237,33.125,20,33.125z M20,7.078C12.875,7.078,7.078,12.875,7.078,20c0,7.125,5.797,12.922,12.922,
                    12.922S32.922,27.125,32.922,20C32.922,12.875,27.125,7.078,20,7.078z`;
const outerLine = `M5.203,20c0-8.159,6.638-14.797,14.797-14.797V5C11.729,5,5,11.729,5,20s6.729,15,15,15v-0.203C11.841,
                    34.797,5.203,28.159,5.203,20z`;
const innerLine = `M7.078,20c0-7.125,5.797-12.922,12.922-12.922V6.875C12.763,6.875,6.875,12.763,6.875,20S12.763,
                    33.125,20,33.125v-0.203C12.875,32.922,7.078,27.125,7.078,20z`;

const Loader: React.FC<LoaderProps> = (props: LoaderProps): ReactElement => {
  useController();
  const size = props?.size ?? 90;
  const style = {
    height: size,
    width: size,
  };
  const text = props?.text?.length ? props.text : "Loading...";
  return (
    <Root className={classes.root} data-testid={PREFIX}>
      <div className={classes.loader}>
        <div className={classes.spinner} style={style}>
          <svg className="svg" viewBox="0 0 38 38">
            <path className={classes.outerCircle} d={outerCircle} />
            <path className={classes.outerLine} d={outerLine} />
            <path className={classes.innerCircle} d={innerCircle} />
            <path className={classes.innerLine} d={innerLine} />
          </svg>
        </div>
        {props?.text && <span className={classes.text}>{text}</span>}
      </div>
    </Root>
  );
};

export default React.memo(Loader);
