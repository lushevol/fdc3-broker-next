import { propsAddTile, type Tile as TileProps } from './interface';

const useController = (props, tile: TileProps) => {
  const getParamter = (parameters) => (parameters ? { ...parameters } : undefined);
  const onClick = () => {
    props.addTile({
      ...propsAddTile,
      container: tile.container,
      emailSupport: tile.emailSupport,
      module: tile.module,
      tile: tile.tile,
      title: `${tile.title} ${tile.subtitle ?? ''}`,
      parameters: getParamter(tile.parameters),
      leftPosition: tile.leftPosition ?? 'calc(50% - 45px)',
      topPossition: tile.topPossition ?? '8px',
    });
  };

  return { onClick, getParamter };
};

export default useController;
