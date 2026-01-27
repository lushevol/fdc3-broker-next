import type { Tile, Tiles } from '../components/Drawer/common/interface';

export const getEntities = (drawers) => {
  const entities = drawers.reduce((aggr, categories: Tiles) => {
    categories.tiles.forEach((tile: Tile) => {
      tile?.entity?.forEach((entity) => {
        aggr[entity] = 1;
      });
    });
    return aggr;
  }, {});
  return entities;
};
