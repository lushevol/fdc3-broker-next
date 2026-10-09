import React, { ReactElement } from "react";
import { TileProps } from "./common/interface";
import { Button } from "ratan-design-origin";
import { Add as AddIcon } from "ratan-design-origin/icons";
import Root, { backgroundCss, classes, PREFIX } from "./common/style";
import { useContext } from "../../hooks/provider";

const Tile: React.FC<TileProps> = (props: TileProps): ReactElement => {
  const [store] = useContext();
  const { theme } = store;

  return (
    <Root
      data-testid={`${PREFIX}`}
      onClick={props.disabled ? undefined : props.onClick}
      className={backgroundCss(props, theme)}
    >
      <main className={classes.main}>
        <section
          className={props.disabled ? classes.titledisabled : classes.title}
        >
          {props.title}
          <p>{props?.subtitle}</p>
        </section>
        <section className={classes.content}>
          <Button variant="outlined" disabled={props.disabled}>
            <AddIcon />
          </Button>
        </section>
      </main>
    </Root>
  );
};

export default React.memo(Tile);
