import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { type ReactElement } from 'react';
import ErrorBoundry from '../../components/ErrorBoundry';
import Button from '../../components/LoadingButton';
import { getSSOLink } from '../../utils/common';
import { LoginTabsProps } from './common/interface';
import Root, { classes, PREFIX } from './common/style';
import TabPanel from './common/TabPanel';
import useController from './common/useController';

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
                    <FormControl variant="standard" className={classes.formControl}>
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
                    <FormControl variant="standard" className={classes.formControl}>
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
                  FMO Post Trade Portal
                </Typography>
                <Typography variant="body1" className={classes.description}>
                  FMO Post Trade Portal provides a suite of integrated post-trade tools and services
                  to Financial Markets Operations users to manage post trade activity across
                  Affirmation, Confirmation, Settlements, Report generation and more.
                </Typography>
              </TabPanel>
              <Box className={classes.box}>
                <Tabs value={value} onChange={handleChange} aria-label="login tabs">
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
