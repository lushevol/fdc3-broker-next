import { Container } from "../../../hooks/model/workspaces";
declare const useParameters: () => {
  addTile: (inputContainer: Container) => void;
  openTile: (
    container_: string,
    module_: string,
    tile_: string,
    parameters_?: string
  ) => void;
  setParamsAndAddTile: (tile: any, parameters_?: string) => void;
};
export default useParameters;
