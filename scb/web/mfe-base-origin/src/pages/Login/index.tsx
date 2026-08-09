import React, { ReactElement } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import useController from "./common/useController";
import Root, { classes, PREFIX } from "./common/style";
import InputLabel from "@mui/material/InputLabel";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import ErrorBoundry from "../../components/ErrorBoundry";
import { LoginTabsProps } from "./common/interface";
import TabPanel from "./common/TabPanel";
import Button from "../../components/LoadingButton";
import { getSSOLink } from "../../utils/common";

const Login: React.FC = (): ReactElement => {
  const {
    username,
    setUsername,
    password,
    setPassword,
    onLoginUserNamePassword,
    handleChange,
    value,
    onKeyUp,
    loading,
    showNormalLogin,
    onKeyUpPassword,
  } = useController();

  return (
    <ErrorBoundry>
      <Root className={classes.root} data-testid={`${PREFIX}`}>
        <Grid container spacing={0}>
          <Grid item xs={4} className={classes.gridleft}>
            <main className={classes.left}>
              {showNormalLogin ? (
                <>
                  <Typography variant="h3" gutterBottom>
                    Sign In
                  </Typography>
                  <section>
                    <FormControl
                      variant="standard"
                      className={classes.formControl}
                    >
                      <InputLabel>Username</InputLabel>
                      <TextField
                        fullWidth
                        hiddenLabel
                        focused
                        placeholder="Enter Username"
                        data-testid="Username"
                        variant="outlined"
                        size="medium"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonOutlineIcon />
                            </InputAdornment>
                          ),
                        }}
                        onChange={(e) => {
                          setUsername(`${e.target.value}`.trim());
                        }}
                        onKeyUp={onKeyUp}
                        value={username}
                      />
                    </FormControl>
                    <FormControl
                      variant="standard"
                      className={classes.formControl}
                    >
                      <InputLabel>Password</InputLabel>
                      <TextField
                        fullWidth
                        hiddenLabel
                        focused
                        data-testid="password"
                        type="password"
                        placeholder="Enter Password"
                        variant="outlined"
                        size="medium"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockOutlinedIcon />
                            </InputAdornment>
                          ),
                        }}
                        onChange={(e) => {
                          setPassword(`${e.target.value}`.trim());
                        }}
                        onKeyUp={onKeyUpPassword}
                        value={password}
                      />
                    </FormControl>
                    <Button
                      size="large"
                      variant="contained"
                      onClick={onLoginUserNamePassword}
                      fullWidth
                      className={classes.button}
                      data-testid={`${PREFIX}_login`}
                      loading={loading}
                    >
                      Sign In
                    </Button>
                    <Divider className={classes.divider} />
                  </section>
                </>
              ) : (
                <></>
              )}
              <section>
                <Button
                  size="large"
                  variant="contained"
                  color="secondary"
                  href={getSSOLink()}
                  fullWidth
                  className={classes.button}
                  data-testid={`${PREFIX}_sso`}
                  loading={loading}
                >
                  Sign In With SSO
                </Button>
              </section>
            </main>
          </Grid>
          <Grid item xs={8} className={classes.gridright}>
            <main className={classes.right}>
              <TabPanel value={value} index={0}>
                <Typography variant="h2" gutterBottom>
                  Markets Operations One
                </Typography>
                <Typography variant="body1" className={classes.description}>
                  Markets Operations One Portal (MO1) is a single, evolving
                  workspace for Operations processing, integrating post-trade
                  applications, and progressively delivering a more connected,
                  intelligent, and efficient processing.
                </Typography>
              </TabPanel>
              <Box className={classes.box}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="login tabs"
                >
                  <Tab {...LoginTabsProps(0)} />
                </Tabs>
              </Box>
            </main>
          </Grid>
        </Grid>
      </Root>
    </ErrorBoundry>
  );
};

export default React.memo(Login);
