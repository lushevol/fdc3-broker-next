import React from "react";
declare const useOpenfin: (openTile: any) => {
  channelMessage: any;
  clearMessage: () => void;
  fdc3Init: () => Promise<void>;
  handleIntentListener: (payload: any) => void;
  clearListener: () => void;
  setChannelMessage: React.Dispatch<any>;
};
export default useOpenfin;
