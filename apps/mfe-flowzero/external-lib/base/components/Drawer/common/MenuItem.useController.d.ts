import { Tile as TileProps } from "./interface";
declare const useController: (
  props: any,
  tile: TileProps
) => {
  onClick: () => void;
  getParamter: (parameters: any) => any;
};
export default useController;
