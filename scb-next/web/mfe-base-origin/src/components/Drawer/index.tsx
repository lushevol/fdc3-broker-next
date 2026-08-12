import React, { ReactElement } from "react";
import MuiDrawer from "@mui/material/Drawer";
import Root, {
  classes,
  DrawerClass,
  PREFIX,
  NewDrawerClass,
} from "./common/style";
import ErrorBoundry from "../../components/ErrorBoundry";
import Menu from "./Menu";
import { DrawerProps } from "./common/interface";
import Tile from "./common/Tile";
import { useIsNewLayout } from "../../hooks/model/root";

const Drawer: React.FC<DrawerProps> = (props: DrawerProps): ReactElement => {
  const isNewLayout = useIsNewLayout();
  return (
    <ErrorBoundry>
      <MuiDrawer
        anchor="right"
        open={props.anchor}
        onClose={props.toggleDrawer(false)}
        className={
          isNewLayout ? `${DrawerClass} ${NewDrawerClass}` : DrawerClass
        }
      >
        <Root className={classes.root} data-testid={`${PREFIX}`}>
          <div className={classes.content}>
            <section className={classes.title}>
              <Tile />
              <span>Tile Options</span>
            </section>
            <section className={classes.body}>
              <Menu {...props} />
            </section>
          </div>
        </Root>
      </MuiDrawer>
    </ErrorBoundry>
  );
};

export default React.memo(Drawer);
