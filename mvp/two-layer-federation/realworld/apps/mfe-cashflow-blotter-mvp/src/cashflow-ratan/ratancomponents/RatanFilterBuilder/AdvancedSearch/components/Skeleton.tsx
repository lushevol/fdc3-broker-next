import { Box, Skeleton, Grid } from "@mui/material";
import { Root, classes } from "./EntrySelector";

export const FilterBuilderBodySkeleton = () => {
  return (
    <Box>
      {Array(3).fill(
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Skeleton height={30} />
          </Grid>
          <Grid item xs={1}>
            <Skeleton height={30} />
          </Grid>
          <Grid item xs={6}>
            <Skeleton height={30} />
          </Grid>
          <Grid item xs={1}>
            <Skeleton height={30} />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export const EntrySelectorSkeleton = () => {
  return (
    <>
      <Root>
        <label className={classes.label}>Filters</label>
        <Skeleton className={classes.selector} height={30} />
        <Skeleton className={classes.clearBtn} height={30} />
        <Skeleton className={classes.viewBtn} height={30} />
      </Root>
    </>
  );
};
