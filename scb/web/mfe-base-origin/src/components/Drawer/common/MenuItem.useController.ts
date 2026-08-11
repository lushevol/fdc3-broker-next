import React from "react";
import {
  MenuItemProps,
  propsAddTile,
  Tile as TileProps,
} from "./interface";

const useController = (props: MenuItemProps, tile: TileProps) => {
  const getParamter = (parameters: object | undefined) =>
    parameters ? { ...parameters } : undefined;
  const onClick = () => {
    props.addTile({
      ...propsAddTile,
      container: tile.container,
      emailSupport: tile.emailSupport,
      module: tile.module,
      tile: tile.tile,
      title: `${tile.title} ${tile.subtitle ?? ""}`,
      parameters: getParamter(tile.parameters),
      leftPosition: tile.leftPosition ?? "calc(50% - 45px)",
      topPossition: tile.topPossition ?? "8px",
    });
  };

  return { onClick, getParamter };
};

export default useController;
