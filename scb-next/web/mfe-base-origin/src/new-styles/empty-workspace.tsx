import React from 'react';
import { Button } from 'ratan-design-origin';
import { styled } from 'ratan-design-origin/theme';
import illustration from './assets/empty-workspace-dark.png';
import { portalMotionStyles, portalTokens as t } from './portal-tokens';

const emptyLayout = {
  top: 86,
  bottom: 48,
  width: 624,
  illustrationInset: 6,
  headingGap: 20,
  headingSize: 28,
  headingLine: 36,
  bodySize: 18,
  bodyLine: 24,
  bodyGap: 4,
  copyWidth: 800,
  buttonGap: 36,
  buttonType: 20,
  mobileHeadingSize: 26,
  mobileHeadingLine: 32,
  mobileCopyWidth: 340,
  shortHeight: 760,
  shortIllustration: 430,
  headingColorDark: '#2995ff',
  lightIllustrationFilter: 'invert(1) hue-rotate(180deg) brightness(1.114)',
} as const;

const Root = styled('section')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  minHeight: '100%',
  padding: `${emptyLayout.top}px ${t.space.lg}px ${emptyLayout.bottom}px`,
  boxSizing: 'border-box',
  fontFamily: t.fontFamily,
  background: t.color[theme.palette.mode].canvas,
  color: t.color[theme.palette.mode].muted,
  '& .workspace-illustration': {
    display: 'block',
    width: emptyLayout.width,
    height: 'auto',
    maxWidth: '100%',
    transform: `translateX(${emptyLayout.illustrationInset}px)`,
    filter: theme.palette.mode === 'light' ? emptyLayout.lightIllustrationFilter : 'none',
  },
  '& h1': {
    margin: `${emptyLayout.headingGap}px 0 ${emptyLayout.bodyGap}px`,
    fontSize: emptyLayout.headingSize,
    lineHeight: `${emptyLayout.headingLine}px`,
    fontWeight: 400,
    color: theme.palette.mode === 'dark' ? emptyLayout.headingColorDark : t.color.primary,
  },
  '& p': {
    margin: 0,
    fontSize: emptyLayout.bodySize,
    lineHeight: `${emptyLayout.bodyLine}px`,
    maxWidth: emptyLayout.copyWidth,
  },
  '& .find-tile': {
    marginTop: emptyLayout.buttonGap,
    width: t.size.emptyButtonWidth,
    maxWidth: '100%',
    height: t.size.buttonHeight,
    borderRadius: t.radius.pill,
    background: t.color.primary,
    color: t.color.primaryText,
    textTransform: 'none',
    fontFamily: t.fontFamily,
    fontSize: emptyLayout.buttonType,
    fontWeight: 600,
    boxShadow: 'none',
    transition: `background ${t.motion.feedback}`,
    '&:hover': { background: t.color.primaryHover },
    ...portalMotionStyles,
  },
  [`@media (max-width: ${t.breakpoint.mobile}px)`]: {
    paddingTop: t.space.xl,
    '& h1': {
      fontSize: emptyLayout.mobileHeadingSize,
      lineHeight: `${emptyLayout.mobileHeadingLine}px`,
    },
    '& p': { maxWidth: emptyLayout.mobileCopyWidth },
    '& .workspace-illustration': { transform: 'none' },
  },
  [`@media (max-height: ${emptyLayout.shortHeight}px)`]: {
    paddingTop: t.space.lg,
    '& .workspace-illustration': { width: emptyLayout.shortIllustration },
  },
}));

export default function PrototypeEmptyWorkspace({ onFindTile }: { onFindTile: () => void }) {
  return (
    <Root data-testid="portal-prototype-empty">
      <img className="workspace-illustration" src={illustration} alt="" />
      <h1>Start customizing your workspace</h1>
      <p>Find out what workspace preference options you have and how those options work.</p>
      <Button className="find-tile" variant="contained" onClick={onFindTile}>
        Find Tile
      </Button>
    </Root>
  );
}
