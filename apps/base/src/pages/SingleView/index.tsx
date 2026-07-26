import Box from '@mui/material/Box';
import React, { type ReactElement } from 'react';
import Container from '../Home/common/Container';
import { useContext } from '../../hooks/provider';
import {
  createSingleViewContainer,
  findSingleViewTile,
  SINGLE_VIEW_QUERY_PARAM,
} from '../Home/common/singleView';

const SingleView: React.FC = (): ReactElement => {
  const [store] = useContext();
  const targetTileId = new URLSearchParams(window.location.search).get(SINGLE_VIEW_QUERY_PARAM);
  const tile = findSingleViewTile(
    targetTileId,
    store.drawers?.flatMap((drawer) => drawer.tiles),
  );

  if (!tile) {
    return <Box role="alert">This single-view tile is unavailable.</Box>;
  }

  return (
    <Box data-testid="single-view" sx={{ height: '100vh', overflow: 'hidden' }}>
      <Container {...createSingleViewContainer(tile)} />
    </Box>
  );
};

export default SingleView;
