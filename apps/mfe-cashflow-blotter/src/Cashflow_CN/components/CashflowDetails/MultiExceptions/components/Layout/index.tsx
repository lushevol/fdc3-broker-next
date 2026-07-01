import { Box, Grid } from "@mui/material";
import React, { FC, PropsWithChildren } from "react";

import { MultiExceptionsNames } from "../../common/interface";
import { LayoutProps } from "./interface";
import Item from "./item";
import StyledGrid, { classes } from "./style";

const SPACE = 1;

const Layout: FC<PropsWithChildren<LayoutProps>> = ({ setting, children }) => {
  const [
    ActionHistory,
    VostroSection,
    NostroSection,
    Affirmation,
    BackValue,
    NSTPExceptions,
    // OtherExceptions,
    Comments,
    Actions,
  ] = React.Children.toArray(children);
  return (
    <StyledGrid container spacing={SPACE}>
      <Grid item container xs={12} direction="row" spacing={SPACE}>
        <Grid item xs={8}>
          <Item show sx={{ height: "100%" }}>
            {ActionHistory}
          </Item>
        </Grid>
        <Grid item xs={4}>
          <Item {...setting[MultiExceptionsNames.NSTP]} sx={{ height: "100%" }}>
            {NSTPExceptions}
          </Item>
        </Grid>
      </Grid>
      <Grid item container xs={12} direction="row" spacing={SPACE}>
        <Grid item xs={8}>
          <Item
            {...setting[MultiExceptionsNames.Vostro]}
            sx={{ minHeight: "1000px" }}
          >
            {VostroSection}
          </Item>
        </Grid>
        <Grid item xs={4}>
          <Item
            {...setting[MultiExceptionsNames.Nostro]}
            sx={{ minHeight: "280px" }}
          >
            {NostroSection}
          </Item>
          <Grid
            className={classes.gridRowWithAccordion}
            container
            spacing={SPACE}
          >
            <Grid item xs={7}>
              <Item {...setting[MultiExceptionsNames.Affirmation]}>
                {Affirmation}
              </Item>
            </Grid>
            <Grid item xs={5}>
              <Item {...setting[MultiExceptionsNames.Backvalue]}>
                {BackValue}
              </Item>
            </Grid>
          </Grid>
          <Item {...setting[MultiExceptionsNames.Comment]}>{Comments}</Item>
          <Box>{Actions}</Box>
        </Grid>
      </Grid>
    </StyledGrid>
  );
};

export default Layout;
