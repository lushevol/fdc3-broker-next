import React from 'react';
import { Divider, InputAdornment, TextField } from 'ratan-design-origin/primitives';
import { LockOutlined, PersonOutlined } from 'ratan-design-origin/icons';
import { LoadingButton } from 'ratan-design-origin';
import { styled, useTheme } from 'ratan-design-origin/theme';
import darkLogo from '../components/AppBar/mo1_logo_dark.svg';
import lightLogo from '../components/AppBar/mo1_logo_light.svg';
import hero from './assets/login-hero-light-top.png';
import { portalMotionStyles, portalTokens as t } from './portal-tokens';

export interface PrototypeLoginProps {
  username?: string;
  password?: string;
  loading: boolean;
  showNormalLogin: boolean;
  setUsername: (value: string) => void;
  setPassword: (value: string) => void;
  onLoginUserNamePassword: () => void;
  ssoLink: string;
}

// Measurements from Frame 11; small-screen values define the responsive adaptation.
const loginLayout = {
  panePercent: 45.635,
  panePadding: 80,
  paneInset: 100,
  paneInsetVw: 6.614,
  logoWidth: 188,
  logoHeight: 32,
  formTop: 124,
  headingInset: 10,
  headingGap: 52,
  headingSize: 48,
  headingLine: 58,
  labelSize: 18,
  labelLine: 24,
  inputHeight: 49,
  controlType: 20,
  submitGap: 12,
  dividerGap: 36,
  heroBottom: 88,
  heroCopyWidth: 660,
  heroTitleSize: 28,
  heroTitleLine: 36,
  bodyType: 16,
  bodyLine: 24,
  heroNavy: '#141d4f',
  mobileFormTop: 56,
  mobileHeadingSize: 40,
  mobileHeadingLine: 48,
  mobileHeroHeight: 240,
  shortHeight: 760,
  compactInset: 40,
} as const;

const Root = styled('main')(({ theme }) => {
  const colors = t.color[theme.palette.mode];
  return {
    display: 'grid',
    gridTemplateColumns: `${loginLayout.panePercent}% minmax(0, 1fr)`,
    minHeight: '100dvh',
    fontFamily: t.fontFamily,
    color: colors.text,
    background: colors.canvas,
    '& .login-pane': {
      padding: `${loginLayout.panePadding}px clamp(${t.space.lg}px, ${loginLayout.paneInsetVw}vw, ${loginLayout.paneInset}px)`,
      minWidth: 0,
    },
    '& .login-logo': {
      width: loginLayout.logoWidth,
      height: loginLayout.logoHeight,
      objectFit: 'contain',
    },
    '& .login-form': {
      marginTop: loginLayout.formTop,
      maxWidth: t.size.loginFormWidth,
      marginInline: 'auto',
    },
    '& h1': {
      fontSize: loginLayout.headingSize,
      lineHeight: `${loginLayout.headingLine}px`,
      fontWeight: 700,
      margin: `0 0 ${loginLayout.headingGap}px`,
      paddingLeft: loginLayout.headingInset,
      color: colors.text,
    },
    '& .login-field': { display: 'block', marginBottom: t.space.lg },
    '& .MuiTextField-root': { margin: 0 },
    '& .login-label': {
      display: 'block',
      fontSize: loginLayout.labelSize,
      lineHeight: `${loginLayout.bodyLine}px`,
      marginBottom: t.space.md,
      color: colors.muted,
    },
    '& .MuiOutlinedInput-root': {
      height: loginLayout.inputHeight,
      borderRadius: t.radius.control,
      background: colors.canvas,
      fontSize: loginLayout.controlType,
      color: colors.text,
      border: 'none !important',
      '& fieldset': {
        display: 'block',
        top: 0,
        borderColor: colors.divider,
        '& legend': { display: 'none' },
      },
      '&:focus-within fieldset': { borderColor: t.color.primary },
      '& input': { fontSize: loginLayout.controlType, fontFamily: t.fontFamily },
      '& .MuiSvgIcon-root': { fontSize: t.space.lg },
      ...portalMotionStyles,
    },
    '& .MuiInputAdornment-root': { color: colors.muted },
    '& .login-submit, & .login-sso': {
      height: t.size.buttonHeight,
      borderRadius: t.radius.pill,
      fontFamily: t.fontFamily,
      fontSize: loginLayout.controlType,
      fontWeight: 600,
      textTransform: 'none',
      boxShadow: 'none',
      transition: t.motion.transition,
      ...portalMotionStyles,
    },
    '& .login-submit': {
      marginTop: loginLayout.submitGap,
      background: t.color.primary,
      color: t.color.primaryText,
      '&:hover': { background: t.color.primaryHover },
    },
    '& .login-divider': {
      marginBlock: loginLayout.dividerGap,
      fontSize: loginLayout.bodyType,
      color: colors.muted,
      '&:before, &:after': { borderColor: colors.divider },
    },
    '& .login-sso': {
      border: `1px solid ${colors.divider}`,
      color: theme.palette.mode === 'light' ? t.color.headerBackgroundDark : colors.text,
      background: 'transparent',
    },
    '& .login-hero': {
      minWidth: 0,
      backgroundColor: loginLayout.heroNavy,
      backgroundImage: `url(${hero})`,
      backgroundSize: '100% auto',
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      alignItems: 'flex-end',
      padding: `${loginLayout.panePadding}px ${loginLayout.panePadding}px ${loginLayout.heroBottom}px`,
      color: t.color.primaryText,
    },
    '& .hero-copy': { maxWidth: loginLayout.heroCopyWidth },
    '& h2': {
      fontSize: loginLayout.heroTitleSize,
      lineHeight: `${loginLayout.heroTitleLine}px`,
      fontWeight: 600,
      margin: `0 0 ${loginLayout.dividerGap}px`,
    },
    '& .hero-copy p': {
      fontSize: loginLayout.bodyType,
      lineHeight: `${loginLayout.bodyLine}px`,
      margin: 0,
    },
    [`@media (max-width: ${t.breakpoint.tablet}px)`]: {
      gridTemplateColumns: 'minmax(0, 1fr)',
      '& .login-pane': { padding: `${t.space.xl}px ${t.space.lg}px ${t.size.buttonHeight}px` },
      '& .login-form': { marginTop: loginLayout.mobileFormTop },
      '& .login-logo': { marginLeft: 0 },
      '& h1': {
        fontSize: loginLayout.mobileHeadingSize,
        lineHeight: `${loginLayout.mobileHeadingLine}px`,
        marginBottom: t.space.xl,
        paddingLeft: 0,
      },
      '& .login-hero': {
        padding: t.space.xl,
        minHeight: loginLayout.mobileHeroHeight,
        backgroundSize: 'cover',
      },
      '& h2': { marginBottom: t.space.lg },
    },
    [`@media (max-height: ${loginLayout.shortHeight}px) and (min-width: ${t.breakpoint.tablet + 1}px)`]:
      {
        '& .login-pane': { paddingBlock: t.space.xl },
        '& .login-form': { marginTop: loginLayout.compactInset },
        '& h1': { marginBottom: t.space.xl },
        '& .login-hero': { padding: loginLayout.compactInset },
      },
    ...portalMotionStyles,
  };
});

const PrototypeLogin: React.FC<PrototypeLoginProps> = (props) => {
  const theme = useTheme();
  return (
    <Root data-testid="portal-prototype-login">
      <section className="login-pane">
        <img
          className="login-logo"
          src={theme.palette.mode === 'dark' ? darkLogo : lightLogo}
          alt="Markets Operations One logo"
        />
        <form
          className="login-form"
          aria-label="Sign In"
          onSubmit={(event) => {
            event.preventDefault();
            if (!props.loading) props.onLoginUserNamePassword();
          }}
        >
          <h1>Sign In</h1>
          {props.showNormalLogin && (
            <>
              <div className="login-field">
                <label className="login-label" htmlFor="portal-login-username">
                  Username
                </label>
                <TextField
                  id="portal-login-username"
                  fullWidth
                  placeholder="Enter field name"
                  variant="outlined"
                  value={props.username ?? ''}
                  autoComplete="username"
                  onChange={(event) => props.setUsername(event.target.value.trim())}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlined />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div className="login-field">
                <label className="login-label" htmlFor="portal-login-password">
                  Password
                </label>
                <TextField
                  id="portal-login-password"
                  fullWidth
                  placeholder="Enter field name"
                  variant="outlined"
                  type="password"
                  value={props.password ?? ''}
                  autoComplete="current-password"
                  onChange={(event) => props.setPassword(event.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <LoadingButton
                type="submit"
                aria-label="Sign In"
                variant="contained"
                fullWidth
                loading={props.loading}
                className="login-submit"
              >
                Sign In
              </LoadingButton>
              <Divider className="login-divider">Or continue with:</Divider>
            </>
          )}
          <LoadingButton
            href={props.ssoLink}
            variant="outlined"
            fullWidth
            loading={props.loading}
            className="login-sso"
          >
            Sign In With SSO
          </LoadingButton>
        </form>
      </section>
      <section className="login-hero" aria-label="About Markets Operations One">
        <div className="hero-copy">
          <h2>Markets Operations One</h2>
          <p>
            Markets Operations One Portal (MO1) is a single, evolving workspace for Operations
            processing, integrating post-trade applications, and progressively delivering a more
            connected, intelligent, and efficient processing.
          </p>
        </div>
      </section>
    </Root>
  );
};

export default PrototypeLogin;
