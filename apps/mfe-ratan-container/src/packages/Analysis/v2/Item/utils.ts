import { ITEM_PATH_SEPERATOR } from "../Station/FullTrack";

export const parsePath = (path: string): string[] => {
  const itemPathList = path.split(ITEM_PATH_SEPERATOR);
  return itemPathList.filter((i) => !!i);
};

export const constructPath = (pathList: string[]): string => {
  return pathList.join(ITEM_PATH_SEPERATOR);
};
