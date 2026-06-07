import { Grid, Skeleton } from "@mui/material";
import React, { FC } from "react";

const FormSkeleton: FC<{ repeat: number }> = React.memo(({ repeat }) => {
  return (
    <>
      <Grid container spacing={2}>
        {Array(repeat).map(() => (
          <>
            <Grid item xs={6}>
              <Skeleton animation="wave" height={30} />
            </Grid>
            <Grid item xs={6}>
              <Skeleton animation="wave" height={30} />
            </Grid>
            <Grid item xs={12}>
              <Skeleton animation="wave" height={10} />
            </Grid>
          </>
        ))}
      </Grid>
    </>
  );
});

export default FormSkeleton;
