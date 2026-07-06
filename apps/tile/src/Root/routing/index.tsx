import React, { type ReactElement } from 'react';
import { Loader, ReactRouterDom } from '../import';
import type { TileProps } from './common/interface';

const { Routes, Route } = ReactRouterDom;

import useController from './common/useController';

const Tile1 = React.lazy(() => import('../../Tile1'));
const FDC3Tile1 = React.lazy(() => import('../../FDC3Tile1'));
const FDC3Tile2 = React.lazy(() => import('../../FDC3Tile2'));
const TradeBlotterTile = React.lazy(() => import('../../TradeBlotterTile'));
const WorkflowLauncherTile = React.lazy(() => import('../../WorkflowLauncherTile'));
const FDC3ConsoleTile = React.lazy(() => import('../../FDC3ConsoleTile'));

const Routing: React.FC<TileProps> = (props: TileProps): ReactElement => {
  useController(props);
  return (
    <Routes>
      <Route
        path="/template_tile1/*"
        element={
          <React.Suspense fallback={<Loader />}>
            <Tile1 {...props} />
          </React.Suspense>
        }
      ></Route>
      <Route
        path="/template_tile_fdc3_1/*"
        element={
          <React.Suspense fallback={<Loader />}>
            <FDC3Tile1 {...props} />
          </React.Suspense>
        }
      ></Route>
      <Route
        path="/template_tile_fdc3_2/*"
        element={
          <React.Suspense fallback={<Loader />}>
            <FDC3Tile2 {...props} />
          </React.Suspense>
        }
      ></Route>
      <Route
        path="/template_tile_trade_blotter/*"
        element={
          <React.Suspense fallback={<Loader />}>
            <TradeBlotterTile {...props} />
          </React.Suspense>
        }
      ></Route>
      <Route
        path="/template_tile_workflow_launcher/*"
        element={
          <React.Suspense fallback={<Loader />}>
            <WorkflowLauncherTile {...props} />
          </React.Suspense>
        }
      ></Route>
      <Route
        path="/template_tile_fdc3_console/*"
        element={
          <React.Suspense fallback={<Loader />}>
            <FDC3ConsoleTile {...props} />
          </React.Suspense>
        }
      ></Route>
      <Route path="*" element={<div>FALL BACK</div>}></Route>
    </Routes>
  );
};

export default Routing;
