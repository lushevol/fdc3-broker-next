import React, { useEffect, useRef } from 'react';
import { Button } from 'ratan-design-origin';
import { Box, Drawer, IconButton, Tooltip } from 'ratan-design-origin/primitives';
import { Add, Close } from 'ratan-design-origin/icons';
import {
  propsAddTile,
  type DrawerProps,
  type Tile,
  type Tiles,
} from '../components/Drawer/common/interface';
import type { Container } from '../hooks/model/workspaces';
import TileIcon from './tile-icon';
import chevronDark from './assets/tile-chevron-dark.png';
import chevronLight from './assets/tile-chevron-light.png';
import waveDark from './assets/tile-wave-dark.png';
import waveLight from './assets/tile-wave-light.png';
import dotsDark from './assets/tile-dots-dark.png';
import dotsLight from './assets/tile-dots-light.png';
import ringsDark from './assets/tile-rings-dark-upper.png';
import ringsLight from './assets/tile-rings-light-upper.png';
import {
  drawerBackdropStyles,
  drawerBodyStyles,
  drawerHeaderStyles,
  drawerPaperStyles,
  drawerTileActionStyles,
  drawerTileStyles,
  type DrawerMode,
} from './drawer-styles';
import { portalTokens } from './portal-tokens';

export interface TileLaunchOption {
  id: string;
  label: string;
  parameters: Record<string, unknown>;
  title?: string;
}

export interface TilePresentation {
  pattern?: 'chevron' | 'wave' | 'dots' | 'rings';
  launchOptions?: TileLaunchOption[];
}

export interface PresentedTile extends Tile {
  presentation?: TilePresentation;
}

export interface PresentedTiles extends Omit<Tiles, 'tiles'> {
  tiles: PresentedTile[];
}

interface PrototypeDrawerProps extends DrawerProps {
  mode: DrawerMode;
  drawers: PresentedTiles[];
}

const patterns = {
  dark: { chevron: chevronDark, wave: waveDark, dots: dotsDark, rings: ringsDark },
  light: { chevron: chevronLight, wave: waveLight, dots: dotsLight, rings: ringsLight },
};

export function buildDrawerLaunch(tile: PresentedTile, option?: TileLaunchOption): Container {
  return {
    ...propsAddTile,
    container: tile.container,
    emailSupport: tile.emailSupport,
    module: tile.module,
    tile: tile.tile,
    title: option?.title ?? `${tile.title} ${tile.subtitle ?? ''}`,
    parameters:
      tile.parameters || option ? { ...(tile.parameters as Record<string, unknown> | undefined), ...option?.parameters } : undefined,
    leftPosition: tile.leftPosition ?? 'calc(50% - 45px)',
    topPossition: tile.topPossition ?? '8px',
  };
}

function artwork(tile: PresentedTile, mode: DrawerMode) {
  if (tile.presentation?.pattern) return patterns[mode][tile.presentation.pattern];
  const source =
    mode === 'dark' ? tile.imageDarkTheme : (tile.imageLightTheme ?? tile.imageDarkTheme);
  if (!source) return undefined;
  if (source.startsWith('darkIcons/') || source.startsWith('lightIcons/'))
    return `/image/${source}`;
  if (
    source.startsWith('/') ||
    source.startsWith('https://') ||
    source.startsWith('http://') ||
    source.startsWith('data:')
  )
    return source;
  return `/${source}`;
}

function PrototypeTile({
  tile,
  mode,
  addTile,
}: {
  tile: PresentedTile;
  mode: DrawerMode;
  addTile: DrawerProps['addTile'];
}) {
  const options = tile.presentation?.launchOptions ?? [];
  const title = `${tile.title} ${tile.subtitle ?? ''}`.trim();
  const image = artwork(tile, mode);
  return (
    <Box
      component="article"
      data-testid="portal-prototype-tile"
      data-disabled={!!tile.disabled}
      data-options={options.length > 0}
      sx={drawerTileStyles(mode)}
    >
      {image && (
        <img
          className="tile-art"
          alt=""
          src={image}
          data-testid="portal-prototype-tile-art"
          data-pattern={tile.presentation?.pattern}
        />
      )}
      <Button
        type="button"
        disableRipple
        className="tile-launch"
        sx={drawerTileActionStyles(mode)}
        aria-label={`Add ${title}`}
        disabled={tile.disabled}
        onClick={() => addTile(buildDrawerLaunch(tile))}
      >
        <span className="tile-name">
          {tile.title}
          {tile.subtitle && <span className="tile-subtitle">{tile.subtitle}</span>}
        </span>
        {options.length === 0 && (
          <span className="tile-plus" aria-hidden="true">
            <Add />
          </span>
        )}
      </Button>
      {options.length > 0 && (
        <div className="tile-options">
          {options.map((option) => (
            <Button
              type="button"
              disableRipple
              key={option.id}
              sx={drawerTileActionStyles(mode)}
              disabled={tile.disabled}
              aria-label={`Add ${title} for ${option.label}`}
              onClick={() => addTile(buildDrawerLaunch(tile, option))}
            >
              {option.label}
            </Button>
          ))}
        </div>
      )}
    </Box>
  );
}

export function PrototypeDrawer(props: PrototypeDrawerProps) {
  const paper = useRef<HTMLDivElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const onClose = useRef(props.toggleDrawer(false));
  onClose.current = props.toggleDrawer(false);

  useEffect(() => {
    if (paper.current) paper.current.inert = !props.anchor;
    if (!props.anchor) return;
    const trigger = document.activeElement;
    close.current?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose.current();
      }
      if (event.key !== 'Tab') return;
      const actions = paper.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');
      if (!actions?.length) return;
      const first = actions[0];
      const last = actions[actions.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      const target =
        trigger instanceof HTMLElement && trigger.isConnected
          ? trigger
          : document.querySelector<HTMLButtonElement>('button[aria-label="Open new tile"]');
      target?.focus();
    };
  }, [props.anchor]);

  return (
    <>
      {props.anchor && (
        <Box
          component="button"
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          data-testid="portal-prototype-drawer-backdrop"
          sx={drawerBackdropStyles(props.mode)}
          onClick={() => onClose.current()}
        />
      )}
      <Drawer
        anchor="right"
        variant="persistent"
        open={props.anchor}
        transitionDuration={parseInt(portalTokens.motion.transition, 10)}
        sx={{
          '& .MuiDrawer-paper': drawerPaperStyles(props.mode),
          '@media (prefers-reduced-motion: reduce)': {
            '& .MuiDrawer-paper': { transition: 'none !important' },
          },
        }}
        PaperProps={{
          ref: paper,
          role: 'dialog',
          'aria-modal': true,
          'aria-hidden': !props.anchor,
          'aria-labelledby': 'portal-prototype-drawer-title',
          'data-testid': 'portal-prototype-drawer',
          'data-theme': props.mode,
        }}
      >
        <Box component="header" sx={drawerHeaderStyles(props.mode)}>
          <TileIcon />
          <h2 id="portal-prototype-drawer-title">Tile Option</h2>
          <Tooltip title="Close tile options">
            <IconButton
              ref={close}
              disableRipple
              aria-label="Close tile options"
              onClick={() => onClose.current()}
            >
              <Close />
            </IconButton>
          </Tooltip>
        </Box>
        <Box component="main" sx={drawerBodyStyles(props.mode)}>
          {props.drawers.map((category) => (
            <section key={category.id} aria-label={category.label}>
              <h3>{category.label}</h3>
              <div className="tile-grid">
                {category.tiles.map((tile, index) => (
                  <PrototypeTile
                    key={tile.id ?? `${tile.tile}-${index}`}
                    tile={tile}
                    mode={props.mode}
                    addTile={props.addTile}
                  />
                ))}
              </div>
            </section>
          ))}
        </Box>
      </Drawer>
    </>
  );
}
